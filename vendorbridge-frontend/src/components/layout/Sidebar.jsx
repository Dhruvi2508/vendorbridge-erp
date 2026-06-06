import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRoleLabel, getSidebarMenuItems } from '../../utils/rbac';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const menuItems = getSidebarMenuItems(role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-surface border-r border-outline-variant flex flex-col py-lg z-50 transition-all duration-300 ${
      isOpen ? 'translate-x-0 w-[280px] px-md' : '-translate-x-full'
    } md:translate-x-0 md:w-[72px] lg:w-[280px] md:px-sm lg:px-md`}>
      <div className="mb-xl px-sm flex items-center gap-md">
        <div className="w-10 h-10 min-w-[40px] bg-primary rounded flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        </div>
        <div className={`lg:block ${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <h1 className="font-headline-md text-headline-md font-bold text-primary whitespace-nowrap">VendorBridge</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{getRoleLabel(role)} Portal</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-xs overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-md px-md md:px-sm lg:px-md py-sm rounded transition-colors ${
                isActive
                  ? 'text-on-secondary-container bg-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              } ${isOpen ? 'justify-start' : 'justify-center lg:justify-start'}`
            }
            title={item.label}
          >
            <span className="material-symbols-outlined min-w-[24px] text-center">{item.icon}</span>
            <span className={`font-body-md lg:inline ${isOpen ? 'inline' : 'hidden'} md:hidden whitespace-nowrap`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      
      <div className="pt-lg border-t border-outline-variant">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-md px-md md:px-sm lg:px-md py-sm rounded transition-colors text-on-surface-variant hover:bg-error-container hover:text-on-error-container text-left ${
            isOpen ? 'justify-start' : 'justify-center lg:justify-start'
          }`}
          title="Logout"
        >
          <span className="material-symbols-outlined min-w-[24px] text-center">logout</span>
          <span className={`font-body-md lg:inline ${isOpen ? 'inline' : 'hidden'} md:hidden whitespace-nowrap`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
