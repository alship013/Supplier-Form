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
import {
  mockFeedstockRecords,
  mockSuppliers,
  mockFeedstockInventory,
  mockQualityInspections,
  mockProcessingBatches
} from '@/data/mockData';
import type {
  FeedstockRecord,
  FeedstockInventory,
  QualityInspection,
  ProcessingBatch
} from '@/types';
import { Plus, Search, Eye, CheckCircle, XCircle, Clock, MapPin, Calendar, TrendingUp, AlertCircle, Camera, FileText, Truck, Package, Factory, Warehouse } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FieldOperationsPage: React.FC = () => {
  const { t } = useLanguage();
  const [deliveries, setDeliveries] = useState<FeedstockRecord[]>(mockFeedstockRecords);
  const [inventory] = useState<FeedstockInventory[]>(mockFeedstockInventory);
  const [qualityInspections] = useState<QualityInspection[]>(mockQualityInspections);
  const [processingBatches] = useState<ProcessingBatch[]>(mockProcessingBatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'in_transit' | 'quality_check' | 'stored'>('all');
  const [filterFeedstockType, setFilterFeedstockType] = useState<string>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<FeedstockRecord | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);
  const [isTrackDeliveryOpen, setIsTrackDeliveryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('deliveries');

  const getFeedstockTypeLabel = (type: FeedstockRecord['feedstockType']) => {
    const labels = {
      palm_kernel_shell: 'Palm Kernel Shell',
      empty_fruit_bunch: 'Empty Fruit Bunch',
      mesocarp_fiber: 'Mesocarp Fiber',
      palm_mill_effluent: 'Palm Mill Effluent',
      shells: 'Shells',
      fronds: 'Fronds'
    };
    return labels[type] || type;
  };

  
  const filteredDeliveries = deliveries.filter(delivery => {
    const supplier = mockSuppliers.find(s => s.id === delivery.supplierId);
    const matchesSearch = supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.feedstockType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
    const matchesType = filterFeedstockType === 'all' || delivery.feedstockType === filterFeedstockType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredInventory = inventory.filter(inv => {
    const matchesSearch = inv.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.feedstockType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterFeedstockType === 'all' || inv.feedstockType === filterFeedstockType;
    return matchesSearch && matchesType;
  });

  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      pending: 'outline',
      rejected: 'destructive',
      in_transit: 'secondary',
      quality_check: 'outline',
      stored: 'default'
    };
    const icons: Record<string, React.ReactNode> = {
      approved: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      in_transit: <Truck className="w-3 h-3" />,
      quality_check: <AlertCircle className="w-3 h-3" />,
      stored: <Warehouse className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {icons[status]}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getProcessingStatusBadge = (status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'scheduled') => {
    const variants: Record<'pending' | 'in_progress' | 'completed' | 'failed' | 'scheduled', 'default' | 'destructive' | 'outline' | 'secondary'> = {
      pending: 'outline',
      scheduled: 'outline',
      in_progress: 'default',
      completed: 'default',
      failed: 'destructive'
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />,
      in_progress: <Factory className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {icons[status]}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getInspectionResultBadge = (result: QualityInspection['overallResult']) => {
    const variants: Record<QualityInspection['overallResult'], 'default' | 'destructive' | 'outline' | 'secondary'> = {
      pass: 'default',
      fail: 'destructive',
      conditional_pass: 'outline',
      pending: 'secondary'
    };
    const icons = {
      pass: <CheckCircle className="w-3 h-3" />,
      fail: <XCircle className="w-3 h-3" />,
      conditional_pass: <AlertCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[result]} className="flex items-center gap-1">
        {icons[result]}
        {result.replace('_', ' ')}
      </Badge>
    );
  };

  const getBatchStatusBadge = (status: ProcessingBatch['status']) => {
    const variants: Record<ProcessingBatch['status'], 'default' | 'destructive' | 'outline' | 'secondary'> = {
      scheduled: 'outline',
      in_progress: 'default',
      completed: 'default',
      failed: 'destructive',
      on_hold: 'secondary'
    };
    const icons = {
      scheduled: <Clock className="w-3 h-3" />,
      in_progress: <Factory className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      on_hold: <AlertCircle className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {icons[status]}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ProcessingBatch['priority']) => {
    const variants: Record<ProcessingBatch['priority'], 'default' | 'destructive' | 'outline' | 'secondary'> = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      urgent: 'destructive'
    };
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };

    return (
      <Badge variant={variants[priority]} className={`flex items-center gap-1 ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getQualityScore = (quality: FeedstockRecord['quality']) => {
    const purityWeight = 0.4;
    const moistureWeight = 0.3;
    const contaminationWeight = 0.2;
    const calorificWeight = 0.1;

    const moistureScore = Math.max(0, 100 - quality.moisture * 5);
    const purityScore = quality.purity;
    const contaminationScore = Math.max(0, 100 - quality.contamination * 10);
    const calorificScore = quality.calorific_value ? Math.min(100, (quality.calorific_value / 4500) * 100) : 80;

    return Math.round(
      purityScore * purityWeight +
      moistureScore * moistureWeight +
      contaminationScore * contaminationWeight +
      calorificScore * calorificWeight
    );
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApproveDelivery = (deliveryId: string) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? { ...d, status: 'approved' as const, certificateUrl: `/certificates/${deliveryId}.pdf` }
          : d
      )
    );
  };

  const handleRejectDelivery = (deliveryId: string) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? { ...d, status: 'rejected' as const }
          : d
      )
    );
  };

  const DeliveryDetailsDialog = ({ delivery }: { delivery: FeedstockRecord }) => {
    const supplier = mockSuppliers.find(s => s.id === delivery.supplierId);
    const qualityScore = getQualityScore(delivery.quality);

    return (
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Delivery Details - {getFeedstockTypeLabel(delivery.feedstockType)}
            {getStatusBadge(delivery.status)}
          </DialogTitle>
          <DialogDescription>
            Feedstock delivery information and quality metrics
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {new Date(delivery.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {delivery.location.name}
              </div>
              <div className="text-sm">
                <div className="font-medium">Supplier:</div>
                <div className="text-muted-foreground">{supplier?.name}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Volume:</div>
                <div className="text-muted-foreground">{delivery.volume.toLocaleString()} tons</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Batch Number:</div>
                <div className="text-muted-foreground">{delivery.batch_number}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Storage Location:</div>
                <div className="text-muted-foreground">{delivery.storage_location || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Transport Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">Vehicle Number:</div>
                <div className="text-muted-foreground">{delivery.transport.vehicle_number}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Driver:</div>
                <div className="text-muted-foreground">{delivery.transport.driver_name}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Transport Company:</div>
                <div className="text-muted-foreground">{delivery.transport.transport_company}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Departure:</div>
                <div className="text-muted-foreground">
                  {new Date(delivery.transport.departure_time).toLocaleString()}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Arrival:</div>
                <div className="text-muted-foreground">
                  {new Date(delivery.transport.arrival_time).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Moisture:</span>
                <span className={`font-medium ${
                  delivery.quality.moisture <= 12 ? 'text-green-600' :
                  delivery.quality.moisture <= 18 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delivery.quality.moisture}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Purity:</span>
                <span className={`font-medium ${
                  delivery.quality.purity >= 95 ? 'text-green-600' :
                  delivery.quality.purity >= 90 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delivery.quality.purity}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contamination:</span>
                <span className={`font-medium ${
                  delivery.quality.contamination <= 2 ? 'text-green-600' :
                  delivery.quality.contamination <= 4 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delivery.quality.contamination}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Size Distribution:</span>
                <span className="font-medium">{delivery.quality.size_distribution}</span>
              </div>
              {delivery.quality.calorific_value && (
                <div className="flex justify-between text-sm">
                  <span>Calorific Value:</span>
                  <span className={`font-medium ${
                    delivery.quality.calorific_value >= 4000 ? 'text-green-600' :
                    delivery.quality.calorific_value >= 3500 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {delivery.quality.calorific_value} kcal/kg
                  </span>
                </div>
              )}
              {delivery.quality.ash_content && (
                <div className="flex justify-between text-sm">
                  <span>Ash Content:</span>
                  <span className={`font-medium ${
                    delivery.quality.ash_content <= 3 ? 'text-green-600' :
                    delivery.quality.ash_content <= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {delivery.quality.ash_content}%
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="font-medium">Overall Score:</span>
                <span className={`font-bold ${getQualityColor(qualityScore)}`}>
                  {qualityScore}/100
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {delivery.photos.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Delivery Photos ({delivery.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {delivery.photos.map((_, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {delivery.inspection && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Inspection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">Inspected By:</div>
                <div className="text-muted-foreground">{delivery.inspection.inspected_by}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Inspection Date:</div>
                <div className="text-muted-foreground">
                  {new Date(delivery.inspection.inspection_date).toLocaleString()}
                </div>
              </div>
              {delivery.inspection.notes && (
                <div className="text-sm">
                  <div className="font-medium">Notes:</div>
                  <div className="text-muted-foreground">{delivery.inspection.notes}</div>
                </div>
              )}
              {delivery.inspection.recommendations && delivery.inspection.recommendations.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium">Recommendations:</div>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {delivery.inspection.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {delivery.documents.delivery_note && (
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Delivery Note
                </Button>
              )}
              {delivery.documents.quality_certificate && (
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Quality Certificate
                </Button>
              )}
              {delivery.documents.weigh_bridge_ticket && (
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Weigh Bridge Ticket
                </Button>
              )}
              {delivery.documents.transport_manifest && (
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Transport Manifest
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedDelivery(null)}>
            Close
          </Button>
          {delivery.status === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  handleRejectDelivery(delivery.id);
                  setSelectedDelivery(null);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  handleApproveDelivery(delivery.id);
                  setSelectedDelivery(null);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    );
  };

  const QualityInspectionDialog = ({ inspection }: { inspection: QualityInspection }) => {
  const feedstockRecord = deliveries.find(d => d.id === inspection.feedstockRecordId);
  const supplier = mockSuppliers.find(s => s.id === feedstockRecord?.supplierId);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Quality Inspection Report
          {getInspectionResultBadge(inspection.overallResult)}
        </DialogTitle>
        <DialogDescription>
          Detailed quality inspection results and test measurements
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Inspection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Inspection ID:</div>
              <div className="text-muted-foreground">{inspection.id}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Type:</div>
              <div className="text-muted-foreground capitalize">{inspection.inspectionType.replace('_', ' ')}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Inspector:</div>
              <div className="text-muted-foreground">{inspection.inspectorName}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Date:</div>
              <div className="text-muted-foreground">
                {new Date(inspection.inspectionDate).toLocaleString()}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Location:</div>
              <div className="text-muted-foreground">{inspection.location}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Feedstock:</div>
              <div className="text-muted-foreground">
                {feedstockRecord && getFeedstockTypeLabel(feedstockRecord.feedstockType)}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Supplier:</div>
              <div className="text-muted-foreground">{supplier?.name}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Score:</span>
              <span className="font-bold">{inspection.totalScore}/{inspection.maxScore}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Percentage:</span>
              <span className="font-medium">
                {Math.round((inspection.totalScore / inspection.maxScore) * 100)}%
              </span>
            </div>
            <div className="mt-4">
              <Progress
                value={(inspection.totalScore / inspection.maxScore) * 100}
                className="h-2"
              />
            </div>
            <div className="text-sm">
              <div className="font-medium">Approval Status:</div>
              <div className="text-muted-foreground">
                {inspection.approvedBy ? (
                  <span className="text-green-600">
                    Approved by {inspection.approvedBy} on{' '}
                    {new Date(inspection.approvedDate!).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-yellow-600">Pending approval</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inspection.tests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{test.name}</h4>
                  <Badge
                    variant={test.result === 'pass' ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {test.result}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Method:</span>
                    <span className="ml-2 text-muted-foreground">{test.method}</span>
                  </div>
                  <div>
                    <span className="font-medium">Standard:</span>
                    <span className="ml-2 text-muted-foreground">{test.standard}</span>
                  </div>
                  <div>
                    <span className="font-medium">Measured:</span>
                    <span className={`ml-2 font-medium ${
                      test.result === 'pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {test.measuredValue} {test.unit}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Acceptance:</span>
                    <span className="ml-2 text-muted-foreground">
                      {test.minAcceptance}-{test.maxAcceptance} {test.unit}
                    </span>
                  </div>
                  {test.equipment && (
                    <div className="col-span-2">
                      <span className="font-medium">Equipment:</span>
                      <span className="ml-2 text-muted-foreground">{test.equipment}</span>
                    </div>
                  )}
                  {test.notes && (
                    <div className="col-span-2">
                      <span className="font-medium">Notes:</span>
                      <span className="ml-2 text-muted-foreground">{test.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {inspection.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {inspection.recommendations.map((rec, index) => (
                <li key={index} className="text-muted-foreground">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {inspection.nonConformities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-600">Non-Conformities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {inspection.nonConformities.map((nc, index) => (
                <li key={index} className="text-red-600">{nc}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {inspection.correctiveActions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-600">Corrective Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {inspection.correctiveActions.map((ca, index) => (
                <li key={index} className="text-orange-600">{ca}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {inspection.certificateUrl && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Download Quality Certificate
            </Button>
          </CardContent>
        </Card>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => setSelectedInspection(null)}>
          Close
        </Button>
        {inspection.certificateUrl && (
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            View Certificate
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

const ProcessingBatchDialog = ({ batch }: { batch: ProcessingBatch }) => {
  const feedstockRecord = deliveries.find(d => d.id === batch.feedstockRecordId);
  
  return (
    <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Processing Batch Details - {batch.batchNumber}
          {getBatchStatusBadge(batch.status)}
          {getPriorityBadge(batch.priority)}
        </DialogTitle>
        <DialogDescription>
          Complete processing batch information and workflow status
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Batch Number:</div>
              <div className="text-muted-foreground font-mono">{batch.batchNumber}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Feedstock:</div>
              <div className="text-muted-foreground">
                {feedstockRecord && getFeedstockTypeLabel(feedstockRecord.feedstockType)}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Input Volume:</div>
              <div className="text-muted-foreground">{batch.inputVolume.toLocaleString()} tons</div>
            </div>
            {batch.actualOutputVolume && (
              <div className="text-sm">
                <div className="font-medium">Actual Output:</div>
                <div className="text-muted-foreground">{batch.actualOutputVolume.toLocaleString()} tons</div>
              </div>
            )}
            {batch.yieldPercentage && (
              <div className="text-sm">
                <div className="font-medium">Yield:</div>
                <div className="text-muted-foreground">{batch.yieldPercentage}%</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Schedule & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Start Date:</div>
              <div className="text-muted-foreground">
                {new Date(batch.startDate).toLocaleString()}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Expected End:</div>
              <div className="text-muted-foreground">
                {new Date(batch.expectedEndDate).toLocaleString()}
              </div>
            </div>
            {batch.actualEndDate && (
              <div className="text-sm">
                <div className="font-medium">Actual End:</div>
                <div className="text-muted-foreground">
                  {new Date(batch.actualEndDate).toLocaleString()}
                </div>
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium">Assigned To:</div>
              <div className="text-muted-foreground">{batch.assignedTo}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Supervised By:</div>
              <div className="text-muted-foreground">{batch.supervisedBy}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Moisture Before:</div>
              <div className="text-muted-foreground">{batch.qualityMetrics.moistureBefore}%</div>
            </div>
            {batch.qualityMetrics.moistureAfter > 0 && (
              <div className="text-sm">
                <div className="font-medium">Moisture After:</div>
                <div className="text-muted-foreground text-green-600">
                  {batch.qualityMetrics.moistureAfter}%
                </div>
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium">Purity Before:</div>
              <div className="text-muted-foreground">{batch.qualityMetrics.purityBefore}%</div>
            </div>
            {batch.qualityMetrics.purityAfter > 0 && (
              <div className="text-sm">
                <div className="font-medium">Purity After:</div>
                <div className="text-muted-foreground text-green-600">
                  {batch.qualityMetrics.purityAfter}%
                </div>
              </div>
            )}
            {batch.qualityMetrics.calorificValueAfter && (
              <div className="text-sm">
                <div className="font-medium">Calorific Value:</div>
                <div className="text-muted-foreground">
                  {batch.qualityMetrics.calorificValueAfter} kcal/kg
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Processing Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batch.steps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 ${
                  index === batch.currentStepIndex ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {index + 1}. {step.name}
                    </h4>
                    {getProcessingStatusBadge(step.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {step.duration} minutes
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Equipment:</span>
                    <span className="ml-2 text-muted-foreground">{step.equipment}</span>
                  </div>
                  <div>
                    <span className="font-medium">Operator:</span>
                    <span className="ml-2 text-muted-foreground">{step.operator}</span>
                  </div>
                  {step.temperature && (
                    <div>
                      <span className="font-medium">Temperature:</span>
                      <span className="ml-2 text-muted-foreground">{step.temperature}°C</span>
                    </div>
                  )}
                  {step.pressure && (
                    <div>
                      <span className="font-medium">Pressure:</span>
                      <span className="ml-2 text-muted-foreground">{step.pressure} bar</span>
                    </div>
                  )}
                  {step.startTime && (
                    <div>
                      <span className="font-medium">Start:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(step.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {step.endTime && (
                    <div>
                      <span className="font-medium">End:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(step.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                {step.notes && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium">Notes:</span> {step.notes}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-1">
                  {step.qualityChecks.map((check, checkIndex) => (
                    <Badge key={checkIndex} variant="outline" className="text-xs">
                      {check.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {batch.notes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Batch Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {batch.notes.map((note, index) => (
                <li key={index} className="text-muted-foreground">{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {batch.deviations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-600">Deviations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {batch.deviations.map((deviation, index) => (
                <li key={index} className="text-orange-600">{deviation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => setSelectedBatch(null)}>
          Close
        </Button>
        {batch.status === 'in_progress' && (
          <Button>
            <Factory className="w-4 h-4 mr-2" />
            Update Batch Status
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

const TrackDeliveryDialog = () => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Track New Delivery</DialogTitle>
        <DialogDescription>
          Record a new feedstock delivery from a supplier
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="supplier" className="text-right">Supplier</label>
          <Select>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {mockSuppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="volume" className="text-right">Volume (tons)</label>
          <Input id="volume" type="number" className="col-span-3" placeholder="Enter volume" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="location" className="text-right">Location</label>
          <Input id="location" className="col-span-3" placeholder="Enter collection point" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="moisture" className="text-right">Moisture (%)</label>
          <Input id="moisture" type="number" step="0.1" className="col-span-3" placeholder="Enter moisture percentage" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="purity" className="text-right">Purity (%)</label>
          <Input id="purity" type="number" step="0.1" className="col-span-3" placeholder="Enter purity percentage" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsTrackDeliveryOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsTrackDeliveryOpen(false)}>
          Record Delivery
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('fieldOperations.title')}</h1>
          <p className="text-muted-foreground">{t('fieldOperations.subtitle')}</p>
        </div>
        <Dialog open={isTrackDeliveryOpen} onOpenChange={setIsTrackDeliveryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('fieldOperations.newDelivery')}
            </Button>
          </DialogTrigger>
          <TrackDeliveryDialog />
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            {t('fieldOperations.deliveries')}
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Warehouse className="w-4 h-4" />
            {t('fieldOperations.inventory')}
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex items-center gap-2">
            <Factory className="w-4 h-4" />
            {t('fieldOperations.processing')}
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t('fieldOperations.qualityControl')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('fieldOperations.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('fieldOperations.totalDeliveries')}</p>
                <p className="text-2xl font-bold">{deliveries.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('fieldOperations.pending')}</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('fieldOperations.approved')}</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('fieldOperations.totalVolume')}</p>
                <p className="text-2xl font-bold">
                  {deliveries.reduce((sum, d) => sum + d.volume, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('fieldOperations.searchDeliveries')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('fieldOperations.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('fieldOperations.allStatus')}</SelectItem>
            <SelectItem value="pending">{t('fieldOperations.pending')}</SelectItem>
            <SelectItem value="approved">{t('fieldOperations.approved')}</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="quality_check">Quality Check</SelectItem>
            <SelectItem value="stored">Stored</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterFeedstockType} onValueChange={setFilterFeedstockType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('fieldOperations.feedstockType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('fieldOperations.allTypes')}</SelectItem>
            <SelectItem value="palm_kernel_shell">Palm Kernel Shell</SelectItem>
            <SelectItem value="empty_fruit_bunch">Empty Fruit Bunch</SelectItem>
            <SelectItem value="mesocarp_fiber">Mesocarp Fiber</SelectItem>
            <SelectItem value="palm_mill_effluent">Palm Mill Effluent</SelectItem>
            <SelectItem value="shells">Shells</SelectItem>
            <SelectItem value="fronds">Fronds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('fieldOperations.deliveryTracking')}</CardTitle>
          <CardDescription>
            {filteredDeliveries.length} {filteredDeliveries.length === 1 ? 'delivery' : 'deliveries'} {t('fieldOperations.found')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Feedstock Type</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => {
                const supplier = mockSuppliers.find(s => s.id === delivery.supplierId);
                const qualityScore = getQualityScore(delivery.quality);

                return (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      {new Date(delivery.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{delivery.batch_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getFeedstockTypeLabel(delivery.feedstockType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{supplier?.name}</TableCell>
                    <TableCell>
                      <div className="font-medium">{delivery.volume.toLocaleString()} tons</div>
                      <div className="text-xs text-muted-foreground">{delivery.location.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className={`font-medium ${getQualityColor(qualityScore)}`}>
                            {qualityScore}/100
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>M: {delivery.quality.moisture}%</span>
                          <span>P: {delivery.quality.purity}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {delivery.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveDelivery(delivery.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectDelivery(delivery.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

          {selectedDelivery && (
            <DeliveryDetailsDialog delivery={selectedDelivery} />
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold">
                      {inventory.reduce((sum, inv) => sum + inv.totalVolume, 0).toLocaleString()} tons
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold">
                      {inventory.reduce((sum, inv) => sum + inv.availableVolume, 0).toLocaleString()} tons
                    </p>
                  </div>
                  <Warehouse className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Allocated</p>
                    <p className="text-2xl font-bold">
                      {inventory.reduce((sum, inv) => sum + inv.allocatedVolume, 0).toLocaleString()} tons
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('fieldOperations.inventoryOverview')}</CardTitle>
              <CardDescription>
                {t('fieldOperations.currentFeedstockInventory')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feedstock Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Avg Quality</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {getFeedstockTypeLabel(inv.feedstockType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{inv.location}</TableCell>
                      <TableCell className="font-medium">{inv.totalVolume.toLocaleString()} tons</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-600">
                            {inv.availableVolume.toLocaleString()} tons
                          </span>
                          <Progress
                            value={(inv.availableVolume / inv.totalVolume) * 100}
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {inv.allocatedVolume.toLocaleString()} tons
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getQualityColor(inv.qualityAverage)}`}>
                          {inv.qualityAverage}/100
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inv.lastUpdated).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
                    <p className="text-2xl font-bold">
                      {processingBatches.filter(b => b.status === 'in_progress').length}
                    </p>
                  </div>
                  <Factory className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold">
                      {processingBatches.filter(b => b.status === 'scheduled').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {processingBatches.filter(b => b.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Yield</p>
                    <p className="text-2xl font-bold">
                      {processingBatches.filter(b => b.yieldPercentage).length > 0
                        ? Math.round(
                            processingBatches
                              .filter(b => b.yieldPercentage)
                              .reduce((sum, b) => sum + (b.yieldPercentage || 0), 0) /
                            processingBatches.filter(b => b.yieldPercentage).length
                          )
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Processing Batches</CardTitle>
              <CardDescription>
                Active and scheduled processing batches with detailed workflow tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Feedstock Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Input/Output</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processingBatches.map((batch) => {
                    const feedstockRecord = deliveries.find(d => d.id === batch.feedstockRecordId);
                    const progressPercentage = (batch.currentStepIndex / batch.steps.length) * 100;

                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-mono text-xs">{batch.batchNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {feedstockRecord && getFeedstockTypeLabel(feedstockRecord.feedstockType)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getBatchStatusBadge(batch.status)}</TableCell>
                        <TableCell>{getPriorityBadge(batch.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercentage} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{batch.assignedTo}</TableCell>
                        <TableCell className="text-sm">
                          <div>{batch.inputVolume.toLocaleString()} tons</div>
                          {batch.actualOutputVolume && (
                            <div className="text-green-600">
                              → {batch.actualOutputVolume.toLocaleString()} tons
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBatch(batch)}
                            >
                              <Eye className="w-4 h-4" />
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

          {selectedBatch && (
            <ProcessingBatchDialog batch={selectedBatch} />
          )}
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Inspections</p>
                    <p className="text-2xl font-bold">{qualityInspections.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Passed</p>
                    <p className="text-2xl font-bold">
                      {qualityInspections.filter(i => i.overallResult === 'pass').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold">
                      {qualityInspections.filter(i => i.overallResult === 'fail').length}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">
                      {qualityInspections.filter(i => i.overallResult === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quality Inspections</CardTitle>
              <CardDescription>
                Recent quality control inspections and test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inspection ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Feedstock</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityInspections.map((inspection) => {
                    const feedstockRecord = deliveries.find(d => d.id === inspection.feedstockRecordId);

                    return (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-mono text-xs">{inspection.id}</TableCell>
                        <TableCell className="capitalize">{inspection.inspectionType.replace('_', ' ')}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(inspection.inspectionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">{inspection.inspectorName}</TableCell>
                        <TableCell>
                          {feedstockRecord && (
                            <Badge variant="outline" className="text-xs">
                              {getFeedstockTypeLabel(feedstockRecord.feedstockType)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {inspection.totalScore}/{inspection.maxScore}
                            </span>
                            <Progress
                              value={(inspection.totalScore / inspection.maxScore) * 100}
                              className="w-12 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{getInspectionResultBadge(inspection.overallResult)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedInspection(inspection)}
                            >
                              <Eye className="w-4 h-4" />
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

          {selectedInspection && (
            <QualityInspectionDialog inspection={selectedInspection} />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedstock Type Distribution</CardTitle>
                <CardDescription>Volume distribution by feedstock type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['palm_kernel_shell', 'empty_fruit_bunch', 'mesocarp_fiber', 'palm_mill_effluent', 'shells'].map(type => {
                    const typeData = inventory.find(inv => inv.feedstockType === type);
                    const volume = typeData?.totalVolume || 0;
                    const totalVolume = inventory.reduce((sum, inv) => sum + inv.totalVolume, 0);
                    const percentage = totalVolume > 0 ? (volume / totalVolume) * 100 : 0;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{getFeedstockTypeLabel(type as FeedstockRecord['feedstockType'])}</span>
                          <span className="font-medium">{volume.toLocaleString()} tons ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
                <CardDescription>Average quality scores by feedstock type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getFeedstockTypeLabel(inv.feedstockType)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{inv.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getQualityColor(inv.qualityAverage)}`}>
                          {inv.qualityAverage}/100
                        </span>
                        <Progress value={inv.qualityAverage} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Important metrics and alerts for feedstock management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Low Inventory Alert:</strong> Empty Fruit Bunch stock is below minimum threshold at Bali Storage Facility.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quality Improvement:</strong> Average quality score increased by 3% this month across all feedstock types.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Truck className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Processing Efficiency:</strong> Current processing operations have 95% efficiency rate.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldOperationsPage;