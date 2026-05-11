import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Home, Coffee, Map, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout() {
  const { user, role, loading, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [time, setTime] = useState('');
  const [weather, setWeather] = useState({ temp: '--', condition: 'Fetching...' });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Clock setup
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      }).format(now);
      setTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Weather setup (New Delhi)
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true');
        const data = await res.json();
        const code = data.current_weather.weathercode;
        let condition = 'Clear';
        if (code > 0 && code < 4) condition = 'Cloudy';
        if (code >= 45 && code < 50) condition = 'Foggy';
        if (code >= 51 && code < 70) condition = 'Rainy';
        if (code >= 71) condition = 'Snow';
        
        setWeather({
          temp: data.current_weather.temperature,
          condition
        });
      } catch (err) {
        console.error('Failed to fetch weather', err);
        setWeather({ temp: '--', condition: 'Offline' });
      }
    };
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000); // 10 mins

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Food & Drinks', path: '/food-drinks', icon: Coffee },
    { name: 'Nearby Places', path: '/nearby', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass-panel border-r border-white/10 p-6 flex flex-col hidden md:flex z-10"
      >
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
            SH
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Smart Hotel
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-400' : ''} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="mb-4 px-2 text-center bg-black/20 rounded-xl py-3 border border-white/5 shadow-inner">
            <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-1 flex items-center justify-center">
              <Map size={12} className="mr-1" /> New Delhi
            </p>
            <p className="text-sm font-bold text-white mb-1">{time}</p>
            <p className="text-xs text-slate-400">{weather.temp}°C | {weather.condition}</p>
          </div>
          <div className="mb-4 px-2">
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mt-1">{role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-x-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="p-8 h-full relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
