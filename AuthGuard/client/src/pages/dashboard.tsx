import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CheckCircle, Lock, Copy, RefreshCw, LogOut, Trash2, Shield, Activity, Key, Monitor, Plus, X, Calendar, MapPin, Smartphone } from "lucide-react";
import Navigation from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getStoredToken, getStoredUser, clearAuthData, getAuthHeaders, isAuthenticated } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@/lib/auth";

export default function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = getStoredToken();
  const storedUser = getStoredUser();
  const [isCreateApiKeyOpen, setIsCreateApiKeyOpen] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/";
    }
  }, []);

  // Fetch all data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: statsData } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      const response = await fetch("/api/user/stats", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: activitiesData } = useQuery({
    queryKey: ["/api/user/security-activities"],
    queryFn: async () => {
      const response = await fetch("/api/user/security-activities?limit=10", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: apiKeysData } = useQuery({
    queryKey: ["/api/user/api-keys"],
    queryFn: async () => {
      const response = await fetch("/api/user/api-keys", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch API keys");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["/api/user/sessions"],
    queryFn: async () => {
      const response = await fetch("/api/user/sessions", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json();
    },
    enabled: !!token,
  });

  // Mutations
  const createApiKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/user/api-keys", { name });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      setIsCreateApiKeyOpen(false);
      setNewApiKeyName("");
      toast({
        title: "API Key Created",
        description: `Your new API key "${data.apiKey.name}" has been created. Copy it now as it won't be shown again.`,
      });
    },
  });

  const revokeApiKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await apiRequest("DELETE", `/api/user/api-keys/${keyId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "API Key Revoked",
        description: "The API key has been successfully revoked",
      });
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("DELETE", `/api/user/sessions/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Session Revoked",
        description: "The session has been successfully revoked",
      });
    },
  });

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast({
        title: "Token copied",
        description: "JWT token has been copied to clipboard",
      });
    }
  };

  const handleLogout = () => {
    clearAuthData();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    window.location.href = "/";
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const user = profileData?.user || storedUser;
  const stats = statsData?.stats;
  const activities = activitiesData?.activities || [];
  const apiKeys = apiKeysData?.apiKeys || [];
  const sessions = sessionsData?.sessions || [];

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
              <p className="text-gray-600">Manage your account security and monitor activity</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-success/10 text-success hover:bg-success/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Authenticated
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <div className={`text-2xl font-bold px-2 py-1 rounded ${getSecurityScoreColor(stats.securityScore)}`}>
                      {stats.securityScore}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Logins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-blue-500 mr-3" />
                  <div className="text-2xl font-bold">{stats.totalLogins}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Monitor className="w-8 h-8 text-green-500 mr-3" />
                  <div className="text-2xl font-bold">{stats.activeSessions}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Key className="w-8 h-8 text-purple-500 mr-3" />
                  <div className="text-2xl font-bold">{stats.apiKeysCount}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile & JWT Token */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details and current session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Username</Label>
                    <p className="text-gray-900" data-testid="text-username">{user?.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-gray-900" data-testid="text-email">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                    <p className="text-gray-900" data-testid="text-role">{user?.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Age</Label>
                    <p className="text-gray-900">{stats?.accountAge || 0} days</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Current JWT Token</Label>
                  <div className="bg-gray-50 rounded-md p-3 border mt-1">
                    <code className="text-xs break-all font-mono text-gray-800 block" data-testid="text-token">
                      {token}
                    </code>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Expires: 24h</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyToken}
                        data-testid="button-copy-token"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Security Activity
                </CardTitle>
                <CardDescription>Latest security events for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{activity.activity}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.ipAddress && (
                        <Badge variant="outline" className="text-xs">
                          {activity.ipAddress}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Keys & Sessions */}
          <div className="space-y-6">
            {/* API Keys */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      API Keys
                    </CardTitle>
                    <CardDescription>Manage your API keys for external integrations</CardDescription>
                  </div>
                  <Dialog open={isCreateApiKeyOpen} onOpenChange={setIsCreateApiKeyOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" data-testid="button-create-api-key">
                        <Plus className="w-4 h-4 mr-1" />
                        Create Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New API Key</DialogTitle>
                        <DialogDescription>
                          Create a new API key for accessing your account programmatically.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="keyName">Key Name</Label>
                          <Input
                            id="keyName"
                            value={newApiKeyName}
                            onChange={(e) => setNewApiKeyName(e.target.value)}
                            placeholder="e.g., Mobile App, Website Integration"
                            data-testid="input-api-key-name"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsCreateApiKeyOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => createApiKeyMutation.mutate(newApiKeyName)}
                            disabled={!newApiKeyName.trim() || createApiKeyMutation.isPending}
                            data-testid="button-confirm-create-api-key"
                          >
                            {createApiKeyMutation.isPending ? "Creating..." : "Create Key"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.map((key: any) => (
                    <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{key.name}</p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                          {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeApiKeyMutation.mutate(key.id)}
                        disabled={revokeApiKeyMutation.isPending}
                        data-testid={`button-revoke-api-key-${key.id}`}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  ))}
                  {apiKeys.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No API keys created yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Active Sessions
                </CardTitle>
                <CardDescription>Monitor and manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium">
                            {session.deviceInfo || "Unknown Device"}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-3">
                            {session.ipAddress && (
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {session.ipAddress}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(session.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeSessionMutation.mutate(session.id)}
                        disabled={revokeSessionMutation.isPending}
                        data-testid={`button-revoke-session-${session.id}`}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No active sessions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Quick actions for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <Button
                    variant="destructive"
                    data-testid="button-delete-account"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
