export default function Logo({ className = "", dark = false }: { className?: string, dark?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 100 75" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-12 md:w-20 md:h-14 mb-1">
        {/* Left wall, roof to center, right roof, right wall */}
        <path d="M 15 70 L 15 35 L 50 20 L 85 35 L 85 70" />
        {/* Center vertical line */}
        <path d="M 50 20 L 50 70" />
        {/* Left floor */}
        <path d="M 15 70 L 50 70" />
        {/* Lamp */}
        <path d="M 28 30 L 28 48" />
        <path d="M 28 48 C 22 48, 20 51, 20 53 L 36 53 C 36 51, 34 48, 28 48 Z" />
        {/* Table */}
        <path d="M 39 67 L 37 70" />
        <path d="M 47 67 L 49 70" />
        <rect x="35" y="64" width="16" height="3" />
        {/* Pot */}
        <path d="M 40 64 L 39 57 L 47 57 L 46 64" />
        {/* Plant */}
        <path d="M 43 57 C 40 47, 43 42, 43 42 C 43 42, 46 47, 43 57" />
        {/* Doorway */}
        <path d="M 58 40 L 78 48 L 78 70" />
        <path d="M 58 40 L 58 70" />
      </svg>
      <div className="flex flex-col items-end">
        <span className={`font-serif text-lg md:text-xl tracking-wide block leading-none ${dark ? 'text-white' : 'text-brand-charcoal'}`}>
          MADHAV INTERIORS
        </span>
        <span className={`text-[8px] md:text-[9px] tracking-wide block mt-1 font-sans ${dark ? 'text-brand-taupe' : 'text-brand-charcoal/80'}`}>
          Design With Purpose
        </span>
        <span className={`text-[7px] md:text-[8px] tracking-[0.2em] uppercase block mt-0.5 font-sans font-semibold ${dark ? 'text-brand-wood' : 'text-brand-wood'}`}>
          Since 1984
        </span>
      </div>
    </div>
  );
}
