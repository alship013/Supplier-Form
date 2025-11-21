import React from 'react';

const CheckIn: React.FC = () => {
  return (
    <div className="vsts-card p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Check-in/Out System</h1>
      <p className="text-gray-600 mb-6">
        Check-in and check-out functionality for visitors and staff members.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Visitor Check-in</h3>
          <p className="text-gray-500">Register new visitors</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Check-in</h3>
          <p className="text-gray-500">Staff attendance tracking</p>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;