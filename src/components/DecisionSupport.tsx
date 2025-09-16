import React, { useEffect, useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MapPin, Activity, AlertTriangle, Database, Share2, Download, Zap } from 'lucide-react';

// Mock stations with state/district for drill-down
const STATIONS = [
  { id: 'DWLR001', name: 'Delhi Central', state: 'Delhi', district: 'New Delhi', level: 15.2 },
  { id: 'DWLR002', name: 'Mumbai West', state: 'Maharashtra', district: 'Mumbai Suburban', level: 8.7 },
  { id: 'DWLR003', name: 'Bangalore South', state: 'Karnataka', district: 'Bengaluru Urban', level: 22.1 },
  { id: 'DWLR004', name: 'Chennai East', state: 'Tamil Nadu', district: 'Chennai', level: 6.3 },
  { id: 'DWLR005', name: 'Kolkata North', state: 'West Bengal', district: 'Kolkata', level: 18.9 },
  { id: 'DWLR006', name: 'Hyderabad Central', state: 'Telangana', district: 'Hyderabad', level: 12.4 },
  { id: 'DWLR007', name: 'Pune East', state: 'Maharashtra', district: 'Pune', level: 19.7 },
  { id: 'DWLR008', name: 'Jaipur South', state: 'Rajasthan', district: 'Jaipur', level: 5.8 },
];

function generateHistorical(stationId: string, days = 30) {
  const base = STATIONS.find(s => s.id === stationId)?.level ?? 12;
  const now = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - i - 1));
    return {
      date: d.toISOString().split('T')[0],
      waterLevel: Math.round((base + Math.sin(i * 0.2) * 2 + (Math.random() - 0.5) * 1) * 100) / 100,
    };
  });
}

function generateLive(stationId: string) {
  // small realtime sample (24 points for 24 hours)
  const base = STATIONS.find(s => s.id === stationId)?.level ?? 12;
  const now = new Date();
  return Array.from({ length: 24 }).map((_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - (23 - i));
    return {
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      waterLevel: Math.round((base + Math.sin(i * 0.3) * 1.5 + (Math.random() - 0.5) * 0.5) * 100) / 100,
      timestamp: d.toISOString(),
    };
  });
}

