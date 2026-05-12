import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { servicenowAPI } from '../../lib/servicenow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BedDouble, Plus, Wrench, X, Loader, 
  CreditCard, Bell, Star, Settings, 
  MessageSquare, LayoutDashboard, History,
  TrendingUp, ShoppingBag, Clock, Heart,
  DollarSign, MapPin
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import toast from 'react-hot-toast';

// --- Sub-Components ---

const KPICard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex items-center space-x-4 border border-white/5"
  >
    <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      <div className="flex items-end space-x-2">
        <h4 className="text-2xl font-bold text-white leading-none">{value}</h4>
        {trend && <span className="text-xs text-emerald-400 font-bold mb-1">+{trend}%</span>}
      </div>
    </div>
  </motion.div>
);

// --- Main Dashboard View ---
const DashboardHome = ({ myBookings, stats, chartData }) => {

  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <div className="relative glass-panel p-8 rounded-3xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">
              Discover Your Stay at <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Novotel Vizag</span>
            </h1>
            <p className="text-slate-300 max-w-md">
              Experience the pinnacle of luxury at Varun Beach. Your smart concierge is ready to assist you.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-panel p-4 rounded-2xl text-center min-w-[120px] border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Loyalty Points</p>
              <p className="text-xl font-bold text-indigo-400">2,450</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center min-w-[120px] border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Total Spending</p>
              <p className="text-xl font-bold text-emerald-400">₹45,200</p>
            </div>
          </div>
        </div>
      </div>      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Active Booking" value={myBookings.filter(b => b.status === 'confirmed').length} icon={BedDouble} color="bg-indigo-500" />
        <KPICard title="Food Orders" value={stats.foodOrders} icon={ShoppingBag} color="bg-orange-500" />
        <KPICard title="Pending Requests" value={stats.pendingRequests} icon={Clock} color="bg-amber-500" trend={12} />
        <KPICard title="Notifications" value={stats.notifications} icon={Bell} color="bg-blue-500" />
      </div>

      {/* Analytics & Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <TrendingUp className="mr-2 text-indigo-400" size={18} /> Spending Analytics
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#818cf8" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Incident Status */}
        <div className="glass-card p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Wrench className="mr-2 text-amber-400" size={18} /> Request Status
          </h3>
          <div className="space-y-4">
            {stats.pendingRequests > 0 ? (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Housekeeping</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">In Progress</span>
                </div>
                <p className="text-sm text-white font-medium">Extra towels requested</p>
                <p className="text-[10px] text-slate-500 mt-1">Staff: Pranay Reddy</p>
                <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[65%]" />
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No active service requests</p>
              </div>
            )}
            
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-400 font-bold transition-all border border-white/5">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Exported Dashboard ---
export default function CustomerDashboard({ view = '/' }) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  const [myBookings, setMyBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [stats, setStats] = useState({ foodOrders: 0, pendingRequests: 0, notifications: 0 });
  const [chartData, setChartData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [bookingForm, setBookingForm] = useState({ check_in: '', check_out: '', guests: 1, room: '', phone: '', special_requests: '' });
  const [serviceForm, setServiceForm] = useState({ type: 'cleaning', priority: 'medium', desc: '', room: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, roomsRes, foodRes, incidentRes, notifyRes, payRes] = await Promise.all([
        servicenowAPI.get('/x_1939650_smart_0_bookings', { params: { sysparm_query: `guest_email=${user.email}` } }),
        servicenowAPI.get('/x_1939650_smart_0_room', { params: { sysparm_query: `status=Available` } }),
        servicenowAPI.get('/x_1939650_smart_0_food_orders', { params: { sysparm_query: `u_guest_name=${user.email.split('@')[0]}^ORu_guest_name=${user.email}` } }),
        servicenowAPI.get('/x_1939650_smart_0_guest_incidents', { params: { sysparm_query: `guest_name=${user.email.split('@')[0]}^status!=resolved^status!=closed` } }),
        servicenowAPI.get('/x_1939650_smart_0_notifications', { params: { sysparm_query: `recipient=${user.email}^status=sent` } }),
        servicenowAPI.get('/x_1939650_smart_0_payments', { params: { sysparm_query: `booking.guest_email=${user.email}` } })
      ]);

      const bookings = bookRes.data.result || [];
      const incidentList = incidentRes.data.result || [];
      setMyBookings(bookings);
      setAvailableRooms(roomsRes.data.result || []);
      setPayments(payRes.data.result || []);
      setIncidents(incidentList);
      
      setStats({
        foodOrders: (foodRes.data.result || []).length,
        pendingRequests: incidentList.filter(i => i.status !== 'resolved' && i.status !== 'closed').length,
        notifications: (notifyRes.data.result || []).length
      });

      // Calculate chart data from real bookings
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIndex = new Date().getMonth();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const idx = (currentMonthIndex - i + 12) % 12;
        last6Months.push({ name: months[idx], value: 0, count: 0 });
      }

      bookings.forEach(b => {
        const date = new Date(b.created_date || b.sys_created_on);
        const monthName = months[date.getMonth()];
        const chartItem = last6Months.find(m => m.name === monthName);
        if (chartItem) {
          chartItem.value += parseFloat(b.total_price || 0);
          chartItem.count += 1;
        }
      });
      
      setChartData(last6Months);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchData();
  }, [user]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Generate a unique booking ID
      const bookingId = 'BK' + Math.floor(Math.random() * 1000000);
      
      // Calculate total price
      const roomObj = availableRooms.find(r => r.sys_id === bookingForm.room);
      const checkIn = new Date(bookingForm.check_in);
      const checkOut = new Date(bookingForm.check_out);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
      const totalPrice = (parseFloat(roomObj?.price_per_night || 0) * nights).toFixed(2);

      await servicenowAPI.post('/x_1939650_smart_0_bookings', {
        booking_id: bookingId,
        guest_name: user?.email.split('@')[0],
        guest_email: user?.email,
        guest_phone: bookingForm.phone,
        room: bookingForm.room, // sys_id of the room
        check_in_date: bookingForm.check_in + ' 14:00:00',
        check_out_date: bookingForm.check_out + ' 11:00:00',
        number_of_guests: bookingForm.guests,
        special_requests: bookingForm.special_requests,
        total_price: totalPrice,
        status: 'confirmed',
        confirmation_email_sent: 'false',
        created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      toast.success('Room booked successfully!');
      toast.success(`Confirmation email sent to ${user.email}`, { icon: '📧', duration: 5000 });
      setShowBookingModal(false);
      fetchData();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book room.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const incidentId = 'INC' + Math.floor(Math.random() * 1000000);
      await servicenowAPI.post('/x_1939650_smart_0_guest_incidents', {
        incident_id: incidentId,
        guest_name: user?.email.split('@')[0],
        complaint_type: serviceForm.type,
        priority: serviceForm.priority,
        description: serviceForm.desc,
        room_number: serviceForm.room || (myBookings[0] ? myBookings[0].room.display_value : '101'),
        status: 'new',
        created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      toast.success('Service request submitted!');
      setShowServiceModal(false);
    } catch (error) {
      toast.error('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  // Router logic based on 'view' prop
  const renderView = () => {
    switch (view) {
      case '/services':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Room Services</h2>
              <button 
                onClick={() => setShowServiceModal(true)}
                className="glass-button bg-indigo-500 hover:bg-indigo-600 flex items-center shadow-lg shadow-indigo-500/20"
              >
                <Plus size={18} className="mr-2" /> New Request
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {incidents.length > 0 ? incidents.map(incident => (
                <div key={incident.sys_id} className="glass-panel p-6 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${
                      incident.priority === 'high' || incident.priority === 'urgent' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      <Wrench size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg capitalize">{incident.complaint_type}</h4>
                      <p className="text-sm text-slate-400 max-w-xl">{incident.description}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-slate-500">ID: {incident.incident_id || 'INC-TEMP'}</span>
                        <span className={incident.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'}>
                          Status: {incident.status}
                        </span>
                        <span className="text-indigo-400">Staff: {incident.assigned_to_staff?.display_value || 'Assigning...'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500 mb-1">Room {incident.room_number}</p>
                    {incident.status === 'resolved' && !incident.satisfaction_rating_1_5 ? (
                      <button 
                        onClick={() => {
                          const rating = prompt('Please rate this service (1-5):');
                          if (rating >= 1 && rating <= 5) {
                            servicenowAPI.patch(`/x_1939650_smart_0_guest_incidents/${incident.sys_id}`, {
                              satisfaction_rating_1_5: rating,
                              status: 'closed'
                            }).then(() => {
                              toast.success('Thank you for rating!');
                              fetchData();
                            });
                          }
                        }}
                        className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-2 py-1 rounded transition-colors"
                      >
                        Rate Service
                      </button>
                    ) : (
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        incident.priority === 'urgent' || incident.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-slate-400'
                      }`}>
                        {incident.priority}
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="glass-panel p-12 text-center text-slate-500 border border-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Wrench size={32} className="opacity-20" />
                  </div>
                  <p className="text-lg font-medium text-white/50">No active service requests</p>
                  <p className="text-sm">Need housekeeping or maintenance? We're here to help!</p>
                </div>
              )}
            </div>
          </div>
        );
      case '/notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Notifications</h2>
            <div className="space-y-4">
              {[
                { title: 'Room Booked', desc: 'Your Deluxe Room booking (BK-123) is confirmed.', time: '2 mins ago', type: 'booking' },
                { title: 'Food Delivered', desc: 'Your Butter Chicken order has been delivered to Room 304.', time: '1 hour ago', type: 'food' },
                { title: 'Service Complete', desc: 'Housekeeping has completed the extra towel request.', time: '3 hours ago', type: 'service' }
              ].map((n, idx) => (
                <div key={idx} className="glass-panel p-6 border border-white/5 flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${
                    n.type === 'booking' ? 'text-indigo-400' : n.type === 'food' ? 'text-orange-400' : 'text-emerald-400'
                  }`}>
                    {n.type === 'booking' ? <BedDouble size={20} /> : n.type === 'food' ? <ShoppingBag size={20} /> : <Wrench size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">{n.time}</span>
                    </div>
                    <p className="text-sm text-slate-400">{n.desc}</p>
                    <p className="text-[10px] text-indigo-400 mt-2 font-bold uppercase tracking-widest">Email Sent to {user?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case '/book-room':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Book Your Paradise</h2>
              {availableRooms.length === 0 && (
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="glass-button bg-indigo-500 hover:bg-indigo-600 flex items-center"
                >
                  <Plus size={18} className="mr-2" /> Manual Booking
                </button>
              )}
            </div>
            {availableRooms.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {availableRooms.map(room => (
                  <motion.div key={room.sys_id} whileHover={{ scale: 1.02 }} className="glass-panel overflow-hidden group border border-white/5">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={room.image_url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'; }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute top-4 right-4 bg-indigo-500/90 backdrop-blur-md text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        ₹{room.price_per_night}/night
                      </div>
                    </div>
                    <div className="p-6 bg-slate-900/40">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">Room {room.room_number}</h3>
                        <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">
                          {room.room_type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">{room.description || 'Experience ultimate luxury in our smart-controlled guest suites.'}</p>
                      <button 
                        onClick={() => {
                          setBookingForm({ ...bookingForm, room: room.sys_id });
                          setShowBookingModal(true);
                        }}
                        className="glass-button w-full bg-indigo-500 hover:bg-indigo-600"
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-20 text-center border border-white/5">
                <BedDouble size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No specific rooms listed</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">We're currently updating our room availability. You can still place a manual booking request, and our staff will confirm it shortly.</p>
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="glass-button bg-indigo-500 hover:bg-indigo-600 px-10"
                >
                  Open Booking Form
                </button>
              </div>
            )}
          </div>
        );
      case '/my-bookings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Your History & Orders</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Room Bookings */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <BedDouble size={14} className="mr-2" /> Room Bookings
                </h3>
                {myBookings.map(b => (
                  <div key={b.sys_id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                        <BedDouble className="text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{b.booking_id}</h4>
                        <p className="text-sm text-slate-400">Room {b.room?.display_value} | {b.check_in_date?.split(' ')[0]} to {b.check_out_date?.split(' ')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">₹{b.total_price}</p>
                        <p className={`text-[10px] uppercase font-bold ${b.status === 'confirmed' ? 'text-emerald-400' : 'text-slate-400'}`}>{b.status}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                         <span className="text-[10px] text-slate-500">GUESTS: {b.number_of_guests}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Food & Drink Orders (Mock or Real) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <ShoppingBag size={14} className="mr-2" /> Food & Drink Orders
                </h3>
                <div className="glass-panel p-6 border border-white/5 bg-slate-900/40">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="text-orange-400" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold">Butter Chicken & Naan</p>
                        <p className="text-xs text-slate-500">Order ID: FD-9921 | Today, 08:30 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹850.00</p>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase">Delivered</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold">Vizag Special Coffee</p>
                        <p className="text-xs text-slate-500">Order ID: FD-9945 | Today, 10:15 AM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹180.00</p>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case '/payments':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Billing & Payments</h2>
            <div className="glass-panel p-8 rounded-3xl text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Total Outstanding: ₹{payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)}</h3>
              <p className="text-slate-400 mb-8">All room charges and food orders are added to your final bill. Real payments are disabled for this demo.</p>
              <div className="max-w-md mx-auto space-y-4 text-left">
                {payments.map((p, idx) => (
                  <div key={idx} className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-white font-bold">{p.payment_id || 'Charge'}</p>
                      <p className="text-xs text-slate-500">{p.payment_method || 'Room Charge'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">₹{p.amount}</p>
                      <p className={`text-[10px] uppercase font-bold ${p.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>{p.payment_status}</p>
                    </div>
                  </div>
                ))}
                {payments.length === 0 && <p className="text-center text-slate-500">No transactions found.</p>}
                <button className="glass-button w-full mt-4 bg-indigo-500 opacity-50 cursor-not-allowed">Generate Final Invoice (PDF)</button>
              </div>
            </div>
          </div>
        );
      case '/settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Profile Settings</h2>
            <div className="glass-panel p-8 rounded-3xl max-w-2xl">
              <div className="flex items-center space-x-6 mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl">
                  {user?.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{user?.email.split('@')[0]}</h3>
                  <p className="text-slate-400">{user?.email}</p>
                </div>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                    <input type="text" className="glass-input w-full" defaultValue={user?.email.split('@')[0]} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Phone</label>
                    <input type="tel" className="glass-input w-full" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Notification Preferences</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="mr-2" /> Email</label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="mr-2" /> Push</label>
                    <label className="flex items-center cursor-pointer"><input type="checkbox" className="mr-2" /> SMS</label>
                  </div>
                </div>
                <button type="button" className="glass-button bg-indigo-500 hover:bg-indigo-600">Save Changes</button>
              </form>
            </div>
          </div>
        );
      case '/feedback':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Guest Feedback</h2>
            <div className="glass-panel p-8 rounded-3xl max-w-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Star className="mr-3 text-amber-400" size={24} /> Rate Your Experience
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  await servicenowAPI.post('/x_1939650_smart_0_feedback', {
                    guest_name: user?.email.split('@')[0],
                    rating: e.target.rating.value,
                    review: e.target.review.value,
                    booking: myBookings[0]?.sys_id || ''
                  });
                  toast.success('Thank you for your feedback!');
                  e.target.reset();
                } catch (err) {
                  toast.error('Failed to submit feedback.');
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Overall Rating (1-5)</label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} className="cursor-pointer group">
                        <input type="radio" name="rating" value={num} required className="hidden peer" />
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 peer-checked:bg-indigo-500 peer-checked:border-indigo-400 transition-all text-white font-bold group-hover:scale-110">
                          {num}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Your Review</label>
                  <textarea name="review" required rows="4" className="glass-input w-full resize-none" placeholder="How was your stay? Any suggestions for us?"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="glass-button bg-indigo-500 hover:bg-indigo-600 w-full py-4 font-bold shadow-lg shadow-indigo-500/20">
                  {submitting ? 'Submitting...' : 'Send Feedback'}
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return <DashboardHome myBookings={myBookings} stats={stats} chartData={chartData} />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Guest Hub</h2>
            <p className="text-slate-400">Enterprise Hospitality Management</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowServiceModal(true)} className="glass-button !py-2 !px-4 text-sm flex items-center bg-white/5 hover:bg-white/10 border-white/10">
            <Wrench size={16} className="mr-2" /> Rapid Service
          </button>
        </div>
      </div>

      {renderView()}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel p-8 rounded-3xl w-full max-w-md relative">
              <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold text-white mb-6">Book a Room</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Select Room</label>
                  <select required className="glass-input w-full bg-slate-900" value={bookingForm.room} onChange={e => setBookingForm({...bookingForm, room: e.target.value})}>
                    <option value="">-- Choose a Room --</option>
                    {availableRooms.length > 0 ? availableRooms.map(r => (
                      <option key={r.sys_id} value={r.sys_id}>Room {r.room_number} ({r.room_type}) - ₹{r.price_per_night}/night</option>
                    )) : (
                      <>
                        <option value="std_room">Standard Room (Vizag View) - ₹3500/night</option>
                        <option value="deluxe_room">Deluxe Suite (Ocean Front) - ₹5500/night</option>
                        <option value="pres_room">Presidential Suite - ₹12000/night</option>
                      </>
                    )}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Guests</label>
                    <input type="number" min="1" max="5" required className="glass-input w-full" value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Phone Number</label>
                    <input type="tel" required className="glass-input w-full" placeholder="+91..." value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Special Requests</label>
                  <textarea rows="2" className="glass-input w-full resize-none" placeholder="Any specific requirements?" value={bookingForm.special_requests} onChange={e => setBookingForm({...bookingForm, special_requests: e.target.value})}></textarea>
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel p-8 rounded-3xl w-full max-w-md relative">
              <button onClick={() => setShowServiceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold text-white mb-6">Request Service</h3>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Service Type</label>
                    <select required className="glass-input w-full bg-slate-900" value={serviceForm.type} onChange={e => setServiceForm({...serviceForm, type: e.target.value})}>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="ac">AC Repair</option>
                      <option value="water">Water Issue</option>
                      <option value="wifi">WiFi Issue</option>
                      <option value="noise">Noise Complaint</option>
                      <option value="temperature">Temperature</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Priority</label>
                    <select required className="glass-input w-full bg-slate-900" value={serviceForm.priority} onChange={e => setServiceForm({...serviceForm, priority: e.target.value})}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Description</label>
                  <textarea required rows="3" className="glass-input w-full resize-none" placeholder="Describe what you need..." value={serviceForm.desc} onChange={e => setServiceForm({...serviceForm, desc: e.target.value})}></textarea>
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
