import {
  TrendingUp,
  BarChart3,
  Wallet,
  Zap,
  Smartphone,
  Lock,
  Clock,
  DollarSign,
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Expense Tracking',
    description: 'Automatically categorize and track all your expenses with AI-powered intelligence.',
  },
  {
    icon: Zap,
    title: 'AI Financial Insights',
    description: 'Get intelligent recommendations to optimize your spending patterns and save more.',
  },
  {
    icon: Wallet,
    title: 'Budget Planning',
    description: 'Create flexible budgets and get real-time alerts when you approach limits.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Visualize your financial data with interactive charts and comprehensive reports.',
  },
  {
    icon: DollarSign,
    title: 'Income & Expense Management',
    description: 'Easily manage multiple income streams and categorized expenses in one place.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly Experience',
    description: 'Access your finances on the go with our fully responsive mobile interface.',
  },
  {
    icon: Lock,
    title: 'Secure Cloud Access',
    description: 'Enterprise-grade encryption protects all your sensitive financial data.',
  },
  {
    icon: Clock,
    title: 'Fast & Responsive Dashboard',
    description: 'Lightning-fast performance with a smooth, intuitive user experience.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/5 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-600/5 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
            <br />
            <span className="text-white">Built for Smart Money Management</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Everything you need to take control of your finances and make smarter financial decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/80 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800 hover:to-slate-900 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300 pointer-events-none" />

                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                    <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h10v10M7 17L17 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">
            Plus many more features to supercharge your financial management
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-blue-300">Explore all features</span>
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
