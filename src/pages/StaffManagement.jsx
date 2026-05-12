import { useState, useEffect } from 'react';
import { servicenowAPI } from '../lib/servicenow';
import { motion } from 'framer-motion';
import { Users, Search, Filter, ShieldCheck, Mail, User, Loader, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      // Query for users with staff/admin titles
      const response = await servicenowAPI.get('/sys_user', {
        params: {
          sysparm_query: 'title!=Customer^ORtitle=NULL', // Show everyone except known customers
          sysparm_limit: 50
        }
      });
      setStaff(response.data.result || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && staff.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ShieldCheck className="mr-3 text-indigo-400" /> Staff Directory
          </h2>
          <p className="text-slate-400">Manage internal credentials and system access roles.</p>
        </div>
        <button 
          onClick={fetchStaff}
          className="glass-panel p-3 rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center text-sm text-slate-300"
        >
          <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="glass-panel p-6 border border-white/5">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or username..." 
              className="glass-input w-full pl-12 bg-slate-950/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="glass-panel px-6 py-3 border border-white/10 flex items-center space-x-2 text-slate-400 hover:text-white transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStaff.map((person, idx) => (
                <motion.tr 
                  key={person.sys_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                        {person.name ? person.name[0] : person.user_name ? person.user_name[0] : '?'}
                      </div>
                      <div>
                        <p className="font-bold text-white">{person.name || 'Unknown User'}</p>
                        <p className="text-xs text-slate-500 flex items-center">
                          <Mail size={10} className="mr-1" /> {person.email || 'no-email@hotel.com'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5 w-fit group-hover:border-indigo-500/30 transition-all">
                      <User size={14} className="text-indigo-400" />
                      <span className="text-sm font-mono text-slate-300">{person.user_name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      person.title === 'Admin' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                      person.title === 'Manager' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                      'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    }`}>
                      {person.title || 'Staff'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-400">{person.sys_updated_on || 'Long ago'}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="flex items-center justify-end text-[10px] font-bold text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                      ACTIVE
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
