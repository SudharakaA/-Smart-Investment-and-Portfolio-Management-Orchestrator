import { 
  LayoutDashboard, 
  TrendingUp, 
  Newspaper, 
  PieChart, 
  Shield, 
  Bell, 
  Settings,
  Bot,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

const NavItem = ({ icon, label, active, badge }: NavItemProps) => (
  <button
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      "hover:bg-secondary/50 group",
      active && "bg-primary/10 text-primary glow-primary"
    )}
  >
    <span className={cn(
      "transition-colors",
      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {icon}
    </span>
    <span className={cn(
      "text-sm font-medium transition-colors",
      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {label}
    </span>
    {badge !== undefined && (
      <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full font-mono">
        {badge}
      </span>
    )}
  </button>
);

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center animate-glow">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">FinAgent</h1>
            <p className="text-xs text-muted-foreground">Intelligence System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <NavItem icon={<TrendingUp size={20} />} label="Markets" />
        <NavItem icon={<PieChart size={20} />} label="Portfolio" />
        <NavItem icon={<Newspaper size={20} />} label="News Intel" />
        <NavItem icon={<Shield size={20} />} label="Risk Analysis" />
        <NavItem icon={<Activity size={20} />} label="Agents" />
        <NavItem icon={<Bell size={20} />} label="Alerts" badge={3} />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavItem icon={<Settings size={20} />} label="Settings" />
        <div className="mt-4 p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">System Status</span>
          </div>
          <p className="text-xs font-mono text-success">All agents online</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
