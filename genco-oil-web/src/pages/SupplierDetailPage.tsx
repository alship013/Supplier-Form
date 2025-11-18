import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, FileSignature, MapPin, Mail, Phone, Calendar, TrendingUp, FileText, Camera, AlertTriangle, CheckCircle, Users, Globe, Shield, TreePine } from 'lucide-react';
import { supplierDb, type SupplierData } from '@/services/supplierDatabase';

// Number formatting utility
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// Utility function to safely render values and prevent React object rendering errors
const safeRender = (value: any, fallback: string = ''): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  // If it's an object or anything else, return fallback to prevent React rendering errors
  return fallback;
};

const SupplierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const supplierData = supplierDb.getSupplierById(id);
      setSupplier(supplierData);
    }
    setLoading(false);
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return <Badge variant={type === 'supplier' ? 'default' : 'secondary'}>{type.toUpperCase()}</Badge>;
  };

  const handleEdit = () => {
    navigate(`/suppliers/edit/${id}`);
  };

  const handleDelete = () => {
    if (supplier) {
      supplierDb.deleteSupplier(supplier.id);
      navigate('/suppliers');
    }
  };

  const handleCreateContract = () => {
    // Navigate to contract creation with pre-filled supplier
    navigate(`/contracts/create?supplierId=${id}`);
  };

  if (loading) {
    return <div className="p-6">Loading supplier details...</div>;
  }

  if (!supplier) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Supplier Not Found</h2>
          <Button onClick={() => navigate('/suppliers')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Suppliers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/suppliers')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Suppliers
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{safeRender(supplier.supplierName, 'Invalid supplier name')}</h1>
            <p className="text-muted-foreground">Supplier Details & Survey Information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={handleCreateContract}
            variant="outline"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Create Contract
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Supplier
          </Button>
        </div>
      </div>

      {/* Status and Type */}
      <div className="flex gap-2">
        {getTypeBadge(supplier.type)}
        {getStatusBadge(supplier.status)}
        <Badge variant="outline">ID: {safeRender(supplier.uniqueSupplierId, 'N/A')}</Badge>
        <Badge variant="outline">Form: {safeRender(supplier.formId, 'N/A')}</Badge>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{safeRender(supplier.email, 'Invalid email')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{safeRender(supplier.phoneNumber, 'Invalid phone')}</span>
                </div>
                {supplier.contactPerson && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Contact: {safeRender(supplier.contactPerson, 'Invalid contact')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Location</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{safeRender(supplier.plantationAddress, 'Invalid address')}</span>
                </div>
                {supplier.gpsCoordinate && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>GPS: {safeRender(supplier.gpsCoordinate, 'Invalid GPS')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Survey Dates</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Survey: {new Date(supplier.surveyDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Verified: {new Date(supplier.dateVerified).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Land Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="w-5 h-5" />
            Land & Plantation Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatNumber(supplier.totalLandSize || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Land Size (Ha)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {supplier.plots?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Number of Plots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {safeRender(supplier.mainCropType, 'N/A')}
              </div>
              <div className="text-sm text-muted-foreground">Main Crop Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatNumber(supplier.estimatedYield || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Estimated Yield (kg/Ha)</div>
            </div>
          </div>

          {supplier.plots && supplier.plots.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Land Plots</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplier.plots.map((plot) => (
                  <Card key={plot.id} className="p-4">
                    <h5 className="font-medium mb-2">{plot.identifier}</h5>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Size: {plot.size} Ha</p>
                      {plot.gpsCoordinates && (
                        <p>GPS: {plot.gpsCoordinates.substring(0, 30)}...</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance & Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">EUDR Compliance</h4>
              <div className="space-y-2">
                <div className={`p-3 rounded-lg ${
                  supplier.hasDeforestation === 'no' ? 'bg-green-50 border border-green-200' :
                  supplier.hasDeforestation === 'yes' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {supplier.hasDeforestation === 'no' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : supplier.hasDeforestation === 'yes' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="font-medium">
                      Deforestation: {supplier.hasDeforestation === 'no' ? 'Clear' :
                                     supplier.hasDeforestation === 'yes' ? 'Risk Detected' : 'Unknown'}
                    </span>
                  </div>
                </div>
                {supplier.evidenceOfNoDeforestation && (
                  <p className="text-sm text-muted-foreground">Evidence: {safeRender(supplier.evidenceOfNoDeforestation, 'Invalid evidence')}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Land Legality</h4>
              <div className="space-y-2">
                <p><strong>Ownership:</strong> {safeRender(supplier.ownershipType, 'N/A')}</p>
                <p><strong>Legal Status:</strong> {safeRender(supplier.legalStatusOfLand, 'N/A')}</p>
                {supplier.proofOfOwnership && supplier.proofOfOwnership.length > 0 && (
                  <p><strong>Proof:</strong> {supplier.proofOfOwnership.join(', ')}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">ISCC Certification</h4>
              <div className="space-y-2">
                <p><strong>Land Use:</strong> {supplier.isccLandUse || 'N/A'}</p>
                <p><strong>GAP Training:</strong> {supplier.gapTraining || 'No'}</p>
                {supplier.previousLandUse && supplier.previousLandUse.length > 0 && (
                  <p><strong>Previous Use:</strong> {supplier.previousLandUse.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Information */}
      {supplier.declaration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Review & Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Surveyor</h4>
                <p>{supplier.surveyorSignature || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Supplier</h4>
                <p>{safeRender(supplier.supplierSignature, safeRender(supplier.supplierName, 'Unknown supplier'))}</p>
              </div>
            </div>
            {supplier.finalNotes && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Final Notes</h4>
                <p className="text-muted-foreground">{safeRender(supplier.finalNotes, '')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier "{supplier.supplierName}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupplierDetailPage;