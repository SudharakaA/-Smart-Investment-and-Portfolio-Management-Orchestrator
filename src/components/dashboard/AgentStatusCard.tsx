import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface AgentStatusCardProps {
  name: string;
  status: "online" | "processing" | "idle" | "error";
  lastAction: string;
  icon: React.ReactNode;
  metrics?: {
    processed: number;
    accuracy: number;
  };
}

const statusConfig = {
  online: { color: "bg-success", label: "Online", textColor: "text-success" },
  processing: { color: "bg-primary animate-pulse", label: "Processing", textColor: "text-primary" },
  idle: { color: "bg-warning", label: "Idle", textColor: "text-warning" },
  error: { color: "bg-destructive", label: "Error", textColor: "text-destructive" },
};

const AgentStatusCard = ({ name, status, lastAction, icon, metrics }: AgentStatusCardProps) => {
  const config = statusConfig[status];

  return (
    <div className="glass-card p-4 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm truncate">{name}</h3>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", config.color)} />
              <span className={cn("text-xs font-mono", config.textColor)}>{config.label}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate mb-3">{lastAction}</p>
          
          {metrics && (
            <div className="flex gap-4 pt-2 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Processed</p>
                <p className="text-sm font-mono text-foreground">{metrics.processed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-sm font-mono text-success">{metrics.accuracy}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentStatusCard;
