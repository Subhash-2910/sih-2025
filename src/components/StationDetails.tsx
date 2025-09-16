import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface StationDetailsProps {
  station: any;
  onBack: () => void;
}

export function StationDetails({ station, onBack }: StationDetailsProps) {

  const generateStationData = (stationId: string) => {
    const data: { date: string; waterLevel: number; temperature: number; recharge: number }[] = [];
    const now = new Date();
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

  const stationData = generateStationData(station.id);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-3 text-lg font-bold text-blue-600 bg-white rounded-lg hover:bg-gray-100 inline-flex items-center shadow-lg"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{station.name}</h1>
            <p className="text-sm text-blue-100">{station.state} • {station.id}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-auto bg-gray-50">
        <div className="p-6 space-y-6 min-w-[800px]">
        {/* Station Info Cards */}
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

        {/* 20-Day Historical Data */}
        <div className="bg-white border rounded-lg p-6">
          <div className="sticky top-0 z-10 -mx-6 -mt-6 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-900 tracking-wide uppercase">20-Day Historical Data</h3>
            </div>
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

        {/* Recent Measurements Table */}
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
  );
}
