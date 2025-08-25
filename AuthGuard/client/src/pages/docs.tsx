import Navigation from "@/components/layout/navigation";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Documentation</h2>
            <p className="text-gray-600 mb-6">Comprehensive documentation for the Secure Authentication API endpoints.</p>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Base URL</h3>
              <div className="bg-gray-50 rounded-md p-3 border">
                <code className="text-sm font-mono">http://localhost:5000/api</code>
              </div>
            </div>

            {/* Authentication Info */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Authentication</h3>
              <p className="text-gray-600 mb-3">This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:</p>
              <div className="bg-gray-50 rounded-md p-3 border">
                <code className="text-sm font-mono">Authorization: Bearer &lt;your-jwt-token&gt;</code>
              </div>
            </div>

            {/* Endpoints */}
            <div className="space-y-8">
              {/* User Registration */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">User Registration</h4>
                    <Badge className="bg-success/10 text-success hover:bg-success/20">
                      POST
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Endpoint</h5>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">/auth/register</code>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Request Body</h5>
                      <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border"><code>{`{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}`}</code></pre>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Response (201 Created)</h5>
                      <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border"><code>{`{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "usr_1234567890",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-20T14:22:35Z"
  }
}`}</code></pre>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Possible Status Codes</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Badge className="bg-success/10 text-success hover:bg-success/20 w-16">201</Badge>
                        <span className="ml-2 text-gray-600">User created successfully</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="secondary" className="w-16">400</Badge>
                        <span className="ml-2 text-gray-600">Invalid input data or validation errors</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="secondary" className="w-16">409</Badge>
                        <span className="ml-2 text-gray-600">User with email/username already exists</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Login */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">User Login</h4>
                    <Badge className="bg-success/10 text-success hover:bg-success/20">
                      POST
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Endpoint</h5>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">/auth/login</code>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Request Body</h5>
                      <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border"><code>{`{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}`}</code></pre>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Response (200 OK)</h5>
                      <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border"><code>{`{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "usr_1234567890",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "expiresIn": "24h"
}`}</code></pre>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Possible Status Codes</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Badge className="bg-success/10 text-success hover:bg-success/20 w-16">200</Badge>
                        <span className="ml-2 text-gray-600">Login successful, JWT token returned</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="secondary" className="w-16">400</Badge>
                        <span className="ml-2 text-gray-600">Invalid input data</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="destructive" className="w-16">401</Badge>
                        <span className="ml-2 text-gray-600">Invalid credentials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protected Endpoint */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Get User Profile</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        <Shield className="w-3 h-3 mr-1" />Protected
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Endpoint</h5>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">/user/profile</code>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Headers</h5>
                      <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border"><code>Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...</code></pre>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Response (200 OK)</h5>
                      <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border"><code>{`{
  "success": true,
  "user": {
    "id": "usr_1234567890",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "permissions": ["read", "write"],
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:22:35Z"
  }
}`}</code></pre>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Possible Status Codes</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Badge className="bg-success/10 text-success hover:bg-success/20 w-16">200</Badge>
                        <span className="ml-2 text-gray-600">Profile data returned successfully</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="destructive" className="w-16">401</Badge>
                        <span className="ml-2 text-gray-600">Unauthorized - Invalid or missing token</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="destructive" className="w-16">403</Badge>
                        <span className="ml-2 text-gray-600">Forbidden - Token expired or invalid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notes */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-md p-4">
              <h4 className="text-lg font-medium text-amber-800 mb-2">
                <Shield className="w-5 h-5 inline mr-2" />
                Security Implementation Notes
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Passwords are hashed using bcrypt with salt rounds ≥ 12</li>
                <li>• JWT tokens expire after 24 hours for security</li>
                <li>• All inputs are validated and sanitized to prevent injection attacks</li>
                <li>• Rate limiting can be implemented on authentication endpoints</li>
                <li>• HTTPS should be used for all API communications in production</li>
                <li>• Environment variables are used for all secrets and configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
