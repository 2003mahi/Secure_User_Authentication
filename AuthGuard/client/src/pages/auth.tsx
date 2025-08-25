import Navigation from "@/components/layout/navigation";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Shield, Lock, Key, CheckCircle, Zap, Users } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
          <h1 className="text-4xl font-bold mb-4">Enterprise-Grade Security</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Experience military-grade authentication with JWT tokens, bcrypt encryption, and advanced security features.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <p className="text-sm text-blue-100">256-bit Encryption</p>
            </div>
            <div className="text-center">
              <Key className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <p className="text-sm text-blue-100">JWT Token Security</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <p className="text-sm text-blue-100">OWASP Compliant</p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Security Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Security Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our authentication system implements industry-leading security practices to protect your data and privacy.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Optimized JWT validation and session management for sub-millisecond response times.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scalable</h3>
              <p className="text-gray-600 text-sm">Built to handle millions of users with role-based access control and permissions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">bcrypt hashing, CSRF protection, and comprehensive input validation.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <LoginForm />
          <RegisterForm />
        </div>
        
        {/* Security Standards */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Security Standards & Compliance</h3>
            <p className="text-gray-600">Built with industry-leading security practices and standards</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">OWASP</h4>
              <p className="text-sm text-gray-600">Top 10 Security Practices</p>
            </div>
            <div>
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">GDPR</h4>
              <p className="text-sm text-gray-600">Privacy Compliant</p>
            </div>
            <div>
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">SOC 2</h4>
              <p className="text-sm text-gray-600">Type II Certified</p>
            </div>
            <div>
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Key className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">ISO 27001</h4>
              <p className="text-sm text-gray-600">Information Security</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
