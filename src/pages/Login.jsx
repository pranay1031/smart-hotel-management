import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, role);
        toast.success('Account created! Logging in...');
        navigate('/');
      } else {
        await signIn(email, password, role);
        toast.success(`Welcome back! Logged in as ${role}`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md pointer-events-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
              Smart Hotel
            </h1>
            <p className="text-slate-400">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Always show Role Selection to make testing easy */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Select Role to Test</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="glass-input w-full bg-slate-900"
              >
                <option value="Customer">Customer</option>
                <option value="Staff">Staff</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full mt-6"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}