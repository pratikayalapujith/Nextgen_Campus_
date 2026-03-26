import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ 
      backgroundImage: "url('/bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(215, 65%, 8%, 0.8) 0%, hsl(215, 65%, 10%, 0.6) 50%, hsl(215, 65%, 8%, 0.85) 100%)', backdropFilter: 'blur(3px)' }} />

      {/* Decorative orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 float-slow z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(215, 90%, 50%), transparent)', top: '-10%', left: '5%' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 float-slower z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(42, 95%, 55%), transparent)', bottom: '-5%', right: '5%' }} />

      {/* Left side — branding and text */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-10 z-10">
        <div className="max-w-xl">
          {/* Logo + branding */}
          <div className="flex items-center gap-4 mb-10">
            <img src="/logo.png" alt="NextGen Campus" className="w-16 h-16 object-contain rounded-2xl pulse-glow shadow-lg bg-white/10 p-1" style={{ backdropFilter: 'blur(10px)' }} />
            <div>
              <h3 className="font-heading font-extrabold text-3xl tracking-tight text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>NextGen Campus</h3>
              <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: 'hsl(42, 95%, 55%)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Since 2024</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="font-heading font-extrabold text-5xl leading-tight tracking-tight mb-5 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Smart Campus.<br />
            <span style={{ color: 'hsl(42, 95%, 55%)' }}>Smarter Management.</span>
          </h2>
          <p className="text-lg leading-relaxed mb-10 text-white/80" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
            A comprehensive platform for managing students, faculty, timetables, attendance, and campus resources — all in one seamless experience.
          </p>

          {/* Stats bar */}
          <div className="flex gap-10 p-6 rounded-2xl bg-black/30 border border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
            {[{ label: 'Students', value: '500+' }, { label: 'Faculty', value: '50+' }, { label: 'Departments', value: '5' }].map(s => (
              <div key={s.label}>
                <p className="font-heading font-extrabold text-3xl text-white">{s.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-1 text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div
          className={`w-full max-w-md rounded-2xl p-8 ${shake ? 'shake' : ''}`}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            animation: 'modalSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Logo - mobile only */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/logo.png" alt="NextGen Campus" className="w-12 h-12 object-contain rounded-xl shadow-md p-1 bg-white/10 border border-white/20" />
            <div>
              <h1 className="font-heading font-extrabold text-xl text-white">NextGen Campus</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Since 2024</p>
            </div>
          </div>

          <h2 className="font-heading font-extrabold text-3xl tracking-tight mb-2 text-white">Welcome Back 👋</h2>
          <p className="text-sm mb-7 text-white/70">Sign in to access your campus portal</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: 'hsl(0 80% 55% / 0.08)', color: 'hsl(0, 80%, 50%)' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/80">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/80">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl p-3.5 pr-11 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-royal w-full py-4 rounded-xl text-base font-bold disabled:opacity-50 mt-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all">
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          <p className="text-center text-sm mt-8 pb-2 text-white/70">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
