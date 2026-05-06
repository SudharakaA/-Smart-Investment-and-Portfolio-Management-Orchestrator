
---

# 🚀 Multi-Agent Financial Intelligence System

**Smart Investment & Portfolio Management Orchestrator**

An event-driven, multi-agent financial intelligence system designed to help investors survive (and thrive) in chaotic markets 📉📈.
This system continuously analyzes market data, global news, risk exposure, and portfolio performance to generate actionable insights in real time.

---

## 🧠 What This Project Does

This project implements a **hierarchical multi-agent architecture** where specialized agents collaborate to:

* Monitor live financial markets (stocks, crypto, forex, commodities)
* Analyze trends & technical indicators
* Track global financial news and sentiment
* Evaluate portfolio risk and diversification
* Suggest portfolio rebalancing strategies
* Generate human-readable insights & alerts

Think of it as a **financial command center powered by agents** 🤖💸.

---

## 🏗️ System Architecture Overview

```
                ┌────────────────────┐
                │  External APIs     │
                │ (Yahoo, Alpha, News│
                └─────────┬──────────┘
                          │
        ┌─────────────────▼─────────────────┐
        │        Agent Orchestrator           │
        │           (FastAPI)                 │
        └───────┬───────┬───────┬────────────┘
                │       │       │
 ┌──────────────▼┐ ┌────▼────┐ ┌▼───────────┐
 │ Market Data   │ │ News     │ │ Trend       │
 │ Agent         │ │ Agent    │ │ Analysis    │
 └───────────────┘ └─────────┘ └─────────────┘
        │                    │
 ┌──────▼────────┐   ┌───────▼────────┐
 │ Risk Evaluation│   │ Portfolio       │
 │ Agent          │   │ Rebalancing     │
 └──────┬─────────┘   └───────┬────────┘
        │                     │
 ┌──────▼──────────┐  ┌───────▼─────────┐
 │ Insight & Report │  │ Alert &          │
 │ Generation Agent │  │ Automation Agent│
 └─────────────────┘  └─────────────────┘
```

---

## 🤖 Agents & Responsibilities

| Agent                           | Responsibility                                     |
| ------------------------------- | -------------------------------------------------- |
| **Market Data Agent**           | Fetches real-time market data                      |
| **News Intelligence Agent**     | Processes global financial news & sentiment        |
| **Trend Analysis Agent**        | Technical analysis (RSI, MA, volatility, patterns) |
| **Risk Evaluation Agent**       | VaR, Sharpe ratio, diversification scoring         |
| **Portfolio Rebalancing Agent** | Buy/sell simulations & allocation optimization     |
| **Insight & Report Agent**      | Converts analytics into readable insights          |
| **Alert & Automation Agent**    | Sends alerts for major market events               |

---

## 🧩 Tech Stack

### Backend

* **Python**
* **FastAPI** (Agent Orchestrator)
* **Docker** (Microservices)
* **Redis** (Key-Value & State Memory)
* **Vector Database** (Contextual & Time-Series Memory)

### APIs

* Yahoo Finance API
* Alpha Vantage API
* News API

### Frontend

* **React.js**
* Data visualization (charts, indicators, reports)

### Communication

* Event-driven Pub/Sub messaging
* Loose-coupled agent communication

---

## 🧠 Memory Layer (Contextual Brain)

The system uses a **hybrid memory model**:

* **Vector Memory** → Contextual retrieval & semantic search
* **Redis (Key-Value Store)** → Fast state management
* **Time-Series Memory** → Historical market tracking

This allows agents to reason using **both short-term context and long-term history**.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/multi-agent-financial-intelligence.git
cd multi-agent-financial-intelligence
```

### 2️⃣ Frontend Setup

```bash
npm install
```

Create/update `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3️⃣ Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 4️⃣ Run Services

Terminal 1 (backend):

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 (frontend):

```bash
npm run dev
```

---

## 📊 Features Implemented

* ✅ Multi-agent orchestration
* ✅ Live market data ingestion
* ✅ News sentiment analysis
* ✅ Technical indicators (RSI, MA, volatility)
* ✅ Risk & diversification metrics
* ✅ Portfolio rebalancing simulations
* ✅ Insight generation
* ✅ Real-time alerts

---

## 🛣️ Roadmap

* 🔄 Reinforcement learning for rebalancing
* 📈 Advanced anomaly detection
* 🧠 LLM-powered financial reasoning
* 📱 Mobile dashboard
* ☁️ AWS Lambda auto-scaling
* 🔐 Secure auth & user profiles

---

## 🎯 Use Cases

* Retail investors
* Portfolio managers
* FinTech research
* Algorithmic trading assistants
* Academic & R&D projects

---

<img width="1440" height="900" alt="Screenshot 2026-05-06 at 18 56 27" src="https://github.com/user-attachments/assets/cfa557fd-89df-4f75-842a-7835747a25f7" />

<img width="1440" height="900" alt="Screenshot 2026-05-06 at 18 57 38" src="https://github.com/user-attachments/assets/b9220e27-d54f-4b39-b38d-b50d3ec7a021" />

<img width="1440" height="900" alt="Screenshot 2026-05-06 at 18 57 46" src="https://github.com/user-attachments/assets/8f174bd0-c0c1-43ee-b4ae-bc04db3eb7a8" />

<img width="1440" height="900" alt="Screenshot 2026-05-06 at 18 57 53" src="https://github.com/user-attachments/assets/1c3f357c-c6ad-4263-9580-fad4ab9103f7" />

<img width="1440" height="900" alt="Screenshot 2026-05-06 at 18 58 05" src="https://github.com/user-attachments/assets/d11c0181-4538-4fee-a1ac-a8fcadcdbec7" />

<img width="1440" height="900" alt="Screenshot 2026-05-06 at 18 58 27" src="https://github.com/user-attachments/assets/7b7a07e1-0fb0-433d-8631-3467453c72b9" />




## 🤝 Contributions

Pull requests are welcome!
If you’re into **multi-agent systems, finance, or AI**, this repo is your playground 🛝.

---

## 📜 License

MIT License – build cool stuff responsibly ✨

---
