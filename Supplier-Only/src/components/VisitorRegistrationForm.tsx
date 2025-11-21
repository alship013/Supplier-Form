import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import QRCode from 'qrcode';
import {
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

// Zod schema for form validation
const visitorSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  arrivalDate: z.string().min(1, 'Arrival date is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
  hostName: z.string().min(2, 'Host name must be at least 2 characters'),
  purposeOfVisit: z.string().optional(),
  carRegistration: z.string().optional(),
}).refine((data) => {
  const arrivalDateTime = new Date(`${data.arrivalDate}T${data.arrivalTime}`);
  const now = new Date();
  return arrivalDateTime > now;
}, {
  message: 'Arrival date and time must be in the future',
  path: ['arrivalDate'],
});

type VisitorFormData = z.infer<typeof visitorSchema>;

interface VisitorRegistrationFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const VisitorRegistrationForm: React.FC<VisitorRegistrationFormProps> = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [registeredVisitor, setRegisteredVisitor] = useState<VisitorFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
  });

  // Generate unique visitor ID
  const generateVisitorId = () => {
    return `VST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate QR code for visitor
  const generateQRCode = async (visitorData: VisitorFormData, visitorId: string) => {
    try {
      const qrData = {
        id: visitorId,
        name: visitorData.fullName,
        company: visitorData.company,
        email: visitorData.email,
        arrivalDate: visitorData.arrivalDate,
        arrivalTime: visitorData.arrivalTime,
        hostName: visitorData.hostName,
        timestamp: new Date().toISOString(),
      };

      const qrString = JSON.stringify(qrData);
      const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  // Save to localStorage (temporary until backend is ready)
  const saveToLocalStorage = (visitorData: VisitorFormData, visitorId: string, qrCode: string) => {
    const visitors = JSON.parse(localStorage.getItem('vsts_visitors') || '[]');
    const newVisitor = {
      id: visitorId,
      ...visitorData,
      qrCode,
      registrationDate: new Date().toISOString(),
      status: 'pre-registered',
    };
    visitors.push(newVisitor);
    localStorage.setItem('vsts_visitors', JSON.stringify(visitors));
  };

  const onSubmit = async (data: VisitorFormData) => {
    setIsSubmitting(true);

    try {
      const visitorId = generateVisitorId();
      const qrCode = await generateQRCode(data, visitorId);

      if (qrCode) {
        // Save to localStorage
        saveToLocalStorage(data, visitorId, qrCode);

        // Update state
        setRegisteredVisitor(data);
        setQrCodeUrl(qrCode);
        setShowSuccess(true);

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }

        // Log for debugging
        console.log('Visitor registered:', { id: visitorId, ...data });
      }
    } catch (error) {
      console.error('Error registering visitor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRegistration = () => {
    setShowSuccess(false);
    setQrCodeUrl('');
    setRegisteredVisitor(null);
    reset();
  };

  // Get minimum date for date input (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (showSuccess && registeredVisitor) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Visitor Successfully Pre-registered!
            </h2>
            <p className="text-gray-600">
              {registeredVisitor.fullName} has been registered for their visit.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Visit Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Visitor Name</p>
                <p className="font-medium">{registeredVisitor.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{registeredVisitor.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {new Date(`${registeredVisitor.arrivalDate}T${registeredVisitor.arrivalTime}`).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Host</p>
                <p className="font-medium">{registeredVisitor.hostName}</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Check-in QR Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share this QR code with the visitor for expedited check-in
            </p>
            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
              {qrCodeUrl && <img src={qrCodeUrl} alt="Visitor QR Code" />}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                // Send email/SMS notification (mock for now)
                alert('Email/SMS notification would be sent to the visitor');
              }}
              className="vsts-button-primary"
            >
              Send Notification
            </button>
            <button
              onClick={handleNewRegistration}
              className="vsts-button-secondary"
            >
              Register Another Visitor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pre-register Visitor
          </h2>
          <p className="text-gray-600">
            Register a visitor in advance to expedite their check-in process
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    className="vsts-input pl-10"
                    placeholder="John Smith"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    {...register('company')}
                    className="vsts-input pl-10"
                    placeholder="Acme Corporation"
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="vsts-input pl-10"
                    placeholder="john.smith@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    className="vsts-input pl-10"
                    placeholder="+1234567890"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Arrival Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="arrivalDate"
                    {...register('arrivalDate')}
                    min={getMinDate()}
                    className="vsts-input pl-10"
                  />
                </div>
                {errors.arrivalDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.arrivalDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Arrival Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="arrivalTime"
                    {...register('arrivalTime')}
                    className="vsts-input pl-10"
                  />
                </div>
                {errors.arrivalTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.arrivalTime.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 mb-2">
                  Host Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="hostName"
                    {...register('hostName')}
                    className="vsts-input pl-10"
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.hostName && (
                  <p className="mt-1 text-sm text-red-600">{errors.hostName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Visit
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="purposeOfVisit"
                    {...register('purposeOfVisit')}
                    className="vsts-input pl-10"
                    placeholder="Business meeting"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Optional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Information</h3>
            <div>
              <label htmlFor="carRegistration" className="block text-sm font-medium text-gray-700 mb-2">
                Car Registration
              </label>
              <input
                type="text"
                id="carRegistration"
                {...register('carRegistration')}
                className="vsts-input"
                placeholder="ABC 123"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => reset()}
              className="vsts-button-secondary"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="vsts-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register Visitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitorRegistrationForm;