import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Landing from './pages/Landing';
import SupplierRegistrationForm from './pages/SupplierRegistrationForm';
import SupplierSuccessPage from './pages/SupplierSuccessPage';
import SupplierDashboard from './pages/SupplierDashboard';

// Import environment configuration
import { config } from './config/env';

// Protected Route Component (for admin access)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  // Validate configuration on app startup
  React.useEffect(() => {
    if (config.debug.enabled) {
      console.log('VSTS Visitor Check-in Starting...');
      console.log(`Version: ${config.app.version}`);
      console.log(`Environment: ${import.meta.env.MODE}`);
    }

    // Frontend-only implementation
    console.log('Frontend-only visitor check-in system active');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Page - First page users see */}
          <Route path="/login" element={<Login />} />

          {/* Supplier Registration - Public Route */}
          <Route path="/supplier-register" element={<SupplierRegistrationForm />} />

          {/* Supplier Success Page - Public Route */}
          <Route path="/supplier-success" element={<SupplierSuccessPage />} />

          {/* Supplier Dashboard - Protected Route */}
          <Route
            path="/supplier-dashboard"
            element={
              <ProtectedRoute>
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/visitor"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 p-8">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">VSTS Admin Dashboard</h1>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Visitor Management</h2>
                      <p className="text-gray-600">Admin functionality for visitor management will be implemented here.</p>
                      <div className="mt-6 space-x-4">
                        <a href="/visitor" className="text-blue-600 hover:text-blue-800">→ Visitor Check-in</a>
                        <a href="/supplier-register" className="text-blue-600 hover:text-blue-800">→ Supplier Registration</a>
                        <button
                          onClick={() => {
                            localStorage.removeItem('vsts_auth');
                            window.location.href = '/login';
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback route - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
