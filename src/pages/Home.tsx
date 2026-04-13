import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPageContent } from '@/services/contentService';

export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getPageContent('home');
      if (data) setContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  const heroTitle = content?.heroTitle || "Designing Elegant Interiors for Modern Living";
  const heroSubtitle = content?.heroSubtitle || "Custom interiors with premium finishes and thoughtful execution.";

  const introTitle = content?.introTitle || "Transforming spaces into timeless interiors with quality craftsmanship and thoughtful design.";
  const introDescription = content?.introDescription || "At Madhav Interiors, we believe that your space should be a reflection of your personality and lifestyle. In business since 1984, we have decades of experience in creating bespoke residential and commercial interiors, bringing a perfect balance of aesthetics and functionality to every project. From conceptualization to final execution, our team ensures a seamless and premium experience.";
  const introImage = content?.introImage || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2832&auto=format&fit=crop";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2874&auto=format&fit=crop"
            alt="Elegant Living Room"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center mt-16">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="h-px w-8 bg-brand-ivory/40"></div>
            <span className="text-brand-ivory/80 uppercase tracking-[0.3em] text-sm font-medium">
              Madhav Interiors
            </span>
            <div className="h-px w-8 bg-brand-ivory/40"></div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 max-w-4xl mx-auto leading-tight">
            {heroTitle}
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-10">
            <span className="text-brand-wood font-serif italic text-lg">Since 1984</span>
            <span className="text-brand-ivory/40">•</span>
            <p className="text-lg md:text-xl text-brand-ivory/90 font-light">
              {heroSubtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/portfolio"
              className="bg-brand-wood text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-charcoal transition-colors w-full sm:w-auto"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-brand-charcoal transition-colors w-full sm:w-auto"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Intro */}
      <section className="py-24 bg-brand-ivory">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Business Since 1984</span>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-8">
            {introTitle}
          </h2>
          <p className="text-brand-charcoal/70 text-lg leading-relaxed">
            {introDescription}
          </p>
          <img 
            src={introImage} 
            alt="Interior Details" 
            className="w-full h-64 md:h-96 object-cover mt-16"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Our Expertise</span>
              <h2 className="text-4xl font-serif text-brand-charcoal">Tailored Design Solutions</h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-sm uppercase tracking-wider font-medium text-brand-charcoal hover:text-brand-wood transition-colors group">
              All Services <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Full Home Interiors', desc: 'End-to-end interior design and execution for your entire home.', img: 'https://images.unsplash.com/photo-1600607687931-cebf574f49ce?q=80&w=2940&auto=format&fit=crop' },
              { title: 'Modular Kitchens', desc: 'Highly functional, modern, and elegant kitchen spaces.', img: 'https://images.unsplash.com/photo-1556910103-1c02745a8728?q=80&w=2940&auto=format&fit=crop' },
              { title: 'Custom Furniture', desc: 'Bespoke furniture pieces crafted to fit your space perfectly.', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2940&auto=format&fit=crop' },
            ].map((service, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="overflow-hidden mb-6 aspect-[4/3]">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-serif text-brand-charcoal mb-3">{service.title}</h3>
                <p className="text-brand-charcoal/70 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/services" className="inline-flex items-center text-sm uppercase tracking-wider font-medium text-brand-charcoal hover:text-brand-wood transition-colors">
              All Services <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-brand-charcoal text-brand-ivory">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-taupe uppercase tracking-widest text-xs font-semibold mb-4 block">Why Madhav Interiors</span>
              <h2 className="text-4xl font-serif text-white mb-8">Elegant interiors designed with purpose and executed with precision.</h2>
              <p className="text-brand-taupe/80 text-lg mb-10 leading-relaxed">
                We don't just design spaces; we craft experiences. Our commitment to quality, transparency, and timely delivery sets us apart.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Customized Designs',
                  'Premium Materials',
                  'Practical Space Planning',
                  'Execution Support',
                  'Attention to Detail',
                  'Transparent Communication'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="text-brand-wood shrink-0 mt-0.5" size={20} />
                    <span className="text-brand-ivory/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2900&auto=format&fit=crop" 
                  alt="Craftsmanship" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-brand-wood p-8 max-w-xs hidden md:block">
                <p className="text-white font-serif text-xl italic">"Excellence is in the details."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Testimonials</span>
            <h2 className="text-4xl font-serif text-brand-charcoal">What Our Clients Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                quote: "Madhav Interiors transformed our apartment into a dream home. Their attention to detail and choice of materials is exceptional.",
                author: "Rajesh Sharma",
                location: "Pune"
              },
              {
                quote: "Professional, creative, and timely. They understood our vision perfectly and executed it beyond our expectations.",
                author: "Priya Mehta",
                location: "Mumbai"
              },
              {
                quote: "The best interior design team we've worked with. Their process is transparent and the results are stunning.",
                author: "Amit Patel",
                location: "Pune"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-brand-ivory p-8 rounded-2xl relative">
                <div className="text-brand-wood text-4xl font-serif absolute top-4 left-6 opacity-20">"</div>
                <p className="text-brand-charcoal/80 italic mb-6 relative z-10 leading-relaxed">
                  {t.quote}
                </p>
                <div>
                  <h4 className="font-medium text-brand-charcoal">{t.author}</h4>
                  <p className="text-brand-charcoal/50 text-sm">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-ivory text-center">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-8">
            Let's create a space that reflects your vision.
          </h2>
          <p className="text-brand-charcoal/70 text-lg mb-12">
            Ready to transform your home or office? Get in touch with us today for a free consultation and let's bring your dream space to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-brand-charcoal text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-wood transition-colors"
            >
              Request Consultation
            </Link>
            <a
              href="https://wa.me/917387383117?text=Hi%20Madhav%20Interiors,%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-brand-charcoal text-brand-charcoal px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-charcoal hover:text-white transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
