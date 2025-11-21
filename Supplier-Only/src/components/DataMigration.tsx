import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';

interface MigrationProps {
  onMigrationComplete: () => void;
}

const DataMigration: React.FC<MigrationProps> = ({ onMigrationComplete }) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>('');
  const [showMigration, setShowMigration] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);

  useEffect(() => {
    // Check if there's localStorage data that needs migration
    const hasVisitors = localStorage.getItem('vsts_visitors');
    const hasEmergency = localStorage.getItem('vsts_emergency_session');

    if (hasVisitors || hasEmergency) {
      setShowMigration(true);
    }
  }, []);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus('Starting migration...');
    setMigrationProgress(0);

    try {
      // Count total items to migrate
      const visitorsData = localStorage.getItem('vsts_visitors');
      const emergencyData = localStorage.getItem('vsts_emergency_session');

      let totalItems = 0;
      if (visitorsData) {
        const visitors = JSON.parse(visitorsData);
        totalItems += visitors.length;
      }
      if (emergencyData) {
        totalItems += 1;
      }

      if (totalItems === 0) {
        setMigrationStatus('No data to migrate.');
        setIsMigrating(false);
        return;
      }

      // Migrate visitors
      if (visitorsData) {
        setMigrationStatus('Migrating visitors...');
        const visitors = JSON.parse(visitorsData);

        for (let i = 0; i < visitors.length; i++) {
          const visitor = visitors[i];
          const progress = Math.round((i / visitors.length) * 50); // Visitors take 50% of progress
          setMigrationProgress(progress);

          try {
            await supabaseService.createVisitor({
              first_name: visitor.fullName?.split(' ')[0] || visitor.name?.split(' ')[0] || '',
              last_name: visitor.fullName?.split(' ').slice(1).join(' ') || visitor.name?.split(' ').slice(1).join(' ') || '',
              email: visitor.email || null,
              phone: visitor.phoneNumber || visitor.phone || null,
              company: visitor.company || null,
              purpose_of_visit: visitor.purposeOfVisit || visitor.purpose || null,
              host_id: visitor.hostId || null,
              site_id: visitor.siteId || null,
              badge_number: visitor.badgeNumber || null,
              status: visitor.status || 'pre-registered',
              check_in_time: visitor.checkInTime || null,
              check_out_time: visitor.checkOutTime || null,
              notes: visitor.notes || null
            });
            setMigrationStatus(`Migrated visitor ${i + 1} of ${visitors.length}`);
          } catch (error) {
            console.warn(`Failed to migrate visitor ${i + 1}:`, error);
          }

          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Migrate emergency session
      if (emergencyData) {
        setMigrationStatus('Migrating emergency session...');
        setMigrationProgress(75);

        const emergency = JSON.parse(emergencyData);
        if (emergency.status === 'active') {
          try {
            await supabaseService.createEmergencySession({
              site_id: emergency.siteId || null,
              emergency_type: emergency.type === 'drill' ? 'drill' : 'other',
              severity_level: 'medium',
              status: 'active',
              title: emergency.title || 'Emergency Session',
              description: emergency.description,
              start_time: emergency.startTime,
              location_description: emergency.location,
              evacuation_required: emergency.type !== 'drill'
            });
            setMigrationStatus('Emergency session migrated successfully');
          } catch (error) {
            console.warn('Failed to migrate emergency session:', error);
          }
        }
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('vsts_visitors');
      localStorage.removeItem('vsts_emergency_session');

      setMigrationProgress(100);
      setMigrationStatus('Migration completed successfully!');

      // Hide migration component after 2 seconds
      setTimeout(() => {
        setShowMigration(false);
        onMigrationComplete();
      }, 2000);

    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus(`Migration failed: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSkipMigration = () => {
    setShowMigration(false);
  };

  if (!showMigration) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Data Migration Available
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            We found existing data in localStorage. Would you like to migrate it to Supabase for persistent storage?
          </p>

          {isMigrating && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${migrationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{migrationStatus}</p>
            </div>
          )}

          {!isMigrating && (
            <div className="flex space-x-3">
              <button
                onClick={handleSkipMigration}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleMigration}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Migrate Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataMigration;