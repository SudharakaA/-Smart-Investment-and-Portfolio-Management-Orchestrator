from typing import List, Optional

from app.models.schemas import Alert, CryptoQuote, MarketQuote, NewsItem, RiskReport, TrendSignal


class AlertAutomationAgent:
    async def evaluate(
        self,
        trends: List[TrendSignal],
        risk: RiskReport,
        threshold: float,
        market_quotes: Optional[List[MarketQuote]] = None,
        crypto_quotes: Optional[List[CryptoQuote]] = None,
        news_items: Optional[List[NewsItem]] = None,
    ) -> List[Alert]:
        alerts: List[Alert] = []
        effective_threshold = min(max(threshold, 0.0), 1.0)

        if risk.riskLevel == "High":
            alerts.append(
                Alert(
                    severity="high",
                    category="risk",
                    title="Portfolio risk elevated",
                    message=f"VaR95 at {risk.var95:.2%}. Reduce concentrated exposure.",
                    agent="Risk Evaluation Agent",
                    channels=["dashboard", "email", "sms"],
                )
            )

        for signal in trends:
            if signal.anomalyScore >= effective_threshold:
                alerts.append(
                    Alert(
                        severity="medium",
                        category="warning",
                        title=f"Anomaly detected in {signal.symbol}",
                        message=(
                            f"Anomaly score {signal.anomalyScore:.2f} with "
                            f"volatility {signal.volatility:.2%}."
                        ),
                        agent="Trend Analysis Agent",
                        channels=["dashboard", "email"],
                    )
                )

        for quote in market_quotes or []:
            if abs(quote.changePercent) >= 2.5:
                direction = "up" if quote.changePercent > 0 else "down"
                alerts.append(
                    Alert(
                        severity="medium",
                        category="warning",
                        title=f"Sharp move in {quote.symbol}",
                        message=(
                            f"{quote.symbol} is {direction} {abs(quote.changePercent):.2f}% "
                            f"in current trading."
                        ),
                        agent="Market Data Agent",
                        channels=["dashboard", "email"],
                    )
                )

        for quote in crypto_quotes or []:
            if abs(quote.changePercent24h) >= 4.0:
                direction = "up" if quote.changePercent24h > 0 else "down"
                alerts.append(
                    Alert(
                        severity="high" if abs(quote.changePercent24h) >= 7.5 else "medium",
                        category="warning",
                        title=f"Crypto volatility: {quote.symbol}",
                        message=(
                            f"{quote.symbol} is {direction} {abs(quote.changePercent24h):.2f}% "
                            f"over 24h."
                        ),
                        agent="Market Data Agent",
                        channels=["dashboard", "email", "sms"],
                    )
                )

        for item in (news_items or [])[:3]:
            if item.sentiment == "negative":
                alerts.append(
                    Alert(
                        severity="medium",
                        category="news",
                        title="Negative macro/news sentiment detected",
                        message=item.title,
                        agent="News Intelligence Agent",
                        channels=["dashboard"],
                    )
                )
                break

        if not alerts:
            alerts.append(
                Alert(
                    severity="low",
                    category="opportunity",
                    title="No critical events",
                    message="Markets are within normal operating thresholds.",
                    agent="Alert & Automation Agent",
                    channels=["dashboard"],
                )
            )

        return alerts
