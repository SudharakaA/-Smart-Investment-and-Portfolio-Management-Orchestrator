import DashboardLayout from "@/components/layout/DashboardLayout";
import AgentStatusCard from "@/components/dashboard/AgentStatusCard";
import AgentOrchestrator from "@/components/dashboard/AgentOrchestrator";
import { Database, Newspaper, BarChart3, Shield, RefreshCw, FileText, Bell, Zap } from "lucide-react";

const agentDetails = [
  {
    name: "Market Data Agent",
    description: "Fetches real-time market data from Yahoo Finance, Alpha Vantage, and other sources. Processes over 1M price updates per hour.",
    status: "online" as const,
    lastAction: "Fetched 1,247 price updates",
    icon: <Database size={18} />,
    metrics: { processed: 124789, accuracy: 99.8 },
    uptime: "99.99%",
    latency: "12ms"
  },
  {
    name: "News Intelligence Agent",
    description: "Processes global financial news and performs sentiment analysis using NLP models. Tracks 500+ news sources.",
    status: "processing" as const,
    lastAction: "Analyzing Fed press release",
    icon: <Newspaper size={18} />,
    metrics: { processed: 3421, accuracy: 94.2 },
    uptime: "99.95%",
    latency: "45ms"
  },
  {
    name: "Trend Analysis Agent",
    description: "Technical analysis including RSI, MA, volatility patterns. Identifies bullish/bearish divergences and trend reversals.",
    status: "online" as const,
    lastAction: "Detected bullish divergence on AAPL",
    icon: <BarChart3 size={18} />,
    metrics: { processed: 8934, accuracy: 87.5 },
    uptime: "99.97%",
    latency: "28ms"
  },
  {
    name: "Risk Evaluation Agent",
    description: "Calculates VaR, Sharpe ratio, diversification scores. Monitors portfolio risk in real-time.",
    status: "online" as const,
    lastAction: "Updated VaR calculations",
    icon: <Shield size={18} />,
    metrics: { processed: 2156, accuracy: 96.1 },
    uptime: "99.98%",
    latency: "35ms"
  },
  {
    name: "Portfolio Rebalancing Agent",
    description: "Simulates buy/sell operations and optimizes asset allocation based on risk tolerance and market conditions.",
    status: "idle" as const,
    lastAction: "Waiting for rebalancing trigger",
    icon: <RefreshCw size={18} />,
    metrics: { processed: 89, accuracy: 92.3 },
    uptime: "99.99%",
    latency: "150ms"
  },
  {
    name: "Insight Generation Agent",
    description: "Converts analytics into human-readable insights and generates daily market summaries.",
    status: "online" as const,
    lastAction: "Generated daily market summary",
    icon: <FileText size={18} />,
    metrics: { processed: 456, accuracy: 91.7 },
    uptime: "99.96%",
    latency: "85ms"
  },
  {
    name: "Alert & Automation Agent",
    description: "Monitors for significant market events and sends real-time alerts via multiple channels.",
    status: "online" as const,
    lastAction: "Sent 3 alerts to user",
    icon: <Bell size={18} />,
    metrics: { processed: 1234, accuracy: 99.2 },
    uptime: "99.99%",
    latency: "8ms"
  },
];

const Agents = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Agent Control Center</h1>
            <p className="text-muted-foreground">Monitor and manage your AI agents</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
            <Zap size={16} className="text-success" />
            <span className="font-mono text-sm text-success">7/7 Agents Active</span>
          </div>
        </div>

        <AgentOrchestrator />

        <div>
          <h2 className="text-lg font-semibold mb-4">Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentDetails.map((agent) => (
              <div key={agent.name} className="glass-card p-5 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <AgentStatusCard 
                      name={agent.name}
                      status={agent.status}
                      lastAction={agent.lastAction}
                      icon={agent.icon}
                      metrics={agent.metrics}
                    />
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{agent.description}</p>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="text-sm font-mono text-success">{agent.uptime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Latency</p>
                        <p className="text-sm font-mono text-primary">{agent.latency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Agents;
