"use client";

import Link from "next/link";

export default function LandingPage() {
  const pricingPlans = [
    {
      name: "FREE",
      price: 0,
      period: "forever",
      description: "Perfect for trying out the platform",
      features: [
        "5 videos per month",
        "2 minutes max duration", 
        "Basic templates",
        "Watermarked videos",
        "Email support"
      ],
      popular: false,
      cta: "Start Free",
      href: "/auth/signup"
    },
    {
      name: "STARTER",
      price: 25,
      period: "month",
      description: "Great for individuals and small teams",
      features: [
        "25 videos per month",
        "10 minutes max duration",
        "Premium templates", 
        "No watermark",
        "Priority email support"
      ],
      popular: false,
      cta: "Start Starter",
      href: "/auth/signup?plan=starter"
    },
    {
      name: "PRO", 
      price: 45,
      period: "month",
      description: "Best for growing businesses",
      features: [
        "100 videos per month",
        "30 minutes max duration",
        "Custom branding",
        "API access",
        "Live chat support",
        "Advanced analytics"
      ],
      popular: true,
      cta: "Start Pro",
      href: "/auth/signup?plan=pro"
    },
    {
      name: "ENTERPRISE",
      price: 125,
      period: "month", 
      description: "For large organizations",
      features: [
        "Unlimited videos",
        "Unlimited duration",
        "White-label solution",
        "Dedicated support",
        "Custom AI training",
        "SLA guarantees"
      ],
      popular: false,
      cta: "Contact Sales",
      href: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AnimaGenius
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link href="/auth/signin" className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Transform Documents Into
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Professional Videos
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered video synthesis platform that converts your documents, data, and media into 
              engaging animated videos. Enterprise-grade with multi-AI integration.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-sm font-medium">
                OpenAI GPT-4 Integration
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-medium">
                Anthropic Claude
              </span>
              <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-sm font-medium">
                Multi-Provider Rendering
              </span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-medium">
                Enterprise Ready
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup" className="inline-block">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all flex items-center gap-2 mx-auto">
                  Start Free Trial
                  <span>→</span>
                </button>
              </Link>
              <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg font-medium text-lg transition-all">
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50K+</div>
                <div className="text-gray-400 text-sm">Videos Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to create professional videos at scale with AI automation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-900/70 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Generation</h3>
              <p className="text-gray-300">
                Transform documents into professional videos using OpenAI GPT-4 and Anthropic Claude
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-900/70 transition-all duration-300">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Format Support</h3>
              <p className="text-gray-300">
                Process PDF, DOCX, XLSX, MP4, MP3, and images with intelligent content extraction
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-900/70 transition-all duration-300">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-300">
                Bank-level encryption, GDPR compliance, and enterprise-grade security controls
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Scale your video production with plans designed for every team size
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`h-full flex flex-col relative rounded-lg border p-6 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? "bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-purple-500/50" 
                    : "bg-gray-900/50 border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-white text-xl font-semibold">{plan.name}</h3>
                  <div className="mb-4 mt-2">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={plan.href} className="w-full">
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already using AnimaGenius to create professional videos with AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all flex items-center gap-2 mx-auto">
                  Start Your Free Trial
                  <span>→</span>
                </button>
              </Link>
              <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 rounded-lg font-medium text-lg transition-all">
                Schedule Demo
              </button>
            </div>

            <p className="text-gray-400 text-sm mt-4">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-6 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                <span className="text-white font-semibold">AnimaGenius</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered video synthesis platform for modern teams.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/api-docs" className="text-gray-400 hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="text-gray-400 text-sm">
              © 2024 AnimaGenius. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}