import DashboardLayout from "@/components/layout/DashboardLayout";
import { AlertTriangle, TrendingUp, Newspaper, Shield, Bell, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAlerts } from "@/contexts/AlertsContext";

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  opportunity: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  news: { icon: Newspaper, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  risk: { icon: Shield, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

const Alerts = () => {
  const { alerts, unreadCount, connected, markAsRead, dismissAlert } = useAlerts();
  const [filter, setFilter] = useState<string>("all");

  const filteredAlerts = filter === "all" 
    ? alerts 
    : filter === "unread" 
      ? alerts.filter(a => !a.read)
      : alerts.filter(a => a.type === filter);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Alerts</h1>
            <p className="text-muted-foreground">
              Real-time notifications from your agents {connected ? "• live" : "• reconnecting"}
            </p>
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
