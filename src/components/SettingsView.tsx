import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  User, 
  Bell, 
  Download, 
  Settings, 
  Shield, 
  Smartphone, 
  Globe, 
  Database,
  HelpCircle,
  LogOut,
  RefreshCw
} from "lucide-react";

export function SettingsView() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    dataUpdates: false,
    maintenanceAlerts: true,
    weeklyReports: true
  });

  const [dataSettings, setDataSettings] = useState({
    refreshInterval: "5",
    cacheData: true,
    autoSync: true
  });

  const [userProfile] = useState({
    name: "Dr. Sarah Kumar",
    organization: "National Water Authority",
    role: "Hydrogeologist",
    accessLevel: "Research",
    joinDate: "March 2023"
  });

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and account</p>
      </div>

      {/* User Profile */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{userProfile.name}</h3>
            <p className="text-sm text-muted-foreground">{userProfile.organization}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{userProfile.role}</Badge>
              <Badge className="bg-blue-100 text-blue-800">{userProfile.accessLevel}</Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p>{userProfile.joinDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Stations accessed</p>
            <p>1,247 stations</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          Edit Profile
        </Button>
      </Card>

      {/* Notification Settings */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="w-5 h-5" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Critical Alerts</p>
              <p className="text-sm text-muted-foreground">Water level critical thresholds</p>
            </div>
            <Switch
              checked={notifications.criticalAlerts}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, criticalAlerts: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Updates</p>
              <p className="text-sm text-muted-foreground">Real-time data refresh notifications</p>
            </div>
            <Switch
              checked={notifications.dataUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, dataUpdates: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Alerts</p>
              <p className="text-sm text-muted-foreground">Station maintenance and outages</p>
            </div>
            <Switch
              checked={notifications.maintenanceAlerts}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, maintenanceAlerts: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Summary reports via email</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, weeklyReports: checked }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Data Settings */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5" />
          <h3 className="font-semibold">Data Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Refresh Interval</p>
            <Select 
              value={dataSettings.refreshInterval} 
              onValueChange={(value) => 
                setDataSettings(prev => ({ ...prev, refreshInterval: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cache Data Locally</p>
              <p className="text-sm text-muted-foreground">Store data for offline access</p>
            </div>
            <Switch
              checked={dataSettings.cacheData}
              onCheckedChange={(checked) => 
                setDataSettings(prev => ({ ...prev, cacheData: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Sync</p>
              <p className="text-sm text-muted-foreground">Automatically sync with server</p>
            </div>
            <Switch
              checked={dataSettings.autoSync}
              onCheckedChange={(checked) => 
                setDataSettings(prev => ({ ...prev, autoSync: checked }))
              }
            />
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Smartphone className="w-5 h-5" />
          <h3 className="font-semibold">App Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Language</p>
            <Select defaultValue="english">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="bengali">Bengali</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div>
            <p className="font-medium mb-2">Units</p>
            <Select defaultValue="metric">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (meters, liters)</SelectItem>
                <SelectItem value="imperial">Imperial (feet, gallons)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div>
            <p className="font-medium mb-2">Theme</p>
            <Select defaultValue="light">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Data Export */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Download className="w-5 h-5" />
          <h3 className="font-semibold">Data Export</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Export your saved data and preferences
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Support & Help */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-semibold">Support & Help</h3>
        </div>
        
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Globe className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <RefreshCw className="w-4 h-4 mr-2" />
            Check for Updates
          </Button>
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">App Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span>2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Build</span>
            <span>2024.01.15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database Version</span>
            <span>v3.2.1</span>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Card className="p-4">
        <Button variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </Card>
    </div>
  );
}