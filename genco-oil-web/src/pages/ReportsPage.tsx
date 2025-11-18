import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar, Users, DollarSign, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ReportsPage: React.FC = () => {
  const { t } = useLanguage();

  // Mock data for charts
  const supplierPerformanceData = [
    { name: 'PT Agro Lestari', volume: 2850, quality: 92, deliveries: 12, onTime: 95 },
    { name: 'Koperasi Petani', volume: 1820, quality: 88, deliveries: 8, onTime: 87 },
    { name: 'CV Sinar Makmur', volume: 1450, quality: 85, deliveries: 6, onTime: 92 },
    { name: 'PT Sawit Jaya', volume: 980, quality: 90, deliveries: 4, onTime: 100 },
    { name: 'Farmers Group', volume: 620, quality: 86, deliveries: 3, onTime: 78 }
  ];

  const revenueBreakdownData = [
    { name: 'CPO Sales', value: 2850000, color: '#2563eb' },
    { name: 'Kernel Sales', value: 850000, color: '#16a34a' },
    { name: 'Processing Fees', value: 420000, color: '#ca8a04' },
    { name: 'Storage Fees', value: 180000, color: '#ea580c' },
    { name: 'Other Income', value: 120000, color: '#8b5cf6' }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', revenue: 2850, cost: 2200, profit: 650 },
    { month: 'Feb', revenue: 3120, cost: 2450, profit: 670 },
    { month: 'Mar', revenue: 2980, cost: 2380, profit: 600 },
    { month: 'Apr', revenue: 3450, cost: 2650, profit: 800 },
    { month: 'May', revenue: 3210, cost: 2580, profit: 630 },
    { month: 'Jun', revenue: 3890, cost: 2950, profit: 940 }
  ];

  const qualityDistributionData = [
    { name: 'Premium', value: 35, color: '#16a34a' },
    { name: 'Standard', value: 45, color: '#2563eb' },
    { name: 'Commercial', value: 18, color: '#ca8a04' },
    { name: 'Below Spec', value: 2, color: '#dc2626' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('reports.title')}</h1>
          <p className="text-muted-foreground">Generate reports and view business analytics</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          {t('reports.generateReport')}
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {t('reports.supplierPerformanceAnalysis')}
            </CardTitle>
            <CardDescription>
              {t('reports.monthlyVolumeQualityScores')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="volume" orientation="left" />
                <YAxis yAxisId="quality" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="volume" dataKey="volume" fill="#2563eb" name={t('reports.volume') + ' (MT)'} />
                <Bar yAxisId="quality" dataKey="quality" fill="#16a34a" name={t('reports.qualityScore')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {t('reports.revenueBreakdown')}
            </CardTitle>
            <CardDescription>
              {t('reports.distributionRevenueBySource')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={revenueBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`IDR ${(value/1000000).toFixed(1)}M`, 'Revenue']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              {t('reports.monthlyFinancialTrends')}
            </CardTitle>
            <CardDescription>
              {t('reports.revenueCostsProfitTrends')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'IDR Millions', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} name={t('reports.revenue')} />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} name={t('reports.costs')} />
                <Area type="monotone" dataKey="profit" stackId="3" stroke="#16a34a" fill="#16a34a" fillOpacity={0.8} name={t('reports.profit')} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              {t('reports.qualityDistribution')}
            </CardTitle>
            <CardDescription>
              {t('reports.productQualityGradeDistribution')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={qualityDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qualityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, t('reports.percentage')]} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.totalSuppliers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">145</div>
            <p className="text-sm text-muted-foreground">{t('reports.activeThisMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.monthlyRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">IDR 3.89B</div>
            <p className="text-sm text-muted-foreground">↑ 12% {t('reports.fromLastMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.avgQualityScore')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">91.2%</div>
            <p className="text-sm text-muted-foreground">↑ 2.3% {t('reports.improvement')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;