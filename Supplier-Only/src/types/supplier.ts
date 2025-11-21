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
  type: 'supplier' | 'farmer';
  status: 'active' | 'inactive' | 'pending';
  dateVerified: string;

  // Land Status and Legality
  ownershipType?: 'Owned' | 'Rented' | 'Customary' | 'Others';
  proofOfOwnership?: string[]; // Array of document types
  certificateNumber?: string;
  legalStatusOfLand?: 'Clear' | 'In Process' | 'Disputed' | 'Others';
  currentBuyer?: 'Local' | 'Middleman' | 'Export' | 'Other';

  // EUDR Compliance
  hasDeforestation?: 'yes' | 'no' | 'unknown';
  evidenceOfNoDeforestation?: string;
  legalityChecklist?: string[];
  proximityToCommunities?: 'yes' | 'no' | 'unsure';
  knownLandConflicts?: 'yes' | 'no' | 'unsure';
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
  grievanceMechanism?: 'yes' | 'no';
  freedomOfAssociation?: 'yes' | 'no';
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
  farmingSystem?: 'Monoculture' | 'Intercropped';

  // Labor
  laborType?: string[]; // Family, Hired, Local, Migrant
  numberWorkersPermanent?: number;
  numberWorkersSeasonal?: number;

  // Access and Logistics
  roadCondition?: 'Paved' | 'Semi-paved' | 'No road' | 'Other';
  distanceToMarket?: number; // km
  accessCategory?: 'Easy' | 'Hard' | 'Moderate';

  // Farming Practices & Costs
  waterSource?: string;
  pestControlMethod?: string;
  quantitySpecs?: string;
  fertilizerUse?: string;
  fertilizerType?: 'Chemical' | 'Organic' | 'Mix' | 'Other';
  fertilizerDetails?: string;
  fertilizerMonths?: string[]; // Months of application
  costFertilizer?: number; // IDR/year
  costLabor?: number; // IDR/year
  costTransport?: number; // IDR/shipment

  // Seasonality
  peakSeasonStart?: string; // Month
  peakSeasonEnd?: string; // Month
  seedCollectionStart?: string; // Month
  seedCollectionEnd?: string; // Month
  fruitDevelopmentStart?: string; // Month
  fruitDevelopmentEnd?: string; // Month

  // Review and Submit
  finalNotes?: string;
  observedRedFlags?: string[];
  photos?: {
    supplier?: string;
    cropSample?: string;
    plantation?: string;
    landTitle?: string;
    roadAccess?: string;
  };
  recommendedFollowUp?: 'Do not follow up' | 'Require verification' | 'Do not engage';
  followUpReason?: string;
  declaration?: boolean;
  surveyorSignature?: string;
  supplierSignature?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateInput extends Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'> {}

export interface SupplierUpdateInput extends Partial<Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'>> {}