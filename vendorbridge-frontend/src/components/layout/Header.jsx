import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Theme toggle state with persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Notifications state with persistence
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('vendorbridge_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "New RFQ-2026-004 published", time: "10 mins ago", read: false },
      { id: 2, text: "Quotation submitted by Acme Corp", time: "1 hr ago", read: false },
      { id: 3, text: "Invoice INV-089 pending approval", time: "3 hrs ago", read: false }
    ];
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // Messages state with persistence
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('vendorbridge_messages');
    return saved ? JSON.parse(saved) : [
      { id: 1, sender: "Sarah Jenkins", text: "Please review the supplier bids.", time: "25 mins ago", read: false },
      { id: 2, sender: "System Admin", text: "Maintenance scheduled for midnight.", time: "2 hrs ago", read: false }
    ];
  });
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    localStorage.setItem('vendorbridge_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_messages', JSON.stringify(messages));
  }, [messages]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const handleMarkNotificationsRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkMessagesRead = (e) => {
    e.stopPropagation();
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    navigate('/activity');
    setShowNotifications(false);
  };

  const handleMessageClick = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    setShowMessages(false);
  };

  const userDisplayName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email 
    : 'Alex Thompson';
  const userRoleName = user ? user.role : 'Procurement Head';

  return (
    <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-lg sticky top-0 z-40">
      {/* Click-away backdrop overlay */}
      {(showNotifications || showMessages) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowNotifications(false);
            setShowMessages(false);
          }}
        />
      )}

      <div className="flex items-center gap-md w-full max-w-xl">
        {/* Mobile menu trigger */}
        <button 
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant mr-xs"
          title="Open Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg pl-11 pr-md py-sm text-body-md focus:ring-2 focus:ring-primary-container outline-none transition-all"
            placeholder="Global search vendors, orders, or documents..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-lg z-40">
        <div className="flex items-center gap-md text-on-surface-variant">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-xs w-80 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 py-sm">
                <div className="flex justify-between items-center px-md py-xs border-b border-outline-variant mb-xs">
                  <span className="font-bold text-on-surface font-headline-sm">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <button 
                      onClick={handleMarkNotificationsRead}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n.id)}
                      className={`px-md py-sm hover:bg-surface-container-high cursor-pointer text-left transition-colors flex items-start gap-sm ${!n.read ? 'bg-surface-container-low font-semibold' : ''}`}
                    >
                      {!n.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-error mt-1.5 shrink-0" title="Unread" />
                      )}
                      <div className="flex-1">
                        <p className="text-body-sm text-on-surface">{n.text}</p>
                        <span className="text-[10px] text-on-surface-variant font-label-sm">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-sm border-t border-outline-variant mt-xs">
                  <button 
                    onClick={() => {
                      navigate('/activity');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    View all activity logs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mail Messages */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors relative" 
              title="Messages"
            >
              <span className="material-symbols-outlined">mail</span>
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-on-primary font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {showMessages && (
              <div className="absolute right-0 mt-xs w-80 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 py-sm">
                <div className="flex justify-between items-center px-md py-xs border-b border-outline-variant mb-xs">
                  <span className="font-bold text-on-surface font-headline-sm">Messages</span>
                  {unreadMessagesCount > 0 && (
                    <button 
                      onClick={handleMarkMessagesRead}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant">
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      onClick={() => handleMessageClick(m.id)}
                      className={`px-md py-sm hover:bg-surface-container-high cursor-pointer text-left transition-colors flex items-start gap-sm ${!m.read ? 'bg-surface-container-low font-semibold' : ''}`}
                    >
                      {!m.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" title="Unread" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="text-body-sm text-primary font-bold">{m.sender}</span>
                          <span className="text-[10px] text-on-surface-variant font-label-sm">{m.time}</span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant line-clamp-1">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-outline-variant"></div>
        
        <div className="flex items-center gap-md">
          <div className="text-right hidden sm:block">
            <p className="font-body-sm font-semibold text-on-surface">{userDisplayName}</p>
            <p className="font-label-sm text-on-surface-variant">{userRoleName}</p>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden border border-outline ring-2 ring-outline-variant">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQeTGYT39w9EAa-y9ge_WQK5-rgZjS__5iDPjx39XQi1He1z_jWow7f6g0oVbRiKyMf0SLt6QI2M5bf_UDyXZPtH87cQPhcsclMp7CeVaJD8K0Ve6wTX0Y38qzuFvTV5crSdwQ9dij-a8hE-uuIkrG29VPN_iiec0fPbv91n6Y-9-VtdZbc1d1iH2vXPOhF9T4tg4UXTkGgsfYI2U8x2B0WnOqeFwoHRg6Ugm8cXo8J0wMN6tIoG4X4AX1yJGjWs4GRPxlOo18IHSe"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
