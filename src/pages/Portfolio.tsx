import DashboardLayout from "@/components/layout/DashboardLayout";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import MetricCard from "@/components/dashboard/MetricCard";
import { DollarSign, TrendingUp, PieChart, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const holdings = [
  { asset: "Bitcoin", symbol: "BTC", amount: "1.5", value: "$101,148.75", change: 12.4, allocation: 40.8 },
  { asset: "Ethereum", symbol: "ETH", amount: "15.2", value: "$53,531.36", change: 8.2, allocation: 21.6 },
  { asset: "Apple Inc.", symbol: "AAPL", amount: "125", value: "$24,066.25", change: 5.7, allocation: 9.7 },
  { asset: "S&P 500 ETF", symbol: "SPY", amount: "45", value: "$23,553.75", change: 3.2, allocation: 9.5 },
  { asset: "Tesla Inc.", symbol: "TSLA", amount: "50", value: "$12,425.00", change: -4.3, allocation: 5.0 },
  { asset: "NVIDIA Corp.", symbol: "NVDA", amount: "15", value: "$13,129.20", change: 18.9, allocation: 5.3 },
  { asset: "Cash (USDC)", symbol: "USDC", amount: "19,977.69", value: "$19,977.69", change: 0, allocation: 8.1 },
];

const Portfolio = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Your holdings and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Value"
            value="$247,832"
            change={12.4}
            icon={<DollarSign size={20} />}
          />
          <MetricCard 
            title="24h Change"
            value="+$3,421"
            change={1.4}
            icon={<TrendingUp size={20} />}
          />
          <MetricCard 
            title="Total Profit"
            value="+$42,187"
            change={20.5}
            icon={<Target size={20} />}
          />
          <MetricCard 
            title="Assets"
            value="7"
            change={0}
            icon={<PieChart size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Holdings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b border-border">
                      <th className="pb-3 font-medium">Asset</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Value</th>
                      <th className="pb-3 font-medium">24h</th>
                      <th className="pb-3 font-medium">Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => (
                      <tr key={holding.symbol} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{holding.asset}</p>
                            <p className="text-xs text-muted-foreground font-mono">{holding.symbol}</p>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-sm">{holding.amount}</td>
                        <td className="py-4 font-mono text-sm">{holding.value}</td>
                        <td className="py-4">
                          <span className={cn(
                            "flex items-center gap-1 font-mono text-sm",
                            holding.change > 0 ? "text-success" : holding.change < 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {holding.change > 0 ? <ArrowUpRight size={14} /> : holding.change < 0 ? <ArrowDownRight size={14} /> : null}
                            {holding.change > 0 ? "+" : ""}{holding.change}%
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${holding.allocation}%` }} 
                              />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">{holding.allocation}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <PortfolioChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
