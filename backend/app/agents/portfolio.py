from typing import Dict, List

from app.models.schemas import AllocationChange, RebalancePlan, RiskReport, TrendSignal


class PortfolioRebalancingAgent:
    async def generate_plan(
        self,
        allocations: Dict[str, float],
        trends: List[TrendSignal],
        risk: RiskReport,
    ) -> RebalancePlan:
        if not allocations:
            tracked_symbols = [signal.symbol for signal in trends[:5]]
            if not tracked_symbols:
                tracked_symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
            equal_weight = round(1 / len(tracked_symbols), 4)
            allocations = {symbol: equal_weight for symbol in tracked_symbols}

        trend_map = {signal.symbol: signal for signal in trends}
        changes: List[AllocationChange] = []
        risk_factor = 0.01 if risk.riskLevel == "Low" else (0.03 if risk.riskLevel == "Medium" else 0.05)

        for symbol, current_weight in allocations.items():
            signal = trend_map.get(symbol)
            target = current_weight
            rationale = "No strong signal; keep allocation stable."
            action = "hold"

            if signal:
                if signal.trend == "bullish":
                    target = min(current_weight + risk_factor, 0.5)
                    rationale = "Bullish trend and favorable momentum."
                elif signal.trend == "bearish":
                    target = max(current_weight - risk_factor, 0.02)
                    rationale = "Bearish trend; reduce exposure."
                action = "buy" if target > current_weight else ("sell" if target < current_weight else "hold")

            changes.append(
                AllocationChange(
                    symbol=symbol,
                    currentWeight=round(current_weight, 4),
                    targetWeight=round(target, 4),
                    action=action,
                    rationale=rationale,
                )
            )

        return RebalancePlan(
            changes=changes,
            expectedRiskReduction=round(0.5 + (0.2 if risk.riskLevel != "Low" else 0.05), 2),
            expectedSharpeImprovement=round(0.1 + (0.15 if risk.riskLevel == "High" else 0.08), 2),
        )
