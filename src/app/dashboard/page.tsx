"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  subscriptionTier: string;
  usageLimits: {
    videos: number;
    duration: number;
    fileSize: number;
  };
  currentUsage: {
    videos: number;
    duration: number;
    fileSize: number;
  };
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [userResponse, projectsResponse] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/projects"),
      ]);

      if (userResponse.ok) {
        const user = await userResponse.json();
        setUserData(user);
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400";
      case "processing": return "text-yellow-400";
      case "failed": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AnimaGenius
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, {userData?.name}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userData?.subscriptionTier === "FREE" 
                    ? "bg-gray-500/20 text-gray-300"
                    : userData?.subscriptionTier === "PRO"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}>
                  {userData?.subscriptionTier}
                </span>
                <button className="text-gray-300 hover:text-white p-2 rounded">
                  ⚙️
                </button>
                <button className="text-gray-300 hover:text-white p-2 rounded">
                  🚪
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Usage Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold">Videos This Month</h3>
                <p className="text-2xl font-bold text-purple-400">
                  {userData?.currentUsage.videos || 0}
                  {userData?.usageLimits.videos !== -1 && (
                    <span className="text-gray-400 text-lg">
                      /{userData?.usageLimits.videos}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-2xl">🎥</div>
            </div>
            {userData?.usageLimits.videos !== -1 && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(userData?.currentUsage.videos || 0, userData?.usageLimits.videos || 1)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold">Storage Used</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {(userData?.currentUsage.fileSize || 0)} MB
                  {userData?.usageLimits.fileSize !== -1 && (
                    <span className="text-gray-400 text-lg">
                      /{userData?.usageLimits.fileSize} MB
                    </span>
                  )}
                </p>
              </div>
              <div className="text-2xl">💾</div>
            </div>
            {userData?.usageLimits.fileSize !== -1 && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(userData?.currentUsage.fileSize || 0, userData?.usageLimits.fileSize || 1)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold">Plan Status</h3>
                <p className="text-lg font-bold text-green-400">
                  {userData?.subscriptionTier} Plan
                </p>
              </div>
              <div className="text-2xl">⭐</div>
            </div>
            <Link href="/dashboard/billing" className="text-purple-400 hover:text-purple-300 text-sm">
              Manage Subscription →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/dashboard/create">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
              <span>➕</span>
              Create New Project
            </button>
          </Link>
          
          <Link href="/dashboard/upload">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
              <span>📤</span>
              Upload Files
            </button>
          </Link>

          <Link href="/dashboard/templates">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
              <span>📋</span>
              Browse Templates
            </button>
          </Link>
        </div>

        {/* Projects Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Projects</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Sort by:</span>
              <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white">
                <option value="recent">Most Recent</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first AI-powered video by uploading a document or starting from a template
              </p>
              <Link href="/dashboard/create">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
                  Create Your First Project
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-900/70 transition-all duration-300">
                  {/* Project Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative">
                    {project.thumbnailUrl ? (
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400">🎬</div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-black/50 ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 truncate">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium transition-all">
                          Edit
                        </button>
                      </Link>
                      
                      {project.videoUrl && (
                        <button 
                          onClick={() => window.open(project.videoUrl, '_blank')}
                          className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium transition-all"
                        >
                          ▶️
                        </button>
                      )}
                      
                      <button className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium transition-all">
                        ⋮
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}