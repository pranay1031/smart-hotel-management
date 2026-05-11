import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Pizza, Wine, Cloud, Sun, CloudRain } from 'lucide-react';
import { servicenowAPI } from '../lib/servicenow';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function FoodAndDrinks() {
  const [weather, setWeather] = useState('sunny');
  const [temp, setTemp] = useState('--');
  const { user } = useAuthStore();
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true');
        const data = await res.json();
        const code = data.current_weather.weathercode;
        setTemp(data.current_weather.temperature);
        let w = 'sunny';
        if (code > 0 && code < 4) w = 'cloudy';
        if (code >= 51 && code < 70) w = 'rainy';
        setWeather(w);
      } catch (e) {
        console.error('Weather fetch error', e);
      }
    };
    fetchWeather();
  }, []);
  
  const handleOrder = async (item) => {
    setIsOrdering(true);
    try {
      await servicenowAPI.post('/x_1939650_smart_0_food_orders', {
        u_guest_name: user?.email.split('@')[0] || 'Guest',
        u_menu_items: item.name,
        u_order_total: item.price
      });
      toast.success(`Successfully ordered ${item.name}!`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again later.');
    } finally {
      setIsOrdering(false);
    }
  };

  const menuCategories = [
    { id: 'all', name: 'All Items', icon: Coffee },
    { id: 'food', name: 'Food', icon: Pizza },
    { id: 'drinks', name: 'Drinks', icon: Wine },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const menuItems = [
    { id: 1, name: 'Masala Chai', category: 'drinks', price: 50, tags: ['rainy', 'cloudy'], image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Cold Coffee', category: 'drinks', price: 150, tags: ['sunny'], image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Paneer Tikka', category: 'food', price: 350, tags: ['sunny', 'cloudy'], image: 'https://images.unsplash.com/photo-1599487488020-0a84d4b1a415?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Butter Chicken', category: 'food', price: 450, tags: ['rainy'], image: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Veg Biryani', category: 'food', price: 300, tags: ['sunny', 'cloudy', 'rainy'], image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Punjabi Samosa', category: 'food', price: 80, tags: ['rainy', 'cloudy'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
  ];

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'all' || item.category === activeCategory)
  );

  const WeatherIcon = weather === 'sunny' ? Sun : weather === 'rainy' ? CloudRain : Cloud;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Food & Drinks</h2>
          <p className="text-slate-400">Discover our authentic Indian culinary delights.</p>
        </div>
        
        {/* Weather Aware Widget */}
        <div className="glass-panel p-4 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <WeatherIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Live Weather (New Delhi)</p>
            <p className="text-lg font-bold text-white capitalize">{weather} & {temp}°C</p>
          </div>
        </div>
      </div>

      {/* Recommended Section (Weather Based) */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
            Perfect for this weather
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.filter(item => item.tags.includes(weather)).slice(0, 3).map((item, idx) => (
            <motion.div
              key={`rec-${item.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              <div className="h-40 w-full overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  <p className="text-indigo-400 font-semibold">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => handleOrder(item)}
                  disabled={isOrdering}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Menu */}
      <div className="pt-8 border-t border-white/10">
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {menuCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel rounded-2xl overflow-hidden flex flex-row h-24"
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
              <div className="p-3 flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-white text-sm">{item.name}</h4>
                <p className="text-indigo-400 font-semibold text-sm mt-1">₹{item.price}</p>
              </div>
              <div className="p-3 flex items-center justify-center border-l border-white/5">
                <button 
                  onClick={() => handleOrder(item)}
                  disabled={isOrdering}
                  className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
