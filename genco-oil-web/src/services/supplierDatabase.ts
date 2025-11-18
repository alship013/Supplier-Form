export interface SupplierData {
  id: string;
  uniqueSupplierId: string;
  formId: string;
  surveyDate: string;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  plantationAddress: string;
  gpsCoordinate: string;

  // Land Status and Legality
  ownershipType: string;
  proofOfOwnership: string[];
  certificateNumber: string;
  legalStatusOfLand: string;
  currentBuyer: string;
  otherOwnershipDetails: string;
  otherLegalStatusDetails: string;

  // EUDR Compliance
  hasDeforestation: string;
  evidenceOfNoDeforestation: string;
  legalityChecklist: string[];
  proximityToIndigenous: string;
  landConflicts: string;
  harvestDateStart: string;
  harvestDateEnd: string;
  firstPointOfSale: string;
  plots: PlotData[];

  // ISCC Self Assessment
  isccLandUse: string;
  previousLandUse: string[];
  environmentalPractices: string[];
  healthSafetyChecklist: string[];
  workerRights: string[];
  grievanceMechanism: string;
  freedomOfAssociation: string;
  recordKeeping: string[];
  gapTraining: string;

  // Plantation Profile
  mainCropType: string;
  plantingYear: number;
  ageOfTrees: number;
  totalLandSize: number;
  estimatedYield: number;
  soilType: string;
  topography: string;
  farmingSystem: string;
  laborType: string[];
  permanentWorkers: number;
  seasonalWorkers: number;
  roadCondition: string;
  distance: number;
  accessCategory: string;
  waterSource: string;
  pestControlMethod: string;
  quantitySpecs: string;
  fertilizerUse: string;
  fertilizerUsageType: string;
  fertilizerBrandDetails: string;
  fertilizerMonths: string[];
  costFertilizer: number;
  costLabor: number;
  costTransport: number;
  peakSeasonStart: string;
  peakSeasonEnd: string;
  seedCollectionStart: string;
  seedCollectionEnd: string;
  fruitDevelopmentStart: string;
  fruitDevelopmentEnd: string;

  // Review and Submit
  finalNotes: string;
  observedRedFlags: string[];
  recommendedAction: string;
  reason: string;
  declaration: boolean;
  surveyorSignature: string;
  supplierSignature: string;
  dateVerified: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'supplier' | 'farmer';
}

export interface PlotData {
  id: string;
  identifier: string;
  size: number;
  gpsCoordinates: string;
}

