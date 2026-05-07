import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validateEmail';
import { getPasswordErrors } from '../utils/validatePassword';
import { Footer } from '../components/Footer';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!isLogin && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    const passwordErrors = getPasswordErrors(password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      if (isLogin) {
        await login(email, password, rememberMe);
      } else {
        await register(name, email, password);
      }
      // Small delay to ensure token is saved to localStorage
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/app');
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.errors) {
        // Field-level validation errors from backend
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: { field: string; message: string }) => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      } else if (error.response?.data?.error) {
        // General error message
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Authentication failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex">
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1574962325789-fbe9cbcfacf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Community sharing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-accent/20" />
          </div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative z-10 text-white">
            <h1 className="text-5xl font-bold mb-6">Welcome to RentIt</h1>
            <p className="text-xl opacity-90 mb-8">
              Your marketplace for renting and sharing items with your community.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
                  ✓
                </div>
                <span className="text-lg">Thousands of items available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
                  ✓
                </div>
                <span className="text-lg">Earn money from unused items</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
                  ✓
                </div>
                <span className="text-lg">Secure and trusted platform</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex gap-2 mb-8 bg-muted p-1 rounded-lg">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                }}
                className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                  isLogin ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                }}
                className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                  !isLogin ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                  {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-sm">Remember Me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              {errors.general && <p className="text-destructive text-sm">{errors.general}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30 mt-6 font-medium"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
