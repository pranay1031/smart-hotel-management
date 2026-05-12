import { useState, useEffect, useCallback } from 'react';
import { servicenowAPI } from '../../lib/servicenow';
import { motion } from 'framer-motion';
import { Loader, CheckSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [updating, setUpdating] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, incRes] = await Promise.all([
        servicenowAPI.get('/x_1939650_smart_0_staff_tasks'),
        servicenowAPI.get('/x_1939650_smart_0_guest_incidents')
      ]);
      setTasks(tasksRes.data.result || []);
      setIncidents(incRes.data.result || []);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const updateTaskStatus = async (sys_id, newStatus) => {
    setUpdating(sys_id);
    try {
      await servicenowAPI.put(`/x_1939650_smart_0_staff_tasks/${sys_id}`, { status: newStatus });
      toast.success('Task status updated');
      fetchData();
    } catch (error) {
      console.error('Task update error:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdating(null);
    }
  };

  const updateIncidentStatus = async (sys_id, newStatus) => {
    setUpdating(sys_id);
    try {
      await servicenowAPI.put(`/x_1939650_smart_0_guest_incidents/${sys_id}`, { status: newStatus });
      toast.success('Incident status updated');
      fetchData();
    } catch (error) {
      console.error('Incident update error:', error);
      toast.error('Failed to update incident');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Staff Home</h2>
        <p className="text-slate-400">View and resolve your assigned tasks and guest requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 h-[500px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold text-white mb-6 sticky top-0 bg-slate-900/80 backdrop-blur pb-2 z-10">Assigned Hotel Tasks</h3>
          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((t) => (
              <div key={t.sys_id} className="flex flex-col space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><CheckSquare size={20} /></div>
                    <div>
                      <p className="font-bold text-white">{t.task_type} <span className="text-sm font-normal text-slate-400">- Room {t.room_number?.display_value || t.room_number || 'N/A'}</span></p>
                      <p className="text-xs text-slate-400">{t.task_description || 'No description provided'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md capitalize font-bold ${t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {t.status}
                  </span>
                </div>
                {t.status !== 'Completed' && (
                  <div className="flex justify-end space-x-2 border-t border-white/10 pt-3">
                    <button 
                      onClick={() => updateTaskStatus(t.sys_id, 'In Progress')} 
                      disabled={updating === t.sys_id}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-xs font-bold transition-colors"
                    >
                      Mark In Progress
                    </button>
                    <button 
                      onClick={() => updateTaskStatus(t.sys_id, 'Completed')} 
                      disabled={updating === t.sys_id}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 text-xs font-bold transition-colors flex items-center"
                    >
                      <CheckCircle2 size={14} className="mr-1"/> Complete
                    </button>
                  </div>
                )}
              </div>
            )) : <p className="text-slate-500 text-center py-10">No tasks assigned.</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 h-[500px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold text-white mb-6 sticky top-0 bg-slate-900/80 backdrop-blur pb-2 z-10 flex items-center">
            Guest Incidents & Requests <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{incidents.filter(i => i.status !== 'Resolved').length}</span>
          </h3>
          <div className="space-y-4">
            {incidents.length > 0 ? incidents.map((inc) => (
              <div key={inc.sys_id} className={`flex flex-col space-y-3 p-4 rounded-xl border transition-colors ${inc.status === 'Resolved' ? 'bg-white/5 border-white/10' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white capitalize">{inc.complaint_type} <span className="text-sm font-normal text-slate-400">- Room {inc.room_number || 'N/A'}</span></p>
                      <p className="text-xs text-slate-300 mt-1">{inc.description}</p>
                      <p className="text-xs text-slate-500 mt-1">Guest: {inc.guest_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md capitalize font-bold ${inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {inc.status || 'Pending'}
                  </span>
                </div>
                {inc.status !== 'Resolved' && (
                  <div className="flex justify-end space-x-2 border-t border-white/5 pt-3">
                    <button 
                      onClick={() => updateIncidentStatus(inc.sys_id, 'In Progress')} 
                      disabled={updating === inc.sys_id}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 text-xs font-bold transition-colors"
                    >
                      Investigate
                    </button>
                    <button 
                      onClick={() => updateIncidentStatus(inc.sys_id, 'Resolved')} 
                      disabled={updating === inc.sys_id}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 text-xs font-bold transition-colors flex items-center"
                    >
                      <CheckCircle2 size={14} className="mr-1"/> Resolve
                    </button>
                  </div>
                )}
              </div>
            )) : <p className="text-slate-500 text-center py-10">No active guest requests.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
