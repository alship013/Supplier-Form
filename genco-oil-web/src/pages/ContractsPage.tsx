import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockContracts } from '@/data/mockContracts';
import type { Contract, ContractStatus, ContractType } from '@/types/contract';
import { Plus, Search, Eye, Edit, FileText, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ContractsPage: React.FC = () => {
  const { t } = useLanguage();
  const [contracts] = useState<Contract[]>(mockContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || contract.type === filterType;
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { variant: 'secondary' as const, color: 'text-gray-600' },
      'pending_review': { variant: 'outline' as const, color: 'text-yellow-600' },
      'pending_signature': { variant: 'outline' as const, color: 'text-orange-600' },
      'active': { variant: 'default' as const, color: 'text-green-600' },
      'suspended': { variant: 'secondary' as const, color: 'text-red-600' },
      'expired': { variant: 'secondary' as const, color: 'text-gray-600' },
      'terminated': { variant: 'destructive' as const, color: 'text-red-600' },
      'renewed': { variant: 'default' as const, color: 'text-blue-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['draft'];
    return <Badge variant={config.variant}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'long_term_supply': 'default',
      'farmer_contract': 'secondary',
      'supplier_agreement': 'outline',
      'trial_supply': 'outline',
      'exclusive_supply': 'default'
    };

    return <Badge variant={typeConfig[type as keyof typeof typeConfig] as any}>
      {type.replace('_', ' ').toUpperCase()}
    </Badge>;
  };

  const getContractHealth = (contract: Contract) => {
    if (!contract.performanceMetrics) return { score: 0, status: 'No Data' };

    const { deliveredVolume, expectedVolume, qualityScore, onTimeDelivery, complianceScore } = contract;
    const deliveryPerformance = expectedVolume > 0 ? (deliveredVolume / expectedVolume) * 100 : 0;

    const overallScore = (deliveryPerformance * 0.4 + qualityScore * 0.3 + onTimeDelivery * 0.2 + complianceScore * 0.1);

    let status = 'Excellent';
    if (overallScore < 60) status = 'Needs Attention';
    else if (overallScore < 80) status = 'Good';
    else if (overallScore < 95) status = 'Very Good';

    return { score: Math.round(overallScore), status };
  };

  const ContractDetailsDialog = ({ contract }: { contract: Contract }) => {
    const health = getContractHealth(contract);

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {contract.contractNumber} - {contract.title}
          </DialogTitle>
          <DialogDescription>
            Contract details and performance metrics
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Contract Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(contract.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {contract.signingDate ? `Signed: ${new Date(contract.signingDate).toLocaleDateString()}` : 'Not signed'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Contract Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(contract.value / 1000000).toFixed(1)}M {contract.currency}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {contract.expectedVolume} {contract.volumeUnit}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Performance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-600">
                    {health.score}%
                  </div>
                  <p className="text-sm text-muted-foreground">{health.status}</p>
                  <Progress value={health.score} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Contract Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span>{new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>
                      {Math.ceil((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-Renewal:</span>
                    <span>{contract.autoRenewal ? `Yes (${contract.renewalNoticeDays} days)` : 'No'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Parties & Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Supplier:</span>
                    <p>{contract.supplierName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Assigned Manager:</span>
                    <p>{contract.assignedManager}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Review Date:</span>
                    <p>{new Date(contract.reviewDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Type:</span>
                    <div className="mt-1">{getTypeBadge(contract.type)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Pricing Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>{contract.pricingModel.basePricePerUnit.toLocaleString()} {contract.pricingModel.priceUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pricing Model:</span>
                    <span className="capitalize">{contract.pricingModel.type.replace('_', ' ')}</span>
                  </div>
                  {contract.pricingModel.indexReference && (
                    <div className="flex justify-between">
                      <span>Index Reference:</span>
                      <span>{contract.pricingModel.indexReference}</span>
                    </div>
                  )}
                  {contract.priceAdjustments.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Price Adjustments:</span>
                      <ul className="text-sm mt-1 space-y-1">
                        {contract.priceAdjustments.map((adj, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{adj.description}</span>
                            <span>{adj.adjustmentPercentage}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Delivery & Payment Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Delivery Location:</span>
                    <p className="text-sm">{contract.deliveryTerms.location}</p>
                  </div>
                  <div className="flex justify-between">
                    <span>Incoterms:</span>
                    <span>{contract.deliveryTerms.incoterms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Frequency:</span>
                    <span>{contract.deliveryTerms.deliveryFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{contract.paymentTerms.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Terms:</span>
                    <span>{contract.paymentTerms.paymentDays} days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quality Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contract.qualityRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{req.parameter}</p>
                        <p className="text-sm text-muted-foreground">{req.requirement}</p>
                        <p className="text-xs text-muted-foreground">Test: {req.testMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{req.maximumValue}{req.unit}</p>
                        {req.critical && (
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {contract.performanceMetrics ? (
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Volume Delivery</span>
                        <span className="text-sm font-medium">{contract.performanceMetrics.deliveredVolume} / {contract.expectedVolume} {contract.volumeUnit}</span>
                      </div>
                      <Progress value={(contract.performanceMetrics.deliveredVolume / contract.expectedVolume) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Quality Score</span>
                        <span className="text-sm font-medium">{contract.performanceMetrics.qualityScore}%</span>
                      </div>
                      <Progress value={contract.performanceMetrics.qualityScore} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">On-Time Delivery</span>
                        <span className="text-sm font-medium">{contract.performanceMetrics.onTimeDelivery}%</span>
                      </div>
                      <Progress value={contract.performanceMetrics.onTimeDelivery} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Compliance Score</span>
                        <span className="text-sm font-medium">{contract.performanceMetrics.complianceScore}%</span>
                      </div>
                      <Progress value={contract.performanceMetrics.complianceScore} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Payment Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contract.paymentTerms.paymentSchedule.map((milestone, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{milestone.description}</p>
                            <p className="text-sm text-muted-foreground">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{milestone.percentage}%</p>
                            <Badge variant={milestone.status === 'paid' ? 'default' :
                                         milestone.status === 'overdue' ? 'destructive' : 'outline'}>
                              {milestone.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No performance data available for this contract yet.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Contract Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Master Agreement</p>
                      <p className="text-sm text-muted-foreground">Contract number: {contract.contractNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>

                  {contract.amendments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Contract Amendments</h4>
                      <div className="space-y-2">
                        {contract.amendments.map((amendment, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">Amendment {amendment.version}</p>
                              <p className="text-sm text-muted-foreground">{amendment.description}</p>
                              <p className="text-xs text-muted-foreground">Date: {new Date(amendment.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {contract.requiredCertifications.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Required Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {contract.requiredCertifications.map((cert, idx) => (
                          <Badge key={idx} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    );
  };

  // Contract Creation Dialog (placeholder)
  const ContractCreationDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Start the contract creation process
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Contract creation form will be available in the next update. For now, please contact the admin to create contracts manually.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Contact Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-muted-foreground">Manage supplier contracts and agreements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </DialogTrigger>
          <ContractCreationDialog />
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-sm text-muted-foreground">Active agreements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {contracts.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {contracts.filter(c => c.status === 'pending_review' || c.status === 'pending_signature').length}
            </div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-sm text-muted-foreground">Combined contract value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Contract Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="long_term_supply">Long-Term Supply</SelectItem>
            <SelectItem value="farmer_contract">Farmer Contract</SelectItem>
            <SelectItem value="supplier_agreement">Supplier Agreement</SelectItem>
            <SelectItem value="trial_supply">Trial Supply</SelectItem>
            <SelectItem value="exclusive_supply">Exclusive Supply</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="pending_signature">Pending Signature</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Directory</CardTitle>
          <CardDescription>
            {filteredContracts.length} {filteredContracts.length === 1 ? 'contract' : 'contracts'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const health = getContractHealth(contract);
                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={contract.title}>
                        {contract.title}
                      </div>
                    </TableCell>
                    <TableCell>{contract.supplierName}</TableCell>
                    <TableCell>{getTypeBadge(contract.type)}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {(contract.value / 1000000).toFixed(1)}M {contract.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contract.expectedVolume} {contract.volumeUnit}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{new Date(contract.startDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        to {new Date(contract.endDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <span className={`font-medium ${
                            health.score >= 90 ? 'text-green-600' :
                            health.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {health.score}%
                          </span>
                          <div className="text-muted-foreground">{health.status}</div>
                        </div>
                        {health.score >= 90 && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {health.score < 70 && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContract(contract)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedContract && (
        <ContractDetailsDialog contract={selectedContract} />
      )}
    </div>
  );
};

export default ContractsPage;