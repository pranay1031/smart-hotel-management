import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

import { lazy, Suspense } from 'react';
import { Loader } from 'lucide-react';

// Components
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import Chatbot from './components/Chatbot';

// Lazy Pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FoodAndDrinks = lazy(() => import('./pages/FoodAndDrinks'));
const NearbyPlaces = lazy(() => import('./pages/NearbyPlaces'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-950">
    <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />
          
          <Route element={<Layout />}>
            <Route path="/" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/book-room" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/my-bookings" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/food-drinks" element={
              <PageTransition>
                <FoodAndDrinks />
              </PageTransition>
            } />
            <Route path="/services" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/nearby" element={
              <PageTransition>
                <NearbyPlaces />
              </PageTransition>
            } />
            <Route path="/notifications" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/payments" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/chat" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/feedback" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/settings" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Chatbot />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      />
    </BrowserRouter>
  );
}

export default App;