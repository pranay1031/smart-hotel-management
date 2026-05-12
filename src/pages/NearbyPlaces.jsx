import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Star, Expand } from 'lucide-react';

export default function NearbyPlaces() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const places = [
    { 
      name: "RK Beach", 
      dist: "0.1 km", 
      time: "2 min walk", 
      category: "Nature", 
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=40", 
      rating: 4.8,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3800.2785006323447!2d83.31512167576595!3d17.71076298323862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431489e5306d%3A0x2d1746f3a749365!2sRamakrishna%20Mission%20Beach!5e0!3m2!1sen!2sin!4v1715462000000!5m2!1sen!2sin"
    },
    { 
      name: "INS Kursura Submarine", 
      dist: "1.2 km", 
      time: "4 min drive", 
      category: "Museum", 
      image: "https://images.unsplash.com/photo-1550293149-1e7d0843516c?auto=format&fit=crop&w=400&q=40", 
      rating: 4.9,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3800.0!2d83.3!3d17.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943156942c73d%3A0xe76464817a3a0c70!2sINS%20Kursura%20Submarine%20Museum!5e0!3m2!1sen!2sin!4v1715462000001!5m2!1sen!2sin"
    },
    { 
      name: "VUDA Park", 
      dist: "2.5 km", 
      time: "7 min drive", 
      category: "Park", 
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=40", 
      rating: 4.5,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3800.1!2d83.32!3d17.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943166942c73d%3A0xe76464817a3a0c70!2sVuda%20Park!5e0!3m2!1sen!2sin!4v1715462000002!5m2!1sen!2sin"
    },
    { 
      name: "Kailasagiri", 
      dist: "6.8 km", 
      time: "15 min drive", 
      category: "Attraction", 
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=40", 
      rating: 4.7,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3800.5!2d83.35!3d17.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943376942c73d%3A0xe76464817a3a0c70!2sKailasagiri!5e0!3m2!1sen!2sin!4v1715462000003!5m2!1sen!2sin"
    },
    { 
      name: "Rushikonda Beach", 
      dist: "11.2 km", 
      time: "25 min drive", 
      category: "Beach", 
      image: "https://images.unsplash.com/photo-1506929199175-609ec3ee8710?auto=format&fit=crop&w=400&q=40", 
      rating: 4.9,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3801.0!2d83.38!3d17.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943486942c73d%3A0xe76464817a3a0c70!2sRushikonda%20Beach!5e0!3m2!1sen!2sin!4v1715462000004!5m2!1sen!2sin"
    }
  ];

  const currentMapUrl = selectedPlace ? selectedPlace.mapUrl : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15201.114002529377!2d83.317422!3d17.710763!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943399086e107%3A0xe54d45543c7b395d!2sNovotel%20Visakhapatnam%20Varun%20Beach!5e0!3m2!1sen!2sin!4v1715461234567!5m2!1sen!2sin";

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Explore Vizag</h2>
          <p className="text-slate-400">Discover attractions near <span className="text-indigo-400 font-bold">Novotel Varun Beach</span>.</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center space-x-3 border border-white/5">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <Navigation className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Base Location</p>
            <p className="text-xs text-white font-bold">Beach Road, Vizag</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          key={currentMapUrl}
          className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden relative min-h-[500px] border border-white/10 shadow-2xl"
        >
          <iframe 
            src={currentMapUrl} 
            width="100%" 
            height="100%" 
            title={`Map showing ${selectedPlace ? selectedPlace.name : 'Novotel Varun Beach'}`}
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 max-w-sm pointer-events-auto">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{selectedPlace ? selectedPlace.name : 'Novotel Varun Beach'}</h4>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{selectedPlace ? selectedPlace.category : 'Current Location'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedPlace 
                  ? `Located ${selectedPlace.dist} away. Approximately ${selectedPlace.time} from Novotel.`
                  : "You are currently staying at the premier destination on the Vizag coastline."}
              </p>
            </div>
            
            <button 
              aria-label="Expand map view"
              className="glass-panel p-3 rounded-full border border-white/10 pointer-events-auto hover:bg-white/10 transition-colors"
            >
              <Expand className="text-white" size={20} />
            </button>
          </div>
        </motion.div>

        {/* Attractions List */}
        <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {places.map((place, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              onClick={() => setSelectedPlace(place)}
              className={`glass-card p-4 flex items-center space-x-4 cursor-pointer border transition-all ${
                selectedPlace?.name === place.name ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={place.image} alt={place.name} width="80" height="80" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">{place.name}</h4>
                  <div className="flex items-center text-amber-400 text-[10px] font-bold">
                    <Star size={8} className="mr-1 fill-amber-400" /> {place.rating}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-tighter">{place.category}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center"><MapPin size={10} className="mr-1 text-rose-400" /> {place.dist}</span>
                  <span className="flex items-center"><Clock size={10} className="mr-1 text-emerald-400" /> {place.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
