import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketTicker from "@/components/dashboard/MarketTicker";
import PriceChart from "@/components/dashboard/PriceChart";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const watchlist = [
  { symbol: "BTC/USD", name: "Bitcoin", price: "67,432.50", change: 2.34, volume: "24.5B" },
  { symbol: "ETH/USD", name: "Ethereum", price: "3,521.80", change: -1.12, volume: "12.8B" },
  { symbol: "AAPL", name: "Apple Inc.", price: "192.53", change: 1.23, volume: "52.3M" },
  { symbol: "TSLA", name: "Tesla Inc.", price: "248.50", change: -2.45, volume: "89.1M" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "875.28", change: 3.67, volume: "45.2M" },
  { symbol: "MSFT", name: "Microsoft", price: "425.22", change: 0.89, volume: "21.4M" },
  { symbol: "GOOGL", name: "Alphabet", price: "156.78", change: 1.45, volume: "18.7M" },
  { symbol: "AMZN", name: "Amazon", price: "185.92", change: -0.34, volume: "32.1M" },
];

const Markets = () => {
  return (
    <DashboardLayout>
      <div className="border-b border-border">
        <MarketTicker />
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Markets</h1>
          <p className="text-muted-foreground">Real-time market data and analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PriceChart />
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Watchlist</h3>
              <button className="text-sm text-primary hover:underline">Edit</button>
            </div>
            <div className="space-y-3">
              {watchlist.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Star size={14} className="text-warning" />
                    <div>
                      <p className="font-mono text-sm font-medium">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">${item.price}</p>
                    <p className={cn(
                      "text-xs font-mono flex items-center justify-end gap-1",
                      item.change >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {item.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {item.change >= 0 ? "+" : ""}{item.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Markets;
