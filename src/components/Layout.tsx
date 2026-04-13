import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatWidget from '@/components/ChatWidget';
import Logo from '@/components/Logo';

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Process', path: '/process' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          isScrolled
            ? 'bg-brand-ivory/90 backdrop-blur-md shadow-sm py-2'
            : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex flex-col hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-sm uppercase tracking-wider font-medium transition-colors hover:text-brand-wood',
                  location.pathname === link.path ? 'text-brand-wood' : 'text-brand-charcoal/80'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-brand-charcoal text-white px-6 py-2.5 text-sm uppercase tracking-wider font-medium hover:bg-brand-wood transition-colors"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-brand-charcoal p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-ivory pt-24 px-6 md:hidden flex flex-col">
          <nav className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-xl font-serif tracking-wide transition-colors',
                  location.pathname === link.path ? 'text-brand-wood' : 'text-brand-charcoal'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-8 bg-brand-charcoal text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-wood transition-colors inline-block mx-auto"
            >
              Get a Quote
            </Link>
            <Link
              to="/admin"
              className="text-xs uppercase tracking-widest text-brand-charcoal/40 hover:text-brand-wood transition-colors mt-4"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-brand-ivory pt-20 pb-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link to="/" className="flex flex-col mb-6 items-start hover:opacity-80 transition-opacity">
                <Logo dark />
              </Link>
              <p className="text-brand-taupe text-sm leading-relaxed mb-6">
                Transforming spaces into timeless interiors with quality craftsmanship and thoughtful design. <br/><br/>
                <span className="text-white font-medium uppercase tracking-wider text-xs">Business Since 1984</span>
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-brand-taupe hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-brand-taupe hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-brand-taupe hover:text-white text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {['Full Home Interiors', 'Modular Kitchens', 'Living Room Design', 'Bedroom Interiors', 'Custom Furniture'].map((service) => (
                  <li key={service}>
                    <Link to="/services" className="text-brand-taupe hover:text-white text-sm transition-colors">
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-brand-taupe text-sm">
                  <MapPin size={18} className="shrink-0 mt-0.5" />
                  <span>Katraj Pune,<br />Maharashtra - 411046</span>
                </li>
                <li className="flex items-start space-x-3 text-brand-taupe text-sm">
                  <Phone size={18} className="shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span>Tulsiram: +91 7387383117</span>
                    <span>Arjun: +91 9922210180</span>
                  </div>
                </li>
                <li className="flex items-center space-x-3 text-brand-taupe text-sm">
                  <Mail size={18} className="shrink-0" />
                  <span>Interiorsmadhav@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-taupe/60">
            <p>&copy; {new Date().getFullYear()} Madhav Interiors. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917387383117?text=Hi%20Madhav%20Interiors,%20I%20would%20like%20to%20discuss%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
