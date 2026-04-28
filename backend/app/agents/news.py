import asyncio
import json
import os
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from typing import List
from xml.etree import ElementTree

from app.models.schemas import NewsItem


class NewsIntelligenceAgent:
    def __init__(self) -> None:
        self._cache: List[NewsItem] = []
        self._cache_updated_at = 0.0
        self._cache_ttl_seconds = 60

    @staticmethod
    def _fetch_text(url: str) -> str:
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
            return response.read().decode("utf-8", errors="replace")

    @staticmethod
    def _sentiment_from_title(title: str) -> str:
        text = title.lower()
        positive = ("rally", "gain", "growth", "surge", "beat", "bull", "record", "up")
        negative = ("drop", "fall", "crash", "miss", "bear", "inflation", "down", "risk")
        if any(word in text for word in positive):
            return "positive"
        if any(word in text for word in negative):
            return "negative"
        return "neutral"

    def _from_newsapi(self, api_key: str) -> List[NewsItem]:
        params = urllib.parse.urlencode(
            {
                "q": "stock market OR federal reserve OR inflation OR crypto",
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": "6",
                "apiKey": api_key,
            }
        )
        url = f"https://newsapi.org/v2/everything?{params}"
        payload = json.loads(self._fetch_text(url))
        rows = payload.get("articles", [])
        items: List[NewsItem] = []
        for row in rows:
            title = (row.get("title") or "").strip()
            if not title:
                continue
            items.append(
                NewsItem(
                    title=title,
                    sentiment=self._sentiment_from_title(title),
                    source=(row.get("source") or {}).get("name") or "NewsAPI",
                    publishedAt=row.get("publishedAt") or datetime.now(timezone.utc).isoformat(),
                )
            )
        return items

    def _from_google_rss(self) -> List[NewsItem]:
        url = (
            "https://news.google.com/rss/search?"
            "q=stock+market+OR+inflation+OR+federal+reserve+OR+crypto&hl=en-US&gl=US&ceid=US:en"
        )
        xml_text = self._fetch_text(url)
        root = ElementTree.fromstring(xml_text)
        items: List[NewsItem] = []
        for node in root.findall(".//item")[:6]:
            title = (node.findtext("title") or "").strip()
            source = (node.findtext("source") or "Google News").strip()
            published = (node.findtext("pubDate") or "").strip()
            if not title:
                continue
            items.append(
                NewsItem(
                    title=title,
                    sentiment=self._sentiment_from_title(title),
                    source=source,
                    publishedAt=published or datetime.now(timezone.utc).isoformat(),
                )
            )
        return items

    async def fetch_top_news(self) -> List[NewsItem]:
        now = time.time()
        if self._cache and (now - self._cache_updated_at <= self._cache_ttl_seconds):
            return self._cache

        api_key = os.getenv("NEWS_API_KEY", "").strip()
        if api_key:
            try:
                items = await asyncio.to_thread(self._from_newsapi, api_key)
                if items:
                    self._cache = items
                    self._cache_updated_at = now
                    return items
            except Exception:
                pass

        items = await asyncio.to_thread(self._from_google_rss)
        if not items:
            if self._cache:
                return self._cache
            raise RuntimeError("No live news feed data returned")
        self._cache = items
        self._cache_updated_at = now
        return items
