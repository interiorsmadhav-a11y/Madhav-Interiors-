import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
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
          <span className="text-brand-ivory/80 uppercase tracking-[0.3em] text-sm font-medium mb-6 block">
            Madhav Interiors
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 max-w-4xl mx-auto leading-tight">
            Designing Elegant Interiors for Modern Living
          </h1>
          <p className="text-lg md:text-xl text-brand-ivory/90 mb-10 max-w-2xl mx-auto font-light">
            Custom interiors for homes and workspaces with premium finishes and thoughtful execution.
          </p>
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
            Transforming spaces into timeless interiors with quality craftsmanship and thoughtful design.
          </h2>
          <p className="text-brand-charcoal/70 text-lg leading-relaxed">
            At Madhav Interiors, we believe that your space should be a reflection of your personality and lifestyle. In business since 1984, we have decades of experience in creating bespoke residential and commercial interiors, bringing a perfect balance of aesthetics and functionality to every project. From conceptualization to final execution, our team ensures a seamless and premium experience.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2832&auto=format&fit=crop" 
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
