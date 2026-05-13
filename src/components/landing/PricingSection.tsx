import { Check, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onGetStartedClick: () => void;
  onTryDemoClick: () => void;
}

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started with essential features',
    currency: 'KSh',
    features: [
      'Up to 50 transactions/month',
      'Basic expense tracking',
      'Simple analytics',
      'Mobile app access',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 499,
    description: 'Perfect for individuals managing finances',
    currency: 'KSh',
    features: [
      'Unlimited transactions',
      'Advanced expense tracking',
      'AI-powered insights',
      'Budget planning & alerts',
      'Advanced analytics & reports',
      'Priority email support',
      'Custom categories',
      'Data export',
    ],
    cta: 'Get Pro',
    highlighted: true,
  },
  {
    name: 'Business',
    price: 1499,
    description: 'For teams and business owners',
    currency: 'KSh',
    features: [
      'Everything in Pro',
      'Multi-user accounts',
      'Team collaboration',
      'Advanced permissions',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced security',
      'Monthly reports',
    ],
    cta: 'Get Business',
    highlighted: false,
  },
];

export default function PricingSection({
  onGetStartedClick,
  onTryDemoClick,
}: PricingSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            <span className="text-white">Pricing for Everyone</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always flexible to scale as you grow.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-800/50 border border-slate-700/50 rounded-lg p-1">
            <button className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium transition-all duration-300">
              Monthly
            </button>
            <button className="px-6 py-2 text-slate-300 hover:text-white transition-colors">
              Yearly
              <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all duration-300 overflow-hidden group ${
                plan.highlighted
                  ? 'md:scale-105 border-2 border-blue-500/50 hover:border-blue-400'
                  : 'border border-slate-700/50 hover:border-slate-600/80'
              } ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80'
                  : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50'
              }`}
            >
              {/* Glow Effect for Featured Plan */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
              )}

              {/* Badge for Featured Plan */}
              {plan.highlighted && (
                <div className="absolute top-0 right-0 left-0 flex justify-center pt-4">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                    Recommended
                  </div>
                </div>
              )}

              <div className={`relative p-8 ${plan.highlighted ? 'pt-12' : ''}`}>
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">
                      {plan.currency}<span className="text-sm">/month</span>
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs text-slate-400 mt-2">Billed monthly, cancel anytime</p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={plan.name === 'Free' ? onTryDemoClick : onGetStartedClick}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 mb-8 group/btn inline-flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-white'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Divider */}
                <div className="border-t border-slate-700/50 mb-6" />

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA for Non-Featured Plans */}
                {!plan.highlighted && plan.price === 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 text-center">
                      Upgrade anytime to unlock more features
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Absolutely! Try our Free plan with no credit card required, or test Pro with our live demo.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, M-Pesa, and bank transfers for annual plans.',
              },
              {
                q: 'Can I get a refund?',
                a: '30-day money back guarantee if you\'re not satisfied with any paid plan.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition-all duration-300"
              >
                <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                <p className="text-slate-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
