from typing import Dict, Optional

from app.models.schemas import RiskReport


class RiskEvaluationAgent:
    async def evaluate(self, portfolio: Optional[Dict[str, float]] = None) -> RiskReport:
        allocations = portfolio or {}
        if allocations:
            total = sum(max(value, 0.0) for value in allocations.values()) or 1.0
            weights = [max(value, 0.0) / total for value in allocations.values()]
        else:
            # Assume balanced allocation when holdings are not supplied.
            weights = [0.2, 0.2, 0.2, 0.2, 0.2]

        hhi = sum(weight * weight for weight in weights)  # concentration proxy
        effective_assets = 1.0 / hhi if hhi else float(len(weights))
        max_weight = max(weights) if weights else 1.0

        # VaR95 proxy based on concentration and dominant position weight.
        var95 = round(min(0.14, 0.02 + hhi * 0.12 + max_weight * 0.03), 4)
        diversification = round(min(100.0, max(0.0, (effective_assets / max(len(weights), 1)) * 100.0)), 2)

        # Sharpe proxy: concentrated and higher VaR portfolios get lower score.
        sharpe = round(max(0.2, 2.4 - (var95 * 11.0) - (max_weight * 0.6)), 2)

        risk_level = "Low"
        if var95 > 0.08:
            risk_level = "High"
        elif var95 > 0.05:
            risk_level = "Medium"

        return RiskReport(
            var95=var95,
            sharpeRatio=sharpe,
            diversificationScore=diversification,
            riskLevel=risk_level,
        )
