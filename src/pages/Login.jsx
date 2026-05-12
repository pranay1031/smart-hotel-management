import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

function AbstractShapes() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[-3, 1, -5]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshDistortMaterial color="#818cf8" speed={2} distort={0.2} roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[3, -2, -3]}>
          <octahedronGeometry args={[1.5]} />
          <MeshDistortMaterial color="#c084fc" speed={1} distort={0.4} roughness={0.1} metalness={0.5} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={1} floatIntensity={3}>
        <mesh position={[0, 3, -8]}>
          <sphereGeometry args={[2, 64, 64]} />
          <MeshDistortMaterial color="#38bdf8" speed={3} distort={0.3} roughness={0.3} metalness={0.9} />
        </mesh>
      </Float>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <AbstractShapes />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function Login() {
  const [isGuestPortal, setIsGuestPortal] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        toast.success('Password reset link sent to your email!');
        setIsForgotPassword(false);
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, 'Customer');
        toast.success('Account created! Logging in...');
        navigate('/');
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setLoading(true);
    try {
      await signIn(demoEmail, 'aditya@123');
      toast.success('Quick login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md pointer-events-auto shadow-2xl shadow-indigo-500/20"
        >
          {/* Top Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-8 border border-white/10">
            <button 
              onClick={() => { setIsGuestPortal(true); setIsForgotPassword(false); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${isGuestPortal ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Guest Access
            </button>
            <button 
              onClick={() => { setIsGuestPortal(false); setIsSignUp(false); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!isGuestPortal ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Staff Portal
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
              Smart Hotel
            </h1>
            <p className="text-slate-400">
              {isGuestPortal 
                ? (isSignUp ? 'Create a guest account' : 'Sign in to your account') 
                : (isForgotPassword ? 'Reset your password' : 'Sign in to your staff account')}
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={isGuestPortal ? handleGuestSubmit : handleStaffSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full"
                placeholder="you@example.com"
                required
              />
            </div>
            
            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  {!isGuestPortal && !isSignUp && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-indigo-400 hover:text-indigo-300">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 font-bold tracking-wide"
            >
              {loading 
                ? 'Processing...' 
                : (isGuestPortal 
                    ? (isSignUp ? 'Sign Up' : 'Sign In') 
                    : (isForgotPassword ? 'Send Reset Link' : 'Secure Login'))}
            </button>
          </form>

          {/* Toggles below form */}
          <div className="mt-4 text-center">
            {!isGuestPortal && isForgotPassword && (
              <button onClick={() => setIsForgotPassword(false)} className="text-sm text-slate-400 hover:text-white transition-colors">
                Back to Sign In
              </button>
            )}
            {isGuestPortal && (
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            )}
          </div>

          {!isForgotPassword && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-500 text-center uppercase tracking-wider font-bold mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button type="button" onClick={() => handleQuickLogin('guest@smarthotel.com')} className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400 transition-colors md:col-span-3">
                  Guest
                </button>
                <button type="button" onClick={() => handleQuickLogin('ramu@smarthotel.com')} className="px-3 py-2 bg-white/5 hover:bg-indigo-500/20 border border-white/5 rounded-lg text-xs font-semibold text-slate-300 transition-colors">
                  Admin
                </button>
                <button type="button" onClick={() => handleQuickLogin('krishna@smarthotel.com')} className="px-3 py-2 bg-white/5 hover:bg-blue-500/20 border border-white/5 rounded-lg text-xs font-semibold text-slate-300 transition-colors">
                  Manager
                </button>
                <button type="button" onClick={() => handleQuickLogin('sita@smarthotel.com')} className="px-3 py-2 bg-white/5 hover:bg-purple-500/20 border border-white/5 rounded-lg text-xs font-semibold text-slate-300 transition-colors">
                  Reception
                </button>
                <button type="button" onClick={() => handleQuickLogin('ravi@smarthotel.com')} className="px-3 py-2 bg-white/5 hover:bg-emerald-500/20 border border-white/5 rounded-lg text-xs font-semibold text-slate-300 transition-colors">
                  Staff
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}