class SupplierDatabaseService {
  private readonly DB_NAME = 'genco_suppliers_db';
  private readonly SUPPLIERS_KEY = 'suppliers';

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    if (!localStorage.getItem(this.SUPPLIERS_KEY)) {
      localStorage.setItem(this.SUPPLIERS_KEY, JSON.stringify([]));
    }
  }

  // CREATE
  createSupplier(supplierData: Omit<SupplierData, 'id' | 'createdAt' | 'updatedAt'>): SupplierData {
    const suppliers = this.getAllSuppliers();
    const newSupplier: SupplierData = {
      ...supplierData,
      id: `supplier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    suppliers.push(newSupplier);
    this.saveSuppliers(suppliers);

    console.log('Supplier created:', newSupplier);
    return newSupplier;
  }

  // READ
  getAllSuppliers(): SupplierData[] {
    try {
      const suppliersJson = localStorage.getItem(this.SUPPLIERS_KEY);
      const suppliers = suppliersJson ? JSON.parse(suppliersJson) : [];
      // Filter out any suppliers with invalid data that could cause React rendering errors
      return suppliers.filter(supplier => {
        // Basic validation - ensure required string fields are actually strings
        const stringFields = ['supplierName', 'email', 'phoneNumber', 'plantationAddress', 'gpsCoordinate'];
        return stringFields.every(field => {
          const value = supplier[field];
          return value === null || value === undefined || typeof value === 'string';
        });
      });
    } catch (error) {
      console.error('Error reading suppliers from localStorage:', error);
      // If there's corrupted data, clear it and start fresh
      localStorage.removeItem(this.SUPPLIERS_KEY);
      this.initializeDatabase();
      return [];
    }
  }

  getSupplierById(id: string): SupplierData | null {
    try {
      const suppliersJson = localStorage.getItem(this.SUPPLIERS_KEY);
      const suppliers = suppliersJson ? JSON.parse(suppliersJson) : [];
      const supplier = suppliers.find(supplier => supplier.id === id);

      // Validate supplier data before returning
      if (!supplier) return null;

      // Basic validation - ensure required string fields are actually strings
      const stringFields = ['supplierName', 'email', 'phoneNumber', 'plantationAddress', 'gpsCoordinate'];
      const isValid = stringFields.every(field => {
        const value = supplier[field];
        return value === null || value === undefined || typeof value === 'string';
      });

      return isValid ? supplier : null;
    } catch (error) {
      console.error('Error reading supplier by id:', error);
      return null;
    }
  }

  getSupplierByUniqueId(uniqueId: string): SupplierData | null {
    const suppliers = this.getAllSuppliers();
    return suppliers.find(supplier => supplier.uniqueSupplierId === uniqueId) || null;
  }

  searchSuppliers(query: string): SupplierData[] {
    const suppliers = this.getAllSuppliers();
    const lowerQuery = query.toLowerCase();

    return suppliers.filter(supplier =>
      supplier.supplierName.toLowerCase().includes(lowerQuery) ||
      supplier.email.toLowerCase().includes(lowerQuery) ||
      supplier.contactPerson.toLowerCase().includes(lowerQuery) ||
      supplier.phoneNumber.includes(query)
    );
  }

  filterSuppliers(filters: {
    type?: 'all' | 'supplier' | 'farmer';
    status?: 'all' | 'active' | 'inactive' | 'pending';
    search?: string;
  }): SupplierData[] {
    let suppliers = this.getAllSuppliers();

    // Filter by type
    if (filters.type && filters.type !== 'all') {
      suppliers = suppliers.filter(supplier => supplier.type === filters.type);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      suppliers = suppliers.filter(supplier => supplier.status === filters.status);
    }

    // Filter by search
    if (filters.search && filters.search.trim()) {
      suppliers = this.searchSuppliers(filters.search);
    }

    return suppliers;
  }

  // UPDATE
  updateSupplier(id: string, updates: Partial<SupplierData>): SupplierData | null {
    const suppliers = this.getAllSuppliers();
    const index = suppliers.findIndex(supplier => supplier.id === id);

    if (index === -1) {
      console.error('Supplier not found with id:', id);
      return null;
    }

    suppliers[index] = {
      ...suppliers[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveSuppliers(suppliers);
    console.log('Supplier updated:', suppliers[index]);
    return suppliers[index];
  }

  // DELETE
  deleteSupplier(id: string): boolean {
    const suppliers = this.getAllSuppliers();
    const index = suppliers.findIndex(supplier => supplier.id === id);

    if (index === -1) {
      console.error('Supplier not found with id:', id);
      return false;
    }

    const deletedSupplier = suppliers.splice(index, 1)[0];
    this.saveSuppliers(suppliers);

    console.log('Supplier deleted:', deletedSupplier);
    return true;
  }

  // UTILITY
  private saveSuppliers(suppliers: SupplierData[]): void {
    try {
      localStorage.setItem(this.SUPPLIERS_KEY, JSON.stringify(suppliers));
    } catch (error) {
      console.error('Error saving suppliers to localStorage:', error);
    }
  }

  // Export data for backup
  exportData(): string {
    const suppliers = this.getAllSuppliers();
    return JSON.stringify(suppliers, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    try {
      const suppliers = JSON.parse(jsonData) as SupplierData[];
      const errors: string[] = [];
      let imported = 0;

      // Validate data
      suppliers.forEach((supplier, index) => {
        if (!supplier.supplierName || !supplier.email) {
          errors.push(`Row ${index + 1}: Missing required fields (supplierName, email)`);
          return;
        }
      });

      if (errors.length > 0) {
        return { success: false, imported: 0, errors };
      }

      // Import valid data
      suppliers.forEach(supplier => {
        const newSupplier = this.createSupplier({
          ...supplier,
          id: '', // Will be generated
          createdAt: '', // Will be generated
          updatedAt: '' // Will be generated
        });
        imported++;
      });

      return { success: true, imported, errors };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: ['Invalid JSON format']
      };
    }
  }

  // Get statistics
  getStatistics() {
    const suppliers = this.getAllSuppliers();

    return {
      total: suppliers.length,
      active: suppliers.filter(s => s.status === 'active').length,
      inactive: suppliers.filter(s => s.status === 'inactive').length,
      pending: suppliers.filter(s => s.status === 'pending').length,
      suppliers: suppliers.filter(s => s.type === 'supplier').length,
      farmers: suppliers.filter(s => s.type === 'farmer').length,
      totalLandSize: suppliers.reduce((sum, s) => sum + (s.totalLandSize || 0), 0),
      averageQuality: suppliers.length > 0
        ? suppliers.reduce((sum, s) => sum + 85, 0) / suppliers.length // Placeholder logic
        : 0
    };
  }

  // Emergency method to clear all data (useful for corruption recovery)
  clearAllData(): void {
    localStorage.removeItem(this.SUPPLIERS_KEY);
    this.initializeDatabase();
    console.log('All supplier data cleared due to corruption');
  }
}

export const supplierDb = new SupplierDatabaseService();