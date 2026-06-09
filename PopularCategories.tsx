import { useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'Brake System', image: '/brake_category.jpg', count: '14,200+ parts', priceFrom: 'From $12' },
  { name: 'Suspension', image: '/suspension_category.jpg', count: '9,800+ parts', priceFrom: 'From $28' },
  { name: 'Filters', image: '/brake_category.jpg', count: '6,500+ parts', priceFrom: 'From $8' },
  { name: 'Electrical', image: '/suspension_category.jpg', count: '11,300+ parts', priceFrom: 'From $15' },
];

interface PopularCategoriesProps {
  onCategorySearch: (q: string) => void;
}

export default function PopularCategories({ onCategorySearch }: PopularCategoriesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    cards.forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 50, scale: 0.96 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        delay: i * 0.1,
      });
    });
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  return (
    <section ref={sectionRef} id="categories" className="relative w-full py-24 md:py-32" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#ff461e' }}>Browse</span>
            <h2 className="font-display text-3xl md:text-4xl font-700 leading-tight" style={{ color: '#ffffff', letterSpacing: '-0.01em' }}>Popular Categories</h2>
          </div>
          <a href="#" className="mt-4 md:mt-0 text-sm font-medium uppercase tracking-wider flex items-center gap-2 transition-colors duration-200 hover:text-white" style={{ color: '#ff461e' }}>
            View All <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative rounded-lg overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3/4', backgroundColor: '#111111' }}
              onClick={() => onCategorySearch(cat.name)}
            >
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: 'grayscale(100%)' }} />
              <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }} />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="text-white/40 text-[11px] uppercase tracking-wider mb-1">{cat.count}</span>
                <h3 className="font-display text-lg font-600 text-white mb-1">{cat.name}</h3>
                <span className="text-[#ff461e] text-xs font-medium">{cat.priceFrom}</span>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" style={{ backgroundColor: '#ff461e' }}>
                <ArrowUpRight size={16} className="text-black" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
