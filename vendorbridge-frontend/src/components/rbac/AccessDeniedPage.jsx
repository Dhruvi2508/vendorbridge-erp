import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dashboardPath } = useAuth();
  const fallback = location.state?.fallback || dashboardPath;
  const from = location.state?.from || 'this page';

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(fallback, { replace: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [fallback, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-on-background px-lg">
      <section className="max-w-xl w-full bg-surface border border-outline-variant rounded-2xl p-2xl shadow-lg">
        <p className="font-label-sm text-error uppercase tracking-[0.2em] mb-sm">403 Access Denied</p>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">You do not have access to {from}.</h1>
        <p className="text-on-surface-variant mb-lg">
          Your account is signed in, but this route is not allowed for your current role. You will be redirected to your dashboard automatically.
        </p>
        <button
          onClick={() => navigate(fallback, { replace: true })}
          className="px-lg py-md rounded-lg bg-primary-container text-on-primary-container font-semibold"
        >
          Go to dashboard now
        </button>
      </section>
    </main>
  );
};

export default AccessDeniedPage;
