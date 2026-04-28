import asyncio
import json
import time
import urllib.parse
import urllib.request
from typing import Dict, List, Optional, Tuple

from app.models.schemas import CryptoHistoryPoint, CryptoQuote


class CryptoDataAgent:
    def __init__(self) -> None:
        self._history_cache: Dict[str, Tuple[float, Dict[str, object]]] = {}
        self._history_cache_ttl_seconds = 15
        self._quotes_cache: Optional[Tuple[float, List[CryptoQuote]]] = None
        self._quotes_cache_ttl_seconds = 20

    @staticmethod
    def _fetch_json(url: str):
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

    def _fetch_quotes_sync(self) -> List[CryptoQuote]:
        ids = "bitcoin,ethereum,solana,ripple"
        params = urllib.parse.urlencode(
            {
                "vs_currency": "usd",
                "ids": ids,
                "order": "market_cap_desc",
                "per_page": "50",
                "page": "1",
                "sparkline": "false",
                "price_change_percentage": "24h",
            }
        )
        url = f"https://api.coingecko.com/api/v3/coins/markets?{params}"
        rows = self._fetch_json(url)

        quotes: List[CryptoQuote] = []
        for row in rows:
            price = float(row.get("current_price") or 0.0)
            change24h = float(row.get("price_change_24h") or 0.0)
            prev = price - change24h
            change_pct = float(row.get("price_change_percentage_24h") or 0.0)

            quotes.append(
                CryptoQuote(
                    symbol=str(row.get("symbol", "")).upper(),
                    name=str(row.get("name", "")),
                    price=round(price, 6),
                    change24h=round(change24h, 6),
                    changePercent24h=round(change_pct, 6),
                    volume24h=float(row.get("total_volume") or 0.0),
                    marketCap=float(row.get("market_cap") or 0.0),
                    high24h=round(float(row.get("high_24h") or price), 6),
                    low24h=round(float(row.get("low_24h") or price), 6),
                )
            )
        return quotes

    async def fetch_quotes(self) -> List[CryptoQuote]:
        now = time.time()
        if self._quotes_cache and (now - self._quotes_cache[0] <= self._quotes_cache_ttl_seconds):
            return self._quotes_cache[1]

        try:
            quotes = await asyncio.to_thread(self._fetch_quotes_sync)
            if not quotes:
                raise RuntimeError("No live crypto quote data returned")
            self._quotes_cache = (now, quotes)
            return quotes
        except Exception:
            if self._quotes_cache:
                return self._quotes_cache[1]
            raise

    @staticmethod
    def _range_config(range_key: str) -> Tuple[str, str, int]:
        key = range_key.upper()
        mapping: Dict[str, Tuple[str, str, int]] = {
            "1H": ("1d", "1m", 60 * 60),
            "24H": ("1d", "5m", 24 * 60 * 60),
            "7D": ("7d", "1h", 7 * 24 * 60 * 60),
            "1M": ("1mo", "1d", 30 * 24 * 60 * 60),
            "1Y": ("1y", "1d", 365 * 24 * 60 * 60),
        }
        if key not in mapping:
            raise ValueError(f"Unsupported range '{range_key}'. Use 1H, 24H, 7D, 1M, 1Y.")
        return mapping[key]

    @staticmethod
    def _binance_config(range_key: str) -> Tuple[str, int]:
        key = range_key.upper()
        mapping: Dict[str, Tuple[str, int]] = {
            "1H": ("1m", 60),
            "24H": ("15m", 96),
            "7D": ("1h", 168),
            "1M": ("4h", 180),
            "1Y": ("1d", 365),
        }
        return mapping[key]

    @staticmethod
    def _format_history_payload(range_key: str, rows: List[Tuple[int, float]], source: str) -> Dict[str, object]:
        if not rows:
            raise RuntimeError("No live BTC history data returned")

        max_points = 180
        filtered = rows
        if len(filtered) > max_points:
            step = max(1, len(filtered) // max_points)
            sampled = filtered[::step]
            if sampled[-1] != filtered[-1]:
                sampled.append(filtered[-1])
            filtered = sampled

        points = [
            CryptoHistoryPoint(timestamp=int(row[0]), price=round(float(row[1]), 6))
            for row in filtered
        ]
        first_price = points[0].price
        last_price = points[-1].price
        change_percent = ((last_price - first_price) / first_price * 100) if first_price else 0.0

        return {
            "symbol": "BTC/USD",
            "range": range_key.upper(),
            "points": [point.model_dump() for point in points],
            "currentPrice": round(last_price, 6),
            "changePercent": round(change_percent, 6),
            "source": source,
        }

    def _fetch_btc_history_yahoo(self, range_key: str) -> Dict[str, object]:
        period_range, interval, window_seconds = self._range_config(range_key)
        params = urllib.parse.urlencode(
            {
                "range": period_range,
                "interval": interval,
            }
        )
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?{params}"
        payload = self._fetch_json(url)
        result = ((payload.get("chart") or {}).get("result") or [None])[0]
        if not result:
            raise RuntimeError("No live BTC history data returned")

        timestamps = result.get("timestamp") or []
        closes = (((result.get("indicators") or {}).get("quote") or [{}])[0].get("close") or [])
        rows = []
        for ts, close in zip(timestamps, closes):
            if close is None:
                continue
            rows.append((int(ts) * 1000, float(close)))

        if not rows:
            raise RuntimeError("No live BTC history data returned")

        last_ts_ms = rows[-1][0]
        window_start_ms = last_ts_ms - window_seconds * 1000
        filtered = [row for row in rows if row[0] >= window_start_ms]
        if not filtered:
            filtered = rows

        return self._format_history_payload(range_key, filtered, "yahoo-finance")

    def _fetch_btc_history_binance(self, range_key: str) -> Dict[str, object]:
        interval, limit = self._binance_config(range_key)
        params = urllib.parse.urlencode(
            {
                "symbol": "BTCUSDT",
                "interval": interval,
                "limit": str(limit),
            }
        )
        url = f"https://api.binance.com/api/v3/klines?{params}"
        rows = self._fetch_json(url)
        if not rows:
            raise RuntimeError("No live BTC history data returned")

        parsed: List[Tuple[int, float]] = []
        for row in rows:
            # Binance kline: [openTime, open, high, low, close, ...]
            open_time = int(row[0])
            close_price = float(row[4])
            parsed.append((open_time, close_price))
        return self._format_history_payload(range_key, parsed, "binance")

    def _fetch_btc_history_sync(self, range_key: str) -> Dict[str, object]:
        key = range_key.upper()

        cached = self._history_cache.get(key)
        now = time.time()
        if cached and (now - cached[0] <= self._history_cache_ttl_seconds):
            return cached[1]

        last_error: Optional[Exception] = None
        try:
            payload = self._fetch_btc_history_yahoo(key)
            self._history_cache[key] = (now, payload)
            return payload
        except Exception as exc:
            last_error = exc

        try:
            payload = self._fetch_btc_history_binance(key)
            self._history_cache[key] = (now, payload)
            return payload
        except Exception as exc:
            if last_error is not None:
                raise RuntimeError(
                    f"BTC history providers failed (yahoo/binance): {last_error} | {exc}"
                ) from exc
            raise

    async def fetch_btc_history(self, range_key: str) -> Dict[str, object]:
        return await asyncio.to_thread(self._fetch_btc_history_sync, range_key)
