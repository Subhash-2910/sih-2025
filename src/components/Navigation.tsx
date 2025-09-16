import { Home, Map, Search, Bell, Compass } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'map', icon: Map, label: 'Map' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
  { id: 'decision', icon: Compass, label: 'Decision' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === id
                ? 'text-primary bg-secondary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}