import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import EditProfilePage from './EditProfilePage';
import type { SupplierData } from '../../shared/types/supplier';

const EditProfileWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load supplier data from localStorage
    const loadSupplierData = () => {
      try {
        let suppliers = JSON.parse(localStorage.getItem('vsts_suppliers') || '[]');
        let currentSupplier = suppliers.find((s: any) => s.id === user?.id);

        // If no supplier data found, create mock data for testing
        if (!currentSupplier && user) {
          currentSupplier = {
            id: user.id,
            formId: `FORM-${Date.now()}-DEMO`,
            uniqueSupplierId: `SUP-${Date.now()}-DEMO`,
            surveyDate: new Date().toISOString().split('T')[0],
            supplierName: 'Demo Supplier Company',
            contactPerson: 'John Doe',
            phoneNumber: '+1234567890',
            email: 'demo@supplier.com',
            plantationAddress: '123 Demo Street, Demo City, Demo Country',
            gpsCoordinate: '-6.2088, 106.8456',
            product: 'palm_oil',
            type: 'supplier',

            // Land Status and Legality
            ownershipType: 'Owned',
            proofOfOwnership: ['Land Certificate'],
            certificateNumber: 'LC-123456',
            legalStatusOfLand: 'Certified',
            currentBuyer: 'Demo Buyer Company',
            otherOwnershipDetails: '',
            otherLegalStatusDetails: '',

            // EUDR Compliance
            hasDeforestation: 'no',
            evidenceOfNoDeforestation: 'No deforestation evidence found',
            legalityChecklist: ['Land ownership proof', 'Environmental permit'],
            proximityToIndigenous: 'No nearby indigenous lands',
            landConflicts: 'No land conflicts',
            harvestDateStart: '2024-01-01',
            harvestDateEnd: '2024-12-31',
            firstPointOfSale: 'Local Market',
            plots: [{ id: '1', identifier: 'Plot 1', size: 25, gpsCoordinates: '-6.2088,106.8456' }],

            // ISCC Self Assessment
            isccLandUse: 'No change',
            previousLandUse: ['Forest'],
            environmentalPractices: ['Soil conservation', 'Water management'],
            healthSafetyChecklist: ['Safety equipment'],
            workerRights: ['Fair wages', 'Safe working conditions'],
            grievanceMechanism: 'Available',
            freedomOfAssociation: 'Yes',
            recordKeeping: ['Daily logs'],
            gapTraining: 'no',

            // Plantation Profile
            mainCropType: 'Oil Palm',
            plantingYear: 2020,
            ageOfTrees: 4,
            totalLandSize: 25,
            estimatedYield: 20,
            soilType: 'Clay Loam',
            topography: 'Gentle Slope',
            farmingSystem: 'Monoculture',

            // Labor
            laborType: ['Family labor', 'Hired labor'],
            permanentWorkers: 5,
            seasonalWorkers: 10,

            // Access and Logistics
            roadCondition: 'Paved',
            distance: 5,
            accessCategory: 'Easy (All weather)',

            // Farming Practices & Costs
            waterSource: 'Rainfall',
            pestControlMethod: 'Integrated Pest Management',
            quantitySpecs: 'High quality',
            fertilizerUse: 'yes',
            fertilizerUsageType: 'NPK',
            fertilizerBrandDetails: 'Brand ABC',
            fertilizerMonths: ['Jan', 'Mar', 'May', 'Jul'],
            costFertilizer: 5000,
            costLabor: 10000,
            costTransport: 2000,

            // Seasonality
            peakSeasonStart: '2024-06-01',
            peakSeasonEnd: '2024-08-31',
            seedCollectionStart: '2024-02-01',
            seedCollectionEnd: '2024-04-30',
            fruitDevelopmentStart: '2024-03-01',
            fruitDevelopmentEnd: '2024-05-31',

            // Review and Submit
            finalNotes: '',
            observedRedFlags: [],
            recommendedAction: '',
            reason: '',
            dateVerified: '',

            // Photos
            photos: {
              supplier: undefined,
              cropSample: undefined,
              plantation: undefined,
              landTitle: undefined,
              roadAccess: undefined,
            },
            proofPhotos: {
              ownership: undefined,
              additional: []
            },

            // Consents
            consentGiven: false,
            dataConsent: {
              accepted: false,
              timestamp: '',
              ipAddress: ''
            },
            privacyPolicy: {
              accepted: false,
              timestamp: '',
              ipAddress: ''
            },
            termsOfUse: {
              accepted: false,
              timestamp: '',
              ipAddress: ''
            },

            // Metadata
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'pending' as const
          };

          // Save to localStorage for persistence
          suppliers.push(currentSupplier);
          localStorage.setItem('vsts_suppliers', JSON.stringify(suppliers));
        }

        if (currentSupplier) {
          setSupplierData(currentSupplier);
        } else {
          console.error('No supplier data found');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading supplier data:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadSupplierData();
  }, [user, navigate]);

  const handleSave = (updatedData: Partial<SupplierData>, restrictedChanges: boolean) => {
    // Save updated data to localStorage
    try {
      let suppliers = JSON.parse(localStorage.getItem('vsts_suppliers') || '[]');
      const index = suppliers.findIndex((s: any) => s.id === user?.id);

      if (index !== -1) {
        suppliers[index] = { ...suppliers[index], ...updatedData };
        localStorage.setItem('vsts_suppliers', JSON.stringify(suppliers));

        if (restrictedChanges) {
          alert('Your changes have been submitted for admin approval. Restricted sections will be reviewed by an administrator.');
        } else {
          alert('Profile updated successfully!');
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving supplier data:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!supplierData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading supplier data</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-primary-600 hover:text-primary-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <EditProfilePage
      supplierData={supplierData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default EditProfileWrapper;