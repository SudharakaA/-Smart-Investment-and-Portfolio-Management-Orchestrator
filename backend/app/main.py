import asyncio
import json
from datetime import datetime, timezone
from typing import Dict, Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.agents.alerts import AlertAutomationAgent
from app.agents.crypto import CryptoDataAgent
from app.agents.insights import InsightReportAgent
from app.agents.market_data import MarketDataAgent
from app.agents.news import NewsIntelligenceAgent
from app.agents.portfolio import PortfolioRebalancingAgent
from app.agents.risk import RiskEvaluationAgent
from app.agents.trend import TrendAnalysisAgent
from app.auth.db import AuthRepository
from app.auth.security import expiry_iso, hash_password, issue_token, verify_password
from app.core.config import get_settings
from app.models.schemas import AuthRequest, AuthResponse, AuthUser, MarketDataRequest, OrchestratorRunRequest, PortfolioRequest
from app.services.orchestrator import AgentOrchestratorService

settings = get_settings()

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

market_agent = MarketDataAgent()
crypto_agent = CryptoDataAgent()
news_agent = NewsIntelligenceAgent()
risk_agent = RiskEvaluationAgent()
trend_agent = TrendAnalysisAgent()
portfolio_agent = PortfolioRebalancingAgent()
insight_agent = InsightReportAgent()
alert_agent = AlertAutomationAgent()
orchestrator = AgentOrchestratorService()
auth_repo = AuthRepository(settings.auth_db_url)


def extract_bearer_token(authorization: Optional[str]) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization scheme")
    return parts[1].strip()


@app.on_event("startup")
async def startup() -> None:
    auth_repo.init_db()


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok", "env": settings.app_env}


@app.post("/api/auth/register", response_model=AuthResponse)
async def register(payload: AuthRequest) -> AuthResponse:
    username = payload.username.strip().lower()
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing = auth_repo.get_user_by_username(username)
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")

    created = auth_repo.create_user(username=username, password_hash=hash_password(payload.password))
    token = issue_token()
    expires_at = expiry_iso(settings.auth_session_hours)
    auth_repo.create_session(token=token, user_id=created["id"], expires_at=expires_at)

    return AuthResponse(
        token=token,
        expiresAt=expires_at,
        user=AuthUser(id=created["id"], username=created["username"], createdAt=created["created_at"]),
    )


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(payload: AuthRequest) -> AuthResponse:
    username = payload.username.strip().lower()
    user = auth_repo.get_user_by_username(username)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = issue_token()
    expires_at = expiry_iso(settings.auth_session_hours)
    auth_repo.create_session(token=token, user_id=user["id"], expires_at=expires_at)

    return AuthResponse(
        token=token,
        expiresAt=expires_at,
        user=AuthUser(id=user["id"], username=user["username"], createdAt=user["created_at"]),
    )


@app.get("/api/auth/me", response_model=AuthUser)
async def me(authorization: Optional[str] = Header(default=None)) -> AuthUser:
    token = extract_bearer_token(authorization)
    user = auth_repo.get_session_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return AuthUser(id=user["id"], username=user["username"], createdAt=user["created_at"])


@app.post("/api/auth/logout")
async def logout(authorization: Optional[str] = Header(default=None)) -> Dict[str, str]:
    token = extract_bearer_token(authorization)
    auth_repo.delete_session(token)
    return {"status": "ok"}


@app.post("/api/market-data")
async def market_data(payload: MarketDataRequest) -> Dict[str, object]:
    quotes = await market_agent.fetch_quotes(payload.symbols)
    return {
        "quotes": [quote.model_dump() for quote in quotes],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "market-data-agent",
    }


@app.get("/api/crypto-data")
async def crypto_data() -> Dict[str, object]:
    quotes = await crypto_agent.fetch_quotes()
    return {
        "quotes": [quote.model_dump() for quote in quotes],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "crypto-data-agent",
    }


@app.get("/api/news")
async def news() -> Dict[str, object]:
    items = await news_agent.fetch_top_news()
    return {
        "items": [item.model_dump() for item in items],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "news-intelligence-agent",
    }


@app.post("/api/risk")
async def risk_report(payload: PortfolioRequest) -> Dict[str, object]:
    report = await risk_agent.evaluate(payload.allocations)
    return {
        "report": report.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "risk-evaluation-agent",
    }


@app.post("/api/trend-analysis")
async def trend_analysis(payload: MarketDataRequest) -> Dict[str, object]:
    quotes = await market_agent.fetch_quotes(payload.symbols)
    signals = await trend_agent.analyze(quotes)
    return {
        "signals": [signal.model_dump() for signal in signals],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "trend-analysis-agent",
    }


@app.post("/api/rebalance")
async def rebalance(payload: OrchestratorRunRequest) -> Dict[str, object]:
    quotes = await market_agent.fetch_quotes(payload.symbols)
    trends = await trend_agent.analyze(quotes)
    risk = await risk_agent.evaluate(payload.portfolio.allocations)
    plan = await portfolio_agent.generate_plan(payload.portfolio.allocations, trends, risk)
    return {
        "plan": plan.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "portfolio-rebalancing-agent",
    }


@app.post("/api/insights")
async def insights(payload: OrchestratorRunRequest) -> Dict[str, object]:
    quotes = await market_agent.fetch_quotes(payload.symbols)
    trends = await trend_agent.analyze(quotes)
    risk = await risk_agent.evaluate(payload.portfolio.allocations)
    plan = await portfolio_agent.generate_plan(payload.portfolio.allocations, trends, risk)
    report = await insight_agent.generate(trends, risk, plan)
    return {
        "report": report.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "insight-report-agent",
    }


@app.post("/api/alerts")
async def alerts(payload: OrchestratorRunRequest) -> Dict[str, object]:
    quotes = await market_agent.fetch_quotes(payload.symbols)
    trends = await trend_agent.analyze(quotes)
    risk = await risk_agent.evaluate(payload.portfolio.allocations)
    items = await alert_agent.evaluate(trends, risk, payload.alertThreshold)
    return {
        "alerts": [item.model_dump() for item in items],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "alert-automation-agent",
    }


@app.get("/api/alerts/live")
async def live_alerts() -> Dict[str, object]:
    symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
    quotes = await market_agent.fetch_quotes(symbols)
    trends = await trend_agent.analyze(quotes)
    risk = await risk_agent.evaluate(None)
    items = await alert_agent.evaluate(trends, risk, threshold=0.7)
    return {
        "alerts": [item.model_dump() for item in items],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "alert-automation-agent",
    }


@app.get("/api/alerts/stream")
async def alert_stream() -> StreamingResponse:
    async def event_generator():
        while True:
            symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
            quotes = await market_agent.fetch_quotes(symbols)
            trends = await trend_agent.analyze(quotes)
            risk = await risk_agent.evaluate(None)
            items = await alert_agent.evaluate(trends, risk, threshold=0.7)
            payload = {
                "alerts": [item.model_dump() for item in items],
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "alert-automation-agent",
            }
            yield f"data: {json.dumps(payload)}\n\n"
            await asyncio.sleep(5)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


@app.post("/api/orchestrator/run")
async def run_orchestrator(payload: OrchestratorRunRequest) -> Dict[str, object]:
    return await orchestrator.run_cycle(payload)
