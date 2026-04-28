import { useState, useEffect, useCallback } from 'react';
import { getMockCryptoQuotes, getMockMarketQuotes } from '@/lib/mockMarketData';
import { apiUrl } from '@/lib/api';

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface CryptoQuote {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

interface UseMarketDataOptions {
  symbols?: string[];
  refreshInterval?: number;
  enabled?: boolean;
}

export function useMarketData(options: UseMarketDataOptions = {}) {
  const { 
    symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'], 
    refreshInterval = 30000, // 30 seconds default
    enabled = true 
  } = options;
  
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      const response = await fetch(apiUrl('/api/market-data'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        throw new Error(`Market API returned ${response.status}`);
      }

      const data = await response.json();
      setQuotes(data?.quotes ?? []);
      setLastUpdate(new Date(data?.timestamp ?? Date.now()));
      setError(null);
    } catch (err) {
      const fallbackQuotes = getMockMarketQuotes(symbols);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setQuotes(fallbackQuotes);
      setLastUpdate(new Date());
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [symbols, enabled]);

  useEffect(() => {
    fetchData();
    
    if (enabled && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, enabled, refreshInterval]);

  return { quotes, loading, error, lastUpdate, refetch: fetchData };
}

export function useCryptoData(options: { refreshInterval?: number; enabled?: boolean } = {}) {
  const { refreshInterval = 30000, enabled = true } = options;
  
  const [quotes, setQuotes] = useState<CryptoQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [source, setSource] = useState<string>('');
  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      const response = await fetch(apiUrl('/api/crypto-data'));
      if (!response.ok) {
        throw new Error(`Crypto API returned ${response.status}`);
      }

      const data = await response.json();
      setQuotes(data?.quotes ?? []);
      setLastUpdate(new Date(data?.timestamp ?? Date.now()));
      setSource(data?.source ?? 'backend');
      setError(null);
    } catch (err) {
      const fallbackQuotes = getMockCryptoQuotes();
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch crypto data';
      setQuotes(fallbackQuotes);
      setLastUpdate(new Date());
      setSource('frontend-fallback');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
    
    if (enabled && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, enabled, refreshInterval]);

  return { quotes, loading, error, lastUpdate, source, refetch: fetchData };
}

// Combined hook for the ticker
export function useTickerData(refreshInterval = 15000) {
  const { quotes: stockQuotes, loading: stockLoading } = useMarketData({ 
    symbols: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL'],
    refreshInterval 
  });
  const { quotes: cryptoQuotes, loading: cryptoLoading } = useCryptoData({ refreshInterval });

  const tickerItems = [
    ...cryptoQuotes.slice(0, 2).map(q => ({
      symbol: `${q.symbol}/USD`,
      price: q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: q.changePercent24h,
    })),
    ...stockQuotes.map(q => ({
      symbol: q.symbol,
      price: q.price.toFixed(2),
      change: q.changePercent,
    })),
  ];

  return { 
    tickerItems, 
    loading: stockLoading || cryptoLoading 
  };
}
