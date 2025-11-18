import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  Eye,
  Download,
  Calendar,
  Users,
  BarChart3,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CompliancePage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock compliance data
  const complianceMetrics = {
    overallScore: 87,
    eudrCompliance: 92,
    isccCompliance: 85,
    qualityCompliance: 89,
    documentationCompliance: 83,
    totalAudits: 24,
    passedAudits: 22,
    pendingAudits: 2,
    criticalIssues: 3,
    openIssues: 12
  };

  const complianceActivities = [
    {
      id: '1',
      type: 'audit',
      title: 'ISCC Annual Audit',
      status: 'passed',
      date: '2024-10-15',
      score: 92,
      auditor: 'TÜV Rheinland'
    },
    {
      id: '2',
      type: 'assessment',
      title: 'EUDR Due Diligence Assessment',
      status: 'in_progress',
      date: '2024-11-01',
      score: null,
      auditor: 'Internal Team'
    },
    {
      id: '3',
      type: 'inspection',
      title: 'Quality Management System Review',
      status: 'scheduled',
      date: '2024-12-01',
      score: null,
      auditor: 'SGS Indonesia'
    }
  ];

  const complianceIssues = [
    {
      id: '1',
      severity: 'high',
      category: 'Documentation',
      title: 'Missing supplier certificates for 3 new suppliers',
      description: 'ISCC and sustainability certificates not uploaded for recent supplier onboarding',
      openDate: '2024-11-05',
      dueDate: '2024-11-20',
      assignee: 'John Smith'
    },
    {
      id: '2',
      severity: 'medium',
      category: 'Quality',
      title: 'Inconsistent moisture content testing',
      description: 'Different testing methods used across facilities',
      openDate: '2024-11-01',
      dueDate: '2024-12-01',
      assignee: 'Sarah Chen'
    },
    {
      id: '3',
      severity: 'low',
      category: 'Safety',
      title: 'Safety training records incomplete',
      description: 'Some contractor training records missing from Q4 2024',
      openDate: '2024-11-08',
      dueDate: '2024-11-30',
      assignee: 'Mike Johnson'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'passed': { variant: 'default' as const, color: 'text-green-600' },
      'in_progress': { variant: 'secondary' as const, color: 'text-blue-600' },
      'scheduled': { variant: 'outline' as const, color: 'text-yellow-600' },
      'failed': { variant: 'destructive' as const, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      'high': { variant: 'destructive' as const, label: 'HIGH' },
      'medium': { variant: 'secondary' as const, label: 'MED' },
      'low': { variant: 'outline' as const, label: 'LOW' }
    };

    const config = severityConfig[severity as keyof typeof severityConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredIssues = complianceIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || issue.severity === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('compliance.title')}</h1>
          <p className="text-muted-foreground">{t('compliance.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('compliance.exportReport')}
          </Button>
          <Button>
            <FileCheck className="w-4 h-4 mr-2" />
            {t('compliance.scheduleAudit')}
          </Button>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t('compliance.overallCompliance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceMetrics.overallScore}%</div>
            <Progress value={complianceMetrics.overallScore} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">{t('compliance.wellAboveTarget')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              {t('compliance.eudrCompliance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{complianceMetrics.eudrCompliance}%</div>
            <Progress value={complianceMetrics.eudrCompliance} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">{t('compliance.meetsRequirements')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {t('compliance.isccCompliance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{complianceMetrics.isccCompliance}%</div>
            <Progress value={complianceMetrics.isccCompliance} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-2">{t('compliance.needsImprovement')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t('compliance.openIssues')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceMetrics.openIssues}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {complianceMetrics.criticalIssues} {t('compliance.critical')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('compliance.overview')}</TabsTrigger>
          <TabsTrigger value="audits">{t('compliance.auditsAssessments')}</TabsTrigger>
          <TabsTrigger value="issues">{t('compliance.issuesActions')}</TabsTrigger>
          <TabsTrigger value="documents">{t('compliance.documents')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t('compliance.complianceScoreTrends')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>EUDR Compliance</span>
                    <span className="font-medium">{complianceMetrics.eudrCompliance}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ISCC Compliance</span>
                    <span className="font-medium">{complianceMetrics.isccCompliance}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality Standards</span>
                    <span className="font-medium">{complianceMetrics.qualityCompliance}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Documentation</span>
                    <span className="font-medium">{complianceMetrics.documentationCompliance}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Audit Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Audits</span>
                    <span className="font-medium">{complianceMetrics.totalAudits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passed</span>
                    <span className="font-medium text-green-600">{complianceMetrics.passedAudits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="font-medium text-yellow-600">{complianceMetrics.pendingAudits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium">
                      {Math.round((complianceMetrics.passedAudits / complianceMetrics.totalAudits) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled & Recent Audits</CardTitle>
              <CardDescription>Track audit schedules and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Audit Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead> Auditor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.auditor}</TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell>
                        {activity.score ? (
                          <span className={`font-medium ${
                            activity.score >= 90 ? 'text-green-600' :
                            activity.score >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {activity.score}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Issues & Actions</CardTitle>
              <CardDescription>Track and resolve compliance issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(issue.severity)}
                        <h3 className="font-medium">{issue.title}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {issue.dueDate}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Category:</span> {issue.category} |
                        <span className="text-muted-foreground ml-2">Assignee:</span> {issue.assignee}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Compliance Documentation
              </CardTitle>
              <CardDescription>Manage certificates, permits, and compliance documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  {t('compliance.documentManagementFunctionalityNextUpdate')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompliancePage;