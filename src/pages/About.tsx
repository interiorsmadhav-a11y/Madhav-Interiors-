export default function About() {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Our Story</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-8">
            Crafting spaces that inspire and elevate everyday living.
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed">
            In business since 1984, Madhav Interiors has been dedicated to transforming ordinary spaces into extraordinary environments. We blend aesthetics with functionality to create homes and offices that truly resonate with the people who inhabit them.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2900&auto=format&fit=crop" 
            alt="Interior Design Process" 
            className="w-full h-[500px] object-cover"
            referrerPolicy="no-referrer"
          />
          <img 
            src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=2874&auto=format&fit=crop" 
            alt="Completed Interior" 
            className="w-full h-[500px] object-cover md:mt-16"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-serif text-brand-charcoal">Our Philosophy</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-brand-charcoal/80 leading-relaxed mb-6">
                We believe that good design is not just about how a space looks, but how it feels and functions. Our approach is deeply rooted in understanding our clients' lifestyles, preferences, and aspirations.
              </p>
              <p className="text-brand-charcoal/80 leading-relaxed">
                Every project we undertake is a collaborative journey. We listen, we ideate, and we execute with meticulous attention to detail, ensuring that the final outcome surpasses expectations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-brand-charcoal/10 pt-20">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-serif text-brand-charcoal">Quality Commitment</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-brand-charcoal/80 leading-relaxed mb-6">
                Quality is the cornerstone of everything we do. From selecting premium materials to partnering with skilled craftsmen, we never compromise on the standards of our work.
              </p>
              <p className="text-brand-charcoal/80 leading-relaxed">
                Our execution process is transparent and rigorous, ensuring that every piece of furniture, every coat of paint, and every lighting fixture meets our exacting criteria for excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
