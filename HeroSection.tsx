import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import CinematicSpeedField from './CinematicSpeedField';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const allSuggestions = [
    'BMW brake pads 320i',
    'Audi A4 oil filter',
    'Mercedes brake disc C-Class',
    'Toyota Camry air filter',
    'Honda Civic spark plugs',
    'Volkswagen Golf clutch kit',
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allSuggestions.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.length > 0 ? filtered : allSuggestions.slice(0, 4));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (heroRef.current && !heroRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSearch = (q?: string) => {
    const query = q || searchQuery;
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      <CinematicSpeedField />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, transparent 60%, black 150%)', zIndex: 2 }}
      />
      <div className="relative flex flex-col items-center justify-end h-full px-6 pb-20 md:pb-28" style={{ zIndex: 10 }}>
        <div className="text-center mb-10">
          <h1
            className="font-display text-white font-900 leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em', textShadow: '0 0 80px rgba(255,70,30,0.15)' }}
          >
            GLOBAL PARTS
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-3 font-light tracking-wide uppercase">
            Compare prices across 500+ stores worldwide
          </p>
        </div>

        <div className="w-full max-w-2xl relative">
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="pl-5 text-white/40">
              <Search size={20} strokeWidth={1.5} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search part, brand, or model..."
              className="flex-1 bg-transparent text-white placeholder-white/35 text-[15px] py-4 px-4 outline-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <button
              onClick={() => handleSearch()}
              className="mr-2 px-5 py-2.5 rounded-md text-black text-sm font-semibold flex items-center gap-2 transition-colors duration-200 hover:brightness-90"
              style={{ backgroundColor: '#ff461e' }}
            >
              Compare Prices
              <ArrowRight size={15} />
            </button>
          </div>

          {showSuggestions && (
            <div
              className="absolute top-full left-0 right-0 mt-2 rounded-lg overflow-hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="w-full text-left px-5 py-3 text-white/70 text-sm hover:text-white hover:bg-white/5 transition-all duration-150 flex items-center gap-3"
                  onClick={() => { setSearchQuery(s); setShowSuggestions(false); handleSearch(s); }}
                >
                  <Search size={14} className="text-white/30" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-8 mt-8 text-white/35 text-xs uppercase tracking-wider">
          <span>500+ Stores</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>2M+ Parts</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Global Shipping</span>
        </div>
      </div>
    </section>
  );
}
