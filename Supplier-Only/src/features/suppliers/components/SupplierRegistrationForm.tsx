import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import type { UploadedFile, SupplierFormData } from '../../shared';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Separator,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../shared';
import { ArrowLeft, Upload, MapPin, Users, TreePine, Shield, FileText, Camera, Calendar, AlertTriangle, CheckCircle, X } from 'lucide-react';


// High-quality image processing function
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
        // Return original if it's already good quality
        resolve(file);
        return;
      }

      // Smart resizing only for very large images
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // High-quality rendering
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
            // Return original if processing doesn't improve quality or size
            resolve(file);
          }
        },
        file.type,
        0.95 // Very high quality (95%)
      );
    };

    img.src = URL.createObjectURL(file);
  });
};


const SupplierRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { registerSupplier, isLoading } = useAuth();

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateSupplierId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SUP-${timestamp}-${random}`;
  };

  // Form state with all fields
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SupplierFormData>({
    // Basic Information
    formId: '',
    uniqueSupplierId: '',
    surveyDate: new Date().toISOString().split('T')[0],
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    plantationAddress: '',
    gpsCoordinate: '',
    primaryProduct: '',
    type: 'supplier',

    // Land Status and Legality
    ownershipType: '',
    proofOfOwnership: [],
    certificateNumber: '',
    legalStatusOfLand: '',
    currentBuyer: '',

    // EUDR Compliance
    hasDeforestation: 'unknown',
    evidenceOfNoDeforestation: '',
    legalityChecklist: [],
    proximityToCommunities: '',
    knownLandConflicts: '',
    harvestDateStart: '',
    harvestDateEnd: '',
    firstPointOfSale: '',
    plots: [{ id: '1', identifier: 'Plot 1', size: 0, gpsCoordinates: '' }],

    // ISCC Self Assessment
    isccLandUse: '',
    previousLandUse: [],
    environmentalPractices: [],
    healthSafetyChecklist: [],
    workerRights: [],
    grievanceMechanism: '',
    freedomOfAssociation: '',
    recordKeeping: [],
    gapTraining: 'no',

    // Plantation Profile
    mainCropType: '',
    plantingYear: 0,
    ageOfTrees: 0,
    totalLandSize: 0,
    estimatedYield: 0,
    soilType: '',
    topography: '',
    farmingSystem: '',

    // Labor
    laborType: [],
    numberWorkersPermanent: 0,
    numberWorkersSeasonal: 0,

    // Access and Logistics
    roadCondition: '',
    distanceToMarket: 0,
    accessCategory: '',

    // Farming Practices & Costs
    waterSource: '',
    pestControlMethod: '',
    quantitySpecs: '',
    fertilizerUse: '',
    fertilizerType: '',
    fertilizerDetails: '',
    fertilizerMonths: [],
    costFertilizer: 0,
    costLabor: 0,
    costTransport: 0,

    // Seasonality
    peakSeasonStart: '',
    peakSeasonEnd: '',
    seedCollectionStart: '',
    seedCollectionEnd: '',
    fruitDevelopmentStart: '',
    fruitDevelopmentEnd: '',

    // Review and Submit
    finalNotes: '',
    observedRedFlags: [],
    photos: {},
    recommendedFollowUp: '',
    followUpReason: '',
    declaration: false,
    surveyorSignature: '',
    supplierSignature: '',
    dateVerified: new Date().toISOString().split('T')[0],

    // Digital Consent and OTP
    consentGiven: false,
    consentTimestamp: '',
    tncVersion: '1.0',
    otpCode: '',
    userEnteredOtp: '',
    otpRequested: false,
    otpVerified: false,
    ipAddress: '',
    verificationTimestamp: '',

    // Additional Documents
    ownershipDocument: undefined,
    proofPhotos: {
      ownership: undefined,
      additional: []
    }
  });

  // Account credentials
  const [credentials, setCredentials] = useState({
    uniqueSupplierId: generateSupplierId(),
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof SupplierFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Sync uniqueSupplierId from credentials to formData
  useEffect(() => {
    updateFormData('uniqueSupplierId', credentials.uniqueSupplierId);
  }, [credentials.uniqueSupplierId]);

  const updateCredentials = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File upload functions
  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and WebP files are allowed';
    }

    // Check file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileUpload = async (photoType: keyof SupplierFormData['photos'], file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors(prev => ({ ...prev, [photoType]: error }));
      return;
    }

    try {
      // Create preview
      const preview = URL.createObjectURL(file);

      // Process the image with high quality preservation
      const processedFile = await processImage(file);

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        file,
        preview,
        compressedFile: processedFile
      };

      // Update form data
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [photoType]: uploadedFile
        }
      }));

      // Clear any existing errors for this photo type
      if (errors[photoType]) {
        setErrors(prev => ({ ...prev, [photoType]: '' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [photoType]: 'Failed to process image' }));
    }
  };

  const removePhoto = (photoType: keyof SupplierFormData['photos']) => {
    setFormData(prev => {
      const updatedPhotos = { ...prev.photos };
      if (updatedPhotos[photoType]?.preview) {
        URL.revokeObjectURL(updatedPhotos[photoType].preview);
      }
      delete updatedPhotos[photoType];
      return {
        ...prev,
        photos: updatedPhotos
      };
    });

    // Clear any errors for this photo type
    if (errors[photoType]) {
      setErrors(prev => ({ ...prev, [photoType]: '' }));
    }
  };

  const handleFileChange = (photoType: keyof SupplierFormData['photos']) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(photoType, file);
    }
    // Reset input value to allow uploading the same file again if removed
    e.target.value = '';
  };

  // Proof photo functions
  const handleProofPhotoUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors(prev => ({ ...prev, proofPhoto: error }));
      return;
    }

    try {
      // Create preview
      const preview = URL.createObjectURL(file);

      // Process the image with high quality preservation
      const processedFile = await processImage(file);

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        file,
        preview,
        compressedFile: processedFile
      };

      // Update form data
      setFormData(prev => ({
        ...prev,
        proofPhotos: {
          ...prev.proofPhotos,
          ownership: uploadedFile
        }
      }));

      // Clear any existing errors
      if (errors.proofPhoto) {
        setErrors(prev => ({ ...prev, proofPhoto: '' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, proofPhoto: 'Failed to process photo' }));
    }
  };

  const removeProofPhoto = () => {
    setFormData(prev => {
      const updatedProofPhotos = { ...prev.proofPhotos };
      if (updatedProofPhotos.ownership?.preview) {
        URL.revokeObjectURL(updatedProofPhotos.ownership.preview);
      }
      updatedProofPhotos.ownership = undefined;
      return {
        ...prev,
        proofPhotos: updatedProofPhotos
      };
    });

    // Clear any errors
    if (errors.proofPhoto) {
      setErrors(prev => ({ ...prev, proofPhoto: '' }));
    }
  };

  // OTP functions
  const generateOTP = () => {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const getClientIP = async () => {
    try {
      // For development/testing, we'll use a mock IP
      // In production, you could use a service like https://api.ipify.org or your backend
      const mockIP = '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
      return mockIP;
    } catch (error) {
      return 'Unknown';
    }
  };

  const requestOTP = async () => {
    const otp = generateOTP();
    const phoneNumber = formData.phoneNumber;

    // Generate client IP
    const ipAddress = await getClientIP();

    // Update form with OTP data
    setFormData(prev => ({
      ...prev,
      otpCode: otp,
      otpRequested: true,
      ipAddress: ipAddress,
      verificationTimestamp: new Date().toISOString()
    }));

    // Show the OTP to user (mock SMS service)
    alert(`🔐 Your OTP Verification Code\n\nCode: ${otp}\n\nThis would be sent to: ${phoneNumber}\nYour IP: ${ipAddress}`);
  };

  const verifyOTP = () => {
    if (formData.userEnteredOtp === formData.otpCode) {
      setFormData(prev => ({
        ...prev,
        otpVerified: true
      }));
      setErrors(prev => ({ ...prev, otp: '' }));
    } else {
      setErrors(prev => ({ ...prev, otp: 'Invalid OTP. Please try again.' }));
    }
  };

  const clearOTP = () => {
    setFormData(prev => ({
      ...prev,
      otpCode: '',
      userEnteredOtp: '',
      otpRequested: false,
      otpVerified: false
    }));
    setErrors(prev => ({ ...prev, otp: '' }));
  };

  const addPlot = () => {
    const newPlot = {
      id: Date.now().toString(),
      identifier: `Plot ${formData.plots.length + 1}`,
      size: 0,
      gpsCoordinates: ''
    };
    updateFormData('plots', [...formData.plots, newPlot]);
  };

  const removePlot = (index: number) => {
    const updatedPlots = formData.plots.filter((_, i) => i !== index);
    updateFormData('plots', updatedPlots);
  };

  const updatePlot = (index: number, field: string, value: any) => {
    const updatedPlots = [...formData.plots];
    updatedPlots[index] = { ...updatedPlots[index], [field]: value };
    updateFormData('plots', updatedPlots);
  };

  const toggleCheckboxArray = (field: keyof SupplierFormData, value: string) => {
    const currentArray = formData[field] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, updatedArray);
  };

  const validateStep = (step: number, returnErrorsOnly = false): boolean | Record<string, string> => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!credentials.email.trim()) newErrors.email = 'Email is required';
        if (!credentials.password) newErrors.password = 'Password is required';
        if (credentials.password !== credentials.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.supplierName.trim()) newErrors.supplierName = 'Supplier name is required';
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.plantationAddress.trim()) newErrors.plantationAddress = 'Address is required';
        break;

      case 2: // Land Status and Legality
        if (!formData.ownershipType) newErrors.ownershipType = 'Ownership type is required';
        if (!formData.legalStatusOfLand) newErrors.legalStatusOfLand = 'Legal status is required';
        break;

      case 3: // EUDR Compliance
        if (!formData.hasDeforestation) newErrors.hasDeforestation = 'Deforestation status is required';
        if (formData.hasDeforestation === 'no' && !formData.evidenceOfNoDeforestation.trim()) {
          newErrors.evidenceOfNoDeforestation = 'Evidence is required when no deforestation';
        }
        break;

      case 4: // ISCC Self Assessment
        if (!formData.isccLandUse) newErrors.isccLandUse = 'ISCC land use is required';
        break;

      case 5: // Plantation Profile
        if (!formData.totalLandSize || formData.totalLandSize <= 0) {
          newErrors.totalLandSize = 'Land size must be greater than 0';
        }
        if (!formData.mainCropType.trim()) newErrors.mainCropType = 'Main crop type is required';
        break;

      case 6: // Review and Submit
        if (!formData.consentGiven) {
          newErrors.consent = 'You must agree to the Terms and Conditions to proceed';
        }
        if (!formData.otpVerified) {
          newErrors.otp = 'You must complete OTP verification to submit';
        }
        break;
    }

    if (returnErrorsOnly) {
      return newErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    // Clean up any existing preview URLs
    Object.values(formData.photos).forEach(photo => {
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    });

    // Clean up proof photos
    if (formData.proofPhotos.ownership?.preview) {
      URL.revokeObjectURL(formData.proofPhotos.ownership.preview);
    }
    formData.proofPhotos.additional?.forEach(photo => {
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    });

    const newId = generateSupplierId();
    setCredentials({
      uniqueSupplierId: newId,
      email: '',
      password: '',
      confirmPassword: ''
    });
    setFormData({
      // Basic Information
      formId: '',
      uniqueSupplierId: newId,
      surveyDate: new Date().toISOString().split('T')[0],
      supplierName: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      plantationAddress: '',
      gpsCoordinate: '',
      primaryProduct: '',
      type: 'supplier',

      // Land Status and Legality
      ownershipType: '',
      proofOfOwnership: [],
      certificateNumber: '',
      legalStatusOfLand: '',
      currentBuyer: '',

      // EUDR Compliance
      hasDeforestation: 'unknown',
      evidenceOfNoDeforestation: '',
      legalityChecklist: [],
      proximityToCommunities: '',
      knownLandConflicts: '',
      harvestDateStart: '',
      harvestDateEnd: '',
      firstPointOfSale: '',
      plots: [{ id: '1', identifier: 'Plot 1', size: 0, gpsCoordinates: '' }],

      // ISCC Self Assessment
      isccLandUse: '',
      previousLandUse: [],
      environmentalPractices: [],
      healthSafetyChecklist: [],
      workerRights: [],
      grievanceMechanism: '',
      freedomOfAssociation: '',
      recordKeeping: [],
      gapTraining: 'no',

      // Plantation Profile
      mainCropType: '',
      plantingYear: 0,
      ageOfTrees: 0,
      totalLandSize: 0,
      estimatedYield: 0,
      soilType: '',
      topography: '',
      farmingSystem: '',

      // Labor
      laborType: [],
      numberWorkersPermanent: 0,
      numberWorkersSeasonal: 0,

      // Access and Logistics
      roadCondition: '',
      distanceToMarket: 0,
      accessCategory: '',

      // Farming Practices & Costs
      waterSource: '',
      pestControlMethod: '',
      quantitySpecs: '',
      fertilizerUse: '',
      fertilizerType: '',
      fertilizerDetails: '',
      fertilizerMonths: [],
      costFertilizer: 0,
      costLabor: 0,
      costTransport: 0,

      // Seasonality
      peakSeasonStart: '',
      peakSeasonEnd: '',
      seedCollectionStart: '',
      seedCollectionEnd: '',
      fruitDevelopmentStart: '',
      fruitDevelopmentEnd: '',

      // Review and Submit
      finalNotes: '',
      observedRedFlags: [],
      photos: {},
      recommendedFollowUp: '',
      followUpReason: '',
      declaration: false,
      surveyorSignature: '',
      supplierSignature: '',
      dateVerified: new Date().toISOString().split('T')[0],

      // Digital Consent and OTP
      consentGiven: false,
      consentTimestamp: '',
      tncVersion: '1.0',
      otpCode: '',
      userEnteredOtp: '',
      otpRequested: false,
      otpVerified: false,
      ipAddress: '',
      verificationTimestamp: '',

      // Additional Documents
      ownershipDocument: undefined,
      proofPhotos: {
        ownership: undefined,
        additional: []
      }
    });
    setErrors({});
    setCurrentStep(1);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 6) {
      setCurrentStep(6);
      return;
    }

    // Validate all steps before submission
    const allErrors: Record<string, string> = {};
    for (let step = 1; step <= 6; step++) {
      const stepErrors = validateStep(step, true) as Record<string, string>;
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      let firstErrorStep = 1;
      for (let step = 1; step <= 6; step++) {
        const stepErrors = validateStep(step, true) as Record<string, string>;
        if (Object.keys(stepErrors).length > 0) {
          firstErrorStep = step;
          break;
        }
      }
      setCurrentStep(firstErrorStep);
      setErrors({
        ...allErrors,
        submit: 'Please complete all required fields in all steps before submitting.'
      });
      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        formId: `FORM-${Date.now()}`,
        consentTimestamp: new Date().toISOString()
      };

      const success = await registerSupplier({
        username: credentials.uniqueSupplierId,
        email: credentials.email,
        password: credentials.password,
        fullName: formData.supplierName,
        supplierData: updatedFormData
      });

      if (success) {
        navigate('/supplier-success');
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred during registration.' });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Create your account and provide basic contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="uniqueSupplierId">Unique Supplier ID</Label>
                  <Input
                    id="uniqueSupplierId"
                    value={credentials.uniqueSupplierId}
                    readOnly
                    className="bg-gray-50 border-gray-300 text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">System-generated identifier</p>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => updateCredentials('email', e.target.value)}
                    placeholder="your@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => updateCredentials('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={credentials.confirmPassword}
                    onChange={(e) => updateCredentials('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name *</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplierName}
                    onChange={(e) => updateFormData('supplierName', e.target.value)}
                    placeholder="Enter company or farm name"
                    className={errors.supplierName ? 'border-red-500' : ''}
                  />
                  {errors.supplierName && <p className="text-red-500 text-sm mt-1">{errors.supplierName}</p>}
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => updateFormData('contactPerson', e.target.value)}
                    placeholder="Full name of contact person"
                    className={errors.contactPerson ? 'border-red-500' : ''}
                  />
                  {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="surveyDate">Survey Date</Label>
                  <Input
                    id="surveyDate"
                    type="date"
                    value={formData.surveyDate}
                    onChange={(e) => updateFormData('surveyDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="primaryProduct">Primary Product</Label>
                <Select value={formData.primaryProduct} onValueChange={(value) => updateFormData('primaryProduct', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rubber Seed">Rubber Seed</SelectItem>
                    <SelectItem value="Copra">Copra</SelectItem>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="POME">POME (Palm Oil Mill Effluent)</SelectItem>
                    <SelectItem value="Enzyme">Enzyme</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Select the main product you supply or produce</p>
              </div>

              <div>
                <Label htmlFor="plantationAddress">Plantation Address *</Label>
                <Textarea
                  id="plantationAddress"
                  value={formData.plantationAddress}
                  onChange={(e) => updateFormData('plantationAddress', e.target.value)}
                  placeholder="Enter complete plantation address"
                  rows={3}
                  className={errors.plantationAddress ? 'border-red-500' : ''}
                />
                {errors.plantationAddress && <p className="text-red-500 text-sm mt-1">{errors.plantationAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gpsCoordinate">GPS Coordinates</Label>
                  <Input
                    id="gpsCoordinate"
                    value={formData.gpsCoordinate}
                    onChange={(e) => updateFormData('gpsCoordinate', e.target.value)}
                    placeholder="e.g., -6.2088, 106.8456"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Registration Type</Label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value as 'supplier' | 'farmer')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Land Status and Legality
              </CardTitle>
              <CardDescription>
                Information about land ownership and legal status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownershipType">Ownership Type *</Label>
                  <Select value={formData.ownershipType} onValueChange={(value) => updateFormData('ownershipType', value as any)}>
                    <SelectTrigger className={errors.ownershipType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Customary">Customary</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ownershipType && <p className="text-red-500 text-sm mt-1">{errors.ownershipType}</p>}
                </div>

                <div>
                  <Label htmlFor="certificateNumber">Certificate Number</Label>
                  <Input
                    id="certificateNumber"
                    value={formData.certificateNumber}
                    onChange={(e) => updateFormData('certificateNumber', e.target.value)}
                    placeholder="Enter certificate number"
                  />
                </div>
              </div>

              <div>
                <Label>Proof of Ownership</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {['SHM', 'HGB', 'HGU', 'HP', 'Girik', 'Adat', 'Other'].map((proof) => (
                    <label key={proof} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.proofOfOwnership.includes(proof)}
                        onChange={() => toggleCheckboxArray('proofOfOwnership', proof)}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm">{proof}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="legalStatusOfLand">Legal Status of Land *</Label>
                  <Select value={formData.legalStatusOfLand} onValueChange={(value) => updateFormData('legalStatusOfLand', value as any)}>
                    <SelectTrigger className={errors.legalStatusOfLand ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select legal status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clear">Clear</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Disputed">Disputed</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.legalStatusOfLand && <p className="text-red-500 text-sm mt-1">{errors.legalStatusOfLand}</p>}
                </div>

                <div>
                  <Label htmlFor="currentBuyer">Current Buyer (Competitor)</Label>
                  <Select value={formData.currentBuyer} onValueChange={(value) => updateFormData('currentBuyer', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current buyer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Middleman">Middleman</SelectItem>
                      <SelectItem value="Export">Export</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Proof of Ownership Photos</Label>
                <p className="text-sm text-gray-600 mb-4">Upload high-quality photos of your land ownership documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'ownership', label: 'Ownership Document' }
                  ].map((photo) => (
                    <div key={photo.key} className="border rounded-lg p-4">
                      <Label className="text-sm font-medium">{photo.label}</Label>

                      {formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos] ? (
                        // Show uploaded file preview
                        <div className="mt-2">
                          <div className="relative group">
                            <img
                              src={formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos]?.preview}
                              alt={photo.label}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={removeProofPhoto}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos]?.compressedFile?.name || 'File processed'}
                          </p>
                          <p className="text-xs text-green-600">
                            {(formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos]?.compressedFile?.size || 0) < 1024
                              ? `${Math.round((formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos]?.compressedFile?.size || 0))} bytes`
                              : `${Math.round(((formData.proofPhotos[photo.key as keyof typeof formData.proofPhotos]?.compressedFile?.size || 0)) / 1024)} KB`
                            } (high quality)
                          </p>
                        </div>
                      ) : (
                        // Show upload prompt
                        <div className="mt-2">
                          <input
                            type="file"
                            id={`proof-upload-${photo.key}`}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleProofPhotoUpload(file);
                              }
                              // Reset input value
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`proof-upload-${photo.key}`}
                            className="cursor-pointer"
                          >
                            <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400 transition-colors">
                              <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Click to upload</p>
                              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 10MB)</p>
                            </div>
                          </label>
                        </div>
                      )}

                      {errors.proofPhoto && (
                        <p className="text-red-500 text-xs mt-1">{errors.proofPhoto}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-700">
                    💡 <strong>High Quality Tips:</strong> Take photos in good lighting with the entire document visible. Ensure text is readable for verification purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                EUDR Compliance
              </CardTitle>
              <CardDescription>
                EU Deforestation Regulation compliance assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Has deforestation occurred since Dec 31, 2020? *</Label>
                <Select value={formData.hasDeforestation} onValueChange={(value) => updateFormData('hasDeforestation', value as any)}>
                  <SelectTrigger className={errors.hasDeforestation ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select deforestation status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hasDeforestation && <p className="text-red-500 text-sm mt-1">{errors.hasDeforestation}</p>}
              </div>

              {formData.hasDeforestation === 'no' && (
                <div>
                  <Label htmlFor="evidenceOfNoDeforestation">Evidence of no deforestation *</Label>
                  <Textarea
                    id="evidenceOfNoDeforestation"
                    value={formData.evidenceOfNoDeforestation}
                    onChange={(e) => updateFormData('evidenceOfNoDeforestation', e.target.value)}
                    placeholder="Provide evidence or documentation supporting no deforestation claim"
                    rows={3}
                    className={errors.evidenceOfNoDeforestation ? 'border-red-500' : ''}
                  />
                  {errors.evidenceOfNoDeforestation && <p className="text-red-500 text-sm mt-1">{errors.evidenceOfNoDeforestation}</p>}
                </div>
              )}

              <div>
                <Label className="text-base font-medium">Legality Checklist</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'Land ownership documents verified',
                    'Environmental permits obtained',
                    'Local community consultations completed',
                    'No protected area encroachment',
                    'Compliance with national forestry laws'
                  ].map((item) => (
                    <label key={item} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.legalityChecklist.includes(item)}
                        onChange={() => toggleCheckboxArray('legalityChecklist', item)}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Proximity to Indigenous/local communities</Label>
                  <Select value={formData.proximityToCommunities} onValueChange={(value) => updateFormData('proximityToCommunities', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Known land conflicts/disputes</Label>
                  <Select value={formData.knownLandConflicts} onValueChange={(value) => updateFormData('knownLandConflicts', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="harvestDateStart">Harvest Period Start</Label>
                  <Input
                    id="harvestDateStart"
                    type="date"
                    value={formData.harvestDateStart}
                    onChange={(e) => updateFormData('harvestDateStart', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="harvestDateEnd">Harvest Period End</Label>
                  <Input
                    id="harvestDateEnd"
                    type="date"
                    value={formData.harvestDateEnd}
                    onChange={(e) => updateFormData('harvestDateEnd', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="firstPointOfSale">First Point of Sale/Aggregation</Label>
                <Input
                  id="firstPointOfSale"
                  value={formData.firstPointOfSale}
                  onChange={(e) => updateFormData('firstPointOfSale', e.target.value)}
                  placeholder="Enter first point of sale"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium">Plots of Land</Label>
                  <Button type="button" onClick={addPlot} variant="outline" size="sm">
                    Add Plot
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.plots.map((plot, index) => (
                    <div key={plot.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{plot.identifier}</h4>
                        {formData.plots.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removePlot(index)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`plot-identifier-${index}`}>Plot Identifier</Label>
                          <Input
                            id={`plot-identifier-${index}`}
                            value={plot.identifier}
                            onChange={(e) => updatePlot(index, 'identifier', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`plot-size-${index}`}>Size (Ha)</Label>
                          <Input
                            id={`plot-size-${index}`}
                            type="number"
                            step="0.1"
                            min="0"
                            value={plot.size || ''}
                            onChange={(e) => updatePlot(index, 'size', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`plot-gps-${index}`}>GPS Coordinates (Polygon)</Label>
                        <Input
                          id={`plot-gps-${index}`}
                          value={plot.gpsCoordinates}
                          onChange={(e) => updatePlot(index, 'gpsCoordinates', e.target.value)}
                          placeholder="Enter polygon coordinates"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                ISCC Self Assessment
              </CardTitle>
              <CardDescription>
                International Sustainability and Carbon Certification assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Principle 1: Land Use</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-sm font-medium">ISCC Land Use Check: conversion after Jan 1, 2008?</Label>
                    <Select value={formData.isccLandUse} onValueChange={(value) => updateFormData('isccLandUse', value as any)}>
                      <SelectTrigger className={errors.isccLandUse ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.isccLandUse && <p className="text-red-500 text-sm mt-1">{errors.isccLandUse}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Previous Land Use (ISCC Definition)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Primary forest', 'Peatland', 'HBD', 'HCS'].map((landUse) => (
                        <label key={landUse} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.previousLandUse.includes(landUse)}
                            onChange={() => toggleCheckboxArray('previousLandUse', landUse)}
                            className="rounded text-primary-600"
                          />
                          <span className="text-sm">{landUse}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Principle 2: Environmental Management</Label>
                <div className="mt-3 space-y-2">
                  {[
                    'Soil and water conservation measures in place',
                    'Biodiversity protection implemented',
                    'Integrated pest management practices'
                  ].map((practice) => (
                    <label key={practice} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.environmentalPractices.includes(practice)}
                        onChange={() => toggleCheckboxArray('environmentalPractices', practice)}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm">{practice}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Principle 3: Health, Safety and Labor</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-sm font-medium">H&S Checklist</Label>
                    <div className="space-y-2 mt-2">
                      {[
                        'Personal protective equipment provided',
                        'Safety training conducted'
                      ].map((item) => (
                        <label key={item} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.healthSafetyChecklist.includes(item)}
                            onChange={() => toggleCheckboxArray('healthSafetyChecklist', item)}
                            className="rounded text-primary-600"
                          />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Worker Rights</Label>
                    <div className="space-y-2 mt-2">
                      {[
                        'Fair wages provided',
                        'Working hours compliant',
                        'No child labor'
                      ].map((right) => (
                        <label key={right} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.workerRights.includes(right)}
                            onChange={() => toggleCheckboxArray('workerRights', right)}
                            className="rounded text-primary-600"
                          />
                          <span className="text-sm">{right}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Grievance mechanism available?</Label>
                      <Select value={formData.grievanceMechanism} onValueChange={(value) => updateFormData('grievanceMechanism', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Freedom of association respected?</Label>
                      <Select value={formData.freedomOfAssociation} onValueChange={(value) => updateFormData('freedomOfAssociation', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Principle 4&5: Management & Traceability</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Record Keeping</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        'Production records maintained',
                        'Input usage tracked',
                        'Sales records documented',
                        'Traceability system implemented',
                        'Regular monitoring conducted'
                      ].map((record) => (
                        <label key={record} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.recordKeeping.includes(record)}
                            onChange={() => toggleCheckboxArray('recordKeeping', record)}
                            className="rounded text-primary-600"
                          />
                          <span className="text-sm">{record}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Participated in GAP training?</Label>
                    <Select value={formData.gapTraining} onValueChange={(value) => updateFormData('gapTraining', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-primary-600" />
                Plantation Profile
              </CardTitle>
              <CardDescription>
                Detailed information about your plantation operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">General Profile</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <Label htmlFor="mainCropType">Main Crop Type *</Label>
                    <Input
                      id="mainCropType"
                      value={formData.mainCropType}
                      onChange={(e) => updateFormData('mainCropType', e.target.value)}
                      placeholder="e.g., Oil Palm, Rubber"
                      className={errors.mainCropType ? 'border-red-500' : ''}
                    />
                    {errors.mainCropType && <p className="text-red-500 text-sm mt-1">{errors.mainCropType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="plantingYear">Planting Year (Average)</Label>
                    <Input
                      id="plantingYear"
                      type="number"
                      value={formData.plantingYear || ''}
                      onChange={(e) => updateFormData('plantingYear', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 2015"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ageOfTrees">Age of Trees (Years)</Label>
                    <Input
                      id="ageOfTrees"
                      type="number"
                      value={formData.ageOfTrees || ''}
                      onChange={(e) => updateFormData('ageOfTrees', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="totalLandSize">Total Land Size (Ha) *</Label>
                    <Input
                      id="totalLandSize"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.totalLandSize || ''}
                      onChange={(e) => updateFormData('totalLandSize', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                      className={errors.totalLandSize ? 'border-red-500' : ''}
                    />
                    {errors.totalLandSize && <p className="text-red-500 text-sm mt-1">{errors.totalLandSize}</p>}
                  </div>

                  <div>
                    <Label htmlFor="estimatedYield">Estd. Yield (kg/Ha)</Label>
                    <Input
                      id="estimatedYield"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.estimatedYield || ''}
                      onChange={(e) => updateFormData('estimatedYield', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="farmingSystem">Farming System</Label>
                    <Select value={formData.farmingSystem} onValueChange={(value) => updateFormData('farmingSystem', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monoculture">Monoculture</SelectItem>
                        <SelectItem value="Intercropped">Intercropped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input
                      id="soilType"
                      value={formData.soilType}
                      onChange={(e) => updateFormData('soilType', e.target.value)}
                      placeholder="e.g., Clay loam, Sandy"
                    />
                  </div>

                  <div>
                    <Label htmlFor="topography">Topography</Label>
                    <Input
                      id="topography"
                      value={formData.topography}
                      onChange={(e) => updateFormData('topography', e.target.value)}
                      placeholder="e.g., Flat, Hilly, Sloping"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Labor</Label>
                <div className="mt-3">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {['Family', 'Hired', 'Local', 'Migrant'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.laborType.includes(type)}
                            onChange={() => toggleCheckboxArray('laborType', type)}
                            className="rounded text-primary-600"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="numberWorkersPermanent">Number of Workers (Permanent)</Label>
                      <Input
                        id="numberWorkersPermanent"
                        type="number"
                        value={formData.numberWorkersPermanent || ''}
                        onChange={(e) => updateFormData('numberWorkersPermanent', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numberWorkersSeasonal">Number of Workers (Seasonal)</Label>
                      <Input
                        id="numberWorkersSeasonal"
                        type="number"
                        value={formData.numberWorkersSeasonal || ''}
                        onChange={(e) => updateFormData('numberWorkersSeasonal', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Access and Logistics</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <Label htmlFor="roadCondition">Road Condition</Label>
                    <Select value={formData.roadCondition} onValueChange={(value) => updateFormData('roadCondition', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paved">Paved</SelectItem>
                        <SelectItem value="Semi-paved">Semi-paved</SelectItem>
                        <SelectItem value="No road">No road</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="distanceToMarket">Distance (km)</Label>
                    <Input
                      id="distanceToMarket"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.distanceToMarket || ''}
                      onChange={(e) => updateFormData('distanceToMarket', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="accessCategory">Access Category</Label>
                    <Select value={formData.accessCategory} onValueChange={(value) => updateFormData('accessCategory', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Review & Submit
              </CardTitle>
              <CardDescription>
                Review your information and provide required documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><strong>Name:</strong> {formData.supplierName}</div>
                  <div><strong>Contact:</strong> {formData.contactPerson}</div>
                  <div><strong>Crop Type:</strong> {formData.mainCropType}</div>
                  <div><strong>Land Size:</strong> {formData.totalLandSize} Ha</div>
                </div>
              </div>

              <div>
                <Label htmlFor="finalNotes">Final Survey Details: Notes</Label>
                <Textarea
                  id="finalNotes"
                  value={formData.finalNotes}
                  onChange={(e) => updateFormData('finalNotes', e.target.value)}
                  placeholder="Enter any additional notes or observations"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Observed Red Flags</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'Evidence of burning',
                    'Child labor observed',
                    'Encroachment on protected land',
                    'Illegal logging',
                    'Water pollution'
                  ].map((flag) => (
                    <label key={flag} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.observedRedFlags.includes(flag)}
                        onChange={() => toggleCheckboxArray('observedRedFlags', flag)}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm">{flag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Photos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {[
                    { key: 'supplier', label: 'Supplier' },
                    { key: 'cropSample', label: 'Crop Sample' },
                    { key: 'plantation', label: 'Plantation' },
                    { key: 'landTitle', label: 'Land Title/Docs' },
                    { key: 'roadAccess', label: 'Road Access' }
                  ].map((photo) => (
                    <div key={photo.key} className="border rounded-lg p-4">
                      <Label className="text-sm font-medium">{photo.label}</Label>

                      {formData.photos[photo.key as keyof SupplierFormData['photos']] ? (
                        // Show uploaded file preview
                        <div className="mt-2">
                          <div className="relative group">
                            <img
                              src={formData.photos[photo.key as keyof SupplierFormData['photos']]?.preview}
                              alt={photo.label}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.key as keyof SupplierFormData['photos'])}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {formData.photos[photo.key as keyof SupplierFormData['photos']]?.compressedFile?.name || 'File processed'}
                          </p>
                          <p className="text-xs text-green-600">
                            {(formData.photos[photo.key as keyof SupplierFormData['photos']]?.compressedFile?.size || 0) < 1024
                              ? `${Math.round((formData.photos[photo.key as keyof SupplierFormData['photos']]?.compressedFile?.size || 0))} bytes`
                              : `${Math.round(((formData.photos[photo.key as keyof SupplierFormData['photos']]?.compressedFile?.size || 0)) / 1024)} KB`
                            } (optimized)
                          </p>
                        </div>
                      ) : (
                        // Show upload prompt
                        <div className="mt-2">
                          <input
                            type="file"
                            id={`file-upload-${photo.key}`}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange(photo.key as keyof SupplierFormData['photos'])}
                            className="hidden"
                          />
                          <label
                            htmlFor={`file-upload-${photo.key}`}
                            className="cursor-pointer"
                          >
                            <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400 transition-colors">
                              <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Click to upload</p>
                              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 10MB)</p>
                            </div>
                          </label>
                        </div>
                      )}

                      {errors[photo.key] && (
                        <p className="text-red-500 text-xs mt-1">{errors[photo.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="recommendedFollowUp">Recommended FU (Follow-Up) Action</Label>
                <Select value={formData.recommendedFollowUp} onValueChange={(value) => updateFormData('recommendedFollowUp', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Do not follow up">Do not follow up</SelectItem>
                    <SelectItem value="Require verification">Require verification</SelectItem>
                    <SelectItem value="Do not engage">Do not engage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.recommendedFollowUp && (
                <div>
                  <Label htmlFor="followUpReason">Reason</Label>
                  <Textarea
                    id="followUpReason"
                    value={formData.followUpReason}
                    onChange={(e) => updateFormData('followUpReason', e.target.value)}
                    placeholder="Provide reason for recommended follow-up action"
                    rows={2}
                  />
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-blue-900">Digital Consent and Verification</h3>

                <div className="mb-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="text-primary-600 hover:text-primary-800 underline text-sm font-medium">
                        Read Genco Supplier Data - Terms and Conditions
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <AlertDialogHeader>
                        <div className="flex items-center justify-between">
                          <AlertDialogTitle>Genco Supplier Data - Terms and Conditions</AlertDialogTitle>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                              aria-label="Close"
                            >
                              <svg
                                className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </AlertDialogTrigger>
                        </div>
                        <AlertDialogDescription>
                          <div className="text-left space-y-4 text-sm">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                              <span className="font-semibold">Effective Date:</span>
                              <span>{getCurrentDate()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                              <span className="font-semibold">Version:</span>
                              <span>1.0</span>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-base">1. Introduction</h4>
                              <p>
                                By checking the box and submitting this form, you ("the Supplier") are providing information
                                to Genco ("the Company") and agree to the terms outlined below regarding the collection,
                                use, and protection of your data.
                              </p>

                              <h4 className="font-semibold text-base">2. Purpose of Data Collection</h4>
                              <p>
                                The Company collects the information provided in this survey for the following specific purposes:
                              </p>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>To conduct due diligence and verify your eligibility as a supplier.</li>
                                <li>To ensure compliance with international sustainability standards, including but not limited
                                to ISCC (International Sustainability and Carbon Certification) and EUDR (EU Deforestation Regulation).</li>
                                <li>To manage our supply chain and maintain traceability of raw materials from source to final product.</li>
                                <li>For internal record-keeping, operational planning, and communication related to our business relationship.</li>
                              </ul>

                              <h4 className="font-semibold text-base">3. Data Usage and Confidentiality</h4>
                              <p>
                                Genco provides the following guarantee regarding your data:
                              </p>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>
                                  <strong>Internal Use Only:</strong> Your data will be used exclusively for the internal
                                  business purposes of the Company as described above.
                                </li>
                                <li>
                                  <strong>No Sale of Data:</strong> We will <strong>never</strong> sell, rent, or lease
                                  your personal or operational data to any third party for marketing or any other purpose.
                                </li>
                                <li>
                                  <strong>Limited Sharing:</strong> Your data may be shared with trusted third parties
                                  only when strictly necessary for our business operations. This includes:
                                  <ul className="list-disc pl-6 mt-1">
                                    <li><strong>Auditors:</strong> Third-party auditors verifying our compliance with sustainability certifications.</li>
                                    <li><strong>Regulatory Bodies:</strong> Government or regulatory agencies as required by law.</li>
                                  </ul>
                                </li>
                              </ul>
                              <p className="text-sm text-gray-600 mt-2">
                                These parties are also bound by strict confidentiality agreements.
                              </p>

                              <h4 className="font-semibold text-base">4. Data Security</h4>
                              <p>
                                We are committed to ensuring that your information is secure. We have implemented suitable
                                physical, electronic, and managerial procedures to safeguard and secure the information we collect.
                              </p>

                              <h4 className="font-semibold text-base">5. Consent and Declaration</h4>
                              <p>
                                By checking the "I Agree" box, you declare that:
                              </p>
                              <ul className="list-disc pl-6 space-y-1">
                                <li>You are authorized to provide this information on behalf of the supplier/plantation.</li>
                                <li>The information provided is true, accurate, and complete to the best of your knowledge.</li>
                                <li>You have read, understood, and agree to these Terms and Conditions regarding the use of your data.</li>
                              </ul>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-sm text-blue-900 mb-3">Digital Agreement Details</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    By checking the box below and completing the verification process, you confirm the following:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5 mb-4">
                    <li>You have read, understood, and agree to the <strong>Genco Supplier Data Terms and Conditions</strong>.</li>
                    <li>You certify that you are authorized to provide this information on behalf of the supplier/plantation.</li>
                    <li>You declare that all information provided is true, accurate, and complete to the best of your knowledge.</li>
                  </ul>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    Your agreement will be recorded digitally. For verification purposes, we will capture your <strong>IP Address</strong>,
                    the <strong>Date and Time</strong> of submission, and validate your identity by sending a <strong>One-Time Password (OTP)</strong>
                    to the provided phone number. This digital record will serve as your binding confirmation.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentGiven}
                      onChange={(e) => updateFormData('consentGiven', e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-blue-800">
                      I have read, understood, and agree to the Genco Supplier Data Terms and Conditions.
                      I certify that I am authorized to provide this information and that all information
                      provided is true, accurate, and complete to the best of my knowledge.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-red-600 text-sm mt-1">{errors.consent}</p>
                  )}
                </div>
              </div>

              {/* OTP Verification Section */}
              {formData.consentGiven && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-green-900">🔐 OTP Verification</h3>

                  {!formData.otpRequested ? (
                    // Request OTP
                    <div>
                      <p className="text-sm text-gray-700 mb-4">
                        We need to verify your identity before submission. A One-Time Password (OTP) will be sent to:
                      </p>
                      <div className="bg-white p-3 rounded border mb-4">
                        <p className="font-medium">{formData.phoneNumber}</p>
                        <p className="text-xs text-gray-500">Phone number on record</p>
                      </div>
                      <Button
                        type="button"
                        onClick={requestOTP}
                        disabled={!formData.phoneNumber}
                        className="w-full md:w-auto"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Send OTP Code
                      </Button>
                    </div>
                  ) : !formData.otpVerified ? (
                    // Verify OTP
                    <div>
                      <p className="text-sm text-gray-700 mb-4">
                        Enter the 6-digit OTP code that was sent to your phone:
                      </p>
                      <div className="flex gap-3 mb-4">
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          value={formData.userEnteredOtp}
                          onChange={(e) => updateFormData('userEnteredOtp', e.target.value)}
                          className="text-center text-lg font-mono"
                        />
                        <Button
                          type="button"
                          onClick={verifyOTP}
                          disabled={formData.userEnteredOtp.length !== 6}
                        >
                          Verify OTP
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearOTP}
                        >
                          Cancel
                        </Button>
                      </div>
                      {errors.otp && (
                        <p className="text-red-600 text-sm mb-4">{errors.otp}</p>
                      )}
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                        <p className="text-xs text-yellow-800">
                          💡 For testing: The OTP was displayed in the popup message when you clicked "Send OTP Code".
                          In production, this would be sent via SMS to your phone.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={requestOTP}
                          className="text-xs"
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // OTP Verified
                    <div className="bg-green-100 border border-green-300 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="font-medium text-green-800">✅ Verification Successful</p>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Phone Verified:</strong> {formData.phoneNumber}</p>
                        <p><strong>IP Address:</strong> {formData.ipAddress}</p>
                        <p><strong>Verification Time:</strong> {new Date(formData.verificationTimestamp).toLocaleString()}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearOTP}
                        className="mt-3"
                      >
                        Reset Verification
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => currentStep > 1 && prevStep()}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Registration</h1>
            </div>
            <Button
              variant="outline"
              onClick={resetForm}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Reset Form
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-4">
            {[
              'Basic Info',
              'Land Status',
              'EUDR',
              'ISCC',
              'Plantation',
              'Review'
            ].map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              const stepErrors = validateStep(stepNumber, true) as Record<string, string>;
              const hasErrors = Object.keys(stepErrors).length > 0;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToStep(stepNumber)}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    isCompleted
                      ? 'text-primary-600'
                      : isCurrent
                      ? 'text-primary-600 font-medium'
                      : hasErrors
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 relative ${
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                      : hasErrors
                      ? 'bg-red-100 border-2 border-red-300 text-red-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}>
                    {isCompleted ? '✓' : stepNumber}
                    {hasErrors && !isCompleted && !isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <span className="text-xs mt-1 max-w-[80px] text-center">
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {/* Error Display */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => currentStep > 1 && prevStep()}
              disabled={currentStep === 1}
            >
              Previous Step
            </Button>

            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierRegistrationForm;