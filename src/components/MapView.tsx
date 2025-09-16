import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Search, Filter, MapPin, ChevronLeft } from 'lucide-react';
import { StationDetails } from './StationDetails';

export function MapView() {
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const dwlrStations = [
    { id: 'DWLR001', name: 'Delhi Central', state: 'Delhi', lat: 28.6139, lng: 77.2090, currentLevel: 15.2, status: 'normal', trend: 'stable' },
    { id: 'DWLR002', name: 'Mumbai West', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, currentLevel: 8.7, status: 'critical', trend: 'declining' },
    { id: 'DWLR003', name: 'Bangalore South', state: 'Karnataka', lat: 12.9716, lng: 77.5946, currentLevel: 22.1, status: 'normal', trend: 'rising' },
    { id: 'DWLR004', name: 'Chennai East', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, currentLevel: 6.3, status: 'warning', trend: 'declining' },
    { id: 'DWLR005', name: 'Kolkata North', state: 'West Bengal', lat: 22.5726, lng: 88.3639, currentLevel: 18.9, status: 'normal', trend: 'stable' },
    { id: 'DWLR006', name: 'Hyderabad Central', state: 'Telangana', lat: 17.3850, lng: 78.4867, currentLevel: 12.4, status: 'warning', trend: 'declining' },
    { id: 'DWLR007', name: 'Pune East', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, currentLevel: 19.7, status: 'normal', trend: 'rising' },
    { id: 'DWLR008', name: 'Jaipur South', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, currentLevel: 5.8, status: 'critical', trend: 'declining' },
  ];

  const generate24HourData = () => {
    const data: { time: string; waterLevel: number; timestamp: Date }[] = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      data.push({
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        waterLevel: Math.round((14.5 + Math.sin(i * 0.3) * 2 + Math.random() * 1 - 0.5) * 10) / 10,
        timestamp: date,
      });
    }
    return data;
  };

  const generateHistoricalData = () => {
    const data: { date: string; waterLevel: number; recharge: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        waterLevel: Math.round((15 + Math.sin(i * 0.2) * 3 + Math.random() * 2 - 1) * 10) / 10,
        recharge: Math.round(Math.random() * 50 * 10) / 10,
      });
    }
    return data;
  };

  const uniqueStates = [...new Set(dwlrStations.map(station => station.state))];

  const filteredStations = dwlrStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || station.status === statusFilter;
    const matchesState = stateFilter === 'all' || station.state === stateFilter;
    
    return matchesSearch && matchesStatus && matchesState;
  });

  const generateStationData = (stationId: string) => {
    const data: { date: string; waterLevel: number; temperature: number; recharge: number }[] = [];
    const now = new Date();
    const station = dwlrStations.find(s => s.id === stationId);
    const baseLevel = station ? station.currentLevel : 15;
    
    for (let i = 19; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        waterLevel: Math.round((baseLevel + Math.sin(i * 0.3) * 2 + Math.random() * 1 - 0.5) * 100) / 100,
        temperature: Math.round((25 + Math.random() * 8 + Math.sin(i * 0.2) * 3) * 10) / 10,
        recharge: Math.round((Math.random() * 45 + 5 + Math.sin(i * 0.4) * 15) * 10) / 10,
      });
    }
    return data;
  };

  useEffect(() => {
    const simulateRealTimeData = () => {
      const newData = dwlrStations.map(station => ({
        ...station,
        currentLevel: Math.round((station.currentLevel + (Math.random() - 0.5) * 0.1) * 100) / 100,
        timestamp: new Date(),
      }));

      setRealTimeData(newData);
      setLastUpdate(new Date());

      const newAlerts = newData
        .filter(station => station.currentLevel < 10 || station.trend === 'declining')
        .map(station => ({
          id: `alert-${station.id}-${Date.now()}`,
          stationId: station.id,
          stationName: station.name,
          type: station.currentLevel < 7 ? 'critical' : 'warning',
          message: station.currentLevel < 7 
            ? `Critical water level: ${station.currentLevel}m` 
            : `Declining trend detected at ${station.name}`,
          timestamp: new Date(),
        }));

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev.slice(0, 19)]);
      }

      setIsConnected(Math.random() > 0.05);
    };

    const interval = setInterval(simulateRealTimeData, 3000);
    simulateRealTimeData();

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'normal': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const StationDetailsModal = ({ station, onClose }: { station: any; onClose: () => void }) => {
    React.useEffect(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, []);
    const stationData = generateStationData(station.id);
    
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-2" role="dialog" aria-modal="true" aria-label={`${station.name} details`}>
        <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
          <div className="sticky top-0 bg-blue-600 text-white p-4 flex items-center justify-between z-50 shadow-lg">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-lg font-bold text-blue-600 bg-white rounded-lg hover:bg-gray-100 inline-flex items-center shadow-lg"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{station.name}</h2>
                <p className="text-sm text-blue-100">{station.state} • {station.id}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>

          <div className="h-full overflow-y-auto overflow-x-auto">
            <div className="p-6 space-y-6 min-w-[800px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Current Water Level</p>
                <p className="text-2xl font-bold text-blue-800">{station.currentLevel}m</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <p className={`text-lg font-semibold capitalize`} style={{ color: getStatusColor(station.status) }}>
                  {station.status}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-sm text-gray-600 font-medium">Trend</p>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(station.trend)}
                  <p className="text-lg font-semibold capitalize text-gray-700">{station.trend}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="sticky top-0 z-20 -mx-6 -mt-6 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-lg flex items-center justify-between shadow">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-blue-900 tracking-wide uppercase">20-Day Historical Data</h3>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white/70 border border-blue-200 rounded-lg hover:bg-white transition-colors inline-flex items-center backdrop-blur"
                  aria-label="Back to stations"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-blue-700">
                  <span className="inline-block w-3 h-1.5 rounded-sm" style={{ backgroundColor: '#3b82f6' }}></span>
                  Water Level (m)
                </span>
                <span className="inline-flex items-center gap-1 text-orange-700">
                  <span className="inline-block w-3 h-1.5 rounded-sm" style={{ backgroundColor: '#f59e0b' }}></span>
                  Temperature (°C)
                </span>
                <span className="inline-flex items-center gap-1 text-green-700">
                  <span className="inline-block w-3 h-1.5 rounded-sm" style={{ backgroundColor: '#10b981' }}></span>
                  Recharge Rate (mm/day)
                </span>
              </div>
              <div className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stationData} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickMargin={8} />
                  <YAxis tickMargin={8} />
                  <Tooltip />
                  <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={2} name="Water Level (m)" />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature (°C)" />
                  <Line type="monotone" dataKey="recharge" stroke="#10b981" strokeWidth={2} name="Recharge Rate (mm/day)" />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Measurements (Last 15 Days)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recharge Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stationData.slice(-15).reverse().map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{data.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{data.waterLevel}m</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{data.temperature}°C</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{data.recharge} mm/day</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If a station is selected, show only the station details
  if (selectedStation) {
    return (
      <StationDetails 
        station={selectedStation} 
        onBack={() => setSelectedStation(null)} 
      />
    );
  }

  return (
    <div className="h-screen overflow-x-auto overflow-y-auto bg-gray-50">
      <div className="min-w-[400px] p-4 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Digital Water Level Recorder (DWLR) Monitoring System
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl text-gray-600">5,260 DWLR Stations Nationwide</h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Station Search & Filters</h3>
            <div className="text-sm text-gray-500">
              {filteredStations.length} of {dwlrStations.length} stations
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stations by name, ID, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-lg">×</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 min-w-[120px] ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <span className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Status Types</option>
                    <option value="normal">✅ Normal</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="critical">🚨 Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by State</label>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All States</option>
                    {uniqueStates.map(state => (
                      <option key={state} value={state}>📍 {state}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(searchTerm || statusFilter !== 'all' || stateFilter !== 'all') && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setStateFilter('all');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">24hr Live Water Level Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">LIVE</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4" />
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={generate24HourData()} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickMargin={8} />
            <YAxis tickMargin={8} />
            <Tooltip />
            <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={3} name="Water Level (m)" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Station Status</h3>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Critical</span>
            </div>
          </div>
        </div>
        {filteredStations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No stations found matching your criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredStations.map(station => (
              <div key={station.id} 
                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => setSelectedStation(station)}>
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getStatusColor(station.status) }}></div>
                  <div>
                    <p className="font-medium text-gray-900">{station.name}</p>
                    <p className="text-sm text-gray-500">{station.state} • {station.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{station.currentLevel}m</p>
                    <p className="text-sm text-gray-500">Water Level</p>
                  </div>
                  {getTrendIcon(station.trend)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

    </div>
  );
}