import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Components
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import Chatbot from './components/Chatbot';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FoodAndDrinks from './pages/FoodAndDrinks';
import NearbyPlaces from './pages/NearbyPlaces';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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
          <Route path="/food-drinks" element={
            <PageTransition>
              <FoodAndDrinks />
            </PageTransition>
          } />
          <Route path="/nearby" element={
            <PageTransition>
              <NearbyPlaces />
            </PageTransition>
          } />
        </Route>
      </Routes>
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