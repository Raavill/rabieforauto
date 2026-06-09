import { useRef, useEffect } from 'react';
import { Search, Layers, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Search',
    description:
      'Enter your car model, part number, or part name. Our AI-powered engine scans millions of listings across global marketplaces in real time.',
    icon: Search,
  },
  {
    num: '02',
    title: 'Compare',
    description:
      'View side-by-side price comparisons from verified sellers. Filter by brand, shipping cost, delivery speed, and customer rating.',
    icon: Layers,
  },
  {
    num: '03',
    title: 'Install',
    description:
      'Order directly from the cheapest store with guaranteed compatibility. Track your shipment and get installation guidance from our AI.',
    icon: Wrench,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.15,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full py-24 md:py-32"
      style={{ backgroundColor: '#f3f3f3' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 block"
            style={{ color: '#ff461e' }}
          >
            The Process
          </span>
          <h2
            className="font-display text-3xl md:text-4xl font-700 leading-tight"
            style={{ color: '#000000', letterSpacing: '-0.01em' }}
          >
            Find Parts in 3 Steps
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="group relative p-8 rounded-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                {/* Number */}
                <span
                  className="absolute top-6 right-6 font-display text-5xl font-800 leading-none opacity-[0.04] select-none"
                  style={{ color: '#000000' }}
                >
                  {step.num}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300"
                  style={{ backgroundColor: 'rgba(255,70,30,0.08)' }}
                >
                  <Icon size={22} style={{ color: '#ff461e' }} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="font-display text-xl font-600 mb-3"
                  style={{ color: '#000000', letterSpacing: '-0.01em' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                  {step.description}
                </p>

                {/* Connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-black/10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
