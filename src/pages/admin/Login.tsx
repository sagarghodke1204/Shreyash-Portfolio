import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, ShieldAlert, KeyRound, Mail } from 'lucide-react';
import { api } from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is already active
    if (api.isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await api.login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center px-4 relative font-mono">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-cyber-surface/40 border border-cyber-border p-6 sm:p-8 rounded-lg relative overflow-hidden tech-border tech-border-top-left tech-border-bottom-right z-10 shadow-2xl">
        
        {/* Header Icon */}
        <div className="w-12 h-12 bg-cyber-teal/10 border border-cyber-teal/40 rounded flex items-center justify-center mx-auto mb-6">
          <Terminal className="w-6 h-6 text-cyber-teal" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-extrabold text-white tracking-wider">SECURE_ADMIN_LOGIN</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            [ AUTHORIZED_OPERATORS_ONLY ]
          </p>
        </div>

        {errorMsg && (
          <div className="bg-cyber-orange/10 border border-cyber-orange/45 text-cyber-orange text-xs p-3 rounded mb-6 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg.toUpperCase()}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs text-slate-400 uppercase tracking-wider">
              Operator Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@system.com"
                className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded pl-10 pr-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs text-slate-400 uppercase tracking-wider">
              Operator Cipher Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded pl-10 pr-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyber-teal text-cyber-bg font-bold font-mono rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? '[ VERIFYING_CIPHER_KEY... ]' : '[ INITIALIZE_AUTH_SESSION ]'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-cyber-border/30 text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-cyber-teal transition-colors"
          >
            &lt;&lt; Return to Public Sector
          </Link>
        </div>
      </div>
    </div>
  );
}
