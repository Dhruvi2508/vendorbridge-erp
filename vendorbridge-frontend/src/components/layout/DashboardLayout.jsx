import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-[280px] md:ml-[72px] ml-0 flex flex-col min-h-screen transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 md:p-lg p-md flex flex-col">
          <Outlet />
        </main>

        <footer className="flex justify-between items-center w-full py-md md:px-lg px-md bg-surface-container-low border-t border-outline-variant mt-auto text-on-surface-variant font-body-sm flex-wrap gap-md">
          <div className="flex items-center gap-md">
            <span className="font-label-md font-bold text-on-surface">VendorBridge</span>
            <span>© 2024 VendorBridge ERP. All rights reserved.</span>
          </div>
          <div className="flex gap-lg">
            <a href="#" className="hover:text-primary underline transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary underline transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary underline transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