export function DecisionSupport() {
  // Filters and selection
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Chart mode: 'historical' | 'live'
  const [chartMode, setChartMode] = useState<'historical' | 'live'>('live');

  // Simulation inputs
  const [rainfallPct, setRainfallPct] = useState<number>(0);
  const [usageReductionPct, setUsageReductionPct] = useState<number>(0);

  // Collaboration/annotations
  const [annotations, setAnnotations] = useState<Record<string, string>>(() => ({}));
  const [flags, setFlags] = useState<Record<string, boolean>>(() => ({}));

  // Selected station for detailed view
  const [selectedStation, setSelectedStation] = useState<string>(STATIONS[0].id);

  // Derived lists
  const states = useMemo(() => ['all', ...Array.from(new Set(STATIONS.map(s => s.state)))], []);
  const districts = useMemo(() => {
    if (stateFilter === 'all') return ['all', ...Array.from(new Set(STATIONS.map(s => s.district)))];
    return ['all', ...Array.from(new Set(STATIONS.filter(s => s.state === stateFilter).map(s => s.district)))];
  }, [stateFilter]);
  const stations = useMemo(() => {
    return STATIONS.filter(s =>
      (stateFilter === 'all' || s.state === stateFilter) &&
      (districtFilter === 'all' || s.district === districtFilter) &&
      (stationFilter === 'all' || s.id === stationFilter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
    );
  }, [stateFilter, districtFilter, stationFilter, search]);

  // Chart data based on selected station and mode
  const chartData = useMemo(() => {
    if (!selectedStation) return [];
    return chartMode === 'historical' ? generateHistorical(selectedStation, 30) : generateLive(selectedStation);
  }, [selectedStation, chartMode]);

  // Simple AI-driven insights (mocked rules)
  const insights = useMemo(() => {
    const current = STATIONS.find(s => s.id === selectedStation);
    const low = STATIONS.filter(s => s.level < 10).length;
    const recommendations: string[] = [];
    if (current && current.level < 8) recommendations.push(`${current.name} reports critically low water: consider emergency restrictions and targeted recharge.`);
    if (low > 2) recommendations.push(`Multiple stations (${low}) reporting low levels — prioritise regional interventions.`);
    if (rainfallPct > 0) recommendations.push(`Simulation: +${rainfallPct}% recharge expected to increase local levels.`);
    if (usageReductionPct > 0) recommendations.push(`Simulation: -${usageReductionPct}% usage projects slower decline in levels.`);
    if (recommendations.length === 0) recommendations.push('No immediate critical recommendations. Continue monitoring and validate with field inspections.');
    return recommendations;
  }, [selectedStation, rainfallPct, usageReductionPct]);

  // Export filtered stations to CSV
  function downloadCSV() {
    const rows = stations.map(s => ({ id: s.id, name: s.name, state: s.state, district: s.district, level: s.level }));
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stations_${stateFilter}_${districtFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Open printable report window (user can save as PDF)
  function openReport() {
    const doc = window.open('', '_blank') as Window | null;
    if (!doc) return;
    const html = `
      <html><head><title>Decision Support Report</title></head><body>
      <h1>Decision Support Report</h1>
      <h2>Filtered Stations (${stations.length})</h2>
      <pre>${JSON.stringify(stations, null, 2)}</pre>
      <h3>Insights</h3>
      <ul>${insights.map(i => `<li>${i}</li>`).join('')}</ul>
      </body></html>`;
    doc.document.write(html);
    doc.document.close();
    doc.focus();
  }

  // Simple scenario simulation function that projects a new level
  function simulateProjection(baseLevel: number) {
    const projected = baseLevel * (1 + rainfallPct / 100) * (1 - usageReductionPct / 100);
    return Math.round(projected * 100) / 100;
  }

  // Collaboration: share annotations/flags as JSON via clipboard
  async function shareAnnotations() {
    const payload = { annotations, flags, stations: stations.map(s => s.id) };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert('Annotations copied to clipboard — share with stakeholders');
    } catch (e) {
      alert('Failed to copy to clipboard.');
    }
  }

  // Toggle flag for a station
  function toggleFlag(stationId: string) {
    setFlags(prev => ({ ...prev, [stationId]: !prev[stationId] }));
  }

  // Save annotation for a station
  function saveAnnotation(stationId: string, text: string) {
    setAnnotations(prev => ({ ...prev, [stationId]: text }));
  }

  // Keep selection in sync if filter narrows
  useEffect(() => {
    if (!stations.find(s => s.id === selectedStation) && stations.length > 0) {
      setSelectedStation(stations[0].id);
    }
  }, [stations, selectedStation]);

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Decision Support</h1>
          <p className="text-muted-foreground">Tools for researchers, planners, and policymakers — focus on evidence and action</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={downloadCSV}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
          <Button variant="outline" onClick={openReport}><Share2 className="w-4 h-4 mr-2"/>Export Report</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="w-full lg:w-1/4">
            <label className="text-sm">State</label>
            <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setDistrictFilter('all'); }}>
              <SelectTrigger>
                <SelectValue placeholder="All states" />
              </SelectTrigger>
              <SelectContent>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full lg:w-1/4">
            <label className="text-sm">District</label>
            <Select value={districtFilter} onValueChange={(v) => setDistrictFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="All districts" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full lg:w-1/4">
            <label className="text-sm">Station</label>
            <Select value={stationFilter} onValueChange={(v) => setStationFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stations</SelectItem>
                {STATIONS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full lg:w-1/4">
            <label className="text-sm">Search</label>
            <Input placeholder="Search by name or id" value={search} onChange={(e:any) => setSearch(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Chart controls */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <label className={`px-3 py-1 rounded ${chartMode==='live'?'bg-blue-100':'bg-gray-100'} cursor-pointer`} onClick={() => setChartMode('live')}>Live</label>
                <label className={`px-3 py-1 rounded ${chartMode==='historical'?'bg-blue-100':'bg-gray-100'} cursor-pointer`} onClick={() => setChartMode('historical')}>Historical</label>
                <div className="ml-4 text-sm">Selected station: <strong>{selectedStation}</strong></div>
              </div>
              <div className="text-sm text-muted-foreground">Mode: <strong>{chartMode}</strong></div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'historical' ? (
                  <LineChart data={chartData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <LineChart data={chartData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Station list with flags/annotations */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Stations ({stations.length})</h3>
            <div className="max-h-72 overflow-y-auto space-y-2">
              {stations.map(s => (
                <div key={s.id} className="p-3 border rounded flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${s.level < 8 ? 'bg-red-500' : s.level < 12 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <div>
                        <div className="font-medium">{s.name} <span className="text-xs text-muted-foreground">({s.id})</span></div>
                        <div className="text-sm text-muted-foreground">{s.district}, {s.state}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Level: <strong>{s.level} m</strong></div>
                    <div className="mt-2 text-sm">Annotation: <em>{annotations[s.id] ?? '—'}</em></div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <button className={`px-2 py-1 rounded text-sm ${flags[s.id] ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`} onClick={() => toggleFlag(s.id)}>{flags[s.id] ? 'Flagged' : 'Flag'}</button>
                      <button className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm" onClick={() => { setSelectedStation(s.id); }}>View</button>
                    </div>
                    <div>
                      <input className="border px-2 py-1 rounded text-sm" placeholder="Add note" defaultValue={annotations[s.id] ?? ''} onBlur={(e) => saveAnnotation(s.id, e.target.value)} />
                    </div>
                    <div className="text-sm text-muted-foreground">Projected: <strong>{simulateProjection(s.level)} m</strong></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <Button variant="outline" onClick={shareAnnotations}><Share2 className="w-4 h-4 mr-2"/>Share</Button>
              <Button onClick={() => { alert('Annotations saved locally (session)'); }}>Save</Button>
            </div>
          </Card>
        </div>

        {/* Right column: Insights, simulation controls */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Policy Insights</h3>
            <div className="space-y-2 text-sm">
              {insights.map((ins, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded">{ins}</div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Scenario Simulation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Expected rainfall recharge change (%)</label>
                <input type="range" min={-50} max={200} value={rainfallPct} onChange={(e:any)=>setRainfallPct(Number(e.target.value))} />
                <div className="text-sm">{rainfallPct}%</div>
              </div>
              <div>
                <label className="text-sm">Planned usage reduction (%)</label>
                <input type="range" min={0} max={100} value={usageReductionPct} onChange={(e:any)=>setUsageReductionPct(Number(e.target.value))} />
                <div className="text-sm">{usageReductionPct}%</div>
              </div>
              <div className="pt-2">
                <div className="text-sm">Projected level for <strong>{selectedStation}</strong>:</div>
                <div className="text-2xl font-bold">{(() => {
                  const base = STATIONS.find(s=>s.id===selectedStation)?.level ?? 0;
                  return simulateProjection(base);
                })()} m</div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => alert('Run more advanced simulation in backend for peer-reviewed scenarios')}>Run Detailed Simulation</Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Downloads & Reports</h3>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" onClick={downloadCSV}><Download className="w-4 h-4 mr-2"/>Download Filtered CSV</Button>
              <Button variant="outline" onClick={openReport}><Zap className="w-4 h-4 mr-2"/>Open Printable Report</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DropletsIcon(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C12 2 6 9 6 13a6 6 0 0012 0c0-4-6-11-6-11z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
