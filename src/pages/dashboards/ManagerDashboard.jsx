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

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [newRoom, setNewRoom] = useState({ number: '', type: 'Deluxe', price: '', status: 'Available' });

  // Process Room Data for Pie Chart
  const availableCount = rooms.filter(r => r.u_status === 'Available' || r.status === 'Available').length;
  const occupiedCount = rooms.filter(r => r.u_status === 'Occupied' || r.status === 'Occupied').length;
  const maintenanceCount = rooms.filter(r => r.u_status === 'Maintenance' || r.status === 'Maintenance').length;

  const roomData = [
    { name: 'Available', value: availableCount, color: '#34d399' },
    { name: 'Occupied', value: occupiedCount, color: '#60a5fa' },
    { name: 'Maintenance', value: maintenanceCount, color: '#f87171' }
  ];

  const revenueData = bookings.slice(-7).map((b, i) => ({
    name: `Day ${i + 1}`,
    revenue: parseFloat(b.u_total_price || b.total_price || 0)
  }));

  const openIncidents = incidents.filter(i => i.u_status !== 'Resolved' && i.status !== 'Resolved').length;

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await servicenowAPI.post('/x_1939650_smart_0_room', {
        u_room_number: newRoom.number,
        u_room_type: newRoom.type,
        u_price: newRoom.price,
        u_status: newRoom.status
      });
      // Refresh rooms
      const res = await servicenowAPI.get('/x_1939650_smart_0_room');
      setRooms(res.data.result || []);
      setShowRoomForm(false);
      setNewRoom({ number: '', type: 'Deluxe', price: '', status: 'Available' });
    } catch (err) {
      console.error('Error adding room:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Manager Home</h2>
          <p className="text-slate-400">Live operational data, revenue tracking, and SLA monitoring.</p>
        </div>
        <button 
          onClick={() => setShowRoomForm(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          + Add New Room
        </button>
      </div>

      {showRoomForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-l-4 border-emerald-500">
          <h3 className="text-xl font-bold text-white mb-4">Add New Inventory</h3>
          <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" placeholder="Room Number" value={newRoom.number} 
              onChange={e => setNewRoom({...newRoom, number: e.target.value})}
              className="glass-input p-2" required
            />
            <select 
              value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})}
              className="glass-input p-2 text-white"
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>
            <input 
              type="number" placeholder="Price (₹)" value={newRoom.price} 
              onChange={e => setNewRoom({...newRoom, price: e.target.value})}
              className="glass-input p-2" required
            />
            <div className="flex space-x-2">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold">Save</button>
              <button type="button" onClick={() => setShowRoomForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

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

