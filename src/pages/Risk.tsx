import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import { Shield, AlertTriangle, TrendingDown, Activity, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const riskMetrics = [
  { name: "Value at Risk (95%)", value: "$12,450", status: "medium", description: "Maximum expected loss at 95% confidence" },
  { name: "Sharpe Ratio", value: "1.87", status: "good", description: "Risk-adjusted return measurement" },
  { name: "Beta", value: "1.24", status: "medium", description: "Portfolio volatility vs market" },
  { name: "Max Drawdown", value: "-18.3%", status: "warning", description: "Largest peak-to-trough decline" },
  { name: "Volatility (30d)", value: "23.4%", status: "medium", description: "Standard deviation of returns" },
  { name: "Sortino Ratio", value: "2.14", status: "good", description: "Downside risk-adjusted return" },
];

const exposureData = [
  { sector: "Technology", exposure: 45, limit: 50, status: "ok" },
  { sector: "Cryptocurrency", exposure: 35, limit: 30, status: "exceeded" },
  { sector: "Financials", exposure: 10, limit: 25, status: "ok" },
  { sector: "Healthcare", exposure: 5, limit: 20, status: "ok" },
  { sector: "Cash", exposure: 5, limit: 10, status: "ok" },
];

const statusColors = {
  good: "text-success",
  medium: "text-warning",
  warning: "text-destructive",
  ok: "bg-success",
  exceeded: "bg-destructive",
};

const Risk = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Risk Analysis</h1>
          <p className="text-muted-foreground">Portfolio risk metrics and exposure monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Overall Risk Score"
            value="Medium"
            change={-5.2}
            icon={<Shield size={20} />}
          />
          <MetricCard 
            title="VaR (Daily)"
            value="$2,478"
            change={8.3}
            icon={<TrendingDown size={20} />}
          />
          <MetricCard 
            title="Active Alerts"
            value="2"
            change={0}
            icon={<AlertTriangle size={20} />}
          />
          <MetricCard 
            title="Diversification"
            value="72%"
            change={3.1}
            icon={<Activity size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Metrics */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Risk Metrics</h3>
            <div className="space-y-4">
              {riskMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-sm">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <span className={cn("font-mono text-lg", statusColors[metric.status as keyof typeof statusColors])}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Exposure */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Sector Exposure</h3>
            <div className="space-y-4">
              {exposureData.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {sector.status === "ok" ? (
                        <CheckCircle size={14} className="text-success" />
                      ) : (
                        <XCircle size={14} className="text-destructive" />
                      )}
                      <span className="text-sm font-medium">{sector.sector}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={cn("font-mono", sector.status === "exceeded" ? "text-destructive" : "text-foreground")}>
                        {sector.exposure}%
                      </span>
                      <span className="text-muted-foreground">/ {sector.limit}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        sector.status === "ok" ? "bg-primary" : "bg-destructive"
                      )} 
                      style={{ width: `${(sector.exposure / sector.limit) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-destructive">Exposure Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cryptocurrency exposure exceeds recommended limit. Consider rebalancing to reduce risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Risk;
