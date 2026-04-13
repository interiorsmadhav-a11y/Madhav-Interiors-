import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPageContent } from '@/services/contentService';

export default function Services() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getPageContent('services');
      if (data) setContent(data);
    };
    fetchContent();
  }, []);

  const title = content?.title || "Tailored solutions for every space.";
  const description = content?.description || "From complete home transformations to bespoke furniture pieces, we offer a comprehensive range of interior design services to meet your specific needs.";

  const services = [
    {
      title: 'Full Home Interiors',
      description: 'Comprehensive interior design and execution for your entire home. We handle everything from conceptualization to the final handover, ensuring a cohesive and harmonious design throughout your living space.',
      includes: ['Space Planning', 'Material Selection', 'Custom Furniture', 'Lighting Design', 'Project Management'],
      img: 'https://images.unsplash.com/photo-1600607687931-cebf574f49ce?q=80&w=2940&auto=format&fit=crop'
    },
    {
      title: 'Modular Kitchens',
      description: 'Highly functional, modern, and elegant kitchen spaces tailored to your cooking habits and lifestyle. We use premium hardware and finishes to create kitchens that are both beautiful and durable.',
      includes: ['Ergonomic Layouts', 'Premium Hardware', 'Custom Cabinetry', 'Appliance Integration', 'Countertop Selection'],
      img: 'https://images.unsplash.com/photo-1556910103-1c02745a8728?q=80&w=2940&auto=format&fit=crop'
    },
    {
      title: 'Living Room Design',
      description: 'Create a welcoming and stylish living area that serves as the heart of your home. We focus on comfortable seating, elegant entertainment units, and perfect lighting to set the right mood.',
      includes: ['TV Unit Design', 'Seating Arrangements', 'False Ceiling', 'Ambient Lighting', 'Soft Furnishings'],
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2874&auto=format&fit=crop'
    },
    {
      title: 'Bedroom Interiors',
      description: 'Transform your bedroom into a serene sanctuary. Our designs prioritize comfort, ample storage, and a relaxing atmosphere to help you unwind after a long day.',
      includes: ['Wardrobe Design', 'Bed & Headboard', 'Mood Lighting', 'Dressing Units', 'Window Treatments'],
      img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2960&auto=format&fit=crop'
    },
    {
      title: 'Custom Furniture',
      description: 'Bespoke furniture pieces crafted to fit your space perfectly. Whether you need a unique dining table, a statement armchair, or built-in shelving, our craftsmen deliver exceptional quality.',
      includes: ['Bespoke Design', 'Premium Woodwork', 'Upholstery', 'Finishing', 'Installation'],
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2940&auto=format&fit=crop'
    },
    {
      title: 'Office Interiors',
      description: 'Functional and inspiring workspaces that boost productivity and reflect your brand identity. We design offices that cater to modern work culture and employee well-being.',
      includes: ['Workstation Layouts', 'Conference Rooms', 'Reception Areas', 'Acoustic Solutions', 'Ergonomic Furniture'],
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2869&auto=format&fit=crop'
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-brand-ivory">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Our Services</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-8">
            {title}
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-32">
          {services.map((service, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}>
              <div className="w-full md:w-1/2">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-serif text-brand-charcoal mb-6">{service.title}</h2>
                <p className="text-brand-charcoal/70 leading-relaxed mb-8">
                  {service.description}
                </p>
                <div className="mb-10">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-charcoal mb-4">What's Included</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-brand-charcoal/80">
                        <span className="w-1.5 h-1.5 bg-brand-wood rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/contact"
                  className="inline-block border-b border-brand-charcoal pb-1 text-sm uppercase tracking-wider font-medium text-brand-charcoal hover:text-brand-wood hover:border-brand-wood transition-colors"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
