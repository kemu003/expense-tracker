import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Freelance Designer',
    content:
      'Mutai Digital Solution has completely transformed how I manage my finances. The AI insights helped me save 30% more each month!',
    avatar: 'SJ',
    rating: 5,
  },
  {
    name: 'James Mwangi',
    role: 'Small Business Owner',
    content:
      'Finally, a tool that makes financial management easy. The budgeting feature keeps me on track and the mobile app is fantastic.',
    avatar: 'JM',
    rating: 5,
  },
  {
    name: 'Diana Kipchoge',
    role: 'Student & Content Creator',
    content:
      'The free tier is incredibly generous. I can track all my expenses without any ads or limitations. Highly recommend!',
    avatar: 'DK',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Corporate Professional',
    content:
      'The analytics dashboard gives me clear visibility into my spending patterns. The real-time alerts keep me from overspending.',
    avatar: 'MC',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    role: 'Financial Consultant',
    content:
      'I recommend this to all my clients. It\'s secure, intuitive, and actually helps people build better financial habits.',
    avatar: 'EW',
    rating: 5,
  },
  {
    name: 'David Ouma',
    role: 'Entrepreneur',
    content:
      'The team collaboration features are game-changing for my business. We can now track expenses across departments easily.',
    avatar: 'DO',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">Loved by</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Users Around the World
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Mutai Digital Solution to manage their finances.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/80 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800 hover:to-slate-900"
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300 pointer-events-none" />

              <div className="relative">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-300 mb-6 leading-relaxed group-hover:text-slate-200 transition-colors">
                  "{testimonial.content}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { number: '5,000+', label: 'Active Users' },
            { number: '50M+', label: 'Transactions Tracked' },
            { number: '4.9/5', label: 'User Rating' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/80 transition-all duration-300"
            >
              <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </p>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">Join the community and start managing your finances smarter</p>
          <div className="inline-flex items-center gap-3">
            <div className="flex -space-x-3">
              {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'].map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: color }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-slate-300">
              <span className="font-semibold text-white">1,234</span> people joined this week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
