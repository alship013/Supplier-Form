import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Shield, Clock } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen vsts-gradient-bg flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex justify-center items-center mb-6">
              <Building className="h-16 w-16 text-primary-600 mr-4" />
              <h1 className="text-5xl font-bold text-gray-900">
                VSTS
              </h1>
            </div>
            <h2 className="text-2xl text-gray-600 mb-2">Visitor & Staff Tracking System</h2>
            <p className="text-lg text-gray-500 mb-8">
              Secure, efficient, and professional visitor management for modern organizations
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="vsts-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Access</h3>
              <p className="text-gray-600 text-sm">
                Advanced authentication and security protocols to protect your facility
              </p>
            </div>
            <div className="vsts-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor visitor and staff movements with live tracking and reporting
              </p>
            </div>
            <div className="vsts-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Building className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Ready</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive emergency management and mustering capabilities
              </p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/login"
              className="vsts-button-primary px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="vsts-button-outline px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Create Account
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="vsts-card p-6 max-w-2xl mx-auto bg-blue-50 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Demo Credentials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="font-medium text-blue-700">Admin Account:</span>
                <p className="text-blue-600">Username: admin</p>
                <p className="text-blue-600">Password: admin123</p>
              </div>
              <div className="text-left">
                <span className="font-medium text-blue-700">Staff Account:</span>
                <p className="text-blue-600">Username: staff</p>
                <p className="text-blue-600">Password: staff123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2024 VSTS - Visitor & Staff Tracking System. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Designed for security, efficiency, and peace of mind
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;