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
      set({ 
        user: { email }, 
        role: snUser ? (snUser.title || 'Customer') : 'Customer',
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching user role from ServiceNow:', error);
      // Fallback local mock if ServiceNow fails
      set({ user: { email }, role: 'Customer', loading: false });
    }
  },

  signIn: async (email, password, roleOverride) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // If a role was selected from the dropdown, force it for testing purposes
      if (roleOverride) {
        set({ user: data.user, role: roleOverride });
      } else {
        await useAuthStore.getState().fetchUserRole(email);
      }
      return data;
    } catch (err) {
      console.warn("Supabase auth failed, using mock auth session for demo purposes.");
      set({ user: { email }, role: roleOverride || 'Customer' });
      return { user: { email } };
    }
  },

  signUp: async (email, password, role = 'Customer') => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase auth failed, using mock auth session for demo purposes.");
    }
    
    try {
      await servicenowAPI.post('/sys_user', {
        email: email,
        user_name: email.split('@')[0],
        title: role
      });
    } catch (snError) {
      console.error('Error syncing user to ServiceNow:', snError);
    }
    
    set({ user: { email }, role });
    return { user: { email } };
  },

  signOut: async () => {
    set({ user: null, role: null });
    try {
      await supabase.auth.signOut();
    } catch (e) {}
  }
}));
