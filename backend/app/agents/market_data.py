import asyncio
import json
import time
import urllib.parse
import urllib.request
from typing import Dict, List, Tuple

from app.models.schemas import MarketQuote


class MarketDataAgent:
    def __init__(self) -> None:
        self._cache: Dict[str, Tuple[float, List[MarketQuote]]] = {}
        self._cache_ttl_seconds = 20

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

    def _fetch_quotes_sync(self, symbols: List[str]) -> List[MarketQuote]:
        csv_symbols = ",".join(symbols)
        url = (
            "https://query1.finance.yahoo.com/v7/finance/quote"
            f"?symbols={urllib.parse.quote(csv_symbols)}"
        )
        payload = self._fetch_json(url)
        rows = payload.get("quoteResponse", {}).get("result", [])
        quotes: List[MarketQuote] = []

        for row in rows:
            symbol = row.get("symbol")
            if not symbol:
                continue

            price = float(row.get("regularMarketPrice") or 0.0)
            previous_close = float(row.get("regularMarketPreviousClose") or price or 0.0)
            change = float(row.get("regularMarketChange") or (price - previous_close))
            change_percent = float(
                row.get("regularMarketChangePercent")
                or ((change / previous_close) * 100 if previous_close else 0.0)
            )

            quotes.append(
                MarketQuote(
                    symbol=symbol,
                    price=round(price, 4),
                    change=round(change, 4),
                    changePercent=round(change_percent, 4),
                    volume=int(row.get("regularMarketVolume") or 0),
                    high=round(float(row.get("regularMarketDayHigh") or price), 4),
                    low=round(float(row.get("regularMarketDayLow") or price), 4),
                    open=round(float(row.get("regularMarketOpen") or previous_close), 4),
                    previousClose=round(previous_close, 4),
                )
            )
        return quotes

    async def fetch_quotes(self, symbols: List[str]) -> List[MarketQuote]:
        key = ",".join(sorted(symbols))
        now = time.time()

        cached = self._cache.get(key)
        if cached and (now - cached[0] <= self._cache_ttl_seconds):
            return cached[1]

        try:
            quotes = await asyncio.to_thread(self._fetch_quotes_sync, symbols)
            if not quotes:
                raise RuntimeError("No live market quote data returned")
            self._cache[key] = (now, quotes)
            return quotes
        except Exception:
            if cached:
                return cached[1]
            raise
