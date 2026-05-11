import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

export default function NearbyPlaces() {
  const places = [
    { id: 1, name: 'Oceanarium', distance: '1.2 km', type: 'Attraction', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'City Center Mall', distance: '2.5 km', type: 'Shopping', image: 'https://images.unsplash.com/photo-1519567241046-7f61c60f2ee8?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Sunset Beach', distance: '0.5 km', type: 'Nature', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Historic Museum', distance: '3.0 km', type: 'Culture', image: 'https://images.unsplash.com/photo-1518998053401-a4149019a8f2?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Nearby Places</h2>
        <p className="text-slate-400">Explore attractions around the hotel.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Map View */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden relative min-h-[400px]"
        >
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-0" />
            <div className="text-center z-10">
              <MapPin className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">Interactive Map</h3>
              <p className="text-slate-400">Map integration goes here.</p>
            </div>
            
            {/* Mock map markers */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          </div>
        </motion.div>

        {/* Places List */}
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {places.map((place, idx) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              <div className="h-32 w-full overflow-hidden">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-lg">{place.name}</h4>
                  <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">
                    {place.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span className="flex items-center"><MapPin size={14} className="mr-1"/> {place.distance}</span>
                  <button className="text-indigo-400 hover:text-white flex items-center transition-colors">
                    <Navigation size={14} className="mr-1"/> Directions
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
