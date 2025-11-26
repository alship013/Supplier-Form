// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role?: 'admin' | 'staff' | 'visitor' | 'supplier';
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface SupplierRegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  supplierData: any; // Will be typed with supplier data structure
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  registerSupplier: (userData: SupplierRegisterData) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// File Upload Types
export interface UploadedFile {
  file: File;
  preview: string;
  compressedFile?: File;
}

// Form Status Types
export interface FormStatus {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}

// Date and Time Types
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  category?: string;
}

// Comprehensive Supplier Form Data Interface
export interface SupplierFormData {
  // Basic Information
  formId: string;
  uniqueSupplierId: string;
  surveyDate: string;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  plantationAddress: string;
  gpsCoordinate: string;
  primaryProduct: string;
  type: 'supplier' | 'farmer';

  // Land Status and Legality
  ownershipType: 'Owned' | 'Rented' | 'Customary' | 'Others' | '';
  proofOfOwnership: string[]; // SHM, HGB, HGU, HP, Girik, Adat, Other
  certificateNumber: string;
  legalStatusOfLand: 'Clear' | 'In Process' | 'Disputed' | 'Others' | '';
  currentBuyer: 'Local' | 'Middleman' | 'Export' | 'Other' | '';

  // EUDR Compliance
  hasDeforestation: 'yes' | 'no' | 'unknown';
  evidenceOfNoDeforestation: string;
  legalityChecklist: string[];
  proximityToCommunities: 'yes' | 'no' | 'unsure' | '';
  knownLandConflicts: 'yes' | 'no' | 'unsure' | '';
  harvestDateStart: string;
  harvestDateEnd: string;
  firstPointOfSale: string;
  plots: Array<{
    id: string;
    identifier: string;
    size: number;
    gpsCoordinates: string;
  }>;

  // ISCC Self Assessment
  isccLandUse: 'yes' | 'no' | 'unknown' | '';
  previousLandUse: string[]; // primary forest, peatland, HBD, HCS
  environmentalPractices: string[];
  healthSafetyChecklist: string[];
  workerRights: string[];
  grievanceMechanism: 'yes' | 'no' | '';
  freedomOfAssociation: 'yes' | 'no' | '';
  recordKeeping: string[];
  gapTraining: 'yes' | 'no' | '';

  // Plantation Profile
  mainCropType: string;
  plantingYear: number;
  ageOfTrees: number;
  totalLandSize: number;
  estimatedYield: number;
  soilType: string;
  topography: string;
  farmingSystem: 'Monoculture' | 'Intercropped' | '';

  // Labor
  laborType: string[]; // Family, Hired, Local, Migrant
  numberWorkersPermanent: number;
  numberWorkersSeasonal: number;

  // Access and Logistics
  roadCondition: 'Paved' | 'Semi-paved' | 'No road' | 'Other' | '';
  distanceToMarket: number;
  accessCategory: 'Easy' | 'Hard' | 'Moderate' | '';

  // Farming Practices & Costs
  waterSource: string;
  pestControlMethod: string;
  quantitySpecs: string;
  fertilizerUse: string;
  fertilizerType: 'Chemical' | 'Organic' | 'Mix' | 'Other' | '';
  fertilizerDetails: string;
  fertilizerMonths: string[]; // Jan, Feb, Mar, etc.
  costFertilizer: number;
  costLabor: number;
  costTransport: number;

  // Seasonality
  peakSeasonStart: string;
  peakSeasonEnd: string;
  seedCollectionStart: string;
  seedCollectionEnd: string;
  fruitDevelopmentStart: string;
  fruitDevelopmentEnd: string;

  // Review and Submit
  finalNotes: string;
  observedRedFlags: string[];
  photos: {
    supplier?: UploadedFile;
    cropSample?: UploadedFile;
    plantation?: UploadedFile;
    landTitle?: UploadedFile;
    roadAccess?: UploadedFile;
  };
  recommendedFollowUp: 'Do not follow up' | 'Require verification' | 'Do not engage' | '';
  followUpReason: string;
  declaration: boolean;
  surveyorSignature: string;
  supplierSignature: string;
  dateVerified: string;

  // Digital Consent and OTP
  consentGiven: boolean;
  consentTimestamp: string;
  tncVersion: string;
  otpCode: string;
  userEnteredOtp: string;
  otpRequested: boolean;
  otpVerified: boolean;
  ipAddress: string;
  verificationTimestamp: string;

  // Additional Documents
  ownershipDocument?: File;
  proofPhotos: {
    ownership?: UploadedFile;
    additional?: UploadedFile[];
  };
}