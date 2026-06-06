import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerUser } from '../../api/authApi';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';

const signupSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().email('Invalid email address').min(1, 'Email is required'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  phone: zod.string().min(10, 'Phone must be at least 10 digits'),
  role: zod.enum(['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  })
});

const SignupPage = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', phone: '', role: 'VENDOR' }
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
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
            <h2 className="font-headline-xl text-headline-xl text-white mb-md">Join over 50,000 verified industrial suppliers.</h2>
            <p className="font-body-lg text-body-lg text-white/80">Connect with global procurement managers, submit quotations, and secure enterprise contracts seamlessly.</p>
          </div>
          <div className="flex gap-lg">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">50k+</span>
              <span className="font-label-sm text-label-sm text-white/60">SUPPLIERS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">Y2026</span>
              <span className="font-label-sm text-label-sm text-white/60">COMPLIANCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-lg bg-surface overflow-y-auto">
        <div className="w-full max-w-md my-xl">
          {/* Mobile Branding */}
          <div className="flex lg:hidden items-center gap-sm mb-xl justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">VendorBridge</span>
          </div>
          
          <div className="mb-lg text-center lg:text-left">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Create Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign up to participate in active RFQ bidding workflows.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <FormInput
                label="First Name"
                type="text"
                icon="person"
                placeholder="John"
                error={errors.firstName}
                {...register('firstName')}
              />
              <FormInput
                label="Last Name"
                type="text"
                icon="person"
                placeholder="Doe"
                error={errors.lastName}
                {...register('lastName')}
              />
            </div>

            <FormInput
              label="Email Address"
              type="email"
              icon="mail"
              placeholder="name@company.com"
              error={errors.email}
              {...register('email')}
            />

            <FormInput
              label="Phone Number"
              type="text"
              icon="call"
              placeholder="+91 98765-43210"
              error={errors.phone}
              {...register('phone')}
            />

            <FormSelect
              label="Account Role"
              icon="shield"
              options={[
                { value: 'VENDOR', label: 'Vendor / Supplier' },
                { value: 'PROCUREMENT_OFFICER', label: 'Procurement Officer' },
                { value: 'MANAGER', label: 'Manager / Approver' }
              ]}
              error={errors.role}
              {...register('role')}
            />

            <FormInput
              label="Password"
              type="password"
              icon="lock"
              placeholder="Min 6 characters"
              error={errors.password}
              {...register('password')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-md px-lg bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] active:translate-y-[1px] active:shadow-none hover:bg-primary-fixed-dim transition-all duration-150 flex items-center justify-center gap-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span> Creating...
                </>
              ) : (
                <>
                  Register <span className="material-symbols-outlined">how_to_reg</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-lg pt-lg border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>

          <footer className="mt-xl flex flex-wrap justify-center gap-lg font-label-sm text-label-sm text-on-tertiary-fixed-variant">
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

export default SignupPage;
