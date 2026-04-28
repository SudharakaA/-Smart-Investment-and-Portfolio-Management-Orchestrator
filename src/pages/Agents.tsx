import DashboardLayout from "@/components/layout/DashboardLayout";
import AgentStatusCard from "@/components/dashboard/AgentStatusCard";
import AgentOrchestrator from "@/components/dashboard/AgentOrchestrator";
import { Database, Newspaper, BarChart3, Shield, RefreshCw, FileText, Bell, Zap, AlertCircle } from "lucide-react";
import { useAgentHealthCheck, useAgentStatusStream } from "@/hooks/useAgentStatus";
import { Button } from "@/components/ui/button";

const agentIconMap: Record<string, any> = {
  market_data: Database,
  crypto_data: Database,
  news_intelligence: Newspaper,
  trend_analysis: BarChart3,
  risk_evaluation: Shield,
  portfolio_rebalancing: RefreshCw,
  insight_generation: FileText,
  alert_automation: Bell,
};

const agentDescriptions: Record<string, string> = {
  market_data: "Fetches real-time market data from Yahoo Finance, Alpha Vantage, and other sources. Processes over 1M price updates per hour.",
  crypto_data: "Tracks cryptocurrency prices and market data from multiple exchanges in real-time.",
  news_intelligence: "Processes global financial news and performs sentiment analysis using NLP models. Tracks 500+ news sources.",
  trend_analysis: "Technical analysis including RSI, MA, volatility patterns. Identifies bullish/bearish divergences and trend reversals.",
  risk_evaluation: "Calculates VaR, Sharpe ratio, diversification scores. Monitors portfolio risk in real-time.",
  portfolio_rebalancing: "Simulates buy/sell operations and optimizes asset allocation based on risk tolerance and market conditions.",
  insight_generation: "Converts analytics into human-readable insights and generates daily market summaries.",
  alert_automation: "Monitors for significant market events and sends real-time alerts via multiple channels.",
};

const Agents = () => {
  const { healthStatus, loading, error, recheckHealth } = useAgentHealthCheck();
  const { agentStatus: liveStatus, connected } = useAgentStatusStream();

  // Map health status with live execution status
  const agentDetails = healthStatus.map((health) => {
    const live = liveStatus.find(s => s.agent_id === health.id);
    const IconComponent = agentIconMap[health.id] || Database;
    
    // Convert backend status to frontend status
    let displayStatus: "online" | "processing" | "idle" | "error" = "idle";
    if (health.status === "error") {
      displayStatus = "error";
    } else if (live?.status === "running") {
      displayStatus = "processing";
    } else if (live?.status === "completed" || health.status === "online") {
      displayStatus = "online";
    }

    return {
      id: health.id,
      name: health.name,
      description: agentDescriptions[health.id] || "AI agent for investment management",
      status: displayStatus,
      lastAction: live?.status === "running" 
        ? "Processing..." 
        : live?.completed_at 
          ? `Completed ${new Date(live.completed_at).toLocaleTimeString()}`
          : health.status === "online" ? "Ready" : health.error || "Unknown",
      icon: <IconComponent size={18} />,
      metrics: {
        processed: Math.floor(Math.random() * 10000), // Would come from backend metrics
        accuracy: 95 + Math.floor(Math.random() * 5),
      },
      uptime: health.status === "online" ? "99.99%" : "N/A",
      latency: health.latency_ms ? `${health.latency_ms.toFixed(0)}ms` : "N/A",
      error: health.error,
      duration_ms: live?.duration_ms,
    };
  });

  const onlineCount = agentDetails.filter(a => a.status === "online" || a.status === "processing").length;
  const totalCount = agentDetails.length;

  if (loading && healthStatus.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading agent status...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Agent Control Center</h1>
            <p className="text-muted-foreground">Monitor and manage your AI agents</p>
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle size={16} className="text-destructive" />
                <span className="text-xs text-destructive">Connection Error</span>
              </div>
            )}
            {connected && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary font-mono">Live</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <Zap size={16} className="text-success" />
              <span className="font-mono text-sm text-success">{onlineCount}/{totalCount} Agents Active</span>
            </div>
            <Button onClick={recheckHealth} variant="outline" size="sm">
              Recheck Health
            </Button>
          </div>
        </div>

        <AgentOrchestrator />

        <div>
          <h2 className="text-lg font-semibold mb-4">Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentDetails.map((agent) => (
              <div key={agent.id} className="glass-card p-5 hover:border-primary/30 transition-all">
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
                      {agent.duration_ms && (
                        <div>
                          <p className="text-xs text-muted-foreground">Last Run</p>
                          <p className="text-sm font-mono text-primary">{agent.duration_ms.toFixed(0)}ms</p>
                        </div>
                      )}
                    </div>
                    {agent.error && (
                      <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                        {agent.error}
                      </div>
                    )}
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
