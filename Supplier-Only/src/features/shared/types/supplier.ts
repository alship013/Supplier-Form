// Supplier data type definitions based on the requirements document

export interface Plot {
  id: string;
  identifier: string; // e.g., Plot 1, Plot 2
  size: number; // Size in hectares
  gpsCoordinates?: string; // Polygon coordinates
}

export interface SupplierData {
  id: string;

  // Basic Information
  formId: string;
  uniqueSupplierId: string;
  surveyDate: string;
  supplierName: string;
  contactPerson?: string;
  phoneNumber: string;
  email: string;
  plantationAddress: string;
  gpsCoordinate?: string;
  product?: string; // Main product type
  type: 'supplier' | 'farmer';
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  dateVerified?: string;

  // Land Status and Legality
  ownershipType?: string; // 'Owned' | 'Leased' | 'Rented' | 'Customary' | 'Other'
  proofOfOwnership?: string[]; // Array of document types
  certificateNumber?: string;
  legalStatusOfLand?: string; // 'Certified' | 'In Process' | 'Not Yet Certified' | 'Traditional' | 'Other'
  currentBuyer?: string;
  otherOwnershipDetails?: string;
  otherLegalStatusDetails?: string;

  // EUDR Compliance
  hasDeforestation?: 'yes' | 'no' | 'unknown';
  evidenceOfNoDeforestation?: string;
  legalityChecklist?: string[];
  proximityToIndigenous?: string;
  landConflicts?: string;
  harvestDateStart?: string;
  harvestDateEnd?: string;
  firstPointOfSale?: string;
  plots?: Plot[];

  // ISCC Self Assessment
  isccLandUse?: string; // Land Use Check result
  previousLandUse?: string[]; // primary forest, peatland, etc.
  environmentalPractices?: string[];
  healthSafetyChecklist?: string[];
  workerRights?: string[];
  grievanceMechanism?: string;
  freedomOfAssociation?: string;
  recordKeeping?: string[];
  gapTraining?: string;

  // Plantation Profile
  mainCropType?: string;
  plantingYear?: number;
  ageOfTrees?: number;
  totalLandSize?: number; // in hectares
  estimatedYield?: number; // kg/Ha
  soilType?: string;
  topography?: string;
  farmingSystem?: string; // 'Monoculture' | 'Intercropped' | other values

  // Labor
  laborType?: string[]; // Family, Hired, Local, Migrant
  permanentWorkers?: number; // Changed from numberWorkersPermanent
  seasonalWorkers?: number; // Changed from numberWorkersSeasonal

  // Access and Logistics
  roadCondition?: string; // More options beyond the basic ones
  distance?: number; // Changed from distanceToMarket
  accessCategory?: string;

  // Farming Practices & Costs
  waterSource?: string;
  pestControlMethod?: string;
  quantitySpecs?: string;
  fertilizerUse?: string;
  fertilizerUsageType?: string; // Changed from fertilizerType
  fertilizerBrandDetails?: string; // Changed from fertilizerDetails
  fertilizerMonths?: string[]; // Months of application
  costFertilizer?: number; // USD/year
  costLabor?: number; // USD/year
  costTransport?: number; // USD/shipment

  // Seasonality
  peakSeasonStart?: string; // Full date
  peakSeasonEnd?: string; // Full date
  seedCollectionStart?: string; // Full date
  seedCollectionEnd?: string; // Full date
  fruitDevelopmentStart?: string; // Full date
  fruitDevelopmentEnd?: string; // Full date

  // Review and Submit
  finalNotes?: string;
  observedRedFlags?: string[];
  photos?: {
    supplier?: File;
    cropSample?: File;
    plantation?: File;
    landTitle?: File;
    roadAccess?: File;
  };
  proofPhotos?: {
    ownership?: File;
    additional: File[];
  };
  recommendedAction?: string; // Changed from recommendedFollowUp
  reason?: string; // Changed from followUpReason
  declaration?: boolean;
  surveyorSignature?: string;
  supplierSignature?: string;

  // T&C Consent
  consentGiven?: boolean;
  dataConsent?: {
    accepted: boolean;
    timestamp?: string;
    ipAddress?: string;
  };
  privacyPolicy?: {
    accepted: boolean;
    timestamp?: string;
    ipAddress?: string;
  };
  termsOfUse?: {
    accepted: boolean;
    timestamp?: string;
    ipAddress?: string;
  };
  consentVerification?: {
    otpRequested?: boolean;
    otpSentAt?: string;
    otpCode?: string;
    userEnteredOtp?: string;
    verifiedAt?: string;
    ipAddress?: string;
  };

  // Legacy fields for backward compatibility
  consentTimestamp?: string;
  tncVersion?: string;
  otpCode?: string;
  otpRequested?: boolean;
  otpVerified?: boolean;
  verificationTimestamp?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateInput extends Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'> {}

export interface SupplierUpdateInput extends Partial<Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'>> {}