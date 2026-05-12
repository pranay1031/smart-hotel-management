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

  signIn: async (email, password) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

    let assignedRole = 'Customer';
    const emailLower = email.toLowerCase();

    // Check against ENV credentials for Admin
    if (email === adminEmail && password === adminPass) {
      assignedRole = 'Admin';
    } else if (emailLower.includes('ram')) {
      assignedRole = 'Staff';
    } else if (emailLower.includes('krishna')) {
      assignedRole = 'Manager';
    } else if (emailLower.includes('sita')) {
      assignedRole = 'Receptionist';
    } else if (emailLower.includes('ravi')) {
      assignedRole = 'Staff';
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      set({ user: data.user, role: assignedRole });
      return data;
    } catch (err) {
      console.error("Auth error:", err.message);
      throw err; // Ensure the UI handles the error instead of falling back to a fake session
    }
  },

  resetPassword: async (email) => {
    try {
      await supabase.auth.resetPasswordForEmail(email);
    } catch (err) {
      console.warn("Password reset error:", err.message);
    }
  },

  signUp: async (email, password, role = 'Customer') => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      await servicenowAPI.post('/sys_user', {
        email: email,
        user_name: email.split('@')[0],
        title: role
      });

      set({ user: data.user, role });
      return data;
    } catch (err) {
      console.error("Sign up error:", err.message);
      throw err;
    }
  },

  signOut: async () => {
    set({ user: null, role: null });
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  }
}));
