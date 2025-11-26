import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { CheckCircle, Users, ArrowRight } from 'lucide-react';

const SupplierSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Registration Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your supplier account has been created successfully
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">What happens next?</h3>
              <ul className="text-left space-y-2 text-green-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Your registration will be reviewed by our verification team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You'll receive a confirmation email within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Once approved, you'll be able to access your supplier dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You can track your application status through your account</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Contact Information</h3>
              <p className="text-blue-700">
                If you have any questions about your registration, please contact our support team at:
              </p>
              <div className="mt-2 text-blue-800 font-medium">
                suppliers-support@vsts.com | +1-800-SUPPLIER
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => navigate('/supplier-dashboard')}
                className="w-full bg-primary-600 hover:bg-primary-700"
                size="lg"
              >
                Go to Supplier Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierSuccessPage;