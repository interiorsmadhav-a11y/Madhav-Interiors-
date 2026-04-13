import { useState, useEffect } from 'react';
import { getPageContent } from '@/services/contentService';

export default function Process() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getPageContent('process');
      if (data) setContent(data);
    };
    fetchContent();
  }, []);

  const title = content?.title || "A seamless journey from concept to reality.";
  const description = content?.description || "We follow a structured and transparent process to ensure that your interior design journey is stress-free and enjoyable.";

  const steps = [
    {
      num: '01',
      title: 'Initial Consultation',
      desc: 'We begin with a detailed discussion to understand your vision, requirements, lifestyle, and budget. This helps us align our design approach with your expectations.'
    },
    {
      num: '02',
      title: 'Site Visit & Measurement',
      desc: 'Our team visits the site to take precise measurements and assess the spatial dynamics, natural light, and structural elements.'
    },
    {
      num: '03',
      title: 'Concept & Layout Planning',
      desc: 'We present initial design concepts, mood boards, and 2D layouts to give you a clear idea of spatial arrangement and design direction.'
    },
    {
      num: '04',
      title: 'Material & Design Finalization',
      desc: 'Once the layout is approved, we move to 3D visualizations and help you select materials, finishes, colors, and furnishings.'
    },
    {
      num: '05',
      title: 'Quotation & Approval',
      desc: 'A detailed, transparent quotation is provided based on the finalized designs and materials. Upon approval, we commence the execution phase.'
    },
    {
      num: '06',
      title: 'Execution & Supervision',
      desc: 'Our skilled craftsmen and project managers take over, ensuring that the design is executed flawlessly, on time, and up to our quality standards.'
    },
    {
      num: '07',
      title: 'Handover',
      desc: 'After a rigorous quality check and deep cleaning, we hand over your newly transformed space, ready for you to move in and enjoy.'
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-brand-ivory">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">How We Work</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-8">
            {title}
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-12 mb-16 relative">
              {/* Connecting Line */}
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute left-[3.5rem] top-24 bottom-[-4rem] w-px bg-brand-charcoal/10"></div>
              )}
              
              <div className="shrink-0">
                <div className="w-28 h-28 rounded-full border border-brand-charcoal/20 flex items-center justify-center bg-white z-10 relative">
                  <span className="font-serif text-4xl text-brand-wood">{step.num}</span>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-2xl font-serif text-brand-charcoal mb-4">{step.title}</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
