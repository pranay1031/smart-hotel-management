import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Pizza, Wine, Cloud, Sun, CloudRain, ShoppingBag, X, Clock, Star, Loader } from 'lucide-react';
import { servicenowAPI } from '../lib/servicenow';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function FoodAndDrinks() {
  const [weather, setWeather] = useState('sunny');
  const [temp, setTemp] = useState('--');
  const { user } = useAuthStore();
  
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.6868&longitude=83.2185&current_weather=true'); // Vizag coords
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

  const addToCart = (item) => {
    setCart([...cart, item]);
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    
    const itemCounts = cart.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});
    
    const itemString = Object.entries(itemCounts).map(([name, count]) => `${count}x ${name}`).join(', ');

    try {
      await servicenowAPI.post('/x_1939650_smart_0_food_orders', {
        u_guest_name: user?.email.split('@')[0] || 'Guest',
        u_menu_items: itemString,
        u_order_total: cartTotal,
        u_room_number: '101', // Should ideally come from booking
        u_status: 'ordered',
        u_special_instructions: 'Handle with care',
        u_created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      toast.success(`Order placed successfully for ₹${cartTotal}!`);
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again later.');
    } finally {
      setIsOrdering(false);
    }
  };

  const menuCategories = [
    { id: 'all', name: 'All Items', icon: Coffee },
    { id: 'south', name: 'South Indian', icon: Pizza },
    { id: 'north', name: 'North Indian', icon: Pizza },
    { id: 'continental', name: 'Continental', icon: Pizza },
    { id: 'drinks', name: 'Drinks', icon: Wine },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const menuItems = [
    // South Indian
    { id: 1, name: 'Vizag Pesarattu', category: 'south', price: 120, tags: ['sunny', 'cloudy'], image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=40', rating: 4.8 },
    { id: 2, name: 'Ghee Roast Dosa', category: 'south', price: 150, tags: ['sunny'], image: 'https://images.unsplash.com/photo-1668236543090-52ee0d3917ba?auto=format&fit=crop&w=400&q=40', rating: 4.9 },
    { id: 3, name: 'Idli Sambar', category: 'south', price: 90, tags: ['rainy'], image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=40', rating: 4.7 },
    
    // North Indian
    { id: 4, name: 'Butter Chicken', category: 'north', price: 450, tags: ['rainy', 'cloudy'], image: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&w=400&q=40', rating: 4.9 },
    { id: 5, name: 'Paneer Butter Masala', category: 'north', price: 380, tags: ['sunny', 'cloudy'], image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=40', rating: 4.8 },
    { id: 6, name: 'Dal Makhani', category: 'north', price: 320, tags: ['cloudy'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=40', rating: 4.6 },
    
    // Continental
    { id: 7, name: 'Grilled Salmon', category: 'continental', price: 750, tags: ['sunny'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=40', rating: 4.9 },
    { id: 8, name: 'Wild Mushroom Risotto', category: 'continental', price: 550, tags: ['cloudy', 'rainy'], image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=400&q=40', rating: 4.7 },
    
    // Drinks
    { id: 9, name: 'Vizag Special Lassi', category: 'drinks', price: 110, tags: ['sunny'], image: 'https://images.unsplash.com/photo-1571006682858-a5c715184c70?auto=format&fit=crop&w=400&q=40', rating: 4.8 },
    { id: 10, name: 'Masala Chai', category: 'drinks', price: 60, tags: ['rainy', 'cloudy'], image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&w=400&q=40', rating: 4.9 },
    { id: 11, name: 'Fresh Watermelon Juice', category: 'drinks', price: 140, tags: ['sunny'], image: 'https://images.unsplash.com/photo-1562051036-e0eea191d42f?auto=format&fit=crop&w=400&q=40', rating: 4.7 },
    { id: 12, name: 'Signature Blue Margarita', category: 'drinks', price: 650, tags: ['sunny', 'cloudy'], image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=40', rating: 4.9 },
  ];

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'all' || item.category === activeCategory)
  );

  const WeatherIcon = weather === 'sunny' ? Sun : weather === 'rainy' ? CloudRain : Cloud;

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gastronomy</h2>
          <p className="text-slate-400">Curated culinary experiences from Vizag and beyond.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowCart(true)}
            className="glass-button !py-3 flex items-center bg-indigo-500 hover:bg-indigo-600 border-none relative shadow-lg shadow-indigo-500/20"
          >
            <ShoppingBag size={20} className="mr-2" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                {cart.length}
              </span>
            )}
          </button>

          <div className="glass-panel p-3 rounded-2xl flex items-center space-x-3 border border-white/10">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <WeatherIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Vizag Weather</p>
              <p className="text-sm font-bold text-white capitalize">{weather} & {temp}°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
            Chef's Weather Recommendations
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.filter(item => item.tags.includes(weather)).slice(0, 3).map((item, idx) => (
            <motion.div
              key={`rec-${item.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card overflow-hidden group border border-white/5"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  width="600"
                  height="192"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center text-xs text-amber-400 font-bold">
                  <Star size={12} className="mr-1 fill-amber-400" /> {item.rating}
                </div>
              </div>
              <div className="p-6 flex justify-between items-center bg-slate-900/40">
                <div>
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  <p className="text-emerald-400 font-bold">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white w-10 h-10 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
                >
                  <span className="text-2xl font-bold">+</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Menu */}
      <div className="pt-8 border-t border-white/10">
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
          {menuCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-3 px-8 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 font-bold ${
                  activeCategory === cat.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30' 
                    : 'bg-indigo-500/5 text-slate-400 hover:bg-indigo-500/10 border border-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel rounded-3xl overflow-hidden flex flex-row h-32 relative border border-white/5 group"
            >
              <div className="w-32 h-full overflow-hidden">
                <img src={item.image} alt={item.name} width="128" height="128" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-center pr-14">
                <h4 className="font-bold text-white text-lg leading-tight mb-1">{item.name}</h4>
                <div className="flex items-center text-xs text-slate-400 mb-2">
                  <Star size={10} className="mr-1 fill-amber-400 text-amber-400" /> {item.rating}
                  <span className="mx-2">|</span>
                  <Clock size={10} className="mr-1" /> 20-30 min
                </div>
                <p className="text-emerald-400 font-bold text-lg">₹{item.price}</p>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="absolute right-0 top-0 bottom-0 w-14 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white flex items-center justify-center transition-all border-l border-white/5 font-bold text-3xl"
              >
                +
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCart(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-md bg-slate-900 border-l border-white/10 h-full flex flex-col shadow-2xl z-10"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-3xl font-bold text-white flex items-center">
                  <ShoppingBag className="mr-4 text-indigo-400" /> Your Order
                </h3>
                <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-white p-3 bg-white/5 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center text-slate-500 mt-32 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag size={48} className="opacity-20 text-white" />
                    </div>
                    <p className="text-lg">Your cart is empty.</p>
                    <p className="text-sm mt-2">Discover our delicious menu items!</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group transition-all hover:bg-white/10">
                      <div>
                        <p className="font-bold text-white text-lg">{item.name}</p>
                        <p className="text-sm text-indigo-400 font-bold">₹{item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="text-rose-400 hover:text-white text-sm font-bold bg-rose-500/10 hover:bg-rose-500 px-4 py-2 rounded-xl transition-all">Remove</button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 border-t border-white/10 bg-slate-800/80 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-slate-300 font-bold text-lg uppercase tracking-widest">Total Amount</span>
                  <span className="text-3xl font-black text-white">₹{cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckout} 
                  disabled={cart.length === 0 || isOrdering}
                  className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-30 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-500/40 text-xl flex justify-center items-center uppercase tracking-widest"
                >
                  {isOrdering ? <Loader className="animate-spin mr-3" /> : 'Confirm Order'}
                </button>
                <p className="text-center text-slate-500 text-xs mt-6 uppercase tracking-widest">Charges will be added to your room bill</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
