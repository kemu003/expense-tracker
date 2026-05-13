import { ArrowRight, MessageCircle, Linkedin, Phone } from 'lucide-react';
import { useState } from 'react';

interface CTASectionProps {
  onGetStartedClick: () => void;
}

export default function CTASection({ onGetStartedClick }: CTASectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="relative py-24 overflow-hidden" id="contact">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Ready to Take Control</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              of Your Finances?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
            Join users using Mutai Digital Solution to manage expenses, budgets, and financial growth smarter. Start for free today.
          </p>
          <button
            onClick={onGetStartedClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 inline-flex items-center gap-2 group"
          >
            Start Tracking Smarter Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          {/* Contact Form */}
          <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl pointer-events-none" />

            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="Tell us about your needs..."
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  {submitted ? '✓ Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            <a
              href="tel:+254725674910"
              className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/80 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800 hover:to-slate-900 block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Call Us</h4>
                  <p className="text-slate-400 text-sm mb-2">Available Monday to Friday, 9 AM - 5 PM EAT</p>
                  <p className="text-lg font-bold text-blue-400 group-hover:text-blue-300">
                    +254 725 674 910
                  </p>
                </div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/kevin-kiplangat-mutai-583172367/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/80 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800 hover:to-slate-900 block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                  <Linkedin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Connect on LinkedIn</h4>
                  <p className="text-slate-400 text-sm mb-2">Follow for updates and insights</p>
                  <p className="text-blue-400 group-hover:text-blue-300 font-medium flex items-center gap-1">
                    Kevin Kiplangat Mutai
                    <ArrowRight className="w-4 h-4" />
                  </p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@mutaidigitalsolution.com"
              className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/80 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800 hover:to-slate-900 block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Email Support</h4>
                  <p className="text-slate-400 text-sm mb-2">We respond within 24 hours</p>
                  <p className="text-blue-400 group-hover:text-blue-300 font-medium">
                    info@mutaidigitalsolution.com
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Still have questions? Check our{' '}
            <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              FAQ section
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
