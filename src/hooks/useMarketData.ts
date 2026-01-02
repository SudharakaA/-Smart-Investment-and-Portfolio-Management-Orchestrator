import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      console.log('Fetching market data for:', symbols);
      
      const { data, error: fnError } = await supabase.functions.invoke('market-data', {
        body: { symbols }
      });

      if (fnError) {
        console.error('Function error:', fnError);
        throw new Error(fnError.message);
      }

      if (data?.quotes) {
        setQuotes(data.quotes);
        setLastUpdate(new Date(data.timestamp));
        setError(null);
        console.log('Market data updated:', data.quotes.length, 'quotes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      console.error('Market data error:', errorMessage);
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
      console.log('Fetching crypto data');
      
      const { data, error: fnError } = await supabase.functions.invoke('crypto-data');

      if (fnError) {
        console.error('Function error:', fnError);
        throw new Error(fnError.message);
      }

      if (data?.quotes) {
        setQuotes(data.quotes);
        setLastUpdate(new Date(data.timestamp));
        setSource(data.source);
        setError(null);
        console.log('Crypto data updated:', data.quotes.length, 'quotes from', data.source);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch crypto data';
      console.error('Crypto data error:', errorMessage);
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
