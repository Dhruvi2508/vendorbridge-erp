import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardConfig, getRoleLabel } from '../../utils/rbac';

const RoleDashboardPage = ({ roleKey }) => {
  const navigate = useNavigate();
  const { displayName, role } = useAuth();
  const config = getDashboardConfig(roleKey);

  return (
    <div className="space-y-lg">
      <section className={`rounded-2xl bg-gradient-to-r ${config.accent} text-white p-2xl shadow-xl`}>
        <div className="flex flex-col gap-md lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="uppercase tracking-[0.2em] text-white/70 text-xs mb-sm">{getRoleLabel(role || roleKey)}</p>
            <h1 className="font-headline-xl text-headline-xl mb-sm">{config.title}</h1>
            <p className="max-w-2xl text-white/80">{config.subtitle}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-lg py-md border border-white/15">
            <p className="text-xs uppercase tracking-wider text-white/70">Signed in as</p>
            <p className="font-semibold">{displayName}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md">
        {config.stats.map((item) => (
          <article key={item.label} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
            <p className="text-on-surface-variant text-sm mb-xs">{item.label}</p>
            <div className="flex items-end justify-between gap-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">{item.value}</h2>
              <span className="text-xs font-semibold text-secondary whitespace-nowrap">{item.trend}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {config.quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="text-left rounded-xl border border-outline-variant bg-surface-container-lowest p-md hover:border-primary hover:shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-primary mb-sm">{action.icon}</span>
                <p className="font-semibold text-on-surface">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Role Summary</h3>
          <ul className="space-y-sm text-sm text-on-surface-variant">
            <li>Dashboard path: {roleKey === 'ADMIN' ? '/admin/dashboard' : roleKey === 'PROCUREMENT_OFFICER' ? '/procurement/dashboard' : roleKey === 'VENDOR' ? '/vendor/dashboard' : '/manager/dashboard'}</li>
            <li>Role-based menus load dynamically from RBAC config.</li>
            <li>Unauthorized routes redirect to 403 then back to this dashboard.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default RoleDashboardPage;
