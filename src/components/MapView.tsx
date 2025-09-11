import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter, MapPin, Droplets, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const mockStations = [
  {
    id: "DWLR001",
    name: "Station Alpha",
    location: "Mumbai, Maharashtra",
    waterLevel: 12.5,
    status: "active",
    trend: "down",
    lastUpdate: "2 min ago",
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: "DWLR002", 
    name: "Station Beta",
    location: "Delhi, NCR",
    waterLevel: 8.3,
    status: "warning",
    trend: "up",
    lastUpdate: "1 min ago",
    coordinates: { lat: 28.7041, lng: 77.1025 }
  },
  {
    id: "DWLR003",
    name: "Station Gamma",
    location: "Bangalore, Karnataka",
    waterLevel: 15.2,
    status: "active",
    trend: "stable",
    lastUpdate: "3 min ago",
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: "DWLR004",
    name: "Station Delta",
    location: "Chennai, Tamil Nadu",
    waterLevel: 6.8,
    status: "critical",
    trend: "down",
    lastUpdate: "1 min ago",
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: "DWLR005",
    name: "Station Epsilon",
    location: "Hyderabad, Telangana",
    waterLevel: 11.1,
    status: "active",
    trend: "up",
    lastUpdate: "4 min ago",
    coordinates: { lat: 17.3850, lng: 78.4867 }
  }
];

export function MapView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const filteredStations = mockStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || station.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Station Map</h1>
        <p className="text-muted-foreground">5,260 DWLR stations nationwide</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex-1 flex justify-end space-x-1">
            <div className="flex items-center space-x-1 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <Card className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544114990-d7384e5be451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmR3YXRlciUyMG1vbml0b3JpbmclMjBzdGF0aW9ufGVufDF8fHx8MTc1NzYwMTAxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Map view of DWLR stations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-semibold">Interactive Map</p>
            <p className="text-xs text-muted-foreground">Station locations and real-time status</p>
          </div>
        </div>
        
        {/* Mock station markers */}
        <div className="absolute top-4 left-4">
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute top-12 right-8">
          <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute bottom-8 left-12">
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </Card>

      {/* Station List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Nearby Stations</h3>
          <span className="text-sm text-muted-foreground">{filteredStations.length} stations</span>
        </div>
        
        {filteredStations.map((station) => (
          <Card 
            key={station.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedStation === station.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(station.status)}`}></div>
                  <span className="font-semibold">{station.name}</span>
                  <span className="text-xs text-muted-foreground">({station.id})</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{station.location}</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold">{station.waterLevel}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(station.trend)}
                    <span className="text-xs capitalize">{station.trend}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                {getStatusBadge(station.status)}
                <p className="text-xs text-muted-foreground">{station.lastUpdate}</p>
              </div>
            </div>
            
            {selectedStation === station.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coordinates</p>
                    <p>{station.coordinates.lat}, {station.coordinates.lng}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Reading</p>
                    <p>{station.lastUpdate}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Download Data
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}