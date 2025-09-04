"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalProjects: number;
  monthlyRevenue: number;
  systemHealth: {
    database: "healthy" | "unhealthy";
    redis: "healthy" | "unhealthy";
    aiServices: "healthy" | "unhealthy";
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users?limit=10"),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setRecentUsers(usersData.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    return status === "healthy" ? "text-green-400" : "text-red-400";
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "FREE": return "bg-gray-500/20 text-gray-300";
      case "STARTER": return "bg-blue-500/20 text-blue-300";
      case "PRO": return "bg-purple-500/20 text-purple-300";
      case "ENTERPRISE": return "bg-gold-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-white">
                AnimaGenius Admin
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium border border-red-500/30">
                ADMIN ACCESS
              </span>
              <button className="text-gray-300 hover:text-white p-2 rounded">
                🚪
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-8 w-fit">
          {["overview", "users", "subscriptions", "content", "system"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-purple-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>
                <p className="text-green-400 text-xs">+12% from last month</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-400 text-sm">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-white">{stats?.activeSubscriptions || 0}</p>
                  </div>
                  <div className="text-2xl">💳</div>
                </div>
                <p className="text-green-400 text-xs">+8% from last month</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalProjects || 0}</p>
                  </div>
                  <div className="text-2xl">🎬</div>
                </div>
                <p className="text-green-400 text-xs">+25% from last month</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">${stats?.monthlyRevenue || 0}</p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
                <p className="text-green-400 text-xs">+15% from last month</p>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">System Health</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">🗄️</div>
                  <div>
                    <p className="text-white text-sm">Database</p>
                    <p className={`text-xs font-medium ${getHealthColor(stats?.systemHealth.database || "unhealthy")}`}>
                      {stats?.systemHealth.database || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-lg">⚡</div>
                  <div>
                    <p className="text-white text-sm">Redis Cache</p>
                    <p className={`text-xs font-medium ${getHealthColor(stats?.systemHealth.redis || "unhealthy")}`}>
                      {stats?.systemHealth.redis || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-lg">🤖</div>
                  <div>
                    <p className="text-white text-sm">AI Services</p>
                    <p className={`text-xs font-medium ${getHealthColor(stats?.systemHealth.aiServices || "unhealthy")}`}>
                      {stats?.systemHealth.aiServices || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Recent Users</h3>
                <Link href="/admin/users" className="text-purple-400 hover:text-purple-300 text-sm">
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 text-xs uppercase py-2">User</th>
                      <th className="text-left text-gray-400 text-xs uppercase py-2">Plan</th>
                      <th className="text-left text-gray-400 text-xs uppercase py-2">Status</th>
                      <th className="text-left text-gray-400 text-xs uppercase py-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800">
                        <td className="py-3">
                          <div>
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(user.subscriptionTier)}`}>
                            {user.subscriptionTier}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-medium ${
                            user.subscriptionStatus === "active" ? "text-green-400" : "text-yellow-400"
                          }`}>
                            {user.subscriptionStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <p className="text-gray-400 text-xs">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-xl">User Management</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm"
                />
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Export CSV
                </button>
              </div>
            </div>

            <div className="text-center text-gray-400 py-8">
              <p>User management interface will be implemented here</p>
              <p className="text-sm">Features: Search, filter, edit, suspend users</p>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-xl">Subscription Management</h3>
              <div className="flex items-center space-x-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Revenue Report
                </button>
              </div>
            </div>

            <div className="text-center text-gray-400 py-8">
              <p>Subscription management interface will be implemented here</p>
              <p className="text-sm">Features: View all subscriptions, process refunds, modify plans</p>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-xl">Content Moderation</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Pending Review: <span className="text-orange-400 font-medium">3</span></span>
              </div>
            </div>

            <div className="text-center text-gray-400 py-8">
              <p>Content moderation interface will be implemented here</p>
              <p className="text-sm">Features: Review flagged content, moderate projects, usage analytics</p>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold text-xl mb-4">System Configuration</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">AI Service Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">OpenAI GPT-4</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Anthropic Claude</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Synthesia API</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">HeyGen API</span>
                      <span className="text-yellow-400">⚠ Limited</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Platform Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max File Size</span>
                      <span className="text-white">100MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Video Duration</span>
                      <span className="text-white">30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PayPal Integration</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rate Limiting</span>
                      <span className="text-green-400">✓ Enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Update Settings
                </button>
              </div>
            </div>

            {/* External API Access */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold text-xl mb-4">External API Access</h3>
              
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Admin API Key</span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    Regenerate
                  </button>
                </div>
                <code className="text-green-400 text-sm break-all">
                  admin_key_****************************abc123
                </code>
              </div>

              <div className="text-sm text-gray-400 space-y-1">
                <p><strong>Available Endpoints:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>GET /api/admin/dashboard - Dashboard metrics</li>
                  <li>GET /api/admin/users - List all users</li>
                  <li>PUT /api/admin/users/:id - Update user</li>
                  <li>GET /api/admin/analytics - Platform analytics</li>
                  <li>POST /api/admin/refunds - Process refunds</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}