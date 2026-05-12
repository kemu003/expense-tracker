import { useState, FormEvent } from 'react';
import { DollarSign, Eye, EyeOff, Loader2, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { signIn, signUp, demoLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'register') {
      // Validation
      if (!email.trim() || !password.trim() || !name.trim()) {
        setError('All fields are required (name, email, password).');
        setLoading(false);
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      console.log('📝 Submitting registration with:', { email: email.trim(), name: name.trim(), password: '***' });
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created! You are now logged in.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError('Invalid email or password.');
    }

    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setError('');
    setSuccess('');
    setDemoLoading(true);

    const { error } = await demoLogin();
    if (error) {
      setError(error);
    } else {
      setSuccess('Demo account loaded! Explore with sample data.');
    }

    setDemoLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient balls */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/50">
              <DollarSign size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SpendWise</h1>
          <p className="text-slate-300 text-lg">Track your expenses smartly</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 mb-8">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  mode === m
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative group">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 animate-in shake">
                <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 flex items-center gap-2 animate-in slide-in-from-bottom-3">
                <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-200">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo Login Section */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
              Want to see how SpendWise works?
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              {demoLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Zap size={18} />
              )}
              Try Demo
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
              Includes sample data • Changes reset on logout
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          Your financial data is encrypted and secure.
        </p>
      </div>
    </div>
  );
}
