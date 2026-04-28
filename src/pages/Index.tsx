import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import AgentStatusCard from "@/components/dashboard/AgentStatusCard";
import MarketTicker from "@/components/dashboard/MarketTicker";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import PriceChart from "@/components/dashboard/PriceChart";
import NewsFeed from "@/components/dashboard/NewsFeed";
import AgentOrchestrator from "@/components/dashboard/AgentOrchestrator";
import { useAgentStatus } from "@/hooks/useAgentStatus";
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

const agentIconMap: Record<string, any> = {
  market_data: Database,
  crypto_data: Database,
  news_intelligence: Newspaper,
  trend_analysis: BarChart3,
  risk_evaluation: Shield,
  portfolio_rebalancing: RefreshCw,
  insight_generation: FileText,
  alert_automation: Bell,
};

const Index = () => {
  const { agentStatus } = useAgentStatus();

  return (
    <DashboardLayout>
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
            
            <div className="space-y-6">
              <AgentOrchestrator />
              <PortfolioChart />
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
            {agentStatus.slice(0, 7).map((agent) => {
              const IconComponent = agentIconMap[agent.agent_id] || Database;
              
              // Convert backend status to frontend status
              let displayStatus: "online" | "processing" | "idle" | "error" = "idle";
              if (agent.status === "error") {
                displayStatus = "error";
              } else if (agent.status === "running") {
                displayStatus = "processing";
              } else if (agent.status === "completed") {
                displayStatus = "online";
              }

              const lastAction = agent.status === "running" 
                ? "Processing..." 
                : agent.completed_at 
                  ? `Completed ${new Date(agent.completed_at).toLocaleTimeString()}`
                  : agent.error || "Ready";

              return (
                <AgentStatusCard 
                  key={agent.agent_id}
                  name={agent.agent_name}
                  status={displayStatus}
                  lastAction={lastAction}
                  icon={<IconComponent size={18} />}
                  metrics={{ 
                    processed: Math.floor(Math.random() * 10000), 
                    accuracy: 95 + Math.floor(Math.random() * 5) 
                  }}
                />
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
