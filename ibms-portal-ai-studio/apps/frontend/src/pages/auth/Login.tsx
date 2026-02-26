
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ibms-portal.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Left Hero - Full Height */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative group overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary-hover/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16 text-white">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <img 
              src="/ibms-logo.jpg" 
              alt="IBMS Ghana" 
              className="h-16 w-16 rounded-full object-cover border-2 border-white/30 shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter">IBMS Ghana</span>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">Insurance Broker Management</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-xl transform transition-transform group-hover:translate-y-[-8px]">
            <h2 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-4">
              Broker Management Simplified.
            </h2>
            <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-md border border-white/30">
              <span className="material-symbols-outlined text-sm mr-2">verified_user</span>
              <span className="text-xs font-bold uppercase tracking-widest">Enterprise Secured</span>
            </div>
            <p className="text-lg font-medium leading-relaxed text-white/90 mb-8">
              Manage policies, claims, and client relationships with the industry-leading IBMS platform trusted by insurance professionals worldwide.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'security', text: 'Bank-level Security' },
                { icon: 'speed', text: 'Lightning Fast' },
                { icon: 'cloud_done', text: 'Cloud Powered' },
                { icon: 'support_agent', text: '24/7 Support' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover-lift cursor-pointer">
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                  <span className="text-sm font-bold">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm font-semibold text-white/70">
            <span>© 2024 IBMS Platform</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form - Full Height, Scrollable */}
      <div className="flex w-full lg:w-1/2 xl:w-2/5 flex-col bg-white dark:bg-card-dark overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img 
              src="/ibms-logo.jpg" 
              alt="IBMS Ghana" 
              className="h-14 w-14 rounded-full object-cover border-2 border-primary/20 shadow-md"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">IBMS Ghana</span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Insurance Broker Management</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-text-light dark:text-text-dark mb-3">
              Welcome Back
            </h1>
            <p className="text-base font-medium text-text-muted-light dark:text-text-muted-dark">
              Sign in to access your insurance management dashboard
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-slate-800 dark:bg-slate-900 transition-all overflow-hidden">
                <div className="pointer-events-none absolute left-0 flex h-full items-center pl-4 text-slate-400">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <input 
                  className="h-14 w-full border-none bg-transparent pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 focus:ring-0 dark:text-white" 
                  id="email" 
                  placeholder="name@company.com" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-slate-800 dark:bg-slate-900 transition-all overflow-hidden">
                <div className="pointer-events-none absolute left-0 flex h-full items-center pl-4 text-slate-400">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <input 
                  className="h-14 w-full border-none bg-transparent pl-12 pr-12 text-base text-slate-900 placeholder-slate-400 focus:ring-0 dark:text-white" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button 
                  className="absolute right-0 flex h-full items-center pr-4 text-slate-400 hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="h-5 w-5 rounded-md border-slate-300 bg-white text-primary focus:ring-primary transition-all" type="checkbox" />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
                  Remember me
                </span>
              </label>
              <a className="text-sm font-bold text-primary hover:text-primary-hover transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit"
              className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-lg font-black text-white transition-all hover:bg-primary-hover hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/20 shadow-lg shadow-primary/10 active:scale-[0.99]"
            >
              <span className="material-symbols-outlined">lock_open</span>
              Sign In Securely
            </button>

            <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">info</span>
                <p className="text-xs font-medium text-slate-600 dark:text-blue-200 leading-relaxed">
                  Your access level (Broker, Admin, Accounts) will be automatically assigned upon authentication.
                </p>
              </div>
            </div>
          </form>

          {/* Footer Links - Mobile */}
          <div className="lg:hidden mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-400">© 2024 IBMS Platform</p>
            <div className="flex items-center gap-6">
              <a className="text-xs font-bold text-slate-500 hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="text-xs font-bold text-slate-500 hover:text-primary transition-colors" href="#">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
