import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { AlertTriangle, Bell, MapPin, Clock, TrendingDown, Droplets, Filter, CheckCircle } from "lucide-react";

const mockAlerts = [
  {
    id: "ALT001",
    type: "critical",
    title: "Water Level Critical Low",
    description: "Station Delta (DWLR004) water level has dropped below 7m threshold",
    station: "Station Delta",
    stationId: "DWLR004",
    location: "Chennai, Tamil Nadu",
    currentValue: 6.8,
    threshold: 7.0,
    timestamp: "2024-01-15 14:25",
    isRead: false,
    priority: "high"
  },
  {
    id: "ALT002",
    type: "warning",
    title: "Declining Water Level Trend",
    description: "Station Beta (DWLR002) showing continuous decline for 48 hours",
    station: "Station Beta",
    stationId: "DWLR002",
    location: "Delhi, NCR",
    currentValue: 8.3,
    threshold: 8.0,
    timestamp: "2024-01-15 12:15",
    isRead: false,
    priority: "medium"
  },
  {
    id: "ALT003",
    type: "maintenance",
    title: "Station Communication Issue",
    description: "Station Gamma (DWLR003) hasn't reported data for 2 hours",
    station: "Station Gamma",
    stationId: "DWLR003",
    location: "Bangalore, Karnataka",
    currentValue: null,
    threshold: null,
    timestamp: "2024-01-15 10:30",
    isRead: true,
    priority: "medium"
  },
  {
    id: "ALT004",
    type: "info",
    title: "Recharge Rate Improvement",
    description: "Station Epsilon (DWLR005) showing positive recharge trend",
    station: "Station Epsilon",
    stationId: "DWLR005",
    location: "Hyderabad, Telangana",
    currentValue: 11.1,
    threshold: 10.0,
    timestamp: "2024-01-15 09:45",
    isRead: true,
    priority: "low"
  },
  {
    id: "ALT005",
    type: "critical",
    title: "Multiple Station Alerts",
    description: "5 stations in Western region showing critical water levels",
    station: "Multiple Stations",
    stationId: "Various",
    location: "Western Region",
    currentValue: null,
    threshold: null,
    timestamp: "2024-01-15 08:20",
    isRead: false,
    priority: "high"
  }
];

export function AlertsView() {
  const [alertFilter, setAlertFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesType = alertFilter === "all" || alert.type === alertFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    const matchesRead = !showUnreadOnly || !alert.isRead;
    return matchesType && matchesPriority && matchesRead;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'maintenance': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBadge = (type: string, priority: string) => {
    const typeColors = {
      critical: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-blue-100 text-blue-800',
      info: 'bg-green-100 text-green-800'
    };
    
    const priorityColors = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      low: 'bg-green-50 text-green-700 border-green-200'
    };

    return (
      <div className="flex space-x-1">
        <Badge className={typeColors[type as keyof typeof typeColors]}>
          {type}
        </Badge>
        <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
          {priority} priority
        </Badge>
      </div>
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length;

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Alerts & Notifications</h1>
        <p className="text-muted-foreground">Real-time system alerts and warnings</p>
        {unreadCount > 0 && (
          <Badge className="bg-red-100 text-red-800">
            {unreadCount} unread alerts
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Select value={alertFilter} onValueChange={setAlertFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="info">Information</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showUnreadOnly}
              onCheckedChange={setShowUnreadOnly}
            />
            <span className="text-sm">Show unread only</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredAlerts.length} alerts
          </span>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`p-4 ${!alert.isRead ? 'border-l-4 border-l-primary bg-blue-50/50' : ''}`}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm leading-tight">
                        {alert.title}
                        {!alert.isRead && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getAlertBadge(alert.type, alert.priority)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Station Info */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span>{alert.station} ({alert.stationId})</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{alert.location}</span>
              </div>

              {/* Metrics */}
              {alert.currentValue && (
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Current: <strong>{alert.currentValue}m</strong></span>
                  </div>
                  {alert.threshold && (
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span>Threshold: <strong>{alert.threshold}m</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timestamp}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(alert.timestamp)}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                    View Details
                  </Button>
                  {!alert.isRead && (
                    <Button size="sm" variant="ghost" className="text-xs px-3 py-1">
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Alerts */}
      {filteredAlerts.length === 0 && (
        <Card className="p-8 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="font-semibold mb-2">No alerts found</h3>
          <p className="text-muted-foreground mb-4">
            {showUnreadOnly 
              ? "You're all caught up! No unread alerts." 
              : "All systems operating normally."}
          </p>
          {showUnreadOnly && (
            <Button 
              variant="outline" 
              onClick={() => setShowUnreadOnly(false)}
            >
              Show All Alerts
            </Button>
          )}
        </Card>
      )}

      {/* Alert Summary */}
      {filteredAlerts.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Alert Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Critical Alerts</p>
              <p className="font-semibold text-red-600">
                {filteredAlerts.filter(a => a.type === 'critical').length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Unread Alerts</p>
              <p className="font-semibold text-blue-600">
                {filteredAlerts.filter(a => !a.isRead).length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}