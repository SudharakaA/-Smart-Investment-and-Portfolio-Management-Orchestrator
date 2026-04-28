from datetime import datetime, timezone
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class MarketDataRequest(BaseModel):
    symbols: List[str] = Field(default_factory=lambda: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"])


class MarketQuote(BaseModel):
    symbol: str
    price: float
    change: float
    changePercent: float
    volume: int
    high: float
    low: float
    open: float
    previousClose: float


class CryptoQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change24h: float
    changePercent24h: float
    volume24h: float
    marketCap: float
    high24h: float
    low24h: float


class CryptoHistoryPoint(BaseModel):
    timestamp: int
    price: float


class NewsItem(BaseModel):
    title: str
    sentiment: str
    source: str
    publishedAt: str


class RiskReport(BaseModel):
    var95: float
    sharpeRatio: float
    diversificationScore: float
    riskLevel: str


class TrendSignal(BaseModel):
    symbol: str
    trend: Literal["bullish", "bearish", "sideways"]
    rsi: float
    movingAverage20: float
    movingAverage50: float
    volatility: float
    anomalyScore: float


class AllocationChange(BaseModel):
    symbol: str
    currentWeight: float
    targetWeight: float
    action: Literal["buy", "sell", "hold"]
    rationale: str


class RebalancePlan(BaseModel):
    changes: List[AllocationChange]
    expectedRiskReduction: float
    expectedSharpeImprovement: float


class InsightReport(BaseModel):
    headline: str
    summary: str
    signals: List[str]
    predictions: List[str]


class Alert(BaseModel):
    severity: Literal["low", "medium", "high"]
    category: Literal["warning", "opportunity", "news", "risk"]
    title: str
    message: str
    agent: str = "Alert & Automation Agent"
    channels: List[str]
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class PortfolioRequest(BaseModel):
    allocations: Dict[str, float] = Field(default_factory=dict)
    totalValue: float = 100000.0


class OrchestratorRunRequest(BaseModel):
    symbols: List[str] = Field(default_factory=lambda: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"])
    portfolio: PortfolioRequest = Field(default_factory=PortfolioRequest)
    alertThreshold: float = 0.7


class AgentRunSnapshot(BaseModel):
    marketQuotes: List[MarketQuote]
    cryptoQuotes: List[CryptoQuote]
    news: List[NewsItem]
    trends: List[TrendSignal]
    risk: RiskReport
    rebalance: RebalancePlan
    report: InsightReport
    alerts: List[Alert]
    events: List[str]
    memoryKeys: List[str]


class TimestampedResponse(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AuthRequest(BaseModel):
    username: str
    password: str


class AuthUser(BaseModel):
    id: int
    username: str
    createdAt: str


class AuthResponse(BaseModel):
    token: str
    expiresAt: str
    user: AuthUser


class AgentExecutionStatus(BaseModel):
    agent_id: str
    agent_name: str
    status: Literal["idle", "running", "completed", "error"]
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    duration_ms: Optional[float] = None
    error: Optional[str] = None
