import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import QrScanner from 'qr-scanner';
import {
  QrCodeIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  CameraIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Visitor {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  arrivalDate: string;
  arrivalTime: string;
  purposeOfVisit?: string;
  carRegistration?: string;
  status: 'pre-registered' | 'checked-in' | 'checked-out';
  qrCode?: string;
  checkInTime?: string;
  checkOutTime?: string;
  badgeNumber?: string;
}

interface CheckInSystemProps {
  mode: 'check-in' | 'check-out';
  onClose?: () => void;
  onSuccess?: (visitor: Visitor) => void;
}

const CheckInSystem: React.FC<CheckInSystemProps> = ({ mode, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedVisitor, setScannedVisitor] = useState<Visitor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBadgeNumber, setCurrentBadgeNumber] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  // Schema for manual check-in form
  const manualCheckInSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    company: z.string().min(2, 'Company is required'),
    email: z.string().email('Valid email is required'),
    phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Valid phone number is required'),
    hostName: z.string().min(2, 'Host name is required'),
    purposeOfVisit: z.string().optional(),
  });

  type ManualCheckInData = z.infer<typeof manualCheckInSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetManualForm,
  } = useForm<ManualCheckInData>({
    resolver: zodResolver(manualCheckInSchema),
  });

  // Generate next badge number
  const generateBadgeNumber = () => {
    const storedVisitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');
    const checkedInVisitors = storedVisitors.filter((v: Visitor) => v.status === 'checked-in');
    const nextNumber = (checkedInVisitors.length + 1).toString().padStart(3, '0');
    return `V${nextNumber}`;
  };

  // Start QR scanner
  const startQRScanner = async () => {
    try {
      setIsScanning(true);
      setError(null);

      if (videoRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            handleQRScanResult(result.data);
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        await qrScannerRef.current.start();
      }
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setIsScanning(false);
    }
  };

  // Stop QR scanner
  const stopQRScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Handle QR scan result
  const handleQRScanResult = (qrData: string) => {
    try {
      const visitorData = JSON.parse(qrData);

      // Check if visitor exists in localStorage
      const storedVisitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');
      const visitor = storedVisitors.find((v: Visitor) => v.id === visitorData.id);

      if (visitor) {
        setScannedVisitor(visitor);
        stopQRScanner();
      } else {
        setError('Visitor not found. Please register the visitor first.');
      }
    } catch (err) {
      setError('Invalid QR code. Please scan a valid visitor QR code.');
    }
  };

  // Process check-in
  const processCheckIn = (visitor: Visitor) => {
    setIsProcessing(true);
    setError(null);

    try {
      const badgeNumber = generateBadgeNumber();
      const checkInTime = new Date().toISOString();

      // Update visitor in localStorage
      const storedVisitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');
      const updatedVisitors = storedVisitors.map((v: Visitor) => {
        if (v.id === visitor.id) {
          return {
            ...v,
            status: 'checked-in',
            checkInTime,
            badgeNumber,
          };
        }
        return v;
      });

      localStorage.setItem('vsts_visitors', JSON.stringify(updatedVisitors));

      // Update the scanned visitor
      const updatedVisitor = {
        ...visitor,
        status: 'checked-in' as const,
        checkInTime,
        badgeNumber,
      };

      setScannedVisitor(updatedVisitor);
      setCurrentBadgeNumber(badgeNumber);

      if (onSuccess) {
        onSuccess(updatedVisitor);
      }

      console.log('Visitor checked in:', updatedVisitor);
    } catch (err) {
      setError('Failed to process check-in. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Process manual check-in
  const handleManualCheckIn = (data: ManualCheckInData) => {
    setIsProcessing(true);
    setError(null);

    try {
      const visitorId = `WALKIN-${Date.now()}`;
      const badgeNumber = generateBadgeNumber();
      const checkInTime = new Date().toISOString();

      const newVisitor: Visitor = {
        id: visitorId,
        fullName: data.fullName,
        company: data.company,
        email: data.email,
        phoneNumber: data.phoneNumber,
        hostName: data.hostName,
        arrivalDate: new Date().toISOString().split('T')[0],
        arrivalTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        purposeOfVisit: data.purposeOfVisit,
        status: 'checked-in',
        checkInTime,
        badgeNumber,
      };

      // Save to localStorage
      const storedVisitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');
      storedVisitors.push(newVisitor);
      localStorage.setItem('vsts_visitors', JSON.stringify(storedVisitors));

      if (onSuccess) {
        onSuccess(newVisitor);
      }

      console.log('Walk-in visitor checked in:', newVisitor);

      // Reset form
      resetManualForm();
      setCurrentBadgeNumber(badgeNumber);

      // Show success message (could be enhanced with a proper success component)
      alert(`Visitor checked in successfully!\nBadge Number: ${badgeNumber}`);
    } catch (err) {
      setError('Failed to process check-in. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Process check-out
  const processCheckOut = (visitor: Visitor) => {
    setIsProcessing(true);
    setError(null);

    try {
      const checkOutTime = new Date().toISOString();

      // Update visitor in localStorage
      const storedVisitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');
      const updatedVisitors = storedVisitors.map((v: Visitor) => {
        if (v.id === visitor.id) {
          return {
            ...v,
            status: 'checked-out',
            checkOutTime,
          };
        }
        return v;
      });

      localStorage.setItem('vsts_visitors', JSON.stringify(updatedVisitors));

      const updatedVisitor = {
        ...visitor,
        status: 'checked-out' as const,
        checkOutTime,
      };

      if (onSuccess) {
        onSuccess(updatedVisitor);
      }

      console.log('Visitor checked out:', updatedVisitor);

      // Show success message
      alert('Visitor checked out successfully!');
      setScannedVisitor(null);
    } catch (err) {
      setError('Failed to process check-out. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopQRScanner();
    };
  }, []);

  if (mode === 'check-out' && !scannedVisitor) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
              <ClockIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Visitor Check-out
            </h2>
            <p className="text-gray-600">
              Scan the visitor's QR code or enter their details to check them out
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'qr'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <QrCodeIcon className="h-5 w-5 inline mr-2" />
              Scan QR Code
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <UserIcon className="h-5 w-5 inline mr-2" />
              Manual Search
            </button>
          </div>

          {activeTab === 'qr' && (
            <div className="mt-6">
              {!isScanning ? (
                <button
                  onClick={startQRScanner}
                  className="w-full vsts-button-primary flex items-center justify-center"
                >
                  <CameraIcon className="h-5 w-5 mr-2" />
                  Start QR Scanner
                </button>
              ) : (
                <div className="relative">
                  <video ref={videoRef} className="w-full rounded-lg" />
                  <button
                    onClick={stopQRScanner}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter visitor name or badge number..."
                className="vsts-input w-full"
              />
              <button className="w-full vsts-button-primary mt-4">
                Search Visitor
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="w-full mt-6 vsts-button-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'check-in' ? 'Visitor Check-in' : 'Visitor Check-out'}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {!scannedVisitor ? (
          <div className="p-6">
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {mode === 'check-in'
                  ? 'Choose how you want to check in the visitor'
                  : 'Choose how you want to check out the visitor'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setActiveTab('qr')}
                className={`p-8 rounded-lg border-2 transition-all ${
                  activeTab === 'qr'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <QrCodeIcon className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                <p className="text-gray-600 text-sm">
                  Scan the visitor's pre-registration QR code for instant check-in
                </p>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`p-8 rounded-lg border-2 transition-all ${
                  activeTab === 'manual'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <UserIcon className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                <h3 className="text-lg font-semibold mb-2">
                  {mode === 'check-in' ? 'Walk-in Registration' : 'Manual Check-out'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {mode === 'check-in'
                    ? 'Register a visitor who doesn\'t have a pre-registration'
                    : 'Manually find and check out a visitor'
                  }
                </p>
              </button>
            </div>

            {activeTab === 'qr' && (
              <div className="mt-8">
                {!isScanning ? (
                  <button
                    onClick={startQRScanner}
                    className="w-full vsts-button-primary flex items-center justify-center py-4"
                  >
                    <CameraIcon className="h-6 w-6 mr-2" />
                    Start QR Scanner
                  </button>
                ) : (
                  <div className="relative">
                    <video ref={videoRef} className="w-full rounded-lg" />
                    <button
                      onClick={stopQRScanner}
                      className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manual' && mode === 'check-in' && (
              <form onSubmit={handleSubmit(handleManualCheckIn)} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="vsts-input"
                      placeholder="John Smith"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      {...register('company')}
                      className="vsts-input"
                      placeholder="Acme Corporation"
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="vsts-input"
                      placeholder="john.smith@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phoneNumber')}
                      className="vsts-input"
                      placeholder="+1234567890"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Host Name *
                    </label>
                    <input
                      type="text"
                      {...register('hostName')}
                      className="vsts-input"
                      placeholder="Jane Doe"
                    />
                    {errors.hostName && (
                      <p className="mt-1 text-sm text-red-600">{errors.hostName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose of Visit
                    </label>
                    <input
                      type="text"
                      {...register('purposeOfVisit')}
                      className="vsts-input"
                      placeholder="Business meeting"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full vsts-button-primary disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Check In Visitor'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center mb-6">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Visitor Found: {scannedVisitor.fullName}
              </h3>
              <p className="text-gray-600">
                From {scannedVisitor.company} • Host: {scannedVisitor.hostName}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Visitor Details:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{scannedVisitor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{scannedVisitor.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="font-medium">{new Date(scannedVisitor.arrivalDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Time</p>
                  <p className="font-medium">{scannedVisitor.arrivalTime}</p>
                </div>
                {scannedVisitor.purposeOfVisit && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Purpose of Visit</p>
                    <p className="font-medium">{scannedVisitor.purposeOfVisit}</p>
                  </div>
                )}
              </div>
            </div>

            {mode === 'check-in' && scannedVisitor.status === 'pre-registered' && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <p className="text-primary-800">
                  <strong>Ready to check in!</strong> Assign badge {generateBadgeNumber()} and activate visitor access.
                </p>
              </div>
            )}

            {mode === 'check-in' && scannedVisitor.status === 'checked-in' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Already checked in!</strong> This visitor is currently on-site.
                  <br />
                  Badge: {scannedVisitor.badgeNumber}
                  <br />
                  Check-in time: {new Date(scannedVisitor.checkInTime || '').toLocaleString()}
                </p>
              </div>
            )}

            {mode === 'check-out' && scannedVisitor.status === 'checked-out' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-800">
                  <strong>Already checked out!</strong> This visitor has already left the site.
                  <br />
                  Check-out time: {new Date(scannedVisitor.checkOutTime || '').toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              {mode === 'check-in' && scannedVisitor.status === 'pre-registered' && (
                <button
                  onClick={() => processCheckIn(scannedVisitor)}
                  disabled={isProcessing}
                  className="flex-1 vsts-button-primary disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Check In Visitor'}
                </button>
              )}

              {mode === 'check-out' && scannedVisitor.status === 'checked-in' && (
                <button
                  onClick={() => processCheckOut(scannedVisitor)}
                  disabled={isProcessing}
                  className="flex-1 vsts-button-primary disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Check Out Visitor'}
                </button>
              )}

              <button
                onClick={() => {
                  setScannedVisitor(null);
                  stopQRScanner();
                }}
                className="flex-1 vsts-button-secondary"
              >
                Scan Another
              </button>
            </div>

            {currentBadgeNumber && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-medium">
                  Badge Number Assigned: <span className="text-xl font-bold">{currentBadgeNumber}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInSystem;