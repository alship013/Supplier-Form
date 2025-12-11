import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import type { SupplierData } from '../../shared/types/supplier';
import { Card, CardContent } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Textarea } from '../../shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';
import { Badge } from '../../shared/components/ui/badge';
import {
  ArrowLeft,
  Upload,
  Camera,
  Users,
  MapPin,
  Truck,
  Calendar,
  AlertCircle,
  Lock,
  Save,
  X,
  Shield,
  FileText,
  TreePine,
  Sprout,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

interface EditProfilePageProps {
  supplierData: SupplierData;
  onSave?: (updatedData: Partial<SupplierData>, restrictedChanges: boolean) => void;
  onCancel?: () => void;
}

// High-quality image processing function (reused from SupplierSurveyForm)
const processImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Only process if image is extremely large (>4000px) to maintain quality
      const maxDimension = 4000;

      if (width <= maxDimension && height <= maxDimension && file.size <= 8 * 1024 * 1024) {
        resolve(file);
        return;
      }

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            }));
          } else {
            resolve(file);
          }
        },
        file.type,
        0.95
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

const EditProfilePage: React.FC<EditProfilePageProps> = ({ supplierData, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  void user;

  const [activeTab, setActiveTab] = useState('basic');
  const [hasRestrictedChanges, setHasRestrictedChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<SupplierData>>({
    ...supplierData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Photo handling
  const handlePhotoUpload = async (field: keyof SupplierData['photos'], file: File) => {
    try {
      const processedFile = await processImage(file);
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [field]: processedFile
        }
      }));
    } catch (error) {
      console.error('Error processing photo:', error);
      alert('Failed to process photo. Please try again.');
    }
  };

  const handleRemovePhoto = (field: keyof SupplierData['photos']) => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [field]: undefined
      }
    }));
  };

  const updateFormData = (field: keyof SupplierData, value: any, isRestricted: boolean = false) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (isRestricted && !hasRestrictedChanges) {
      setHasRestrictedChanges(true);
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    const validationErrors: Record<string, string> = {};

    // Validate basic required fields
    if (!formData.supplierName?.trim()) {
      validationErrors.supplierName = 'Supplier name is required';
    }
    if (!formData.contactPerson?.trim()) {
      validationErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.phoneNumber?.trim()) {
      validationErrors.phoneNumber = 'Phone number is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('Please fill in all required fields');
      return;
    }

    const updatedData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };

    if (onSave) {
      onSave(updatedData, hasRestrictedChanges);
    } else {
      // Default behavior
      if (hasRestrictedChanges) {
        alert('Your changes have been submitted for admin approval. Restricted sections will be reviewed by an administrator.');
      } else {
        alert('Profile updated successfully!');
      }
      navigate('/dashboard');
    }
  };

  const renderReadOnlyField = (label: string, value: string | undefined) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Input value={value || ''} disabled className="bg-gray-50" />
    </div>
  );

  const renderRestrictedField = (
    label: string,
    value: any,
    field: keyof SupplierData,
    type: 'input' | 'textarea' | 'select' = 'input',
    options?: string[]
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <Badge variant="secondary" className="text-xs">
          <Lock className="w-3 h-3 mr-1" />
          Admin Approval Required
        </Badge>
      </div>
      {type === 'textarea' ? (
        <Textarea
          value={value || ''}
          onChange={(e) => updateFormData(field, e.target.value, true)}
          className="border-amber-200 focus:border-amber-500"
        />
      ) : type === 'select' ? (
        <Select value={value || ''} onValueChange={(v) => updateFormData(field, v, true)}>
          <SelectTrigger className="border-amber-200 focus:border-amber-500">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options?.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          value={value || ''}
          onChange={(e) => updateFormData(field, e.target.value, true)}
          className="border-amber-200 focus:border-amber-500"
        />
      )}
    </div>
  );

  // Steps configuration similar to SupplierSurveyForm
  const steps = [
    { id: 'basic', label: 'Basic Information', icon: Users },
    { id: 'land', label: 'Land & Compliance', icon: MapPin },
    { id: 'farming', label: 'Farming & Labor', icon: TreePine },
    { id: 'photos', label: 'Photos', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => onCancel ? onCancel() : navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-500">Update your supplier information</p>
              </div>
            </div>
            {hasRestrictedChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Contains changes requiring admin approval
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`${
                    activeTab === step.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="h-5 w-5" />
                  {step.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasRestrictedChanges && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Admin Approval Required</h3>
                <p className="mt-1 text-sm text-amber-700">
                  Some sections contain restricted fields that require administrator approval before changes take effect.
                  Your unrestricted changes will be saved immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>

                  {/* Read-only Reference Fields */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Reference Information (Read-only)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderReadOnlyField('Supplier ID', formData.uniqueSupplierId)}
                      {renderReadOnlyField('Form ID', formData.formId)}
                      {renderReadOnlyField('Registration Date', formData.surveyDate)}
                    </div>
                  </div>

                  {/* Unrestricted Section */}
                  <div className="mb-8">
                    <h3 className="text-base font-medium text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Unrestricted Changes (Save Immediately)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="supplierName" className="text-sm font-medium text-gray-700">
                          Supplier Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="supplierName"
                          value={formData.supplierName || ''}
                          onChange={(e) => updateFormData('supplierName', e.target.value)}
                          className={errors.supplierName ? 'border-red-500' : ''}
                        />
                        {errors.supplierName && <p className="text-sm text-red-500">{errors.supplierName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">
                          Contact Person <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson || ''}
                          onChange={(e) => updateFormData('contactPerson', e.target.value)}
                          className={errors.contactPerson ? 'border-red-500' : ''}
                        />
                        {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber || ''}
                          onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                          className={errors.phoneNumber ? 'border-red-500' : ''}
                        />
                        {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => updateFormData('email', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="plantationAddress" className="text-sm font-medium text-gray-700">Plantation Address</Label>
                        <Textarea
                          id="plantationAddress"
                          value={formData.plantationAddress || ''}
                          onChange={(e) => updateFormData('plantationAddress', e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gpsCoordinate" className="text-sm font-medium text-gray-700">GPS Coordinates</Label>
                        <Input
                          id="gpsCoordinate"
                          value={formData.gpsCoordinate || ''}
                          onChange={(e) => updateFormData('gpsCoordinate', e.target.value)}
                          placeholder="Format: latitude,longitude (e.g., -6.2088,106.8456)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product" className="text-sm font-medium text-gray-700">Product</Label>
                        <Select value={formData.product || ''} onValueChange={(v) => updateFormData('product', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="palm_oil">Palm Oil</SelectItem>
                            <SelectItem value="coconut">Coconut</SelectItem>
                            <SelectItem value="rubber">Rubber</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Land & Compliance Tab */}
            {activeTab === 'land' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Land Status & Compliance</h2>

                  {/* Restricted Section - Land & Legal */}
                  <div className="mb-8">
                    <h3 className="text-base font-medium text-amber-700 mb-4 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Restricted Changes (Require Admin Approval)
                    </h3>
                    <div className="space-y-6 p-4 border-2 border-amber-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Land Status and Legality</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderRestrictedField(
                          'Ownership Type',
                          formData.ownershipType,
                          'ownershipType',
                          'select',
                          ['Owned', 'Leased', 'Rented', 'Customary', 'Other']
                        )}

                        {renderRestrictedField(
                          'Certificate Number',
                          formData.certificateNumber,
                          'certificateNumber'
                        )}

                        {renderRestrictedField(
                          'Legal Status of Land',
                          formData.legalStatusOfLand,
                          'legalStatusOfLand',
                          'select',
                          ['Certified', 'In Process', 'Not Yet Certified', 'Traditional', 'Other']
                        )}

                        {renderRestrictedField(
                          'Current Buyer',
                          formData.currentBuyer,
                          'currentBuyer'
                        )}

                        <div className="md:col-span-2">
                          {renderRestrictedField(
                            'Other Ownership Details',
                            formData.otherOwnershipDetails,
                            'otherOwnershipDetails',
                            'textarea'
                          )}
                        </div>

                        <div className="md:col-span-2">
                          {renderRestrictedField(
                            'Other Legal Status Details',
                            formData.otherLegalStatusDetails,
                            'otherLegalStatusDetails',
                            'textarea'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Restricted Section - EUDR Compliance */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-4">EUDR Compliance</h4>
                    <div className="space-y-6 p-4 border-2 border-amber-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderRestrictedField(
                          'Deforestation Status',
                          formData.hasDeforestation,
                          'hasDeforestation',
                          'select',
                          ['yes', 'no', 'unknown']
                        )}

                        <div className="md:col-span-2">
                          {renderRestrictedField(
                            'Evidence of No Deforestation',
                            formData.evidenceOfNoDeforestation,
                            'evidenceOfNoDeforestation',
                            'textarea'
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium text-gray-700">Legality Checklist</Label>
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Admin Approval Required
                          </Badge>
                        </div>
                        <div className="space-y-2 border rounded-lg p-4">
                          {['Land ownership proof', 'Environmental permit', 'Business license'].map(item => (
                            <label key={item} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.legalityChecklist?.includes(item) || false}
                                onChange={(e) => {
                                  const checklist = formData.legalityChecklist || [];
                                  if (e.target.checked) {
                                    updateFormData('legalityChecklist', [...checklist, item], true);
                                  } else {
                                    updateFormData('legalityChecklist', checklist.filter(i => i !== item), true);
                                  }
                                }}
                                className="rounded border-amber-200"
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderRestrictedField(
                          'Proximity to Indigenous Lands',
                          formData.proximityToIndigenous,
                          'proximityToIndigenous'
                        )}

                        <div className="md:col-span-2">
                          {renderRestrictedField(
                            'Land Conflicts',
                            formData.landConflicts,
                            'landConflicts',
                            'textarea'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Restricted Section - ISCC */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">ISCC Self Assessment</h4>
                    <div className="space-y-6 p-4 border-2 border-amber-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderRestrictedField(
                          'Land Use Change',
                          formData.isccLandUse,
                          'isccLandUse',
                          'select',
                          ['No change', 'Forest to agricultural', 'Grassland to agricultural', 'Other']
                        )}

                        {renderRestrictedField(
                          'Previous Land Use',
                          formData.previousLandUse?.join(', '),
                          'previousLandUse'
                        )}

                        {renderRestrictedField(
                          'Grievance Mechanism',
                          formData.grievanceMechanism,
                          'grievanceMechanism',
                          'textarea'
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium text-gray-700">Environmental Practices</Label>
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Admin Approval Required
                          </Badge>
                        </div>
                        <div className="space-y-2 border rounded-lg p-4">
                          {['Soil conservation', 'Water management', 'Biodiversity protection'].map(item => (
                            <label key={item} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.environmentalPractices?.includes(item) || false}
                                onChange={(e) => {
                                  const practices = formData.environmentalPractices || [];
                                  if (e.target.checked) {
                                    updateFormData('environmentalPractices', [...practices, item], true);
                                  } else {
                                    updateFormData('environmentalPractices', practices.filter(i => i !== item), true);
                                  }
                                }}
                                className="rounded border-amber-200"
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium text-gray-700">Worker Rights</Label>
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Admin Approval Required
                          </Badge>
                        </div>
                        <div className="space-y-2 border rounded-lg p-4">
                          {['Fair wages', 'Safe working conditions', 'No child labor', 'Freedom of association'].map(item => (
                            <label key={item} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.workerRights?.includes(item) || false}
                                onChange={(e) => {
                                  const rights = formData.workerRights || [];
                                  if (e.target.checked) {
                                    updateFormData('workerRights', [...rights, item], true);
                                  } else {
                                    updateFormData('workerRights', rights.filter(i => i !== item), true);
                                  }
                                }}
                                className="rounded border-amber-200"
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Farming & Labor Tab */}
            {activeTab === 'farming' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Farming Practices & Labor Information</h2>

                  {/* Unrestricted Section - Labor Information */}
                  <div className="mb-8">
                    <h3 className="text-base font-medium text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Unrestricted Changes (Save Immediately)
                    </h3>
                    <div className="space-y-6">
                      <h4 className="font-medium text-gray-900">Labor Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="permanentWorkers" className="text-sm font-medium text-gray-700">
                            Number of Permanent Workers
                          </Label>
                          <Input
                            id="permanentWorkers"
                            type="number"
                            min="0"
                            value={formData.permanentWorkers || 0}
                            onChange={(e) => updateFormData('permanentWorkers', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="seasonalWorkers" className="text-sm font-medium text-gray-700">
                            Number of Seasonal Workers
                          </Label>
                          <Input
                            id="seasonalWorkers"
                            type="number"
                            min="0"
                            value={formData.seasonalWorkers || 0}
                            onChange={(e) => updateFormData('seasonalWorkers', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-700">Labor Types</Label>
                          <div className="mt-2 space-y-2 border rounded-lg p-4">
                            {['Family labor', 'Hired labor', 'Contract workers'].map(type => (
                              <label key={type} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.laborType?.includes(type) || false}
                                  onChange={(e) => {
                                    const laborTypes = formData.laborType || [];
                                    if (e.target.checked) {
                                      updateFormData('laborType', [...laborTypes, type]);
                                    } else {
                                      updateFormData('laborType', laborTypes.filter(t => t !== type));
                                    }
                                  }}
                                />
                                <span className="text-sm">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unrestricted Section - Access & Logistics */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-4">Access and Logistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="roadCondition" className="text-sm font-medium text-gray-700">Road Condition</Label>
                        <Select value={formData.roadCondition || ''} onValueChange={(v) => updateFormData('roadCondition', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select road condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paved">Paved</SelectItem>
                            <SelectItem value="gravel">Gravel</SelectItem>
                            <SelectItem value="dirt">Dirt</SelectItem>
                            <SelectItem value="no_road">No road access</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="distance" className="text-sm font-medium text-gray-700">
                          Distance to Main Road (km)
                        </Label>
                        <Input
                          id="distance"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.distance || 0}
                          onChange={(e) => updateFormData('distance', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accessCategory" className="text-sm font-medium text-gray-700">Access Category</Label>
                        <Select value={formData.accessCategory || ''} onValueChange={(v) => updateFormData('accessCategory', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy (All weather)</SelectItem>
                            <SelectItem value="moderate">Moderate (Seasonal)</SelectItem>
                            <SelectItem value="difficult">Difficult (4WD only)</SelectItem>
                            <SelectItem value="very_difficult">Very difficult (Walking only)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Unrestricted Section - Farming Practices */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-4">Farming Practices & Costs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="waterSource" className="text-sm font-medium text-gray-700">Water Source</Label>
                        <Select value={formData.waterSource || ''} onValueChange={(v) => updateFormData('waterSource', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select water source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rainfall">Rainfall</SelectItem>
                            <SelectItem value="irrigation">Irrigation</SelectItem>
                            <SelectItem value="well">Well</SelectItem>
                            <SelectItem value="river">River</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pestControlMethod" className="text-sm font-medium text-gray-700">Pest Control Method</Label>
                        <Select value={formData.pestControlMethod || ''} onValueChange={(v) => updateFormData('pestControlMethod', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pest control method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="chemical">Chemical</SelectItem>
                            <SelectItem value="integrated">Integrated Pest Management</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fertilizerUse" className="text-sm font-medium text-gray-700">Fertilizer Use</Label>
                        <Select value={formData.fertilizerUse || ''} onValueChange={(v) => updateFormData('fertilizerUse', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fertilizer use" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="organic">Organic only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.fertilizerUse === 'yes' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fertilizerBrandDetails" className="text-sm font-medium text-gray-700">
                              Fertilizer Brand Details
                            </Label>
                            <Input
                              id="fertilizerBrandDetails"
                              value={formData.fertilizerBrandDetails || ''}
                              onChange={(e) => updateFormData('fertilizerBrandDetails', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Application Months</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                <label key={month} className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={formData.fertilizerMonths?.includes(month) || false}
                                    onChange={(e) => {
                                      const months = formData.fertilizerMonths || [];
                                      if (e.target.checked) {
                                        updateFormData('fertilizerMonths', [...months, month]);
                                      } else {
                                        updateFormData('fertilizerMonths', months.filter(m => m !== month));
                                      }
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-sm">{month}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="costFertilizer" className="text-sm font-medium text-gray-700">
                          Annual Fertilizer Cost (USD)
                        </Label>
                        <Input
                          id="costFertilizer"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costFertilizer || 0}
                          onChange={(e) => updateFormData('costFertilizer', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="costLabor" className="text-sm font-medium text-gray-700">
                          Annual Labor Cost (USD)
                        </Label>
                        <Input
                          id="costLabor"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costLabor || 0}
                          onChange={(e) => updateFormData('costLabor', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="costTransport" className="text-sm font-medium text-gray-700">
                          Annual Transport Cost (USD)
                        </Label>
                        <Input
                          id="costTransport"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costTransport || 0}
                          onChange={(e) => updateFormData('costTransport', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Unrestricted Section - Seasonality */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Seasonality</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="harvestDateStart" className="text-sm font-medium text-gray-700">
                          Harvest Period Start
                        </Label>
                        <Input
                          id="harvestDateStart"
                          type="date"
                          value={formData.harvestDateStart || ''}
                          onChange={(e) => updateFormData('harvestDateStart', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="harvestDateEnd" className="text-sm font-medium text-gray-700">
                          Harvest Period End
                        </Label>
                        <Input
                          id="harvestDateEnd"
                          type="date"
                          value={formData.harvestDateEnd || ''}
                          onChange={(e) => updateFormData('harvestDateEnd', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="peakSeasonStart" className="text-sm font-medium text-gray-700">
                          Peak Season Start
                        </Label>
                        <Input
                          id="peakSeasonStart"
                          type="date"
                          value={formData.peakSeasonStart || ''}
                          onChange={(e) => updateFormData('peakSeasonStart', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="peakSeasonEnd" className="text-sm font-medium text-gray-700">
                          Peak Season End
                        </Label>
                        <Input
                          id="peakSeasonEnd"
                          type="date"
                          value={formData.peakSeasonEnd || ''}
                          onChange={(e) => updateFormData('peakSeasonEnd', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seedCollectionStart" className="text-sm font-medium text-gray-700">
                          Seed Collection Start
                        </Label>
                        <Input
                          id="seedCollectionStart"
                          type="date"
                          value={formData.seedCollectionStart || ''}
                          onChange={(e) => updateFormData('seedCollectionStart', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seedCollectionEnd" className="text-sm font-medium text-gray-700">
                          Seed Collection End
                        </Label>
                        <Input
                          id="seedCollectionEnd"
                          type="date"
                          value={formData.seedCollectionEnd || ''}
                          onChange={(e) => updateFormData('seedCollectionEnd', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fruitDevelopmentStart" className="text-sm font-medium text-gray-700">
                          Fruit Development Start
                        </Label>
                        <Input
                          id="fruitDevelopmentStart"
                          type="date"
                          value={formData.fruitDevelopmentStart || ''}
                          onChange={(e) => updateFormData('fruitDevelopmentStart', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fruitDevelopmentEnd" className="text-sm font-medium text-gray-700">
                          Fruit Development End
                        </Label>
                        <Input
                          id="fruitDevelopmentEnd"
                          type="date"
                          value={formData.fruitDevelopmentEnd || ''}
                          onChange={(e) => updateFormData('fruitDevelopmentEnd', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Photo Management</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload or update your plantation photos. Supported formats: JPG, PNG, WebP (Max 10MB)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'supplier' as keyof SupplierData['photos'], label: 'Supplier/Farm Owner' },
                      { key: 'cropSample' as keyof SupplierData['photos'], label: 'Crop Sample' },
                      { key: 'plantation' as keyof SupplierData['photos'], label: 'Plantation Overview' },
                      { key: 'landTitle' as keyof SupplierData['photos'], label: 'Land Title/Document' },
                      { key: 'roadAccess' as keyof SupplierData['photos'], label: 'Road Access' }
                    ].map(photoType => (
                      <div key={photoType.key} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">{photoType.label}</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          {formData.photos?.[photoType.key] ? (
                            <div className="space-y-2">
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(formData.photos[photoType.key] as File)}
                                  alt={photoType.label}
                                  className="w-full h-48 object-cover rounded"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => handleRemovePhoto(photoType.key)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handlePhotoUpload(photoType.key, file);
                                  };
                                  input.click();
                                }}
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Replace Photo
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-2">
                                <label htmlFor={`photo-${photoType.key}`} className="cursor-pointer">
                                  <span className="text-sm text-primary-600 hover:text-primary-500">
                                    Upload photo
                                  </span>
                                  <input
                                    id={`photo-${photoType.key}`}
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handlePhotoUpload(photoType.key, file);
                                    }}
                                  />
                                </label>
                                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t mt-8">
              <Button
                variant="outline"
                onClick={() => onCancel ? onCancel() : navigate('/dashboard')}
              >
                Cancel
              </Button>
              <div className="space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({ ...supplierData });
                    setHasRestrictedChanges(false);
                    setErrors({});
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Changes
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;