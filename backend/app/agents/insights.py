from typing import List

from app.models.schemas import InsightReport, RebalancePlan, RiskReport, TrendSignal


class InsightReportAgent:
    async def generate(
        self,
        trends: List[TrendSignal],
        risk: RiskReport,
        rebalance: RebalancePlan,
    ) -> InsightReport:
        bullish = sum(1 for signal in trends if signal.trend == "bullish")
        bearish = sum(1 for signal in trends if signal.trend == "bearish")

        headline = "Market stance neutral"
        if bullish > bearish:
            headline = "Risk-adjusted bullish setup detected"
        elif bearish > bullish:
            headline = "Defensive posture recommended"

        signals = [
            f"Bullish signals: {bullish}",
            f"Bearish signals: {bearish}",
            f"Portfolio risk level: {risk.riskLevel}",
            f"Estimated Sharpe ratio: {risk.sharpeRatio}",
        ]

        predictions = [
            "Short-term volatility likely to remain elevated.",
            "Rebalancing may improve downside protection.",
            "Alert channels should prioritize high-severity macro events.",
        ]

        summary = (
            f"Trend analysis indicates {headline.lower()}. "
            f"The proposed plan contains {len(rebalance.changes)} allocation updates "
            f"with expected risk reduction of {rebalance.expectedRiskReduction}%."
        )

        return InsightReport(
            headline=headline,
            summary=summary,
            signals=signals,
            predictions=predictions,
        )
