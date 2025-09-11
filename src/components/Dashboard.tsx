import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Droplets, AlertTriangle, MapPin, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const mockWaterLevelData = [
  { time: '00:00', level: 12.5 },
  { time: '04:00', level: 12.3 },
  { time: '08:00', level: 12.1 },
  { time: '12:00', level: 11.8 },
  { time: '16:00', level: 11.9 },
  { time: '20:00', level: 12.0 },
  { time: '24:00', level: 12.2 },
];

const rechargeData = [
  { region: 'North', recharge: 85 },
  { region: 'South', recharge: 72 },
  { region: 'East', recharge: 91 },
  { region: 'West', recharge: 68 },
];

const stationStatusData = [
  { name: 'Active', value: 4892, color: '#22c55e' },
  { name: 'Warning', value: 298, color: '#f59e0b' },
  { name: 'Critical', value: 70, color: '#ef4444' },
];

export function Dashboard() {
  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">DWLR Network</h1>
        <p className="text-muted-foreground">Real-time Groundwater Monitoring</p>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>5,260 Stations</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Stations</p>
              <p className="text-2xl font-semibold">4,892</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">98.2% uptime</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Water Level</p>
              <p className="text-2xl font-semibold">11.8m</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">-2.3% this week</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-semibold">70</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">+5 since yesterday</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recharge Rate</p>
              <p className="text-2xl font-semibold">79%</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <Progress value={79} className="mt-2" />
        </Card>
      </div>

      {/* Water Level Trend */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">24h Water Level Trend</h3>
          <Badge variant="outline">Live</Badge>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockWaterLevelData}>
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Regional Recharge Analysis */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Regional Recharge Status</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rechargeData}>
              <XAxis dataKey="region" className="text-xs" />
              <YAxis className="text-xs" />
              <Bar dataKey="recharge" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Station Status Distribution */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Station Status Overview</h3>
        <div className="flex items-center justify-between">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={60}
                  dataKey="value"
                >
                  {stationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 ml-6 space-y-2">
            {stationStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>View Map</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>View Alerts</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Generate Report</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Droplets className="w-4 h-4" />
            <span>Data Export</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}