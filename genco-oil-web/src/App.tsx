import React from 'react';
import {
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Activity,
  CheckCircle,
  Plus,
  Truck,
  Search,
  Bell,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import SuppliersPage from '@/pages/SuppliersPage';
import SupplierDetailPage from '@/pages/SupplierDetailPage';
import SupplierEditPage from '@/pages/SupplierEditPage';
import FieldOperationsPage from '@/pages/FieldOperationsPage';
import ContractsPage from '@/pages/ContractsPage';
import ProcessingPage from '@/pages/ProcessingPage';
import CompliancePage from '@/pages/CompliancePage';
import TradingPage from '@/pages/TradingPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import { mockDashboardStats } from '@/data/mockData';

// Mock data for supply chain volume chart - Realistic palm oil supply chain metrics
const supplyChainVolumeData = [
  { month: 'Jan', volume: 2850, quality: 87.5 },
  { month: 'Feb', volume: 3120, quality: 89.2 },
  { month: 'Mar', volume: 2980, quality: 85.8 },
  { month: 'Apr', volume: 3450, quality: 91.3 },
  { month: 'May', volume: 3210, quality: 88.6 },
  { month: 'Jun', volume: 3890, quality: 93.4 },
  { month: 'Jul', volume: 4120, quality: 90.2 },
  { month: 'Aug', volume: 3980, quality: 94.1 },
  { month: 'Sep', volume: 4250, quality: 92.5 },
  { month: 'Oct', volume: 4010, quality: 89.7 },
  { month: 'Nov', volume: 4380, quality: 93.8 },
  { month: 'Dec', volume: 4650, quality: 95.2 }
];

// Mock data for quality metrics chart - Realistic CPO quality specifications
const qualityMetricsData = [
  { month: 'Jan', ffa: 4.8, moisture: 0.22, purity: 88.5, contamination: 2.3 },
  { month: 'Feb', ffa: 4.2, moisture: 0.18, purity: 90.2, contamination: 1.9 },
  { month: 'Mar', ffa: 5.1, moisture: 0.25, purity: 86.8, contamination: 2.6 },
  { month: 'Apr', ffa: 3.9, moisture: 0.16, purity: 92.1, contamination: 1.6 },
  { month: 'May', ffa: 4.5, moisture: 0.20, purity: 89.4, contamination: 2.0 },
  { month: 'Jun', ffa: 3.6, moisture: 0.14, purity: 93.5, contamination: 1.4 },
  { month: 'Jul', ffa: 4.1, moisture: 0.17, purity: 91.0, contamination: 1.7 },
  { month: 'Aug', ffa: 3.4, moisture: 0.13, purity: 94.2, contamination: 1.3 },
  { month: 'Sep', ffa: 3.8, moisture: 0.16, purity: 92.8, contamination: 1.5 },
  { month: 'Oct', ffa: 4.6, moisture: 0.21, purity: 90.1, contamination: 2.1 },
  { month: 'Nov', ffa: 3.7, moisture: 0.15, purity: 93.6, contamination: 1.4 },
  { month: 'Dec', ffa: 3.2, moisture: 0.11, purity: 95.8, contamination: 1.1 }
];


const StatCard = ({ title, value, change, changeType, icon, color, t }: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
  t: (key: string) => string;
}) => (
  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold mb-2">{value}</p>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-muted-foreground">{t('dashboard.vsLastMonth')}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder={t('common.searchPlaceholder')}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Button variant="ghost" size="icon">
          <Moon className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Admin User</div>
            <div className="text-xs text-gray-500">{t('common.systemAdministrator')}</div>
          </div>
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardPage = () => {
  const { t } = useLanguage();

  const statCards = [
    {
      title: t('dashboard.totalSuppliers'),
      value: mockDashboardStats.totalSuppliers.toLocaleString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: t('dashboard.totalFarmers'),
      value: mockDashboardStats.totalFarmers.toLocaleString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: t('dashboard.activeSuppliers'),
      value: mockDashboardStats.activeSuppliers.toLocaleString(),
      change: '+5%',
      changeType: 'increase' as const,
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-100'
    },
    {
      title: t('dashboard.totalVolume'),
      value: `${(mockDashboardStats.totalVolume / 1000).toFixed(1)}K`,
      change: '+15%',
      changeType: 'increase' as const,
      icon: <Package className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: t('dashboard.averageQuality'),
      value: `${mockDashboardStats.averageQuality}%`,
      change: '+2%',
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: t('dashboard.pendingRegistrations'),
      value: mockDashboardStats.pendingRegistrations.toLocaleString(),
      change: '-3%',
      changeType: 'decrease' as const,
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-100'
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} t={t} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Supply Chain Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              {t('dashboard.supplyVolumeQuality')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={supplyChainVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="volume" orientation="left" stroke="#2563eb" label={{ value: t('dashboard.volume'), angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="quality" orientation="right" stroke="#16a34a" label={{ value: t('dashboard.qualityScore'), angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name={t('dashboard.volume')}
                  dot={{ fill: "#2563eb", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="quality"
                  type="monotone"
                  dataKey="quality"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name={t('dashboard.qualityScore')}
                  dot={{ fill: "#16a34a", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              {t('dashboard.qualityParameters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityMetricsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: t('dashboard.percentage'), angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ffa"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name={t('dashboard.ffa')}
                  dot={{ fill: "#dc2626", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke="#ea580c"
                  strokeWidth={2}
                  name={t('dashboard.moisture')}
                  dot={{ fill: "#ea580c", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="purity"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name={t('dashboard.purity')}
                  dot={{ fill: "#16a34a", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="contamination"
                  stroke="#ca8a04"
                  strokeWidth={2}
                  name={t('dashboard.contamination')}
                  dot={{ fill: "#ca8a04", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              {t('dashboard.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start text-left">
                <div className="flex flex-col items-start">
                  <Plus className="w-6 h-6 text-primary-600 mb-2" />
                  <div className="font-semibold mb-1">{t('dashboard.addNewSupplier')}</div>
                  <div className="text-sm text-muted-foreground">{t('dashboard.addNewSupplierDesc')}</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 justify-start text-left">
                <div className="flex flex-col items-start">
                  <Truck className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-semibold mb-1">{t('dashboard.trackDelivery')}</div>
                  <div className="text-sm text-muted-foreground">{t('dashboard.trackDeliveryDesc')}</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              {t('dashboard.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'delivery' ? 'bg-green-100' :
                    activity.type === 'registration' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'delivery' ? <Package className="w-4 h-4 text-green-600" /> :
                     activity.type === 'registration' ? <Plus className="w-4 h-4 text-blue-600" /> :
                     <CheckCircle className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{activity.entityName}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
                <Route path="/suppliers/edit/:id" element={<SupplierEditPage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/processing" element={<ProcessingPage />} />
                <Route path="/field-operations" element={<FieldOperationsPage />} />
                <Route path="/compliance" element={<CompliancePage />} />
                <Route path="/trading" element={<TradingPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;