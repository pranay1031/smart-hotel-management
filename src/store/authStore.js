import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { servicenowAPI } from '../lib/servicenow';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await get().fetchUserRole(session.user.email);
    } else {
      set({ user: null, role: null, loading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await get().fetchUserRole(session.user.email);
      } else {
        set({ user: null, role: null, loading: false });
      }
    });
  },

  fetchUserRole: async (email) => {
    try {
      set({ loading: true });
      const response = await servicenowAPI.get(`/sys_user`, {
        params: {
          sysparm_query: `email=${email}`,
          sysparm_limit: 1
        }
      });
      
      const snUser = response.data.result[0];
      // Default to Customer unless we have logic to identify admins.
      set({ 
        user: { email }, 
        role: snUser ? 'Customer' : 'Customer',
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching user role from ServiceNow:', error);
      set({ user: { email }, role: 'Customer', loading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signUp: async (email, password, role = 'Customer') => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    try {
      // Optional: Auto-create a sys_user entry if permissions allow
      await servicenowAPI.post('/sys_user', {
        email: email,
        user_name: email.split('@')[0],
      });
    } catch (snError) {
      console.error('Error syncing user to ServiceNow:', snError);
    }
    
    return data;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  }
}));
