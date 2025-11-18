import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockIntakeRecords, mockProcessingBatches, mockQualityTests, mockInventoryRecords, mockProcessingStats } from '@/data/mockProcessingData';
import { AcceptanceStatus, BatchStatus, TestResult } from '@/types/processing';
import type { IntakeRecord, ProcessingBatch, QualityTest, InventoryRecord, ProcessingStepType, QualityCheckType } from '@/types/processing';
import { Plus, Search, Eye, Edit, AlertTriangle, CheckCircle, Clock, Truck, Beaker, Package, Activity, TrendingUp, Filter, Download, Camera, Thermometer, PieChart } from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const ProcessingPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIntake, setSelectedIntake] = useState<IntakeRecord | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);
  const [selectedTest, setSelectedTest] = useState<QualityTest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  
  const dailyProcessingData = [
    { date: 'Mon', intake: 2850, processed: 2720, output: 2650 },
    { date: 'Tue', intake: 3120, processed: 2980, output: 2910 },
    { date: 'Wed', intake: 2980, processed: 2850, output: 2790 },
    { date: 'Thu', intake: 3450, processed: 3320, output: 3240 },
    { date: 'Fri', intake: 3210, processed: 3080, output: 3010 },
    { date: 'Sat', intake: 1890, processed: 1820, output: 1780 },
    { date: 'Sun', intake: 950, processed: 920, output: 890 }
  ];

  const yieldDistributionData = [
    { name: t('processing.premium'), value: 28, fill: '#16a34a' },
    { name: t('processing.standard'), value: 52, fill: '#2563eb' },
    { name: t('processing.commercial'), value: 17, fill: '#ca8a04' },
    { name: t('processing.lowGrade'), value: 3, fill: '#dc2626' }
  ];

  
  const getStatusBadge = (status: AcceptanceStatus | BatchStatus | TestResult) => {
    const statusConfig = {
      [AcceptanceStatus.ACCEPTED]: { variant: 'default' as const, color: 'text-green-600' },
      [AcceptanceStatus.CONDITIONALLY_ACCEPTED]: { variant: 'secondary' as const, color: 'text-yellow-600' },
      [AcceptanceStatus.REJECTED]: { variant: 'destructive' as const, color: 'text-red-600' },
      [AcceptanceStatus.QUARANTINE]: { variant: 'outline' as const, color: 'text-orange-600' },
      [AcceptanceStatus.PENDING_ANALYSIS]: { variant: 'outline' as const, color: 'text-blue-600' },
      [BatchStatus.COMPLETED]: { variant: 'default' as const, color: 'text-green-600' },
      [BatchStatus.IN_PROGRESS]: { variant: 'secondary' as const, color: 'text-blue-600' },
      [BatchStatus.ON_HOLD]: { variant: 'outline' as const, color: 'text-orange-600' },
      [BatchStatus.FAILED]: { variant: 'destructive' as const, color: 'text-red-600' },
      [BatchStatus.QUALITY_APPROVED]: { variant: 'default' as const, color: 'text-green-600' },
      [TestResult.PASS]: { variant: 'default' as const, color: 'text-green-600' },
      [TestResult.FAIL]: { variant: 'destructive' as const, color: 'text-red-600' },
      [TestResult.MARGINAL]: { variant: 'secondary' as const, color: 'text-yellow-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, color: 'text-gray-600' };
    return <Badge variant={config.variant}>{status.toString().toUpperCase().replace('_', ' ')}</Badge>;
  };

  const IntakeDetailsDialog = ({ intake }: { intake: IntakeRecord }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Intake Details - {intake.intakeNumber}
        </DialogTitle>
        <DialogDescription>
          Raw material receipt and quality assessment details
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="basic" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="quality">Quality Assessment</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('processing.supplierAndDelivery')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{t('processing.supplier')}:</span>
                  <span className="font-medium">{intake.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('processing.contract')}:</span>
                  <span className="font-medium">{intake.contractId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('processing.vehicle')}:</span>
                  <span className="font-medium">{intake.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('processing.driver')}:</span>
                  <span className="font-medium">{intake.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('processing.arrival')}:</span>
                  <span className="font-medium">{new Date(intake.arrivalTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('processing.departure')}:</span>
                  <span className="font-medium">{new Date(intake.departureTime).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t('processing.materialDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Material Type:</span>
                  <span className="font-medium">{intake.rawMaterialType.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Expected:</span>
                  <span className="font-medium">{intake.expectedQuantity.toLocaleString()} {intake.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Received:</span>
                  <span className="font-medium">{intake.receivedQuantity.toLocaleString()} {intake.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Variance:</span>
                  <span className={`font-medium ${intake.receivedQuantity < intake.expectedQuantity ? 'text-red-600' : 'text-green-600'}`}>
                    {((intake.receivedQuantity - intake.expectedQuantity) / intake.expectedQuantity * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Moisture:</span>
                  <span className="font-medium">{intake.moistureContent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Temperature:</span>
                  <span className="font-medium">{intake.temperature}°C</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Acceptance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                {getStatusBadge(intake.acceptanceStatus)}
                <span className="text-sm text-muted-foreground">
                  {new Date(intake.receivedDate).toLocaleDateString()}
                </span>
              </div>
              {intake.rejectionReasons && intake.rejectionReasons.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Rejection Reasons:</span>
                  <ul className="text-sm space-y-1">
                    {intake.rejectionReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Visual Inspection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(intake.visualInspection).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Preliminary Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intake.preliminaryTests.map((test, idx) => (
                  <div key={idx} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{test.type}</p>
                        <p className="text-sm text-muted-foreground">{test.method}</p>
                        <p className="text-sm">{test.instrument}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{test.result}</p>
                        <p className="text-xs text-muted-foreground">{new Date(test.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Delivery Note:</span>
                    <p className="text-sm">{intake.deliveryNoteNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Sample ID:</span>
                    <p className="text-sm">{intake.sampleId || 'Not collected'}</p>
                  </div>
                </div>

                {intake.weighingTickets.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Weighing Tickets:</span>
                    <div className="mt-2 space-y-2">
                      {intake.weighingTickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded p-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{ticket.ticketNumber}</span>
                            <span className="text-sm">{ticket.netWeight.toLocaleString()} {ticket.unit}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Operator: {ticket.operatorName} | {new Date(ticket.weighingTime).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {intake.photos.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Photos ({intake.photos.length}):</span>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {intake.photos.map((photo) => (
                        <Badge key={photo.id} variant="outline" className="text-xs">
                          {photo.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Storage Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Storage Location:</span>
                  <span className="font-medium">{intake.storageLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Storage Bin:</span>
                  <span className="font-medium">{intake.storageBin || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Quarantine Status:</span>
                  <Badge variant="outline">
                    {intake.quarantineStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {intake.quarantineExpiryDate && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Quarantine Expiry:</span>
                    <span className="font-medium">{new Date(intake.quarantineExpiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Processing & Quality Control</h1>
          <p className="text-muted-foreground">Raw material processing and quality management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intake">Intake</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="quality">Quality Tests</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Intake Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProcessingStats.totalIntakeToday}</div>
                <p className="text-sm text-muted-foreground">Raw material deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Processing Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProcessingStats.totalProcessedToday}</div>
                <p className="text-sm text-muted-foreground">Batches processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quality Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockProcessingStats.totalQualityTestsPending}
                </div>
                <p className="text-sm text-muted-foreground">Pending results</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Average Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockProcessingStats.averageYield}%
                </div>
                <p className="text-sm text-muted-foreground">Processing efficiency</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Quality Pass Rate</span>
                      <span className="text-sm font-medium">{mockProcessingStats.qualityPassRate}%</span>
                    </div>
                    <Progress value={mockProcessingStats.qualityPassRate} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Batch Completion Rate</span>
                      <span className="text-sm font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Batches in Production</span>
                    </div>
                    <span className="font-medium">{mockProcessingStats.totalBatchesInProduction}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Alerts Requiring Attention</span>
                    </div>
                    <span className="font-medium text-yellow-600">{mockProcessingStats.alertsRequiringAttention}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Total Inventory Value</span>
                    </div>
                    <span className="font-medium">
                      {(mockProcessingStats.totalInventoryValue / 1000000).toFixed(1)}M IDR
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Processing Charts Section */}
        <div className="space-y-8">
          {/* Daily Processing Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Daily Processing Metrics
              </CardTitle>
              <CardDescription>
                Weekly intake, processing, and output volumes (MT)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyProcessingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="intake" stroke="#2563eb" strokeWidth={2} name="Intake" />
                  <Line type="monotone" dataKey="processed" stroke="#16a34a" strokeWidth={2} name="Processed" />
                  <Line type="monotone" dataKey="output" stroke="#ca8a04" strokeWidth={2} name="Output" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Yield Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                Product Yield Distribution
              </CardTitle>
              <CardDescription>
                Distribution of product quality grades (%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={yieldDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {yieldDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Intake Tab */}
        <TabsContent value="intake" className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('processing.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="quarantine">Quarantine</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Intake
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Raw Material Intake</CardTitle>
              <CardDescription>
                Recent raw material receipts and quality assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Intake #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIntakeRecords.map((intake) => (
                    <TableRow key={intake.id}>
                      <TableCell className="font-medium">{intake.intakeNumber}</TableCell>
                      <TableCell>{intake.supplierName}</TableCell>
                      <TableCell>{intake.rawMaterialType.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{intake.receivedQuantity.toLocaleString()} {intake.unit}</div>
                          <div className="text-xs text-muted-foreground">
                            Expected: {intake.expectedQuantity.toLocaleString()} {intake.unit}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(intake.acceptanceStatus)}</TableCell>
                      <TableCell>{new Date(intake.receivedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedIntake(intake)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processing Batches</CardTitle>
              <CardDescription>
                Active and completed processing batches with full traceability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch #</TableHead>
                    <TableHead>Input Material</TableHead>
                    <TableHead>Processing Line</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Yield</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProcessingBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{batch.totalInputQuantity.toLocaleString()} kg</div>
                          <div className="text-xs text-muted-foreground">
                            {batch.inputMaterials.length} material(s)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{batch.processingLine.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell>{getStatusBadge(batch.batchStatus)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{batch.actualYield}%</span>
                          {batch.actualYield >= 98 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(batch.processingStartTime).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBatch(batch)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tests Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Testing Laboratory</CardTitle>
              <CardDescription>
                Laboratory test results and quality certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test #</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Sample</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Laboratory</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockQualityTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.testNumber}</TableCell>
                      <TableCell>{test.testType.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell>{test.sampleId}</TableCell>
                      <TableCell>{getStatusBadge(test.overallResult)}</TableCell>
                      <TableCell>{test.laboratory}</TableCell>
                      <TableCell>{new Date(test.testDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={test.testStatus === 'completed' ? 'default' : 'secondary'}>
                          {test.testStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTest(test)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Beaker className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Real-time stock levels and material traceability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Type</TableHead>
                    <TableHead>Batch #</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quality Grade</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventoryRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.productType.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell className="font-medium">{record.batchNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.quantity.toLocaleString()} {record.unit}</div>
                          <div className="text-xs text-muted-foreground">
                            Available: {record.availableQuantity.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.qualityGrade === 'premium' ? 'default' : 'secondary'}>
                          {record.qualityGrade.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.location.warehouse} - {record.location.zone}
                          <div className="text-muted-foreground">{record.storageBin}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        {(record.totalValue / 1000000).toFixed(1)}M {record.currency}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Package className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">EUDR Compliance</span>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISCC Certification</span>
                    <Badge variant="default">Certified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Halal Certification</span>
                    <Badge variant="default">Certified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISO 9001</span>
                    <Badge variant="default">Implemented</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Quality Score</span>
                      <span className="text-sm font-medium">94.5%</span>
                    </div>
                    <Progress value={94.5} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Documentation Compliance</span>
                      <span className="text-sm font-medium">98.2%</span>
                    </div>
                    <Progress value={98.2} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Traceability Completeness</span>
                      <span className="text-sm font-medium">96.8%</span>
                    </div>
                    <Progress value={96.8} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedIntake && (
        <IntakeDetailsDialog intake={selectedIntake} />
      )}
    </div>
  );
};

export default ProcessingPage;