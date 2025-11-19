import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  Settings,
  FileText,
  TrendingUp,
  Truck,
  CheckCircle,
  Menu,
  X,
  FileSignature
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

interface SidebarProps {
  activeItem?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem: _activeItem = 'dashboard',
  isCollapsed = false,
  onToggle
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'dashboard',
      label: t('sidebar.dashboard'),
      icon: <Home className="w-5 h-5" />,
      href: '/'
    },
    {
      id: 'suppliers',
      label: t('sidebar.suppliers'),
      icon: <Users className="w-5 h-5" />,
      href: '/suppliers',
      badge: '12'
    },
    {
      id: 'contracts',
      label: t('sidebar.contracts'),
      icon: <FileSignature className="w-5 h-5" />,
      href: '/contracts',
      badge: '3'
    },
    {
      id: 'processing',
      label: t('sidebar.processing'),
      icon: <Package className="w-5 h-5" />,
      href: '/processing',
      badge: '5'
    },
    {
      id: 'field-operations',
      label: t('sidebar.fieldOperations'),
      icon: <Truck className="w-5 h-5" />,
      href: '/field-operations'
    },
    {
      id: 'compliance',
      label: t('sidebar.compliance'),
      icon: <CheckCircle className="w-5 h-5" />,
      href: '/compliance'
    },
    {
      id: 'trading',
      label: t('sidebar.trading'),
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/trading'
    },
    {
      id: 'reports',
      label: t('sidebar.reports'),
      icon: <FileText className="w-5 h-5" />,
      href: '/reports'
    },
    {
      id: 'settings',
      label: t('sidebar.settings'),
      icon: <Settings className="w-5 h-5" />,
      href: '/settings'
    }
  ];
  return (
    <div className={cn(
      "flex flex-col h-screen bg-primary-700 text-white transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-primary-600">
        <div className={cn(
          "flex items-center justify-between",
          isCollapsed && "justify-center"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold">Genco Oil</h1>
                <p className="text-primary-200 text-xs">{t('sidebar.platform')}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-primary-200 hover:text-white hover:bg-primary-600"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link to={item.href}>
                <Button
                  variant={currentPath === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    currentPath === item.href
                      ? "bg-primary-600 text-white hover:bg-primary-500"
                      : "text-primary-100 hover:bg-primary-600 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary-800 text-primary-100 px-2 py-1 rounded-full text-xs">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-600">
        {/* Version and Copyright */}
        {!isCollapsed && (
          <div className="text-primary-200 text-xs space-y-1">
            <p>Version 1.0.0</p>
            <p>© 2024 Genco Oil</p>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};