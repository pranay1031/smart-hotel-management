import { useState, useEffect } from 'react';
import { servicenowAPI } from '../../lib/servicenow';
import { motion } from 'framer-motion';
import { Loader, Users, LogIn, LogOut, BedDouble } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReceptionistDashboard() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [updating, setUpdating] = useState(null);

  const fetchData = async () => {
    try {
      const [bookingsRes, roomsRes] = await Promise.all([
        servicenowAPI.get('/x_1939650_smart_0_bookings'),
        servicenowAPI.get('/x_1939650_smart_0_room')
      ]);
      setBookings(bookingsRes.data.result || []);
      setRooms(roomsRes.data.result || []);
    } catch (error) {
      console.error('Error fetching receptionist data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async (booking) => {
    setUpdating(booking.sys_id);
    try {
      // 1. Update Booking Status
      await servicenowAPI.put(`/x_1939650_smart_0_bookings/${booking.sys_id}`, { status: 'Checked In' });
      
      // 2. Update Room Status to Occupied
      if (booking.room?.value) {
        await servicenowAPI.put(`/x_1939650_smart_0_room/${booking.room.value}`, { status: 'Occupied' });
      }

      toast.success(`${booking.guest_name} successfully checked in!`);
      fetchData();
    } catch (error) {
      toast.error('Check-in failed.');
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckOut = async (booking) => {
    setUpdating(booking.sys_id);
    try {
      // 1. Update Booking Status
      await servicenowAPI.put(`/x_1939650_smart_0_bookings/${booking.sys_id}`, { status: 'Completed' });
      
      // 2. Update Room Status to Maintenance (Needs Cleaning)
      if (booking.room?.value) {
        await servicenowAPI.put(`/x_1939650_smart_0_room/${booking.room.value}`, { status: 'Maintenance' });
        
        // 3. Auto-generate cleaning task for staff
        await servicenowAPI.post('/x_1939650_smart_0_staff_tasks', {
          task_type: 'Cleaning',
          room_number: booking.room.value,
          task_description: `Post-checkout cleaning required for room`,
          priority: 'High',
          status: 'pending'
        });
      }

      toast.success(`${booking.guest_name} successfully checked out! Cleaning task generated.`);
      fetchData();
    } catch (error) {
      toast.error('Check-out failed.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  const todayBookings = bookings.filter(b => b.status === 'pending' || b.status === 'Checked In');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Receptionist Dashboard</h2>
          <p className="text-slate-400">Manage daily check-ins, check-outs, and live room allocation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Guest Management */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 h-[500px] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-6 sticky top-0 bg-slate-900/80 backdrop-blur pb-2 z-10 flex items-center">
              <Users className="mr-2 text-indigo-400" /> Today's Reservations
            </h3>
            <div className="space-y-4">
              {todayBookings.length > 0 ? todayBookings.map((b) => (
                <div key={b.sys_id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="font-bold text-white text-lg">{b.guest_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-bold capitalize ${
                        b.status === 'Checked In' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {b.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">ID: {b.booking_id} • Room {b.room?.display_value || b.room || 'Unassigned'} • Guests: {b.number_of_guests}</p>
                    <p className="text-xs text-slate-500 mt-1">{b.check_in_date?.split(' ')[0]} to {b.check_out_date?.split(' ')[0]}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {b.status !== 'Checked In' && (
                      <button 
                        onClick={() => handleCheckIn(b)}
                        disabled={updating === b.sys_id}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg flex items-center text-sm font-bold transition-colors"
                      >
                        <LogIn size={16} className="mr-2"/> Check In
                      </button>
                    )}
                    {b.status === 'Checked In' && (
                      <button 
                        onClick={() => handleCheckOut(b)}
                        disabled={updating === b.sys_id}
                        className="px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-lg flex items-center text-sm font-bold transition-colors"
                      >
                        <LogOut size={16} className="mr-2"/> Check Out
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 text-center py-10">No active reservations for today.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Live Room Grid */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 h-[500px] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-6 sticky top-0 bg-slate-900/80 backdrop-blur pb-2 z-10 flex items-center">
              <BedDouble className="mr-2 text-purple-400" /> Live Room Status
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {rooms.map(r => {
                let statusColor = 'bg-white/5 border-white/10 text-slate-400'; // Unknown
                if (r.status === 'Available') statusColor = 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
                if (r.status === 'Occupied') statusColor = 'bg-blue-500/20 border-blue-500/30 text-blue-400';
                if (r.status === 'Maintenance') statusColor = 'bg-red-500/20 border-red-500/30 text-red-400';

                return (
                  <div key={r.sys_id} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-colors ${statusColor}`}>
                    <span className="font-bold text-lg text-white">{r.room_number}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider mt-1">{r.status}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 border-t border-white/10 pt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-emerald-500/40 mr-2"/> Available</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-blue-500/40 mr-2"/> Occupied</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-red-500/40 mr-2"/> Maintenance</div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
