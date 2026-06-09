import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const helixItems = [
  { label: 'Fast Shipping', x: -35, yOffset: 0 },
  { label: 'OEM Certified', x: 35, yOffset: 80 },
  { label: 'Price Match', x: -35, yOffset: 160 },
  { label: 'Global Inventory', x: 35, yOffset: 240 },
  { label: 'AI Diagnostics', x: -35, yOffset: 320 },
];

export default function KineticDataHelix() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    if (items.length === 0) return;

    // Set initial positions
    items.forEach((item, i) => {
      const data = helixItems[i];
      gsap.set(item, {
        xPercent: data.x,
        y: window.innerHeight * 0.6 + data.yOffset,
        rotateX: 0,
        opacity: 0,
      });
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 25%',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    // Fade in items
    items.forEach((item, i) => {
      tl.to(
        item,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        i * 0.1
      );
    });

    // Start position — move from bottom
    tl.to(
      items,
      {
        y: (i) => helixItems[i].yOffset + 60,
        duration: 1,
        stagger: 0.5,
        ease: 'power2.inOut',
      },
      0
    );

    // Rotation — rotate from flat to angled
    tl.to(
      items,
      {
        rotateX: -180,
        duration: 1,
        stagger: 0.5,
        ease: 'power1.inOut',
      },
      0
    );

    ScrollTrigger.refresh(true);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="scrolling-text-wrapper"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Section Header */}
      <div
        className="absolute top-24 left-0 w-full text-center z-10"
        style={{ pointerEvents: 'none' }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 block"
          style={{ color: '#ff461e' }}
        >
          Our Ecosystem
        </span>
        <h2
          className="font-display text-3xl md:text-4xl font-700 leading-tight"
          style={{ color: '#ffffff', letterSpacing: '-0.01em' }}
        >
          Built for Speed
        </h2>
      </div>

      {/* 3D Text Container */}
      <div
        className="scrolling-text"
        style={{
          width: '100%',
          height: '100vh',
          top: 0,
          left: 0,
        }}
      >
        {helixItems.map((item, i) => (
          <div
            key={item.label}
            ref={(el) => { itemsRef.current[i] = el; }}
            className="helix-item"
            style={{
              left: '50%',
              top: '30%',
              transformStyle: 'preserve-3d',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              color: i % 2 === 0 ? '#ffffff' : '#ff461e',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {item.label}
            {/* Decorative node */}
            <span
              className="inline-block ml-4 w-3 h-3 rounded-full"
              style={{ backgroundColor: '#ff461e' }}
            />
            {/* Connector line */}
            <span
              className="inline-block ml-2 w-16 h-px opacity-30"
              style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        ))}
      </div>

      {/* Bottom text */}
      <div
        className="absolute bottom-24 left-0 w-full text-center z-10"
        style={{ pointerEvents: 'none' }}
      >
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Scroll to explore our network of trusted suppliers
        </p>
      </div>
    </section>
  );
}
