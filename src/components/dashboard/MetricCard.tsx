import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

const MetricCard = ({ title, value, change, icon, trend }: MetricCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="glass-card p-5 group hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:animate-glow transition-all">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-mono",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isPositive ? "+" : ""}{change}%
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
    </div>
  );
};

export default MetricCard;
