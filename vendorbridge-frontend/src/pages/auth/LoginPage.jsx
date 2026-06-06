import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import FormInput from '../../components/forms/FormInput';

const loginSchema = zod.object({
  email: zod.string().email('Invalid email address').min(1, 'Email is required'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      setAuth(result.user, result.token, result.role);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      {/* Left Side: Illustration / Branding */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-highest overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Global Procurement"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcL70NoSoaX8nvYqBVUVK9kSwpmhOhUYRcLXujnjVCQInwmhckGhRre0fZhRpHU63rdCpDNOgIbIJT2QsaOOVw3-jR4VRDnI8Cp4NQ2DeCQzkPTrSJSRURHXdFsl2GRNUFYCgiUAWkkQq8LQSTG05as5zJ8PiSJFrh16YMCAbgIRBWGFfdjQ5lkYL7B9jRr8reb_1rbMTbueEZvpKLLAdkGj6RxmGDO2vSqiHieEbbSpSeMP_6eHy6ykdaUPkRW6k5JjQx2vx6M6UW"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-2xl flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary-container text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <span className="font-headline-md text-headline-md font-bold text-white tracking-tight">VendorBridge</span>
          </div>
          <div className="max-w-md">
            <h2 className="font-headline-xl text-headline-xl text-white mb-md">Streamlining global procurement for industry leaders.</h2>
            <p className="font-body-lg text-body-lg text-white/80">Connect with over 50,000 verified vendors and manage your entire supply chain lifecycle in one precision-engineered platform.</p>
          </div>
          <div className="flex gap-lg">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">12.4k</span>
              <span className="font-label-sm text-label-sm text-white/60">ACTIVE RFQS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">99.9%</span>
              <span className="font-label-sm text-label-sm text-white/60">UPTIME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-lg bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="flex lg:hidden items-center gap-sm mb-2xl justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">VendorBridge</span>
          </div>
          
          <div className="mb-2xl text-center lg:text-left">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter your credentials to access the Procurement ERP.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
            <FormInput
              label="Email Address"
              type="email"
              icon="mail"
              placeholder="name@company.com"
              error={errors.email}
              {...register('email')}
            />

            <FormInput
              label="Password"
              type="password"
              icon="lock"
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container cursor-pointer"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-body-sm text-body-sm text-primary font-semibold hover:underline transition-all">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-md px-lg bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] active:translate-y-[1px] active:shadow-none hover:bg-primary-fixed-dim transition-all duration-150 flex items-center justify-center gap-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...
                </>
              ) : (
                <>
                  Sign In <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-xl pt-xl border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <footer className="mt-2xl flex flex-wrap justify-center gap-lg font-label-sm text-label-sm text-on-tertiary-fixed-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </footer>
        </div>
      </section>

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}></div>
    </main>
  );
};

export default LoginPage;
