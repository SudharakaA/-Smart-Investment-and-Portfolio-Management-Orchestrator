import DashboardLayout from "@/components/layout/DashboardLayout";
import { AlertTriangle, TrendingUp, Newspaper, Shield, Bell, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
  id: string;
  type: "warning" | "opportunity" | "news" | "risk";
  title: string;
  description: string;
  time: string;
  agent: string;
  read: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "High Volatility Detected",
    description: "BTC/USD showing unusual volatility patterns. 30-day volatility has increased by 45%. Consider reviewing positions and setting stop-losses.",
    time: "2m ago",
    agent: "Market Data Agent",
    read: false
  },
  {
    id: "2",
    type: "opportunity",
    title: "Bullish Signal: AAPL",
    description: "RSI crossed above 30, potential reversal pattern forming. Historical accuracy for this signal is 78%.",
    time: "15m ago",
    agent: "Trend Analysis Agent",
    read: false
  },
  {
    id: "3",
    type: "news",
    title: "Fed Interest Rate Decision",
    description: "Federal Reserve announces rate decision tomorrow at 2:00 PM EST. Market sentiment analysis suggests high volatility expected.",
    time: "1h ago",
    agent: "News Intelligence Agent",
    read: false
  },
  {
    id: "4",
    type: "risk",
    title: "Portfolio Concentration Alert",
    description: "Tech sector exposure exceeds 60% of portfolio. Diversification score has dropped to 68%. Consider rebalancing.",
    time: "3h ago",
    agent: "Risk Evaluation Agent",
    read: true
  },
  {
    id: "5",
    type: "opportunity",
    title: "Rebalancing Opportunity",
    description: "Portfolio drift detected. Suggested rebalancing could improve Sharpe ratio by 0.12.",
    time: "5h ago",
    agent: "Portfolio Rebalancing Agent",
    read: true
  },
  {
    id: "6",
    type: "warning",
    title: "Unusual Volume Detected",
    description: "TSLA showing 3x average trading volume. Large institutional activity suspected.",
    time: "6h ago",
    agent: "Market Data Agent",
    read: true
  },
];

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  opportunity: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  news: { icon: Newspaper, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  risk: { icon: Shield, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

const Alerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<string>("all");

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : filter === "unread" 
      ? alerts.filter(a => !a.read)
      : alerts.filter(a => a.type === filter);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Alerts</h1>
            <p className="text-muted-foreground">Real-time notifications from your agents</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <span className="font-mono text-sm">
              <span className="text-primary">{unreadCount}</span> unread
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "warning", label: "Warnings" },
            { value: "opportunity", label: "Opportunities" },
            { value: "news", label: "News" },
            { value: "risk", label: "Risk" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === f.value 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            
            return (
              <div 
                key={alert.id}
                className={cn(
                  "glass-card p-5 transition-all duration-200 hover:border-primary/30",
                  !alert.read && "border-l-2 border-l-primary"
                )}
              >
                <div className="flex gap-4">
                  <div className={cn("p-3 rounded-xl shrink-0", config.bg)}>
                    <Icon size={20} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs font-mono text-primary/70">{alert.agent}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!alert.read && (
                          <button 
                            onClick={() => markAsRead(alert.id)}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-success" />
                          </button>
                        )}
                        <button 
                          onClick={() => dismissAlert(alert.id)}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          title="Dismiss"
                        >
                          <X size={16} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="glass-card p-12 text-center">
              <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No alerts to display</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
