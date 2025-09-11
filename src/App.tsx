import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { MapView } from "./components/MapView";
import { SearchView } from "./components/SearchView";
import { AlertsView } from "./components/AlertsView";
import { SettingsView } from "./components/SettingsView";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "map":
        return <MapView />;
      case "search":
        return <SearchView />;
      case "alerts":
        return <AlertsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="relative">
        {renderActiveView()}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}