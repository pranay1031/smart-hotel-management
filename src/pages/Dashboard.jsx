import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { servicenowAPI } from '../lib/servicenow';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BedDouble, CalendarCheck, TrendingUp, Loader, Plus, Wrench, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { role, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // Admin Data
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Customer Data
  const [myBookings, setMyBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  // Modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Forms
  const [bookingForm, setBookingForm] = useState({ check_in: '', check_out: '', guests: 1, room: '' });
  const [serviceForm, setServiceForm] = useState({ type: 'cleaning', desc: '', room: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [role, user.email]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (role === 'Customer') {
        const [bookRes, roomsRes] = await Promise.all([
          servicenowAPI.get('/x_1939650_smart_0_bookings', { params: { sysparm_query: `guest_email=${user.email}` } }),
          servicenowAPI.get('/x_1939650_smart_0_room', { params: { sysparm_query: `status=Available` } })
        ]);
        setMyBookings(bookRes.data.result || []);
        setAvailableRooms(roomsRes.data.result || []);
      } else {
        const [roomsRes, bookingsRes, tasksRes] = await Promise.all([
          servicenowAPI.get('/x_1939650_smart_0_room'),
          servicenowAPI.get('/x_1939650_smart_0_bookings'),
          servicenowAPI.get('/x_1939650_smart_0_staff_tasks')
        ]);
        setRooms(roomsRes.data.result || []);
        setBookings(bookingsRes.data.result || []);
        setTasks(tasksRes.data.result || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await servicenowAPI.post('/x_1939650_smart_0_bookings', {
        guest_name: user?.email.split('@')[0],
        guest_email: user?.email,
        room: bookingForm.room,
        check_in_date: bookingForm.check_in + ' 14:00:00',
        check_out_date: bookingForm.check_out + ' 11:00:00',
        number_of_guests: bookingForm.guests
      });
      toast.success('Room booked successfully!');
      setShowBookingModal(false);
      fetchData(); // refresh data
    } catch (error) {
      toast.error('Failed to book room.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await servicenowAPI.post('/x_1939650_smart_0_guest_incidents', {
        guest_name: user?.email.split('@')[0],
        complaint_type: serviceForm.type,
        description: serviceForm.desc,
        room_number: serviceForm.room || (myBookings[0] ? myBookings[0].room.value : '')
      });
      toast.success('Service request submitted!');
      setShowServiceModal(false);
    } catch (error) {
      toast.error('Failed to submit request.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  // Admin Stats
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-slate-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-4">
          {role === 'Customer' && (
            <button onClick={() => setShowServiceModal(true)} className="glass-button !py-2 !px-4 text-sm flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500">
              <Wrench size={16} className="mr-2" /> Request Service
            </button>
          )}
          <div className="glass-panel px-4 py-2 rounded-lg hidden sm:block">
            <span className="text-sm text-slate-300">Current Role: </span>
            <span className="text-sm font-bold text-indigo-400">{role}</span>
          </div>
        </div>
      </div>

      {role !== 'Customer' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 h-80 overflow-y-auto custom-scrollbar"
            >
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
                )) : (
                  <p className="text-slate-500 text-center mt-10">No recent bookings found.</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 h-80 overflow-y-auto custom-scrollbar"
            >
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
        </>
      )}

      {role === 'Customer' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 min-h-[400px]"
        >
          {myBookings.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Your Bookings</h3>
                <button onClick={() => setShowBookingModal(true)} className="glass-button !py-2 !px-4 text-sm flex items-center">
                  <Plus size={16} className="mr-2"/> New Booking
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBookings.map((b) => (
                  <div key={b.sys_id} className="p-4 bg-white/5 border border-white/10 rounded-xl text-left flex justify-between items-center hover:bg-white/10 transition-colors">
                    <div>
                      <p className="font-bold text-white text-lg">{b.booking_id}</p>
                      <p className="text-sm text-indigo-300 mb-1">Room {b.room?.display_value || 'N/A'}</p>
                      <p className="text-xs text-slate-400">{b.check_in_date?.split(' ')[0]} to {b.check_out_date?.split(' ')[0]}</p>
                    </div>
                    <div className="text-right flex flex-col justify-between h-full">
                      <p className="text-emerald-400 font-bold text-lg">₹{b.total_price}</p>
                      <p className="text-xs font-semibold text-white bg-indigo-500 px-2 py-1 rounded-md mt-2 inline-block capitalize">{b.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BedDouble className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Active Bookings</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                You don't have any upcoming stays. Book a room now and experience our world-class hospitality.
              </p>
              <button onClick={() => setShowBookingModal(true)} className="glass-button">
                Book a Room
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 rounded-3xl w-full max-w-md relative"
            >
              <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Book a Room</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Select Room</label>
                  <select 
                    required 
                    className="glass-input w-full bg-slate-900"
                    value={bookingForm.room}
                    onChange={e => setBookingForm({...bookingForm, room: e.target.value})}
                  >
                    <option value="">-- Choose a Room --</option>
                    {availableRooms.map(r => (
                      <option key={r.sys_id} value={r.sys_id}>Room {r.room_number} ({r.room_type}) - ₹{r.price_per_night}/night</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Check In</label>
                    <input type="date" required className="glass-input w-full" value={bookingForm.check_in} onChange={e => setBookingForm({...bookingForm, check_in: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Check Out</label>
                    <input type="date" required className="glass-input w-full" value={bookingForm.check_out} onChange={e => setBookingForm({...bookingForm, check_out: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Guests</label>
                  <input type="number" min="1" max="5" required className="glass-input w-full" value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: e.target.value})} />
                </div>
                <button type="submit" disabled={submitting} className="glass-button w-full mt-4">
                  {submitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Service Request Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 rounded-3xl w-full max-w-md relative"
            >
              <button onClick={() => setShowServiceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Request Service</h3>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Service Type</label>
                  <select 
                    required 
                    className="glass-input w-full bg-slate-900"
                    value={serviceForm.type}
                    onChange={e => setServiceForm({...serviceForm, type: e.target.value})}
                  >
                    <option value="cleaning">Housekeeping / Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Description</label>
                  <textarea 
                    required 
                    rows="3"
                    className="glass-input w-full resize-none"
                    placeholder="Describe what you need..."
                    value={serviceForm.desc}
                    onChange={e => setServiceForm({...serviceForm, desc: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" disabled={submitting} className="glass-button w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500">
                  {submitting ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
