import React, { useState } from 'react';
import { MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CoordinateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const CoordinateInput: React.FC<CoordinateInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter coordinates (e.g., -6.2088, 106.8456)",
  required = false,
  error,
  className = ""
}) => {
  const [validationError, setValidationError] = useState('');

  const validateCoordinates = (coord: string) => {
    if (!coord && !required) {
      setValidationError('');
      return true;
    }

    if (!coord && required) {
      setValidationError('Coordinates are required');
      return false;
    }

    // Match format: -6.2088, 106.8456 or -6.2088,106.8456
    const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    if (!coordPattern.test(coord)) {
      setValidationError('Invalid format. Use: latitude, longitude (e.g., -6.2088, 106.8456)');
      return false;
    }

    const [lat, lng] = coord.split(',').map(s => parseFloat(s.trim()));

    if (isNaN(lat) || isNaN(lng)) {
      setValidationError('Both latitude and longitude must be valid numbers');
      return false;
    }

    if (lat < -90 || lat > 90) {
      setValidationError('Latitude must be between -90 and 90');
      return false;
    }

    if (lng < -180 || lng > 180) {
      setValidationError('Longitude must be between -180 and 180');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    validateCoordinates(newValue);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onChange(coordString);
          validateCoordinates(coordString);
        },
        (error) => {
          console.error('Error getting location:', error);
          setValidationError('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      setValidationError('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPinIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`vsts-input block w-full pl-10 pr-24 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
            (validationError || error) ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          className="absolute inset-y-0 right-0 px-3 bg-primary-100 hover:bg-primary-200 text-primary-700 text-sm font-medium rounded-r-md border-l border-primary-300"
          title="Get current location"
        >
          Use GPS
        </button>
      </div>

      {(validationError || error) && (
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span>{validationError || error}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Format: latitude, longitude (e.g., -6.2088, 106.8456)
      </p>
    </div>
  );
};

export default CoordinateInput;