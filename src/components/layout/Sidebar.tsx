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
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: number;
}

const NavItem = ({ icon, label, to, badge }: NavItemProps) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
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
    </Link>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center animate-glow">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">InvestX</h1>
            <p className="text-xs text-muted-foreground">Intelligence System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" />
        <NavItem icon={<TrendingUp size={20} />} label="Markets" to="/markets" />
        <NavItem icon={<PieChart size={20} />} label="Portfolio" to="/portfolio" />
        <NavItem icon={<Newspaper size={20} />} label="News Intel" to="/news" />
        <NavItem icon={<Shield size={20} />} label="Risk Analysis" to="/risk" />
        <NavItem icon={<Activity size={20} />} label="Agents" to="/agents" />
        <NavItem icon={<Bell size={20} />} label="Alerts" to="/alerts" badge={3} />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" />
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
