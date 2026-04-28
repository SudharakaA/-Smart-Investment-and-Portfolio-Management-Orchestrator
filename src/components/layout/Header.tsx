import { Search, Bell, User, Settings, LogOut, CreditCard, UserCircle, AlertTriangle, TrendingUp, Newspaper, Shield, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/contexts/ProfileContext";
import { useAlerts } from "@/contexts/AlertsContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const alertTypeConfig = {
  warning: { icon: AlertTriangle, color: "text-warning" },
  opportunity: { icon: TrendingUp, color: "text-success" },
  news: { icon: Newspaper, color: "text-primary" },
  risk: { icon: Shield, color: "text-destructive" },
};

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileData } = useProfile();
  const { alerts, unreadCount, connected, markAsRead, dismissAlert } = useAlerts();
  const { logout } = useAuth();
  const recentAlerts = alerts.slice(0, 5);

  const handleProfileClick = () => {
    navigate("/profile");
    toast({
      title: "Profile",
      description: "Opening your profile...",
    });
  };

  const handleBillingClick = () => {
    toast({
      title: "Billing",
      description: "Billing management coming soon!",
    });
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    toast({
      title: "Settings",
      description: "Opening settings...",
    });
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "destructive",
    });
    navigate("/login");
  };
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-destructive rounded-full text-[10px] font-mono flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className={cn("text-xs font-mono", connected ? "text-success" : "text-warning")}>
                {connected ? "LIVE" : "RECONNECTING"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentAlerts.length === 0 ? (
              <div className="px-2 py-6 text-sm text-center text-muted-foreground">No live notifications yet.</div>
            ) : (
              recentAlerts.map((alert) => {
                const config = alertTypeConfig[alert.type];
                const Icon = config.icon;
                return (
                  <div key={alert.id} className="px-2 py-2 hover:bg-secondary/40 rounded-md">
                    <div className="flex items-start gap-2">
                      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm truncate", !alert.read && "font-semibold")}>{alert.title}</p>
                          <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                        <p className="text-[11px] text-primary/80 font-mono mt-1">{alert.agent}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!alert.read && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="p-1 rounded hover:bg-secondary"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5 text-success" />
                          </button>
                        )}
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="p-1 rounded hover:bg-secondary"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-between" onClick={() => navigate("/alerts")}>
              <span>Open Alerts Center</span>
              <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-4 border-l border-border hover:bg-secondary/50 rounded-lg transition-colors pr-2">
              <div className="text-right">
                <p className="text-sm font-medium">{profileData.name}</p>
                <p className="text-xs text-muted-foreground">{profileData.occupation}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {profileData.profileImage ? (
                  <img 
                    src={profileData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profileData.name}</p>
                <p className="text-xs text-muted-foreground">{profileData.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <UserCircle className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleBillingClick}>
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
