from datetime import datetime, timezone
from typing import Dict, List
import time

from app.agents.alerts import AlertAutomationAgent
from app.agents.crypto import CryptoDataAgent
from app.agents.insights import InsightReportAgent
from app.agents.market_data import MarketDataAgent
from app.agents.news import NewsIntelligenceAgent
from app.agents.portfolio import PortfolioRebalancingAgent
from app.agents.risk import RiskEvaluationAgent
from app.agents.trend import TrendAnalysisAgent
from app.memory.kv_store import RedisKVStore
from app.memory.time_series_store import TimeSeriesMemoryStore
from app.memory.vector_store import VectorMemoryStore
from app.messaging.pubsub import InMemoryPubSub
from app.models.schemas import AgentRunSnapshot, OrchestratorRunRequest, AgentExecutionStatus


class AgentOrchestratorService:
    def __init__(self) -> None:
        self.market_agent = MarketDataAgent()
        self.crypto_agent = CryptoDataAgent()
        self.news_agent = NewsIntelligenceAgent()
        self.trend_agent = TrendAnalysisAgent()
        self.risk_agent = RiskEvaluationAgent()
        self.rebalance_agent = PortfolioRebalancingAgent()
        self.insight_agent = InsightReportAgent()
        self.alert_agent = AlertAutomationAgent()

        self.kv_store = RedisKVStore()
        self.vector_store = VectorMemoryStore()
        self.time_series_store = TimeSeriesMemoryStore()
        self.pubsub = InMemoryPubSub()

    async def run_cycle(self, payload: OrchestratorRunRequest) -> Dict[str, object]:
        # Market Data Agent
        self._update_status("market_data", "running")
        try:
            market_quotes = await self.market_agent.fetch_quotes(payload.symbols)
            self._update_status("market_data", "completed")
        except Exception as e:
            self._update_status("market_data", "error", str(e))
            raise
        
        # Crypto Data Agent
        self._update_status("crypto_data", "running")
        try:
            crypto_quotes = await self.crypto_agent.fetch_quotes()
            self._update_status("crypto_data", "completed")
        except Exception as e:
            self._update_status("crypto_data", "error", str(e))
            raise
        
        # News Intelligence Agent
        self._update_status("news_intelligence", "running")
        try:
            news_items = await self.news_agent.fetch_top_news()
            self._update_status("news_intelligence", "completed")
        except Exception as e:
            self._update_status("news_intelligence", "error", str(e))
            raise

        # Trend Analysis Agent
        self._update_status("trend_analysis", "running")
        try:
            trends = await self.trend_agent.analyze(market_quotes)
            self._update_status("trend_analysis", "completed")
        except Exception as e:
            self._update_status("trend_analysis", "error", str(e))
            raise
        
        # Risk Evaluation Agent
        self._update_status("risk_evaluation", "running")
        try:
            risk = await self.risk_agent.evaluate(payload.portfolio.allocations)
            self._update_status("risk_evaluation", "completed")
        except Exception as e:
            self._update_status("risk_evaluation", "error", str(e))
            raise
        
        # Portfolio Rebalancing Agent
        self._update_status("portfolio_rebalancing", "running")
        try:
            rebalance = await self.rebalance_agent.generate_plan(payload.portfolio.allocations, trends, risk)
            self._update_status("portfolio_rebalancing", "completed")
        except Exception as e:
            self._update_status("portfolio_rebalancing", "error", str(e))
            raise
        
        # Insight Generation Agent
        self._update_status("insight_generation", "running")
        try:
            report = await self.insight_agent.generate(trends, risk, rebalance)
            self._update_status("insight_generation", "completed")
        except Exception as e:
            self._update_status("insight_generation", "error", str(e))
            raise
        
        # Alert Automation Agent
        self._update_status("alert_automation", "running")
        try:
            alerts = await self.alert_agent.evaluate(
                trends,
                risk,
                payload.alertThreshold,
                market_quotes=market_quotes,
                crypto_quotes=crypto_quotes,
                news_items=news_items,
            )
            self._update_status("alert_automation", "completed")
        except Exception as e:
            self._update_status("alert_automation", "error", str(e))
            raise

        await self.pubsub.publish("market.updates", {"count": len(market_quotes)})
        await self.pubsub.publish("risk.updates", risk.model_dump())
        await self.pubsub.publish("alerts.updates", [alert.model_dump() for alert in alerts])

        timestamp = datetime.now(timezone.utc).isoformat()
        await self.kv_store.set("latest_timestamp", timestamp)
        await self.kv_store.set("latest_risk", risk.model_dump())
        await self.kv_store.set("latest_report", report.model_dump())
        await self.time_series_store.append("market.quotes", [quote.model_dump() for quote in market_quotes])

        # Minimal feature vector derived from risk state for contextual retrieval.
        feature_vector: List[float] = [risk.var95, risk.sharpeRatio, risk.diversificationScore / 100]
        await self.vector_store.upsert(f"cycle:{timestamp}", feature_vector, report.model_dump())

        events = []
        for topic in ("market.updates", "risk.updates", "alerts.updates"):
            topic_events = await self.pubsub.read_topic(topic, limit=10)
            events.extend([f"{topic}:{len(topic_events)}"])

        memory_keys = await self.kv_store.keys()
        snapshot = AgentRunSnapshot(
            marketQuotes=market_quotes,
            cryptoQuotes=crypto_quotes,
            news=news_items,
            trends=trends,
            risk=risk,
            rebalance=rebalance,
            report=report,
            alerts=alerts,
            events=events,
            memoryKeys=memory_keys,
        )
        return {
            "snapshot": snapshot.model_dump(),
            "timestamp": timestamp,
            "source": "agent-orchestrator",
        }
