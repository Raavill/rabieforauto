import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, Shield } from 'lucide-react';

interface NavigationProps {
  onAdminClick: () => void;
  onSearch: (q: string) => void;
}

export default function Navigation({ onAdminClick, onSearch }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Shop', 'Brands', 'Categories', 'AI Assistant'];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? '#000000' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-white text-xl font-800 tracking-tight">
          rabieforauto
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-white text-[13px] font-medium uppercase tracking-wider hover:text-[#ff461e] transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-5">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && quickSearch.trim()) { onSearch(quickSearch.trim()); setSearchOpen(false); setQuickSearch(''); } }}
                placeholder="Search parts..."
                className="bg-transparent text-white text-sm outline-none border-b border-white/30 pb-1 w-40 placeholder-white/30"
              />
              <button onClick={() => setSearchOpen(false)} className="text-white/50 hover:text-white"><X size={15} /></button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-[#ff461e] transition-colors duration-200">
              <Search size={18} strokeWidth={1.5} />
            </button>
          )}
          <button className="text-white hover:text-[#ff461e] transition-colors duration-200 relative">
            <ShoppingCart size={18} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#ff461e] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="text-white hover:text-[#ff461e] transition-colors duration-200">
            <User size={18} strokeWidth={1.5} />
          </button>
          {/* Admin link */}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,70,30,0.15)', color: '#ff461e', border: '1px solid rgba(255,70,30,0.3)' }}
            title="Admin Panel"
          >
            <Shield size={13} />
            Admin
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full py-6 px-6 flex flex-col gap-5"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-white text-sm font-medium uppercase tracking-wider hover:text-[#ff461e] transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <button
            onClick={() => { onAdminClick(); setMobileOpen(false); }}
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: '#ff461e' }}
          >
            <Shield size={15} />
            Admin Panel
          </button>
        </div>
      )}
    </nav>
  );
}
