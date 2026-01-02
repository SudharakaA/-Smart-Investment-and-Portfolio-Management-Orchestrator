import DashboardLayout from "@/components/layout/DashboardLayout";
import NewsFeed from "@/components/dashboard/NewsFeed";
import { TrendingUp, TrendingDown, Minus, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const featuredNews = [
  {
    id: "f1",
    title: "Federal Reserve Signals Major Policy Shift: What Investors Need to Know",
    summary: "The Federal Reserve's latest meeting minutes reveal a significant change in monetary policy outlook, with implications for both equity and bond markets.",
    source: "Bloomberg",
    time: "45m ago",
    sentiment: "positive" as const,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "f2",
    title: "Bitcoin ETF Inflows Reach Record High Amid Institutional Adoption",
    summary: "Spot Bitcoin ETFs continue to attract unprecedented capital as major institutional investors increase their crypto allocations.",
    source: "Reuters",
    time: "2h ago",
    sentiment: "positive" as const,
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop&q=60"
  }
];

const sentimentConfig = {
  positive: { icon: TrendingUp, color: "text-success", label: "Bullish" },
  negative: { icon: TrendingDown, color: "text-destructive", label: "Bearish" },
  neutral: { icon: Minus, color: "text-muted-foreground", label: "Neutral" },
};

const News = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">News Intelligence</h1>
          <p className="text-muted-foreground">AI-analyzed financial news and sentiment</p>
        </div>

        {/* Featured Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredNews.map((article) => {
            const sentiment = sentimentConfig[article.sentiment];
            const Icon = sentiment.icon;
            
            return (
              <div key={article.id} className="glass-card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">{article.source}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={10} />
                      {article.time}
                    </span>
                    <span className={cn("flex items-center gap-1 text-xs", sentiment.color)}>
                      <Icon size={12} />
                      {sentiment.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                  <button className="mt-4 text-sm text-primary flex items-center gap-1 hover:underline">
                    Read more <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* News Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsFeed />
          
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Sentiment Overview</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-success font-medium">Bullish Sentiment</span>
                  <span className="font-mono text-success">62%</span>
                </div>
                <div className="h-2 rounded-full bg-success/20">
                  <div className="h-full w-[62%] rounded-full bg-success" />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground font-medium">Neutral Sentiment</span>
                  <span className="font-mono text-muted-foreground">24%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[24%] rounded-full bg-muted-foreground" />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-destructive font-medium">Bearish Sentiment</span>
                  <span className="font-mono text-destructive">14%</span>
                </div>
                <div className="h-2 rounded-full bg-destructive/20">
                  <div className="h-full w-[14%] rounded-full bg-destructive" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Trending Topics</h4>
              <div className="flex flex-wrap gap-2">
                {["Fed Policy", "Bitcoin ETF", "AI Stocks", "Interest Rates", "Earnings", "Crypto"].map((topic) => (
                  <span key={topic} className="px-3 py-1 rounded-full bg-secondary text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default News;
