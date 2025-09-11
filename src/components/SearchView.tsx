import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter, MapPin, Calendar, Droplets, TrendingUp, TrendingDown, Download, Eye } from "lucide-react";

const mockSearchResults = [
  {
    id: "DWLR001",
    name: "Station Alpha",
    location: "Mumbai, Maharashtra",
    region: "Western",
    waterLevel: 12.5,
    trend: "down",
    status: "active",
    rechargeRate: 85,
    lastUpdate: "2024-01-15 14:30",
    dataQuality: "Good"
  },
  {
    id: "DWLR045",
    name: "Coastal Monitor",
    location: "Goa, Goa",
    region: "Western",
    waterLevel: 9.2,
    trend: "stable",
    status: "active",
    rechargeRate: 78,
    lastUpdate: "2024-01-15 14:28",
    dataQuality: "Excellent"
  },
  {
    id: "DWLR102",
    name: "Urban Deep Well",
    location: "Delhi, NCR",
    region: "Northern",
    waterLevel: 8.3,
    trend: "down",
    status: "warning",
    rechargeRate: 45,
    lastUpdate: "2024-01-15 14:25",
    dataQuality: "Fair"
  },
  {
    id: "DWLR234",
    name: "Agricultural Zone A1",
    location: "Punjab, Punjab",
    region: "Northern",
    waterLevel: 18.7,
    trend: "up",
    status: "active",
    rechargeRate: 92,
    lastUpdate: "2024-01-15 14:29",
    dataQuality: "Good"
  },
  {
    id: "DWLR567",
    name: "Industrial Sector Beta",
    location: "Chennai, Tamil Nadu",
    region: "Southern",
    waterLevel: 6.8,
    trend: "down",
    status: "critical",
    rechargeRate: 32,
    lastUpdate: "2024-01-15 14:31",
    dataQuality: "Poor"
  }
];

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredResults = mockSearchResults
    .filter(station => {
      const matchesSearch = searchQuery === "" || 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesRegion = regionFilter === "all" || 
        station.region.toLowerCase() === regionFilter.toLowerCase();
        
      const matchesStatus = statusFilter === "all" || station.status === statusFilter;
      
      return matchesSearch && matchesRegion && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "waterLevel":
          return b.waterLevel - a.waterLevel;
        case "recharge":
          return b.rechargeRate - a.rechargeRate;
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDataQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-semibold">Search Stations</h1>
        <p className="text-muted-foreground">Find and analyze DWLR station data</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by station name, ID, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3">
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="northern">Northern</SelectItem>
            <SelectItem value="southern">Southern</SelectItem>
            <SelectItem value="eastern">Eastern</SelectItem>
            <SelectItem value="western">Western</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="waterLevel">Water Level</SelectItem>
            <SelectItem value="recharge">Recharge Rate</SelectItem>
          </SelectContent>
        </Select>
        
        <span className="text-sm text-muted-foreground">
          {filteredResults.length} stations found
        </span>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {filteredResults.map((station) => (
          <Card key={station.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{station.name}</h3>
                    <Badge variant="outline" className="text-xs">{station.id}</Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{station.location}</span>
                    <span>•</span>
                    <span>{station.region} Region</span>
                  </div>
                </div>
                
                <Badge className={getStatusColor(station.status)}>
                  {station.status}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Water Level</span>
                    {getTrendIcon(station.trend)}
                  </div>
                  <p className="font-semibold">{station.waterLevel}m</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Recharge Rate</span>
                  </div>
                  <p className="font-semibold">{station.rechargeRate}%</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{station.lastUpdate}</span>
                  </div>
                  <Badge className={getDataQualityColor(station.dataQuality)} variant="outline">
                    {station.dataQuality} Quality
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredResults.length === 0 && (
        <Card className="p-8 text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No stations found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setRegionFilter("all");
            setStatusFilter("all");
          }}>
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Quick Stats */}
      {filteredResults.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Search Results Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Avg Water Level</p>
              <p className="font-semibold">
                {(filteredResults.reduce((sum, s) => sum + s.waterLevel, 0) / filteredResults.length).toFixed(1)}m
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Recharge Rate</p>
              <p className="font-semibold">
                {Math.round(filteredResults.reduce((sum, s) => sum + s.rechargeRate, 0) / filteredResults.length)}%
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}