import { Monitor, Smartphone, Zap } from 'lucide-react';

export default function PreviewSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">Beautiful Interface</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              On Every Device
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Seamless experience across desktop, tablet, and mobile devices with a responsive design.
          </p>
        </div>

        {/* Preview Tabs */}
        <div className="space-y-8">
          {/* Desktop Preview */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Desktop Dashboard</h3>
              <span className="ml-auto text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">Fully Featured</span>
            </div>
            <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/80 transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <p className="text-xs text-slate-400 flex-1">dashboard.mutaidigital.app</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                {/* Sidebar */}
                <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-300">Navigation</p>
                  {['Dashboard', 'Expenses', 'Income', 'Analytics', 'Budgets'].map((item, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded text-xs ${
                        i === 0
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Total Balance</p>
                    <p className="text-3xl font-bold text-white">KSh 125,450</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <p className="text-xs text-slate-400">This Month</p>
                      <p className="text-xl font-bold text-green-400 mt-2">+KSh 28,300</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <p className="text-xs text-slate-400">Expenses</p>
                      <p className="text-xl font-bold text-red-400 mt-2">-KSh 15,600</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 h-32 flex items-end justify-between gap-2">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded"
                        style={{ height: `${Math.random() * 100 + 20}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Mobile Experience</h3>
              <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Optimized</span>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl overflow-hidden hover:border-slate-600/80 transition-all duration-300 max-w-xs w-full">
                {/* Phone Frame */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 flex items-center justify-center text-xs text-slate-400">
                  <span>9:41</span>
                </div>
                <div className="bg-slate-900 p-4 space-y-4 min-h-96">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Your Balance</p>
                    <p className="text-2xl font-bold text-white mt-1">KSh 125,450</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Income</p>
                      <p className="text-lg font-bold text-green-400 mt-1">+28K</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400">Expenses</p>
                      <p className="text-lg font-bold text-red-400 mt-1">-15K</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-slate-300 font-semibold">Recent</p>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-400">
                        <span>Transaction {i}</span>
                        <span className="text-red-400">-KSh {500 * i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Smart Categorization',
              description: 'AI automatically categorizes transactions for better insights.',
            },
            {
              title: 'Real-Time Sync',
              description: 'All devices sync instantly for up-to-date information.',
            },
            {
              title: 'Offline Access',
              description: 'Access your data even without internet connection.',
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
