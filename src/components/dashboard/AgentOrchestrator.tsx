import { 
  Database, 
  Newspaper, 
  TrendingUp, 
  Shield, 
  RefreshCw, 
  FileText,
  Bell,
  ArrowRight
} from "lucide-react";

const agents = [
  { id: "market", name: "Market Data", icon: Database, status: "active" },
  { id: "news", name: "News Intel", icon: Newspaper, status: "active" },
  { id: "trend", name: "Trend Analysis", icon: TrendingUp, status: "processing" },
  { id: "risk", name: "Risk Eval", icon: Shield, status: "active" },
  { id: "rebalance", name: "Rebalancing", icon: RefreshCw, status: "idle" },
  { id: "insight", name: "Insights", icon: FileText, status: "active" },
  { id: "alert", name: "Alerts", icon: Bell, status: "active" },
];

const connections = [
  { from: "market", to: "trend" },
  { from: "market", to: "risk" },
  { from: "news", to: "trend" },
  { from: "trend", to: "risk" },
  { from: "risk", to: "rebalance" },
  { from: "risk", to: "insight" },
  { from: "rebalance", to: "insight" },
  { from: "insight", to: "alert" },
];

const AgentOrchestrator = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Agent Orchestrator</h3>
          <p className="text-sm text-muted-foreground">Real-time agent coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-success">7 Active</span>
        </div>
      </div>

      {/* Agent Flow Visualization */}
      <div className="relative p-6 bg-secondary/20 rounded-xl overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(187, 92%, 55%) 1px, transparent 1px),
              linear-gradient(90deg, hsl(187, 92%, 55%) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }} />
        </div>

        {/* Top row - Data Sources */}
        <div className="relative flex justify-center gap-12 mb-8">
          {agents.slice(0, 2).map((agent) => {
            const Icon = agent.icon;
            return (
              <div 
                key={agent.id}
                className="flex flex-col items-center gap-2"
              >
                <div className={`
                  p-3 rounded-xl bg-card border border-primary/30 
                  ${agent.status === 'processing' ? 'animate-pulse' : ''}
                  glow-primary
                `}>
                  <Icon size={20} className="text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{agent.name}</span>
              </div>
            );
          })}
        </div>

        {/* Connection arrows */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-8">
            <ArrowRight size={16} className="text-primary/50 -rotate-45" />
            <ArrowRight size={16} className="text-primary/50 rotate-45" />
          </div>
        </div>

        {/* Middle row - Processing */}
        <div className="relative flex justify-center gap-8 mb-8">
          {agents.slice(2, 5).map((agent) => {
            const Icon = agent.icon;
            return (
              <div 
                key={agent.id}
                className="flex flex-col items-center gap-2"
              >
                <div className={`
                  p-3 rounded-xl bg-card border 
                  ${agent.status === 'processing' ? 'border-primary animate-pulse glow-primary' : 
                    agent.status === 'idle' ? 'border-warning/30' : 'border-success/30'}
                `}>
                  <Icon size={20} className={
                    agent.status === 'processing' ? 'text-primary' :
                    agent.status === 'idle' ? 'text-warning' : 'text-success'
                  } />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{agent.name}</span>
              </div>
            );
          })}
        </div>

        {/* Connection arrows */}
        <div className="flex justify-center mb-4">
          <ArrowRight size={16} className="text-primary/50 rotate-90" />
        </div>

        {/* Bottom row - Output */}
        <div className="relative flex justify-center gap-12">
          {agents.slice(5).map((agent) => {
            const Icon = agent.icon;
            return (
              <div 
                key={agent.id}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 rounded-xl bg-card border border-success/30">
                  <Icon size={20} className="text-success" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{agent.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-xl font-bold font-mono text-primary">1.2M</p>
          <p className="text-xs text-muted-foreground">Events/hour</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-xl font-bold font-mono text-success">23ms</p>
          <p className="text-xs text-muted-foreground">Avg latency</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-xl font-bold font-mono text-foreground">99.9%</p>
          <p className="text-xs text-muted-foreground">Uptime</p>
        </div>
      </div>
    </div>
  );
};

export default AgentOrchestrator;
