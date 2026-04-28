import asyncio
import json
import statistics
import urllib.request
from typing import List

from app.models.schemas import MarketQuote, TrendSignal


class TrendAnalysisAgent:
    @staticmethod
    def _fetch_json(url: str) -> dict:
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
                )
            },
        )
        with urllib.request.urlopen(request, timeout=12) as response:
            return json.loads(response.read().decode("utf-8"))

    def _fetch_closes(self, symbol: str) -> List[float]:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=3mo&interval=1d"
        payload = self._fetch_json(url)
        result = (payload.get("chart") or {}).get("result") or []
        if not result:
            return []
        close_values = (((result[0].get("indicators") or {}).get("quote") or [{}])[0].get("close") or [])
        return [float(value) for value in close_values if value is not None]

    @staticmethod
    def _moving_average(values: List[float], period: int) -> float:
        if not values:
            return 0.0
        if len(values) < period:
            return sum(values) / len(values)
        window = values[-period:]
        return sum(window) / period

    @staticmethod
    def _rsi(values: List[float], period: int = 14) -> float:
        if len(values) < 2:
            return 50.0
        deltas = [values[i] - values[i - 1] for i in range(1, len(values))]
        gains = [max(delta, 0) for delta in deltas]
        losses = [abs(min(delta, 0)) for delta in deltas]

        if len(gains) < period:
            period = max(2, len(gains))
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period

        if avg_loss == 0:
            return 100.0
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))

    @staticmethod
    def _volatility(values: List[float]) -> float:
        if len(values) < 3:
            return 0.0
        returns = []
        for i in range(1, len(values)):
            prev = values[i - 1]
            curr = values[i]
            if prev:
                returns.append((curr - prev) / prev)
        if len(returns) < 2:
            return 0.0
        return statistics.pstdev(returns)

    async def _analyze_quote(self, quote: MarketQuote) -> TrendSignal:
        closes = await asyncio.to_thread(self._fetch_closes, quote.symbol)
        if not closes:
            closes = [quote.previousClose, quote.open, quote.price]

        ma20 = self._moving_average(closes, 20)
        ma50 = self._moving_average(closes, 50)
        rsi = self._rsi(closes, 14)
        volatility = self._volatility(closes[-30:])

        trend = "sideways"
        if ma20 > ma50 and quote.changePercent > 0:
            trend = "bullish"
        elif ma20 < ma50 and quote.changePercent < 0:
            trend = "bearish"

        momentum_component = min(abs(quote.changePercent) / 8.0, 0.7)
        volatility_component = min(volatility * 6.0, 0.3)
        anomaly = min(1.0, max(0.0, momentum_component + volatility_component))
        if rsi > 75 or rsi < 25:
            anomaly = min(1.0, anomaly + 0.1)

        return TrendSignal(
            symbol=quote.symbol,
            trend=trend,
            rsi=round(rsi, 2),
            movingAverage20=round(ma20, 4),
            movingAverage50=round(ma50, 4),
            volatility=round(volatility, 6),
            anomalyScore=round(anomaly, 4),
        )

    async def analyze(self, quotes: List[MarketQuote]) -> List[TrendSignal]:
        tasks = [self._analyze_quote(quote) for quote in quotes]
        return await asyncio.gather(*tasks)
