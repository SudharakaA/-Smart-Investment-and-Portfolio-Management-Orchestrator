import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

const tickerData: TickerItem[] = [
  { symbol: "BTC/USD", price: "67,432.50", change: 2.34 },
  { symbol: "ETH/USD", price: "3,521.80", change: -1.12 },
  { symbol: "S&P 500", price: "5,234.18", change: 0.89 },
  { symbol: "NASDAQ", price: "16,742.39", change: 1.45 },
  { symbol: "EUR/USD", price: "1.0845", change: -0.23 },
  { symbol: "GOLD", price: "2,341.50", change: 0.67 },
  { symbol: "AAPL", price: "192.53", change: 1.23 },
  { symbol: "TSLA", price: "248.50", change: -2.45 },
];

const MarketTicker = () => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex animate-marquee">
        {[...tickerData, ...tickerData].map((item, index) => (
          <div 
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-3 px-6 py-3 border-r border-border/30 shrink-0"
          >
            <span className="font-mono text-sm font-medium">{item.symbol}</span>
            <span className="font-mono text-sm text-foreground">${item.price}</span>
            <span className={cn(
              "flex items-center gap-1 font-mono text-xs",
              item.change >= 0 ? "text-success" : "text-destructive"
            )}>
              {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {item.change >= 0 ? "+" : ""}{item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
