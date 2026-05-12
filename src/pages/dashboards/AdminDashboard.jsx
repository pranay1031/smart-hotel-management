import { useState, useEffect } from 'react';
import { servicenowAPI } from '../../lib/servicenow';
import { motion } from 'framer-motion';
import { Users, BedDouble, CalendarCheck, TrendingUp, Loader } from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes, tasksRes] = await Promise.all([
          servicenowAPI.get('/x_1939650_smart_0_room'),
          servicenowAPI.get('/x_1939650_smart_0_bookings'),
          servicenowAPI.get('/x_1939650_smart_0_staff_tasks')
        ]);
        setRooms(roomsRes.data.result || []);
        setBookings(bookingsRes.data.result || []);
        setTasks(tasksRes.data.result || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  const adminAvailableRooms = rooms.filter(r => r.status === 'Available').length;
  const todayBookings = bookings.length; 
  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

  const stats = [
    { title: 'Total Guests', value: bookings.reduce((sum, b) => sum + parseInt(b.number_of_guests || 1), 0), icon: Users, color: 'text-blue-400' },
    { title: 'Available Rooms', value: adminAvailableRooms, icon: BedDouble, color: 'text-indigo-400' },
    { title: 'Total Bookings', value: todayBookings, icon: CalendarCheck, color: 'text-purple-400' },
    { title: 'Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Admin Home</h2>
        <p className="text-slate-400">Full system overview and monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl"><Icon className={`w-6 h-6 ${stat.color}`} /></div>
              </div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 h-80 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-white mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {bookings.length > 0 ? bookings.slice(0, 5).map((b) => (
              <div key={b.sys_id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{b.guest_name} - Room {b.room?.display_value || b.room || 'N/A'}</p>
                  <p className="text-xs text-slate-500">{b.booking_id} | Status: {b.status}</p>
                </div>
                <div className="text-sm text-emerald-400 font-bold">₹{b.total_price}</div>
              </div>
            )) : <p className="text-slate-500 text-center mt-10">No recent bookings found.</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 h-80 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-white mb-4">Staff Tasks</h3>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.slice(0, 5).map((t) => (
              <div key={t.sys_id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{t.task_type} - Room {t.room_number?.display_value || t.room_number || 'N/A'}</p>
                  <p className="text-xs text-slate-500">{t.task_id} | Priority: {t.priority}</p>
                </div>
                <div className="text-xs px-2 py-1 bg-white/10 rounded text-slate-300">{t.status}</div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <CalendarCheck className="w-12 h-12 mb-2 opacity-20" />
                <p>No immediate tasks pending.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
