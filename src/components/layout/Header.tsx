import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search markets, assets, news..." 
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-success">LIVE</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] font-mono flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs text-muted-foreground">Pro Investor</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
