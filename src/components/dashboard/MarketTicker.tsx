import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useTickerData } from "@/hooks/useMarketData";

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

const MarketTicker = () => {
  const { tickerItems, loading } = useTickerData(15000);

  // Fallback data when loading or no data
  const displayData: TickerItem[] = tickerItems.length > 0 ? tickerItems : [
    { symbol: "BTC/USD", price: "67,432.50", change: 2.34 },
    { symbol: "ETH/USD", price: "3,521.80", change: -1.12 },
    { symbol: "AAPL", price: "192.53", change: 1.23 },
    { symbol: "TSLA", price: "248.50", change: -2.45 },
    { symbol: "NVDA", price: "875.28", change: 3.67 },
  ];

  return (
    <div className="glass-card overflow-hidden relative">
      {loading && tickerItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading live data...</span>
        </div>
      )}
      <div className="flex animate-marquee">
        {[...displayData, ...displayData].map((item, index) => (
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
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Live indicator */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-card/90">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-[10px] font-mono text-success">LIVE</span>
      </div>
    </div>
  );
};

export default MarketTicker;
