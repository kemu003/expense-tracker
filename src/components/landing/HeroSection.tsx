import { ArrowRight, Zap } from 'lucide-react';

interface HeroSectionProps {
  onDemoClick: () => void;
  onGetStartedClick: () => void;
}

export default function HeroSection({ onDemoClick, onGetStartedClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      {/* Gradient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-l from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] py-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Smart Financial Management</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                  Smart Expense
                </span>
                <br />
                <span className="text-white">Tracking Powered</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  by AI
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
              Manage your finances smarter with intelligent expense tracking, budgeting, analytics, and real-time financial insights. Take control of your money today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onDemoClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 group inline-flex items-center justify-center gap-2"
              >
                Try the Live Demo Instantly
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onGetStartedClick}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
              >
                Get Started
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border border-slate-800" />
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border border-slate-800" />
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border border-slate-800" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Trusted by users</p>
                  <p className="text-xs text-slate-400">Join our growing community</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">★</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">4.9/5 Rating</p>
                  <p className="text-xs text-slate-400">From 200+ reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
            <div className="relative w-full h-full max-w-lg">
              {/* Mock Dashboard */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <p className="text-xs text-slate-400 flex-1 text-center">dashboard.mutaidigital.app</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Welcome back!</p>
                    <p className="text-2xl font-bold text-white">Your Financial Overview</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400">Total Expenses</p>
                      <p className="text-lg font-bold text-white mt-1">KSh 24,850</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400">This Month</p>
                      <p className="text-lg font-bold text-green-400 mt-1">+KSh 8,200</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400">Budget Status</p>
                      <p className="text-lg font-bold text-blue-400 mt-1">75%</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400">Savings</p>
                      <p className="text-lg font-bold text-purple-400 mt-1">KSh 12,450</p>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-slate-700/20 rounded-lg p-4 h-24 flex items-end justify-between gap-2">
                    <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded h-12 opacity-70" />
                    <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded h-16 opacity-70" />
                    <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded h-10 opacity-70" />
                    <div className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded h-14 opacity-70" />
                  </div>

                  {/* Recent Transactions */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-slate-300">Recent Transactions</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-slate-700/20 rounded px-3 py-2">
                          <span className="text-slate-300">Transaction {i}</span>
                          <span className="text-red-400">-KSh {1500 + i * 200}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
