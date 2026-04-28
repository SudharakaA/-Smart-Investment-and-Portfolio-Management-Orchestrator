# InvestX Multi-Agent Backend

This backend implements a hierarchical, multi-agent financial intelligence orchestrator using FastAPI.

## Agents

| Agent | Primary Function | Core Analytics |
| --- | --- | --- |
| Market Data Agent | Fetches live-like market data and snapshots | Price feed simulation, rolling updates |
| News Intelligence Agent | Produces actionable market news signals | Sentiment labels, topic-style summaries |
| Trend Analysis Agent | Detects directional market behavior | RSI proxy, MA20/MA50, volatility, anomaly score |
| Risk Evaluation Agent | Quantifies portfolio risk posture | VaR95, Sharpe ratio, diversification score |
| Portfolio Rebalancing Agent | Proposes buy/sell/hold adjustments | Scenario-based target weights |
| Insight & Report Agent | Converts signals into readable intelligence | Headline, summary, predictions |
| Alert & Automation Agent | Raises event-driven investor alerts | Threshold monitoring, severity routing |

## External APIs

The architecture is prepared for:
- Yahoo API
- Alpha Vantage API
- News API

Current implementation for live alerts uses:
- Yahoo Finance quote + chart endpoints (stocks)
- CoinGecko markets endpoint (crypto)
- NewsAPI (if `NEWS_API_KEY` set) or Google News RSS fallback

## Memory Layer

- Redis-style key-value memory: `app/memory/kv_store.py`
- Vector memory abstraction: `app/memory/vector_store.py`
- Rolling time-series memory: `app/memory/time_series_store.py`

## Event-Driven Messaging

- In-memory Pub/Sub abstraction: `app/messaging/pubsub.py`
- Topics used by orchestrator: `market.updates`, `risk.updates`, `alerts.updates`

## API Endpoints

- `GET /health`
- `POST /api/market-data`
- `GET /api/crypto-data`
- `GET /api/crypto/history?symbol=BTC&range=1H|24H|7D|1M|1Y`
- `GET /api/news`
- `POST /api/risk`
- `POST /api/trend-analysis`
- `POST /api/rebalance`
- `POST /api/insights`
- `POST /api/alerts`
- `POST /api/orchestrator/run`

## Run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Real-Time Alerts Notes

- `GET /api/alerts/live` and `GET /api/alerts/stream` now use real market/news sources.
- If a source is unavailable, the API emits a data-unavailable alert instead of fake/random numbers.

## Auth Database

Set `AUTH_DB_URL` in `backend/.env`:

- SQLite (default): `sqlite:///data/investx.db`
- MySQL: `mysql://username:password@127.0.0.1:3306/investx`
