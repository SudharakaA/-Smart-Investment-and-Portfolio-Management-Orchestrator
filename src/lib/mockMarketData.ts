import type { CryptoQuote, MarketQuote } from '@/hooks/useMarketData';

const stockBase: Record<string, number> = {
  AAPL: 188.42,
  MSFT: 424.11,
  GOOGL: 176.83,
  AMZN: 184.55,
  TSLA: 209.15,
  NVDA: 132.74,
};

function jitter(value: number, maxPct = 0.02): number {
  const delta = (Math.random() * 2 - 1) * maxPct;
  return value * (1 + delta);
}

export function getMockMarketQuotes(symbols: string[]): MarketQuote[] {
  return symbols.map((symbol) => {
    const base = stockBase[symbol] ?? 100 + Math.random() * 300;
    const price = jitter(base, 0.012);
    const previousClose = jitter(base, 0.008);
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      symbol,
      price,
      change,
      changePercent,
      volume: Math.floor(1_000_000 + Math.random() * 10_000_000),
      high: Math.max(price, previousClose) * 1.01,
      low: Math.min(price, previousClose) * 0.99,
      open: previousClose,
      previousClose,
    };
  });
}

export function getMockCryptoQuotes(): CryptoQuote[] {
  const base = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67200 },
    { symbol: 'ETH', name: 'Ethereum', price: 3520 },
    { symbol: 'SOL', name: 'Solana', price: 152 },
    { symbol: 'XRP', name: 'XRP', price: 0.61 },
  ];

  return base.map((coin) => {
    const price = jitter(coin.price, 0.02);
    const previous = jitter(coin.price, 0.015);
    const change24h = price - previous;
    const changePercent24h = (change24h / previous) * 100;
    const volume24h = 1_000_000_000 + Math.random() * 9_000_000_000;
    const marketCap = price * (50_000_000 + Math.random() * 200_000_000);

    return {
      symbol: coin.symbol,
      name: coin.name,
      price,
      change24h,
      changePercent24h,
      volume24h,
      marketCap,
      high24h: Math.max(price, previous) * 1.03,
      low24h: Math.min(price, previous) * 0.97,
    };
  });
}
