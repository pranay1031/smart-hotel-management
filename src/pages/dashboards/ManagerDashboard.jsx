import { useState, useEffect } from 'react';
import { servicenowAPI } from '../../lib/servicenow';
import { motion } from 'framer-motion';
import { Loader, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes, incRes] = await Promise.all([
          servicenowAPI.get('/x_1939650_smart_0_room'),
          servicenowAPI.get('/x_1939650_smart_0_bookings'),
          servicenowAPI.get('/x_1939650_smart_0_guest_incidents')
        ]);
        setRooms(roomsRes.data.result || []);
        setBookings(bookingsRes.data.result || []);
        setIncidents(incRes.data.result || []);
      } catch (error) {
        console.error('Error fetching manager data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  // Process Room Data for Pie Chart
  const availableCount = rooms.filter(r => r.status === 'Available').length;
  const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
  const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;

  const roomData = [
    { name: 'Available', value: availableCount, color: '#34d399' }, // emerald-400
    { name: 'Occupied', value: occupiedCount, color: '#60a5fa' },   // blue-400
    { name: 'Maintenance', value: maintenanceCount, color: '#f87171' } // red-400
  ];

  // Process Booking Data for Line/Area Chart (Mocking Last 7 Days Revenue from recent bookings)
  // In a real scenario, we'd group by created_date. Here we just take the last 7 bookings and pretend they are a timeline
  const revenueData = bookings.slice(-7).map((b, i) => ({
    name: `Day ${i + 1}`,
    revenue: parseFloat(b.total_price || 0)
  }));

  // SLA Metrics
  const openIncidents = incidents.filter(i => i.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Manager Analytics</h2>
        <p className="text-slate-400">Live operational data, revenue tracking, and SLA monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center space-x-4 border-t-4 border-indigo-500">
          <div className="p-4 bg-indigo-500/20 rounded-full"><TrendingUp size={24} className="text-indigo-400"/></div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Revenue (All Time)</p>
            <p className="text-2xl font-bold text-white">₹{bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex items-center space-x-4 border-t-4 border-blue-500">
          <div className="p-4 bg-blue-500/20 rounded-full"><Users size={24} className="text-blue-400"/></div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Current Occupancy Rate</p>
            <p className="text-2xl font-bold text-white">{Math.round((occupiedCount / (rooms.length || 1)) * 100)}%</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex items-center space-x-4 border-t-4 border-red-500">
          <div className="p-4 bg-red-500/20 rounded-full"><AlertCircle size={24} className="text-red-400"/></div>
          <div>
            <p className="text-slate-400 text-sm font-medium">SLA: Open Incidents</p>
            <p className="text-2xl font-bold text-white">{openIncidents} Pending</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Recent Revenue Trends</h3>
          <div className="w-full h-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Room Status Distribution */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Real-Time Room Status</h3>
          <div className="w-full h-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {roomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
