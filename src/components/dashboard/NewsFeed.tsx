import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: "positive" | "negative" | "neutral";
  relevance: number;
}

const news: NewsItem[] = [
  {
    id: "1",
    title: "Bitcoin ETF Sees Record Inflows as Institutional Interest Surges",
    source: "Bloomberg",
    time: "23m ago",
    sentiment: "positive",
    relevance: 95
  },
  {
    id: "2",
    title: "Federal Reserve Officials Signal Potential Rate Cuts in 2024",
    source: "Reuters",
    time: "1h ago",
    sentiment: "positive",
    relevance: 88
  },
  {
    id: "3",
    title: "Tech Stocks Face Pressure Amid Antitrust Concerns",
    source: "WSJ",
    time: "2h ago",
    sentiment: "negative",
    relevance: 76
  },
  {
    id: "4",
    title: "Global Markets Mixed as Traders Await Economic Data",
    source: "CNBC",
    time: "3h ago",
    sentiment: "neutral",
    relevance: 65
  },
];

const sentimentConfig = {
  positive: { icon: TrendingUp, color: "text-success", label: "Bullish" },
  negative: { icon: TrendingDown, color: "text-destructive", label: "Bearish" },
  neutral: { icon: Minus, color: "text-muted-foreground", label: "Neutral" },
};

const NewsFeed = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">News Intelligence</h3>
          <p className="text-sm text-muted-foreground">AI-analyzed financial news</p>
        </div>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {news.map((item) => {
          const sentiment = sentimentConfig[item.sentiment];
          const Icon = sentiment.icon;

          return (
            <div 
              key={item.id}
              className="group p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <ExternalLink size={14} className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={cn("flex items-center gap-1", sentiment.color)}>
                    <Icon size={12} />
                    <span className="text-xs font-mono">{sentiment.label}</span>
                  </div>
                  <div className="text-xs font-mono text-primary">
                    {item.relevance}% rel
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;
