import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketTicker from "@/components/dashboard/MarketTicker";
import PriceChart from "@/components/dashboard/PriceChart";
import { TrendingUp, TrendingDown, Star, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketData, useCryptoData } from "@/hooks/useMarketData";

const Markets = () => {
  const { quotes: stockQuotes, loading: stockLoading, lastUpdate: stockUpdate, refetch: refetchStocks } = useMarketData({
    symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META'],
    refreshInterval: 30000
  });
  
  const { quotes: cryptoQuotes, loading: cryptoLoading, lastUpdate: cryptoUpdate, source, refetch: refetchCrypto } = useCryptoData({
    refreshInterval: 30000
  });

  const handleRefresh = () => {
    refetchStocks();
    refetchCrypto();
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(4);
  };

  return (
    <DashboardLayout>
      <div className="border-b border-border">
        <MarketTicker />
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Markets</h1>
            <p className="text-muted-foreground">Real-time market data and analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-xs text-muted-foreground">
              {stockUpdate && <p>Last update: {stockUpdate.toLocaleTimeString()}</p>}
            </div>
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              disabled={stockLoading || cryptoLoading}
            >
              <RefreshCw size={18} className={cn("text-muted-foreground", (stockLoading || cryptoLoading) && "animate-spin")} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PriceChart />
          </div>

          {/* Crypto Watchlist */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Crypto Markets</h3>
              {source && <span className="text-xs text-muted-foreground font-mono">{source}</span>}
            </div>
            
            {cryptoLoading && cryptoQuotes.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {cryptoQuotes.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Star size={14} className="text-warning" />
                      <div>
                        <p className="font-mono text-sm font-medium">{item.symbol}/USD</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">${formatPrice(item.price)}</p>
                      <p className={cn(
                        "text-xs font-mono flex items-center justify-end gap-1",
                        item.changePercent24h >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {item.changePercent24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {item.changePercent24h >= 0 ? "+" : ""}{item.changePercent24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stock Watchlist */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Stock Watchlist</h3>
            <button className="text-sm text-primary hover:underline">Edit</button>
          </div>
          
          {stockLoading && stockQuotes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stockQuotes.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Star size={14} className="text-warning" />
                    <div>
                      <p className="font-mono text-sm font-medium">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">Vol: {(item.volume / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">${formatPrice(item.price)}</p>
                    <p className={cn(
                      "text-xs font-mono flex items-center justify-end gap-1",
                      item.changePercent >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {item.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Markets;
