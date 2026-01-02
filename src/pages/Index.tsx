import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import AgentStatusCard from "@/components/dashboard/AgentStatusCard";
import MarketTicker from "@/components/dashboard/MarketTicker";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import PriceChart from "@/components/dashboard/PriceChart";
import NewsFeed from "@/components/dashboard/NewsFeed";
import AgentOrchestrator from "@/components/dashboard/AgentOrchestrator";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  ShieldCheck,
  Database,
  Newspaper,
  BarChart3,
  Shield,
  RefreshCw,
  FileText,
  Bell
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          {/* Market Ticker */}
          <div className="border-b border-border">
            <MarketTicker />
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Portfolio Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Total Portfolio Value"
                  value="$247,832"
                  change={12.4}
                  icon={<DollarSign size={20} />}
                  trend="up"
                />
                <MetricCard 
                  title="24h P&L"
                  value="+$3,421"
                  change={1.4}
                  icon={<TrendingUp size={20} />}
                  trend="up"
                />
                <MetricCard 
                  title="Sharpe Ratio"
                  value="1.87"
                  change={5.2}
                  icon={<PieChart size={20} />}
                  trend="up"
                />
                <MetricCard 
                  title="Risk Score"
                  value="Medium"
                  change={-2.1}
                  icon={<ShieldCheck size={20} />}
                  trend="down"
                />
              </div>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Charts */}
              <div className="lg:col-span-2 space-y-6">
                <PriceChart />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PortfolioChart />
                  <AgentOrchestrator />
                </div>
              </div>

              {/* Right Column - Feeds */}
              <div className="space-y-6">
                <AlertsFeed />
                <NewsFeed />
              </div>
            </div>

            {/* Agent Status Grid */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Agent Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AgentStatusCard 
                  name="Market Data Agent"
                  status="online"
                  lastAction="Fetched 1,247 price updates"
                  icon={<Database size={18} />}
                  metrics={{ processed: 124789, accuracy: 99.8 }}
                />
                <AgentStatusCard 
                  name="News Intelligence Agent"
                  status="processing"
                  lastAction="Analyzing Fed press release"
                  icon={<Newspaper size={18} />}
                  metrics={{ processed: 3421, accuracy: 94.2 }}
                />
                <AgentStatusCard 
                  name="Trend Analysis Agent"
                  status="online"
                  lastAction="Detected bullish divergence on AAPL"
                  icon={<BarChart3 size={18} />}
                  metrics={{ processed: 8934, accuracy: 87.5 }}
                />
                <AgentStatusCard 
                  name="Risk Evaluation Agent"
                  status="online"
                  lastAction="Updated VaR calculations"
                  icon={<Shield size={18} />}
                  metrics={{ processed: 2156, accuracy: 96.1 }}
                />
                <AgentStatusCard 
                  name="Portfolio Rebalancing Agent"
                  status="idle"
                  lastAction="Waiting for rebalancing trigger"
                  icon={<RefreshCw size={18} />}
                  metrics={{ processed: 89, accuracy: 92.3 }}
                />
                <AgentStatusCard 
                  name="Insight Generation Agent"
                  status="online"
                  lastAction="Generated daily market summary"
                  icon={<FileText size={18} />}
                  metrics={{ processed: 456, accuracy: 91.7 }}
                />
                <AgentStatusCard 
                  name="Alert & Automation Agent"
                  status="online"
                  lastAction="Sent 3 alerts to user"
                  icon={<Bell size={18} />}
                  metrics={{ processed: 1234, accuracy: 99.2 }}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
