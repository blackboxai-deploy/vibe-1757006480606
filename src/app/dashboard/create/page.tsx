"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    template: "",
    uploadedFile: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setProjectData(prev => ({ ...prev, uploadedFile: file }));
      setStep(2);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'video/mp4': ['.mp4'],
      'audio/mpeg': ['.mp3'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const templates = [
    {
      id: "business-presentation",
      name: "Business Presentation",
      description: "Professional corporate presentations with animations",
      thumbnail: "https://placehold.co/300x200?text=Business+Presentation+Template+with+corporate+design",
    },
    {
      id: "educational-content",
      name: "Educational Content",
      description: "Engaging educational videos with clear explanations",
      thumbnail: "https://placehold.co/300x200?text=Educational+Content+Template+with+learning+focus",
    },
    {
      id: "marketing-video",
      name: "Marketing Video", 
      description: "Eye-catching marketing videos that convert",
      thumbnail: "https://placehold.co/300x200?text=Marketing+Video+Template+with+promotional+design",
    },
    {
      id: "training-material",
      name: "Training Material",
      description: "Step-by-step training videos for teams",
      thumbnail: "https://placehold.co/300x200?text=Training+Material+Template+with+instructional+layout",
    },
  ];

  const handleCreateProject = async () => {
    if (!projectData.title) {
      alert("Please enter a project title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("title", projectData.title);
      formData.append("description", projectData.description);
      formData.append("template", projectData.template);
      
      if (projectData.uploadedFile) {
        formData.append("file", projectData.uploadedFile);
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Redirect to project page
      setTimeout(() => {
        router.push(`/dashboard/projects/${result.projectId}`);
      }, 1000);

    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <span className="text-gray-300 hover:text-white">← Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AnimaGenius
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
          <p className="text-gray-400">Transform your content into professional videos with AI</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-400"
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-purple-500" : "bg-gray-700"}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-400"
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? "bg-purple-500" : "bg-gray-700"}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-400"
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Choose Template or Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">How would you like to start?</h2>
              <p className="text-gray-400">Choose a template or upload your own content</p>
            </div>

            {/* Templates */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Choose a Template</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setProjectData(prev => ({ ...prev, template: template.id }));
                      setStep(3);
                    }}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900/70 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-1">{template.name}</h4>
                      <p className="text-gray-400 text-sm">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Or Upload Your Content</h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? "border-purple-500 bg-purple-500/10" 
                    : "hover:border-gray-500 hover:bg-gray-800/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-4">📤</div>
                <div className="text-white font-semibold mb-2">
                  {isDragActive ? "Drop your files here" : "Drag & drop files here"}
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  or click to browse
                </p>
                <div className="text-xs text-gray-500">
                  Supports PDF, DOCX, XLSX, MP4, MP3, JPG, PNG • Max 100MB
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: File Preview */}
        {step === 2 && projectData.uploadedFile && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">File Uploaded Successfully</h2>
              <p className="text-gray-400">Review your file and add project details</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">📄</div>
                <div>
                  <h3 className="text-white font-semibold">{projectData.uploadedFile.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {(projectData.uploadedFile.size / 1024 / 1024).toFixed(1)} MB • {projectData.uploadedFile.type}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
              >
                Upload Different File
              </button>
              <button 
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Project Details</h2>
              <p className="text-gray-400">Give your project a name and description</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={projectData.title}
                  onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="My Amazing Video Project"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of your video project..."
                />
              </div>
            </div>

            {isUploading && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-white">Creating Project...</div>
                  <p className="text-gray-400 text-sm">Please wait while we process your content</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-gray-400">
                  {uploadProgress}% complete
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setStep(step - 1)}
                disabled={isUploading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all"
              >
                ← Back
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={isUploading || !projectData.title}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all"
              >
                {isUploading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}