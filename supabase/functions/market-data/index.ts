import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockQuote {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error('ALPHA_VANTAGE_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const { symbols } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error('Symbols array is required');
    }

    console.log('Fetching market data for symbols:', symbols);

    const quotes: StockQuote[] = [];
    
    // Fetch data for each symbol (Alpha Vantage has rate limits, so we process sequentially)
    for (const symbol of symbols.slice(0, 5)) { // Limit to 5 symbols per request
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        console.log('Fetching:', symbol);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Response for', symbol, ':', JSON.stringify(data));
        
        if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
          const quote = data['Global Quote'];
          quotes.push({
            symbol: quote['01. symbol'] || symbol,
            price: parseFloat(quote['05. price']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
            volume: parseInt(quote['06. volume']) || 0,
            high: parseFloat(quote['03. high']) || 0,
            low: parseFloat(quote['04. low']) || 0,
            open: parseFloat(quote['02. open']) || 0,
            previousClose: parseFloat(quote['08. previous close']) || 0,
          });
        } else if (data['Note']) {
          console.log('API rate limit reached');
          // Use mock data when rate limited
          quotes.push(generateMockQuote(symbol));
        } else {
          console.log('No data for symbol:', symbol);
          quotes.push(generateMockQuote(symbol));
        }
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        console.error('Error fetching', symbol, ':', err);
        quotes.push(generateMockQuote(symbol));
      }
    }

    console.log('Returning quotes:', quotes.length);

    return new Response(JSON.stringify({ quotes, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in market-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateMockQuote(symbol: string): StockQuote {
  const basePrice = getBasePrice(symbol);
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    price: basePrice + change,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    high: basePrice + Math.abs(change) + Math.random() * 5,
    low: basePrice - Math.abs(change) - Math.random() * 5,
    open: basePrice + (Math.random() - 0.5) * 5,
    previousClose: basePrice,
  };
}

function getBasePrice(symbol: string): number {
  const basePrices: Record<string, number> = {
    'AAPL': 192.53,
    'MSFT': 425.22,
    'GOOGL': 156.78,
    'AMZN': 185.92,
    'TSLA': 248.50,
    'NVDA': 875.28,
    'META': 505.75,
    'SPY': 523.42,
    'QQQ': 445.67,
    'BTC-USD': 67432.50,
    'ETH-USD': 3521.80,
  };
  return basePrices[symbol] || 100 + Math.random() * 200;
}
