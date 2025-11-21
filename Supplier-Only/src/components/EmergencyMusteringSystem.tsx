import React, { useState, useEffect, useCallback } from 'react';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  ArrowPathIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

interface Person {
  id: string;
  name: string;
  company: string;
  type: 'staff' | 'visitor' | 'contractor';
  lastKnownZone: string;
  status: 'safe' | 'missing' | 'unknown';
  checkInTime?: string;
  phoneNumber?: string;
  hostName?: string;
  badgeNumber?: string;
}

interface Zone {
  id: string;
  name: string;
  musterPoint: string;
  capacity: number;
  currentCount: number;
  safeCount: number;
  missingCount: number;
  lastUpdate: string;
}

interface MusteringSession {
  id: string;
  startTime: string;
  endTime?: string;
  type: 'drill' | 'actual';
  activatedBy: string;
  status: 'active' | 'completed' | 'cancelled';
  totalPeople: number;
  safePeople: number;
  missingPeople: number;
  zones: Zone[];
}

const EmergencyMusteringSystem: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<MusteringSession | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showActivationConfirm, setShowActivationConfirm] = useState(false);
  const [showDeactivationConfirm, setShowDeactivationConfirm] = useState(false);
  const [emergencyType, setEmergencyType] = useState<'drill' | 'actual'>('drill');
  const [countdown, setCountdown] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize zones
  useEffect(() => {
    const initialZones: Zone[] = [
      { id: 'production', name: 'Production Floor', musterPoint: 'Main Exit', capacity: 150, currentCount: 0, safeCount: 0, missingCount: 0, lastUpdate: new Date().toISOString() },
      { id: 'warehouse', name: 'Warehouse A', musterPoint: 'Loading Dock', capacity: 80, currentCount: 0, safeCount: 0, missingCount: 0, lastUpdate: new Date().toISOString() },
      { id: 'office', name: 'Office Building', musterPoint: 'Front Entrance', capacity: 100, currentCount: 0, safeCount: 0, missingCount: 0, lastUpdate: new Date().toISOString() },
      { id: 'cafeteria', name: 'Cafeteria', musterPoint: 'Side Exit', capacity: 60, currentCount: 0, safeCount: 0, missingCount: 0, lastUpdate: new Date().toISOString() },
      { id: 'parking', name: 'Parking Area', musterPoint: 'Gate A', capacity: 40, currentCount: 0, safeCount: 0, missingCount: 0, lastUpdate: new Date().toISOString() },
    ];
    setZones(initialZones);
    localStorage.setItem('vsts_zones', JSON.stringify(initialZones));
  }, []);

  // Load people from localStorage
  const loadPeople = useCallback(() => {
    try {
      const storedVisitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');

      const formattedPeople: Person[] = storedVisitors.map((visitor: any) => ({
        id: visitor.id,
        name: visitor.fullName || visitor.name,
        company: visitor.company,
        type: 'visitor' as const,
        lastKnownZone: 'office', // Default zone
        status: 'unknown' as const,
        checkInTime: visitor.checkInTime,
        phoneNumber: visitor.phoneNumber,
        hostName: visitor.hostName,
        badgeNumber: visitor.badgeNumber,
      }));

      // Add mock staff members for demonstration
      const mockStaff: Person[] = [
        { id: 'staff-1', name: 'John Smith', company: 'VSTS Corp', type: 'staff', lastKnownZone: 'production', status: 'unknown', phoneNumber: '+1-555-0101' },
        { id: 'staff-2', name: 'Sarah Johnson', company: 'VSTS Corp', type: 'staff', lastKnownZone: 'office', status: 'unknown', phoneNumber: '+1-555-0102' },
        { id: 'staff-3', name: 'Michael Brown', company: 'Contractor Co', type: 'contractor', lastKnownZone: 'warehouse', status: 'unknown', phoneNumber: '+1-555-0103' },
        { id: 'staff-4', name: 'Lisa Anderson', company: 'VSTS Corp', type: 'staff', lastKnownZone: 'cafeteria', status: 'unknown', phoneNumber: '+1-555-0104' },
      ];

      setPeople([...formattedPeople, ...mockStaff]);
    } catch (error) {
      console.error('Error loading people:', error);
    }
  }, []);

  // Load existing emergency session
  useEffect(() => {
    const storedSession = localStorage.getItem('vsts_emergency_session');
    if (storedSession) {
      const session = JSON.parse(storedSession);
      if (session.status === 'active') {
        setCurrentSession(session);
        setIsEmergencyActive(true);
        loadPeople();
      }
    }
    loadPeople();
  }, [loadPeople]);

  // Auto-refresh when emergency is active
  useEffect(() => {
    if (!autoRefresh || !isEmergencyActive) return;

    const interval = setInterval(() => {
      if (currentSession) {
        // Simulate real-time updates
        updateSessionData();
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isEmergencyActive, currentSession]);

  // Update session data
  const updateSessionData = () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      totalPeople: people.length,
      safePeople: people.filter(p => p.status === 'safe').length,
      missingPeople: people.filter(p => p.status === 'missing').length,
      lastUpdate: new Date().toISOString(),
    };

    setCurrentSession(updatedSession);
    localStorage.setItem('vsts_emergency_session', JSON.stringify(updatedSession));
  };

  // Activate emergency mode
  const activateEmergency = () => {
    const session: MusteringSession = {
      id: `emergency-${Date.now()}`,
      startTime: new Date().toISOString(),
      type: emergencyType,
      activatedBy: 'Admin User', // Would be actual user from auth system
      status: 'active',
      totalPeople: people.length,
      safePeople: 0,
      missingPeople: 0,
      zones: zones.map(zone => ({
        ...zone,
        currentCount: 0,
        safeCount: 0,
        missingCount: 0,
        lastUpdate: new Date().toISOString(),
      })),
    };

    setCurrentSession(session);
    setIsEmergencyActive(true);
    localStorage.setItem('vsts_emergency_session', JSON.stringify(session));
    localStorage.setItem('vsts_emergency_people', JSON.stringify(people));

    // Reset all people status to unknown
    const resetPeople = people.map(person => ({
      ...person,
      status: 'unknown' as const,
    }));
    setPeople(resetPeople);

    setShowActivationConfirm(false);

    // Start countdown for drill (10 seconds)
    if (emergencyType === 'drill') {
      setCountdown(10);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Deactivate emergency mode
  const deactivateEmergency = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        status: 'completed' as const,
      };

      setCurrentSession(null);
      setIsEmergencyActive(false);
      localStorage.setItem('vsts_emergency_session', JSON.stringify(completedSession));
      localStorage.removeItem('vsts_emergency_people');

      // Reset countdown
      setCountdown(0);
    }

    setShowDeactivationConfirm(false);
  };

  // Mark person as safe
  const markAsSafe = (personId: string, zoneId: string) => {
    const updatedPeople = people.map(person => {
      if (person.id === personId) {
        return { ...person, status: 'safe' as const, lastKnownZone: zoneId };
      }
      return person;
    });
    setPeople(updatedPeople);

    // Update zone counts
    const updatedZones = zones.map(zone => {
      if (zone.id === zoneId) {
        const zonePeople = updatedPeople.filter(p => p.lastKnownZone === zoneId);
        return {
          ...zone,
          currentCount: zonePeople.length,
          safeCount: zonePeople.filter(p => p.status === 'safe').length,
          missingCount: zonePeople.filter(p => p.status === 'missing').length,
          lastUpdate: new Date().toISOString(),
        };
      }
      return zone;
    });
    setZones(updatedZones);
    localStorage.setItem('vsts_zones', JSON.stringify(updatedZones));
  };

  // Mark person as missing
  const markAsMissing = (personId: string) => {
    const updatedPeople = people.map(person => {
      if (person.id === personId) {
        return { ...person, status: 'missing' as const };
      }
      return person;
    });
    setPeople(updatedPeople);

    // Update zone counts
    const updatedZones = zones.map(zone => {
      const zonePeople = updatedPeople.filter(p => p.lastKnownZone === zone.id);
      return {
        ...zone,
        currentCount: zonePeople.length,
        safeCount: zonePeople.filter(p => p.status === 'safe').length,
        missingCount: zonePeople.filter(p => p.status === 'missing').length,
        lastUpdate: new Date().toISOString(),
      };
    });
    setZones(updatedZones);
    localStorage.setItem('vsts_zones', JSON.stringify(updatedZones));
  };

  // Get statistics
  const getStatistics = () => {
    const total = people.length;
    const safe = people.filter(p => p.status === 'safe').length;
    const missing = people.filter(p => p.status === 'missing').length;
    const unknown = people.filter(p => p.status === 'unknown').length;
    const percentage = total > 0 ? Math.round((safe / total) * 100) : 0;

    return { total, safe, missing, unknown, percentage };
  };

  const stats = getStatistics();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Emergency Activation Panel */}
      {!isEmergencyActive ? (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Mustering System</h1>
            <p className="text-gray-600">
              Activate emergency mode to begin mustering procedures and ensure all personnel are accounted for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Current Site Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total People On-site</span>
                  <span className="font-semibold">{people.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Zones</span>
                  <span className="font-semibold">{zones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">System Status</span>
                  <span className="text-green-600 font-semibold">Normal Operation</span>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Type</h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="emergencyType"
                    value="drill"
                    checked={emergencyType === 'drill'}
                    onChange={(e) => setEmergencyType(e.target.value as 'drill')}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium">Safety Drill</span>
                    <p className="text-sm text-gray-500">For practice and training purposes</p>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="emergencyType"
                    value="actual"
                    checked={emergencyType === 'actual'}
                    onChange={(e) => setEmergencyType(e.target.value as 'actual')}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium">Actual Emergency</span>
                    <p className="text-sm text-gray-500">Real emergency situation</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowActivationConfirm(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <ExclamationTriangleIcon className="h-6 w-6 inline mr-2" />
              Activate Emergency Mode
            </button>
          </div>
        </div>
      ) : (
        /* Active Emergency Interface */
        <div>
          {/* Emergency Header */}
          <div className={`rounded-lg p-6 mb-6 ${
            emergencyType === 'actual' ? 'bg-red-50 border-2 border-red-200' : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${
                  emergencyType === 'actual' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <ExclamationTriangleIcon className={`h-8 w-8 ${
                    emergencyType === 'actual' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {emergencyType === 'actual' ? 'EMERGENCY MODE ACTIVE' : 'SAFETY DRILL IN PROGRESS'}
                  </h1>
                  <p className="text-gray-600">
                    Started: {new Date(currentSession?.startTime || '').toLocaleString()}
                    {countdown > 0 && ` • Evacuation in: ${countdown}s`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeactivationConfirm(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                End Emergency
              </button>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total People</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Safe</p>
                  <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Missing</p>
                  <p className="text-2xl font-bold text-red-600">{stats.missing}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full mr-4">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unknown</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.unknown}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Mustering Progress</h3>
              <span className="text-2xl font-bold text-primary-600">{stats.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.safe} of {stats.total} people accounted for
            </p>
          </div>

          {/* Zone Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Zones List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Zone Status</h3>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg ${autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                >
                  {autoRefresh ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              <div className="space-y-3">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedZone === zone.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedZone(zone.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm text-gray-500">
                          Muster Point: {zone.musterPoint}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{zone.safeCount}/{zone.currentCount}</p>
                        <p className="text-xs text-gray-500">Safe/Total</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${zone.currentCount > 0 ? (zone.safeCount / zone.currentCount) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* People List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedZone ? `People in ${zones.find(z => z.id === selectedZone)?.name}` : 'All People'}
                </h3>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg" title="Send Notification">
                    <BellIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg" title="Announcement">
                    <SpeakerWaveIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {people
                  .filter(person => !selectedZone || person.lastKnownZone === selectedZone)
                  .map((person) => (
                    <div
                      key={person.id}
                      className={`border rounded-lg p-3 flex justify-between items-center ${
                        person.status === 'safe' ? 'border-green-200 bg-green-50' :
                        person.status === 'missing' ? 'border-red-200 bg-red-50' :
                        'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{person.name}</span>
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            {person.type}
                          </span>
                          {person.badgeNumber && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                              {person.badgeNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {person.company} • {person.lastKnownZone}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {person.status !== 'safe' && (
                          <button
                            onClick={() => markAsSafe(person.id, person.lastKnownZone)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            title="Mark as Safe"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {person.status !== 'missing' && (
                          <button
                            onClick={() => markAsMissing(person.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="Mark as Missing"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {showActivationConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Confirm Emergency Activation
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to activate {emergencyType === 'actual' ? 'an actual emergency' : 'a safety drill'}?
                {emergencyType === 'actual' && ' This will trigger emergency notifications.'}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={activateEmergency}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => setShowActivationConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeactivationConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                End Emergency Mode
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {stats.missing > 0
                  ? `Warning: ${stats.missing} people are still unaccounted for. Are you sure you want to end the emergency?`
                  : 'Are you sure you want to end the emergency mode?'}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={deactivateEmergency}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  End Emergency
                </button>
                <button
                  onClick={() => setShowDeactivationConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyMusteringSystem;