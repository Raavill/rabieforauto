import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const MARQUEE_TEXT = 'HUGE SAVINGS \u2022 UP TO 60% OFF OEM PARTS \u2022 SHOP NOW \u2022 ';

export default function KineticTextMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textBlocksRef = useRef<HTMLDivElement[]>([]);
  const charSpansRef = useRef<HTMLSpanElement[][]>([[], []]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const blocks = textBlocksRef.current.filter(Boolean);
    if (blocks.length === 0) return;

    // GSAP horizontal scroll tween
    const tl = gsap.timeline({ repeat: -1 });
    blocks.forEach((block, i) => {
      gsap.set(block, { xPercent: i === 0 ? 0 : -100 });
    });

    tl.to(blocks, {
      xPercent: '+=100',
      duration: 40,
      ease: 'none',
      repeat: -1,
      modifiers: {
        xPercent: gsap.utils.wrap(-100, 100),
      },
    });

    // Wave animation
    let time = 0;
    const animate = () => {
      time += 0.015;
      charSpansRef.current.forEach((charList) => {
        charList.forEach((char) => {
          if (!char || !char.parentElement) return;
          const textDiv = char.parentElement as HTMLElement;
          const waveVal =
            Math.sin(
              -(textDiv.offsetLeft + char.offsetLeft) * 0.01 - time
            ) * 20;
          const scaleVal = Math.max(0, 1 - Math.abs(waveVal) * 0.05);
          char.style.transform = `translateY(${waveVal}px) scaleY(${scaleVal})`;
        });
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      tl.kill();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const chars = MARQUEE_TEXT.split('');

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#ff461e',
        padding: '120px 0',
      }}
    >
      <div className="relative" style={{ whiteSpace: 'nowrap' }}>
        {[0, 1].map((blockIdx) => (
          <div
            key={blockIdx}
            ref={(el) => {
              if (el) textBlocksRef.current[blockIdx] = el;
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {chars.map((char, charIdx) => (
              <span
                key={charIdx}
                ref={(el) => {
                  if (el) charSpansRef.current[blockIdx][charIdx] = el;
                }}
                style={{
                  display: 'inline-block',
                  color: '#000000',
                  fontSize: '8vw',
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.1,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
