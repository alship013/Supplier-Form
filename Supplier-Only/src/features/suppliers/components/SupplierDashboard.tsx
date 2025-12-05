import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Badge } from '../../shared/components/ui/badge';
import { Users, FileText, MapPin, LogOut, Edit } from 'lucide-react';

const SupplierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    // Load supplier data from localStorage or use mock data for testing
    let suppliers = JSON.parse(localStorage.getItem('vsts_suppliers') || '[]');
    let currentSupplier = suppliers.find((s: any) => s.id === user?.id);

    // If no supplier data found, create mock data for the admin user
    if (!currentSupplier && user?.role === 'admin') {
      currentSupplier = {
        id: user.id,
        supplierName: 'Demo Supplier Company',
        contactPerson: 'John Doe',
        email: 'admin@vsts.com',
        phoneNumber: '+1234567890',
        plantationAddress: '123 Demo Street, Demo City',
        gpsCoordinate: '-6.2088, 106.8456',
        status: 'approved',
        totalLandSize: 25,
        plots: [
          { id: '1', identifier: 'Plot 1', size: 15 },
          { id: '2', identifier: 'Plot 2', size: 10 }
        ],
        type: 'supplier',
        product: 'Rubber Seed',
        createdAt: new Date().toISOString()
      };

      // Save mock data to localStorage
      suppliers.push(currentSupplier);
      localStorage.setItem('vsts_suppliers', JSON.stringify(suppliers));
    }

    setSupplierData(currentSupplier);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  if (!supplierData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading supplier information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Supplier Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Registration Status</span>
                {getStatusBadge(supplierData.status || 'pending')}
              </CardTitle>
              <CardDescription>
                Current status of your supplier registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {supplierData.supplierName}
                  </div>
                  <div className="text-sm text-gray-600">Company Name</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {supplierData.totalLandSize || 0} Ha
                  </div>
                  <div className="text-sm text-gray-600">Total Land Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {supplierData.plots?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Number of Plots</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your registration is currently under review.
                  You will be notified once the verification process is complete.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/edit-profile')}
            >
              <CardContent className="p-6 text-center">
                <Edit className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-medium">Edit Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Update your information</p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/documents')}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-medium">Documents</h3>
                <p className="text-sm text-gray-600 mt-1">Upload supporting documents</p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/map-view')}
            >
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-medium">Map View</h3>
                <p className="text-sm text-gray-600 mt-1">View plantation locations</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your supplier registration details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Business Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Business Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Supplier ID:</strong> {supplierData.uniqueSupplierId || user?.id}</div>
                  <div><strong>Form ID:</strong> {supplierData.formId || 'N/A'}</div>
                  <div><strong>Company Name:</strong> {supplierData.supplierName}</div>
                  <div><strong>Supplier Type:</strong> {supplierData.type || 'supplier'}</div>
                  <div><strong>Main Product:</strong> {supplierData.product || 'N/A'}</div>
                  <div><strong>Registration Date:</strong> {supplierData.surveyDate || 'N/A'}</div>
                  <div><strong>Status:</strong> {getStatusBadge(supplierData.status || 'pending')}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Contact Person:</strong> {supplierData.contactPerson}</div>
                  <div><strong>Email:</strong> {supplierData.email}</div>
                  <div><strong>Phone:</strong> {supplierData.phoneNumber}</div>
                  <div><strong>Address:</strong> {supplierData.plantationAddress}</div>
                  {supplierData.gpsCoordinate && (
                    <div><strong>GPS:</strong> {supplierData.gpsCoordinate}</div>
                  )}
                  {supplierData.currentBuyer && (
                    <div><strong>Current Buyer:</strong> {supplierData.currentBuyer}</div>
                  )}
                </div>
              </div>

              {/* Land Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Land & Production</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Total Land Size:</strong> {supplierData.totalLandSize || 0} Ha</div>
                  <div><strong>Number of Plots:</strong> {supplierData.plots?.length || 0}</div>
                  <div><strong>Estimated Yield:</strong> {supplierData.estimatedYield || 0} kg/Ha</div>
                  {supplierData.mainCropType && (
                    <div><strong>Main Crop:</strong> {supplierData.mainCropType}</div>
                  )}
                  {supplierData.ownershipType && (
                    <div><strong>Land Ownership:</strong> {supplierData.ownershipType}</div>
                  )}
                  {supplierData.plantingYear && (
                    <div><strong>Planting Year:</strong> {supplierData.plantingYear}</div>
                  )}
                </div>
              </div>

            </div>

            {/* Land Status & Compliance */}
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Land Status</h4>
                  <div className="space-y-2 text-sm">
                    {supplierData.legalStatusOfLand && (
                      <div><strong>Legal Status:</strong> {supplierData.legalStatusOfLand}</div>
                    )}
                    {supplierData.certificateNumber && (
                      <div><strong>Certificate:</strong> {supplierData.certificateNumber}</div>
                    )}
                    {supplierData.proofOfOwnership && supplierData.proofOfOwnership.length > 0 && (
                      <div><strong>Ownership Proof:</strong> {supplierData.proofOfOwnership.join(', ')}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Compliance</h4>
                  <div className="space-y-2 text-sm">
                    {supplierData.hasDeforestation && (
                      <div><strong>Deforestation Check:</strong> {supplierData.hasDeforestation === 'no' ? '✅ Clear' : '⚠️ ' + supplierData.hasDeforestation}</div>
                    )}
                    {supplierData.otpVerified && (
                      <div><strong>Verification:</strong> ✅ OTP Verified</div>
                    )}
                    {supplierData.consentGiven && (
                      <div><strong>Digital Consent:</strong> ✅ Provided</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Plot Summary */}
            {supplierData.plots && supplierData.plots.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Plot Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {supplierData.plots.map((plot: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-sm">{plot.identifier}</div>
                      <div className="text-xs text-gray-600">
                        Size: {plot.size || 0} Ha
                        {plot.gpsCoordinates && ` | GPS: ${plot.gpsCoordinates}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        </div>
    </div>
  );
};

export default SupplierDashboard;