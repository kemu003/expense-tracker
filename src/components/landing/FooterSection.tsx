import { Linkedin, Twitter, Github } from 'lucide-react';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/50 bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mutai Digital
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Smart expense tracking powered by AI. Manage your finances smarter.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.linkedin.com/in/kevin-kiplangat-mutai-583172367/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Security', 'Status'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/50 py-8 space-y-4 sm:flex sm:items-center sm:justify-between sm:space-y-0">
          {/* Copyright */}
          <div className="text-slate-400 text-sm">
            <p>© {currentYear} Mutai Digital Solution. All rights reserved.</p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a
              href="tel:+254725674910"
              className="text-slate-400 hover:text-white transition-colors"
            >
              📞 +254 725 674 910
            </a>
            <a
              href="mailto:info@mutaidigitalsolution.com"
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✉️ info@mutaidigitalsolution.com
            </a>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center pt-4 border-t border-slate-800/50">
          <p className="text-slate-500 text-xs">
            Made with ❤️ by Mutai Digital Solution
          </p>
        </div>
      </div>
    </footer>
  );
}
