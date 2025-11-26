import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../auth/services/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencySession, setEmergencySession] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check for active emergency session
  useEffect(() => {
    const checkEmergencyStatus = () => {
      const storedSession = localStorage.getItem('vsts_emergency_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session.status === 'active') {
          setIsEmergencyActive(true);
          setEmergencySession(session);
        } else {
          setIsEmergencyActive(false);
          setEmergencySession(null);
        }
      } else {
        setIsEmergencyActive(false);
        setEmergencySession(null);
      }
    };

    checkEmergencyStatus();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vsts_emergency_session') {
        checkEmergencyStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Visitors', href: '/visitors', icon: UsersIcon },
    { name: 'Staff', href: '/staff', icon: UserGroupIcon },
      {
      name: 'Emergency',
      href: '/emergency',
      icon: ExclamationTriangleIcon,
      alert: isEmergencyActive
    },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen vsts-gradient-bg">
      {/* Emergency Alert Banner */}
      {isEmergencyActive && emergencySession && (
        <div className="bg-red-600 text-white px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-5 w-5 animate-pulse" />
              <span className="font-medium">
                {emergencySession.type === 'drill' ? 'Emergency Drill in Progress' : 'EMERGENCY ALERT'}
              </span>
              <span className="text-red-200">
                {emergencySession.location || 'All Locations'} • Active for {Math.floor((new Date().getTime() - new Date(emergencySession.startTime).getTime()) / 60000)} min
              </span>
            </div>
            <Link
              to="/emergency"
              className="bg-red-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-800"
            >
              View Details
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">VSTS</h1>
                <span className="ml-2 text-sm text-gray-500">Visitor & Staff Tracking System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isEmergencyActive && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  Emergency Active
                </div>
              )}
              <span className="text-sm text-gray-500">
                Welcome, {user?.fullName || user?.username || 'User'}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.href
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${item.alert ? 'animate-pulse' : ''}`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      location.pathname === item.href
                        ? 'text-primary-600'
                        : item.alert
                          ? 'text-red-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                    {item.alert && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">!</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Main Layout component
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <LayoutContent>{children}</LayoutContent>;
};

export default Layout;