import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PreviewSection from '../components/landing/PreviewSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import FooterSection from '../components/landing/FooterSection';

interface LandingPageProps {
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
}

export default function LandingPage({ onNavigateToAuth, onNavigateToDashboard }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mutai Digital
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToAuth}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <div id="hero">
          <HeroSection
            onDemoClick={onNavigateToDashboard}
            onGetStartedClick={onNavigateToAuth}
          />
        </div>

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="preview">
          <PreviewSection />
        </div>

        <div id="pricing">
          <PricingSection
            onGetStartedClick={onNavigateToAuth}
            onTryDemoClick={onNavigateToDashboard}
          />
        </div>

        <div id="testimonials">
          <TestimonialsSection />
        </div>

        <div id="contact">
          <CTASection onGetStartedClick={onNavigateToAuth} />
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
