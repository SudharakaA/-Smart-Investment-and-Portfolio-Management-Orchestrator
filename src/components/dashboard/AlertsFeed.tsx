import { AlertTriangle, TrendingUp, Newspaper, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/contexts/AlertsContext";
import { useNavigate } from "react-router-dom";

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  opportunity: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  news: { icon: Newspaper, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  risk: { icon: Shield, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

const AlertsFeed = () => {
  const { alerts, connected } = useAlerts();
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Real-Time Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Agent-generated insights {connected ? "• live" : "• reconnecting"}
          </p>
        </div>
        <button className="text-sm text-primary hover:underline" onClick={() => navigate("/alerts")}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 8).map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200 hover:scale-[1.01] cursor-pointer",
                config.bg,
                config.border
              )}
            >
              <div className="flex gap-3">
                <div className={cn("p-2 rounded-lg", config.bg)}>
                  <Icon size={16} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.description}</p>
                  <p className="text-xs font-mono text-primary/70">{alert.agent}</p>
                </div>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="text-sm text-muted-foreground p-4 border border-border/60 rounded-lg">
            Waiting for live alerts...
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsFeed;
