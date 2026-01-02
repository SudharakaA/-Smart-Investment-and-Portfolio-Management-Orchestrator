import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CryptoQuote {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching crypto data from CoinGecko');
    
    // CoinGecko free API - no key required
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.log('CoinGecko API error, using mock data');
      return new Response(JSON.stringify({ 
        quotes: generateMockCryptoData(),
        timestamp: new Date().toISOString(),
        source: 'mock'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const data = await response.json();
    console.log('CoinGecko response received, coins:', data.length);
    
    const quotes: CryptoQuote[] = data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_24h,
      changePercent24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
    }));

    return new Response(JSON.stringify({ 
      quotes, 
      timestamp: new Date().toISOString(),
      source: 'coingecko'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crypto-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      quotes: generateMockCryptoData(),
      timestamp: new Date().toISOString(),
      source: 'mock',
      error: errorMessage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateMockCryptoData(): CryptoQuote[] {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', basePrice: 67432.50 },
    { symbol: 'ETH', name: 'Ethereum', basePrice: 3521.80 },
    { symbol: 'SOL', name: 'Solana', basePrice: 142.35 },
    { symbol: 'ADA', name: 'Cardano', basePrice: 0.45 },
    { symbol: 'XRP', name: 'Ripple', basePrice: 0.52 },
    { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.12 },
  ];
  
  return cryptos.map(crypto => {
    const change = (Math.random() - 0.5) * crypto.basePrice * 0.1;
    const changePercent = (change / crypto.basePrice) * 100;
    
    return {
      symbol: crypto.symbol,
      name: crypto.name,
      price: crypto.basePrice + change,
      change24h: change,
      changePercent24h: changePercent,
      volume24h: Math.floor(Math.random() * 50000000000) + 1000000000,
      marketCap: crypto.basePrice * (Math.floor(Math.random() * 500000000) + 100000000),
      high24h: crypto.basePrice + Math.abs(change) * 1.5,
      low24h: crypto.basePrice - Math.abs(change) * 1.5,
    };
  });
}
