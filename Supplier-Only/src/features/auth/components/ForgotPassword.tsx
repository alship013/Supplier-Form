import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Building, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const success = await forgotPassword(email);
      if (success) {
        setMessage('Password reset instructions have been sent to your email address.');
        setIsSubmitted(true);
      } else {
        setError('Email address not found in our system');
      }
    } catch (error) {
      setError('Failed to send reset instructions. Please try again.');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
    if (isSubmitted) {
      setIsSubmitted(false);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen vsts-gradient-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center mb-6">
          <Building className="h-12 w-12 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">VSTS</h1>
        </div>
        <h2 className="text-center text-2xl font-medium text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            back to sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="vsts-card py-8 px-4 sm:px-10">
          {!isSubmitted ? (
            <div>
              <div className="text-center mb-6">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Forgot your password?
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      className="vsts-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full vsts-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Email Instructions</h4>
                <p className="text-xs text-blue-700">
                  Since this is a demo application, you can use any of these demo emails to test:
                </p>
                <ul className="mt-2 text-xs text-blue-600 space-y-1">
                  <li>• admin@vsts.com</li>
                  <li>• staff@vsts.com</li>
                </ul>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                    setEmail('');
                  }}
                  className="w-full vsts-button-outline"
                >
                  Try Another Email
                </button>
                <Link
                  to="/login"
                  className="block w-full vsts-button-primary text-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Security Notice</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              For security reasons, we will never ask for your password via email.
              Password reset links expire after 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;