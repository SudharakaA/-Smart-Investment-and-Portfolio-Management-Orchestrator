import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Bell, Shield, Palette, Database, Key, Globe, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "data", label: "Data & APIs", icon: Database },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="glass-card p-4 h-fit">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      activeSection === section.id 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 glass-card p-6">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={32} className="text-primary" />
                  </div>
                  <div>
                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                      Upload Photo
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Max 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <input type="text" defaultValue="Alex Morgan" className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input type="email" defaultValue="alex@investx.com" className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Timezone</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC+0 (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Currency</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
                <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium">
                  Save Changes
                </button>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Price Alerts", description: "Get notified when assets hit target prices" },
                    { label: "Market News", description: "AI-curated financial news updates" },
                    { label: "Risk Alerts", description: "Portfolio risk and exposure warnings" },
                    { label: "Agent Updates", description: "Status changes and insights from agents" },
                    { label: "Rebalancing Suggestions", description: "Portfolio optimization recommendations" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Key size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">Enabled</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">Session Management</p>
                          <p className="text-sm text-muted-foreground">View and manage active sessions</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary hover:underline">Manage</button>
                    </div>
                  </div>
                  <button className="px-6 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium hover:bg-destructive/20 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Appearance</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Moon size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Use dark theme</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Data & API Keys</h2>
                <div className="space-y-4">
                  {[
                    { name: "Yahoo Finance API", status: "Connected", key: "••••••••••••abc123" },
                    { name: "Alpha Vantage API", status: "Connected", key: "••••••••••••xyz789" },
                    { name: "News API", status: "Connected", key: "••••••••••••def456" },
                  ].map((api) => (
                    <div key={api.name} className="p-4 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{api.name}</p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">{api.key}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{api.status}</span>
                      </div>
                    </div>
                  ))}
                  <button className="px-6 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/70 transition-colors">
                    Add API Key
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
