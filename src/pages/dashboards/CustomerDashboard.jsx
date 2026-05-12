import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { servicenowAPI } from '../../lib/servicenow';
import { notify, sendBookingEmail, sendServiceEmail, sendDesktopNotification, requestNotificationPermission } from '../../lib/notifications';
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

const NavCard = ({ title, desc, icon: Icon, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card p-6 flex flex-col items-start text-left space-y-4 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-3xl group-hover:opacity-[0.1] transition-opacity`} />
    <div className={`p-4 rounded-2xl ${color} bg-opacity-20 group-hover:bg-opacity-30 transition-all shadow-lg`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{title}</h4>
      <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
    <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
      Open Section →
    </div>
  </motion.button>
);

// --- Main Dashboard View ---
const DashboardHome = ({ myBookings, stats, chartData, incidents, foodOrders }) => {
  const navigate = useNavigate();

  const navItems = [
    { title: "Book a Room", desc: "Reserve your luxury stay with ocean views.", icon: BedDouble, color: "bg-indigo-500", path: "/book-room" },
    { title: "Food & Drinks", desc: "Gourmet dining and room service menu.", icon: ShoppingBag, color: "bg-orange-500", path: "/food-drinks" },
    { title: "Nearby Places", desc: "Explore local attractions and beaches.", icon: MapPin, color: "bg-emerald-500", path: "/nearby" },
    { title: "Room Services", desc: "Housekeeping, maintenance & more.", icon: Wrench, color: "bg-amber-500", path: "/services" },
    { title: "My Bookings", desc: "View your reservation history & status.", icon: History, color: "bg-purple-500", path: "/my-bookings" },
    { title: "Payments", desc: "Manage your bills and payment history.", icon: CreditCard, color: "bg-rose-500", path: "/payments" },
    { title: "Notifications", desc: "Updates about your stay and requests.", icon: Bell, color: "bg-blue-500", path: "/notifications" },
    { title: "Feedback", desc: "Rate your experience at our hotel.", icon: Star, color: "bg-yellow-500", path: "/feedback" },
    { title: "Settings", desc: "Manage your profile and preferences.", icon: Settings, color: "bg-slate-500", path: "/settings" }
  ];

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
      </div>      {/* Hub Navigation Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="mr-3 text-indigo-400" size={20} /> Explore Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item, idx) => (
            <NavCard 
              key={idx}
              {...item}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Live Status Tracking - All in one place */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <History className="mr-2 text-purple-400" size={18} /> Recent Stay Activity
          </h3>
          <div className="space-y-4">
            {myBookings.length > 0 ? myBookings.slice(0, 2).map(b => (
              <div key={b.sys_id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <BedDouble className="text-indigo-400" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Room {b.room?.display_value || 'Suite'}</p>
                    <p className="text-[10px] text-slate-500">{b.booking_id}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded uppercase">{b.status}</span>
              </div>
            )) : <p className="text-slate-500 text-xs italic">No recent stay activity.</p>}
          </div>
        </div>

        <div className="glass-panel p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <ShoppingBag className="mr-2 text-orange-400" size={18} /> Food & Service Status
          </h3>
          <div className="space-y-4">
            {/* Latest Food Order */}
            {foodOrders.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="text-orange-400" size={16} />
                  </div>
                  <div className="max-w-[150px]">
                    <p className="text-sm font-bold text-white truncate">{foodOrders[0].u_menu_items}</p>
                    <p className="text-[10px] text-slate-500">Latest Food Order</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-1 bg-orange-500/10 text-orange-400 rounded uppercase">{foodOrders[0].u_status || 'Pending'}</span>
              </div>
            )}
            
            {/* Latest Service Request */}
            {incidents.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Wrench className="text-blue-400" size={16} />
                  </div>
                  <div className="max-w-[150px]">
                    <p className="text-sm font-bold text-white truncate">{incidents[0].complaint_type || 'General Service'}</p>
                    <p className="text-[10px] text-slate-500">Service Request</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-1 bg-blue-500/10 text-blue-400 rounded uppercase">{incidents[0].status}</span>
              </div>
            )}

            {foodOrders.length === 0 && incidents.length === 0 && (
              <p className="text-slate-500 text-xs italic">No active requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Notifications View ---
const NotificationsView = ({ user, incidents, foodOrders, myBookings }) => {
  const [permStatus, setPermStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    setPermStatus(granted ? 'granted' : Notification.permission);
    if (granted) {
      toast.success('Desktop notifications enabled!');
      sendDesktopNotification(
        '🏨 Smart Hotel',
        'Desktop notifications are now active. You\'ll be notified for all bookings and service requests.'
      );
    } else {
      toast.error('Permission denied. Please allow notifications in your browser settings.');
    }
  };

  const handleTest = () => {
    notify('🔔 Test Notification', 'This is a test from Smart Hotel. Notifications are working!', 'info');
  };

  // Build unified timeline from live data
  const timeline = [
    ...myBookings.map(b => ({
      type: 'booking',
      title: `Room Booking Confirmed`,
      desc: `Booking ${b.booking_id} for Room ${b.room?.display_value || 'Suite'} — Status: ${b.status}`,
      date: b.created_date || b.sys_created_on,
    })),
    ...foodOrders.map(o => ({
      type: 'food',
      title: `Food Order Placed`,
      desc: `${o.u_menu_items} — ₹${o.u_order_total} — ${o.u_status || 'Pending'}`,
      date: o.u_created_date || o.sys_created_on,
    })),
    ...incidents.map(i => ({
      type: 'service',
      title: `Service Request: ${i.complaint_type || 'General'}`,
      desc: `Priority: ${i.priority} — Status: ${i.status}`,
      date: i.created_date || i.sys_created_on,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Notifications</h2>

      {/* Permission Status Banner */}
      <div className={`glass-panel p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        permStatus === 'granted' ? 'border-emerald-500/30 bg-emerald-500/5' :
        permStatus === 'denied'  ? 'border-red-500/30 bg-red-500/5' :
                                   'border-amber-500/30 bg-amber-500/5'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            permStatus === 'granted' ? 'bg-emerald-500/20' :
            permStatus === 'denied'  ? 'bg-red-500/20' : 'bg-amber-500/20'
          }`}>
            <Bell className={
              permStatus === 'granted' ? 'text-emerald-400' :
              permStatus === 'denied'  ? 'text-red-400' : 'text-amber-400'
            } size={20} />
          </div>
          <div>
            <p className="font-bold text-white">
              Desktop Notifications — {
                permStatus === 'granted'     ? '✅ Enabled' :
                permStatus === 'denied'      ? '❌ Blocked' :
                permStatus === 'unsupported' ? '⚠️ Not Supported' : '⏳ Not Enabled Yet'
              }
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {permStatus === 'granted'     ? 'You will receive desktop pop-ups for bookings and service requests.' :
               permStatus === 'denied'      ? 'Notifications are blocked. Click the 🔒 icon in your browser address bar → Allow.' :
               permStatus === 'unsupported' ? 'Your browser does not support desktop notifications.' :
               'Click Enable to receive booking confirmations and service updates on your desktop.'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {permStatus !== 'granted' && permStatus !== 'unsupported' && (
            <button onClick={handleEnable} className="glass-button !py-2 !px-5 text-sm bg-indigo-500 hover:bg-indigo-600">
              Enable Notifications
            </button>
          )}
          {permStatus === 'granted' && (
            <button onClick={handleTest} aria-label="Send test notification" className="glass-button !py-2 !px-5 text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30">
              🔔 Send Test
            </button>
          )}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Activity Timeline</h3>
        {timeline.length > 0 ? timeline.map((n, idx) => (
          <div key={idx} className="glass-panel p-5 border border-white/5 flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${
              n.type === 'booking' ? 'bg-indigo-500/20 text-indigo-400' :
              n.type === 'food'    ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {n.type === 'booking' ? <BedDouble size={20} /> : n.type === 'food' ? <ShoppingBag size={20} /> : <Wrench size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-white text-sm">{n.title}</h4>
                <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">{n.date?.split(' ')[0]}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{n.desc}</p>
              <p className="text-[10px] text-indigo-400 mt-2 font-bold uppercase tracking-widest">📧 {user?.email}</p>
            </div>
          </div>
        )) : (
          <div className="glass-panel p-16 text-center text-slate-500 border border-white/5">
            <Bell size={40} className="mx-auto mb-4 opacity-30" />
            <p>No activity yet. Book a room or order food to see notifications here.</p>
          </div>
        )}
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
  const [foodOrders, setFoodOrders] = useState([]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [bookingForm, setBookingForm] = useState({ check_in: '', check_out: '', guests: 1, room: '', phone: '', special_requests: '' });
  const [serviceForm, setServiceForm] = useState({ type: 'cleaning', priority: 'medium', desc: '', room: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, roomsRes, foodRes, incidentRes, notifyRes, payRes] = await Promise.all([
        servicenowAPI.get('/x_1939650_smart_0_bookings', { params: { sysparm_query: `guest_emailLIKE${user.email.split('@')[0]}`, sysparm_limit: 100 } }),
        servicenowAPI.get('/x_1939650_smart_0_room', { params: { sysparm_query: `status=Available`, sysparm_limit: 100 } }),
        servicenowAPI.get('/x_1939650_smart_0_food_orders', { params: { sysparm_query: `u_guest_nameLIKE${user.email.split('@')[0]}`, sysparm_limit: 100 } }),
        servicenowAPI.get('/x_1939650_smart_0_guest_incidents', { params: { sysparm_query: `guest_nameLIKE${user.email.split('@')[0]}`, sysparm_limit: 100 } }),
        servicenowAPI.get('/x_1939650_smart_0_notifications', { params: { sysparm_query: `recipientLIKE${user.email.split('@')[0]}`, sysparm_limit: 100 } }),
        servicenowAPI.get('/x_1939650_smart_0_payments', { params: { sysparm_query: `booking.guest_emailLIKE${user.email.split('@')[0]}`, sysparm_limit: 100 } })
      ]);

      const bookings = bookRes.data.result || [];
      const incidentList = incidentRes.data.result || [];
      const foodList = foodRes.data.result || [];
      
      setMyBookings(bookings);
      setAvailableRooms(roomsRes.data.result || []);
      setPayments(payRes.data.result || []);
      setIncidents(incidentList);
      setFoodOrders(foodList);
      
      setStats({
        foodOrders: foodList.length,
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
    if (user?.email) {
      fetchData();
      // Request desktop notification permission on first load
      requestNotificationPermission();
    }
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
      const roomName = roomObj ? `Room ${roomObj.room_number} (${roomObj.room_type})` : 'Suite';

      await servicenowAPI.post('/x_1939650_smart_0_bookings', {
        booking_id: bookingId,
        guest_name: user?.email.split('@')[0],
        guest_email: user?.email,
        guest_phone: bookingForm.phone,
        room: bookingForm.room,
        check_in_date: bookingForm.check_in + ' 14:00:00',
        check_out_date: bookingForm.check_out + ' 11:00:00',
        number_of_guests: bookingForm.guests,
        special_requests: bookingForm.special_requests,
        total_price: totalPrice,
        status: 'confirmed',
        confirmation_email_sent: 'false',
        created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });

      // Real email notification
      await sendBookingEmail({
        guestEmail: user.email,
        guestName:  user.email.split('@')[0],
        bookingId,
        roomName,
        checkIn:    bookingForm.check_in,
        checkOut:   bookingForm.check_out,
        totalPrice,
        guests:     bookingForm.guests,
      });

      // Guaranteed notification (toast + desktop)
      await notify(
        '🏨 Booking Confirmed!',
        `Booking ${bookingId} for ${roomName} confirmed. Check-in: ${bookingForm.check_in}`,
        'booking'
      );

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

      // Real email notification
      await sendServiceEmail({
        guestEmail:   user.email,
        guestName:    user.email.split('@')[0],
        incidentId,
        serviceType:  serviceForm.type,
        priority:     serviceForm.priority,
        description:  serviceForm.desc,
      });

      // Guaranteed notification (toast + desktop)
      await notify(
        '🔧 Service Request Received',
        `Your ${serviceForm.type} request (${incidentId}) has been logged. Priority: ${serviceForm.priority}`,
        'service'
      );

      toast.success('Service request submitted!');
      setShowServiceModal(false);
      fetchData();
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
          <NotificationsView
            user={user}
            incidents={incidents}
            foodOrders={foodOrders}
            myBookings={myBookings}
          />
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
                {myBookings.length > 0 ? myBookings.map(b => (
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
                )) : (
                  <div className="glass-panel p-10 text-center text-slate-500 border border-white/5">
                    <p>No active room bookings found.</p>
                  </div>
                )}
              </div>

              {/* Food & Drink Orders (Mock or Real) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <ShoppingBag size={14} className="mr-2" /> Food & Drink Orders
                </h3>
                <div className="space-y-4">
                  {foodOrders.length > 0 ? foodOrders.map((order, idx) => (
                    <div key={idx} className="glass-panel p-6 border border-white/5 bg-slate-900/40">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            order.u_status === 'delivered' ? 'bg-emerald-500/20' : 'bg-orange-500/20'
                          }`}>
                            <ShoppingBag className={order.u_status === 'delivered' ? 'text-emerald-400' : 'text-orange-400'} size={20} />
                          </div>
                          <div>
                            <p className="text-white font-bold">{order.u_menu_items}</p>
                            <p className="text-xs text-slate-500">Order ID: {order.u_order_id || `FD-${idx + 1000}`} • {order.u_created_date?.split(' ')[0]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₹{order.u_order_total}</p>
                          <p className={`text-[10px] font-bold uppercase ${
                            order.u_status === 'delivered' ? 'text-emerald-400' : 'text-orange-400'
                          }`}>{order.u_status}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="glass-panel p-10 text-center text-slate-500 border border-white/5">
                      <p>No food orders found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Requests (Incidents) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <Wrench size={14} className="mr-2" /> Service Requests
                </h3>
                <div className="space-y-4">
                  {incidents.length > 0 ? incidents.map((inc, idx) => (
                    <div key={idx} className="glass-panel p-6 border border-white/5 bg-slate-900/40">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            inc.status === 'resolved' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                          }`}>
                            <Wrench className={inc.status === 'resolved' ? 'text-emerald-400' : 'text-blue-400'} size={20} />
                          </div>
                          <div>
                            <p className="text-white font-bold">{inc.complaint_type || inc.short_description || 'General Request'}</p>
                            <p className="text-xs text-slate-500">ID: {inc.incident_id || inc.number} • {inc.created_date || inc.sys_created_on}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                            inc.status === 'resolved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                            inc.status === 'new' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 
                            'bg-orange-500/10 border-orange-500/30 text-orange-400'
                          }`}>{inc.status}</p>
                          <p className="text-[10px] text-slate-500 mt-2">Priority: {inc.priority}</p>
                        </div>
                      </div>
                      {inc.description && <p className="mt-4 text-xs text-slate-400 italic">"{inc.description}"</p>}
                    </div>
                  )) : (
                    <div className="glass-panel p-10 text-center text-slate-500 border border-white/5">
                      <p>No active service requests found.</p>
                    </div>
                  )}
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
        return <DashboardHome 
          myBookings={myBookings} 
          stats={stats} 
          chartData={chartData} 
          incidents={incidents} 
          foodOrders={foodOrders} 
        />;
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
            <h2 className="text-3xl font-bold text-white">
              {view === '/' ? 'Home' : 
               view === '/my-bookings' ? 'My History' : 
               view === '/book-room' ? 'Reservations' : 
               view === '/nearby' ? 'Explore' : 
               view === '/food-drinks' ? 'Gastronomy' : 'Home'}
            </h2>
            <p className="text-slate-400">
              {view === '/' ? 'Enterprise Hospitality Management' : 
               view === '/my-bookings' ? 'Your active services and previous stays' : 
               view === '/book-room' ? 'Secure your luxury stay' : 
               view === '/nearby' ? 'Discover local attractions' : 
               view === '/food-drinks' ? 'Gourmet dining and room service' : 'Enterprise Hospitality Management'}
            </p>
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
              <button onClick={() => setShowBookingModal(false)} aria-label="Close booking modal" className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold text-white mb-6">Book a Room</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="room-select" className="block text-sm text-slate-300 mb-1">Select Room</label>
                  <select id="room-select" required className="glass-input w-full bg-slate-950 text-white" value={bookingForm.room} onChange={e => setBookingForm({...bookingForm, room: e.target.value})}>
                    <option value="" className="bg-slate-950 text-white">-- Choose a Room --</option>
                    {availableRooms.length > 0 ? availableRooms.map(r => (
                      <option key={r.sys_id} value={r.sys_id} className="bg-slate-950 text-white">Room {r.room_number} ({r.room_type}) - ₹{r.price_per_night}/night</option>
                    )) : (
                      <>
                        <option value="std_room" className="bg-slate-950 text-white">Standard Room (Vizag View) - ₹3500/night</option>
                        <option value="deluxe_room" className="bg-slate-950 text-white">Deluxe Suite (Ocean Front) - ₹5500/night</option>
                        <option value="pres_room" className="bg-slate-950 text-white">Presidential Suite - ₹12000/night</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="check-in" className="block text-sm text-slate-300 mb-1">Check In</label>
                    <input id="check-in" type="date" required className="glass-input w-full" value={bookingForm.check_in} onChange={e => setBookingForm({...bookingForm, check_in: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="check-out" className="block text-sm text-slate-300 mb-1">Check Out</label>
                    <input id="check-out" type="date" required className="glass-input w-full" value={bookingForm.check_out} onChange={e => setBookingForm({...bookingForm, check_out: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-guests" className="block text-sm text-slate-300 mb-1">Guests</label>
                    <input id="booking-guests" type="number" min="1" max="5" required className="glass-input w-full" value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="block text-sm text-slate-300 mb-1">Phone Number</label>
                    <input id="booking-phone" type="tel" required className="glass-input w-full" placeholder="+91..." value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-requests" className="block text-sm text-slate-300 mb-1">Special Requests</label>
                  <textarea id="booking-requests" rows="2" className="glass-input w-full resize-none" placeholder="Any specific requirements?" value={bookingForm.special_requests} onChange={e => setBookingForm({...bookingForm, special_requests: e.target.value})}></textarea>
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
              <button onClick={() => setShowServiceModal(false)} aria-label="Close service modal" className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold text-white mb-6">Request Service</h3>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="service-type" className="block text-sm text-slate-300 mb-1">Service Type</label>
                    <select id="service-type" required className="glass-input w-full bg-slate-950 text-white" value={serviceForm.type} onChange={e => setServiceForm({...serviceForm, type: e.target.value})}>
                      <option value="cleaning" className="bg-slate-950 text-white">Cleaning</option>
                      <option value="maintenance" className="bg-slate-950 text-white">Maintenance</option>
                      <option value="ac" className="bg-slate-950 text-white">AC Repair</option>
                      <option value="water" className="bg-slate-950 text-white">Water Issue</option>
                      <option value="wifi" className="bg-slate-950 text-white">WiFi Issue</option>
                      <option value="noise" className="bg-slate-950 text-white">Noise Complaint</option>
                      <option value="temperature" className="bg-slate-950 text-white">Temperature</option>
                      <option value="other" className="bg-slate-950 text-white">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="service-priority" className="block text-sm text-slate-300 mb-1">Priority</label>
                    <select id="service-priority" required className="glass-input w-full bg-slate-950 text-white" value={serviceForm.priority} onChange={e => setServiceForm({...serviceForm, priority: e.target.value})}>
                      <option value="low" className="bg-slate-950 text-white">Low</option>
                      <option value="medium" className="bg-slate-950 text-white">Medium</option>
                      <option value="high" className="bg-slate-950 text-white">High</option>
                      <option value="urgent" className="bg-slate-950 text-white">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="service-desc" className="block text-sm text-slate-300 mb-1">Description</label>
                  <textarea id="service-desc" required rows="3" className="glass-input w-full resize-none" placeholder="Describe what you need..." value={serviceForm.desc} onChange={e => setServiceForm({...serviceForm, desc: e.target.value})}></textarea>
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
