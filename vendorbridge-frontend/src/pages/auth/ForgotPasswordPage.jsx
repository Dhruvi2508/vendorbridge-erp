import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../api/authApi';
import FormInput from '../../components/forms/FormInput';

const forgotPasswordSchema = zod.object({
  email: zod.string().email('Invalid email address').min(1, 'Email is required')
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success('Password reset email sent! Check your inbox.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Forgot password failed.');
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
            <h2 className="font-headline-xl text-headline-xl text-white mb-md">Recover your ERP credentials.</h2>
            <p className="font-body-lg text-body-lg text-white/80">Follow the secure verification process to request a single-use access link and reset your security configurations.</p>
          </div>
          <div className="flex gap-lg">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">Secure</span>
              <span className="font-label-sm text-label-sm text-white/60">ENCRYPTION</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">24/7</span>
              <span className="font-label-sm text-label-sm text-white/60">AUDITING</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Forgot Password Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-lg bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="flex lg:hidden items-center gap-sm mb-2xl justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">VendorBridge</span>
          </div>
          
          <div className="mb-2xl text-center lg:text-left">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Reset Password</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter your email and we'll send a verification link to reset your password.</p>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-md px-lg bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] active:translate-y-[1px] active:shadow-none hover:bg-primary-fixed-dim transition-all duration-150 flex items-center justify-center gap-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span> Sending...
                </>
              ) : (
                <>
                  Send Recovery Link <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-xl pt-xl border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Remember your details?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Back to Sign in
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

export default ForgotPasswordPage;
