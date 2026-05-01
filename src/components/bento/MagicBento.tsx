import React, { useRef } from 'react';
import { motion } from 'framer-motion';

type MagicBentoGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function MagicBentoGrid({ children, className }: MagicBentoGridProps) {
  return (
    <div
      className={
        "grid gap-6 " +
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 " +
        (className ? className : '')
      }
    >
      {children}
    </div>
  );
}

type MagicBentoCardProps = {
  children: React.ReactNode;
  accent?: 'primary' | 'accent';
  className?: string;
  spotlight?: boolean;
  spotlightRadius?: number; // px
  magnetism?: boolean;
  magnetStrength?: number; // px
  clickEffect?: boolean;
  contentClassName?: string;
  tilt?: boolean;
  tiltStrength?: number; // deg
  stars?: boolean;
  disableAnimations?: boolean;
  delay?: number;
};

export function MagicBentoCard({
  children,
  accent = 'primary',
  className,
  spotlight = true,
  spotlightRadius = 350,
  magnetism = true,
  magnetStrength = 8,
  clickEffect = true,
  contentClassName,
  tilt = true,
  tiltStrength = 5,
  stars = true,
  disableAnimations = false,
  delay = 0,
}: MagicBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const element = cardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (spotlight) {
      const xPct = (localX / rect.width) * 100;
      const yPct = (localY / rect.height) * 100;
      element.style.setProperty('--spot-x', `${xPct}%`);
      element.style.setProperty('--spot-y', `${yPct}%`);
      element.style.setProperty('--spot-opacity', '1');
      element.style.setProperty('--spot-radius', `${spotlightRadius}px`);
    }

    if (magnetism || tilt) {
      const normalizedX = (localX - rect.width / 2) / (rect.width / 2);
      const normalizedY = (localY - rect.height / 2) / (rect.height / 2);
      
      if (magnetism) {
        const tx = Math.max(-1, Math.min(1, normalizedX)) * magnetStrength;
        const ty = Math.max(-1, Math.min(1, normalizedY)) * magnetStrength;
        element.style.setProperty('--mag-x', `${tx}px`);
        element.style.setProperty('--mag-y', `${ty}px`);
        
        const parallaxX = -normalizedX * 10;
        const parallaxY = -normalizedY * 10;
        element.style.setProperty('--parallax-x', `${parallaxX}px`);
        element.style.setProperty('--parallax-y', `${parallaxY}px`);
      }

      if (tilt) {
        const ry = normalizedX * tiltStrength;
        const rx = -normalizedY * tiltStrength;
        element.style.setProperty('--tilt-x', `${rx}deg`);
        element.style.setProperty('--tilt-y', `${ry}deg`);
      }
    }
  }

  function handleMouseLeave() {
    const element = cardRef.current;
    if (!element) return;
    element.style.setProperty('--spot-opacity', '0');
    element.style.setProperty('--mag-x', '0px');
    element.style.setProperty('--mag-y', '0px');
    element.style.setProperty('--parallax-x', '0px');
    element.style.setProperty('--parallax-y', '0px');
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  }

  const accentColor = accent === 'primary' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={
        "group relative overflow-hidden rounded-2xl border border-white/5 " +
        "bg-[#0a0a0a]/40 backdrop-blur-3xl " +
        "transition-all duration-300 ease-out hover:border-primary/30 " +
        "hover:shadow-[0_0_40px_rgba(0,255,255,0.03)] " +
        (className ? className : '')
      }
      style={{
        transform: `translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))`,
        perspective: '1000px',
      } as any}
    >
      {/* Dynamic Glow Layer */}
      <div className="glow-border group-hover:border-primary/20" />
      
      {/* Animated Accent Gradient */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${accentColor} 0%, transparent 70%)`
        }}
      />
      
      {/* Scanner Line */}
      <div className="scanner-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Spotlight Effect */}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[var(--spot-opacity,0)] transition-opacity duration-500"
          style={{
            background: `radial-gradient(var(--spot-radius, ${spotlightRadius}px) circle at var(--spot-x, 50%) var(--spot-y, 50%), ${accentColor}15, transparent 80%)`,
          } as React.CSSProperties}
        />
      )}

      {/* Floating Particles/Stars */}
      {stars && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20 transition-transform duration-500 ease-out"
          style={{
            transform: 'translate3d(var(--parallax-x,0px), var(--parallax-y,0px), 0)',
            backgroundImage: `radial-gradient(1px 1px at 25% 35%, white 50%, transparent 51%),
              radial-gradient(1.5px 1.5px at 65% 55%, white 50%, transparent 51%),
              radial-gradient(1px 1px at 45% 85%, white 50%, transparent 51%),
              radial-gradient(1px 1px at 85% 15%, white 50%, transparent 51%)`,
            backgroundRepeat: 'no-repeat',
          } as React.CSSProperties}
        />
      )}

      {/* Content */}
      <div className={"relative z-10 " + (contentClassName ? contentClassName : "p-6") }>
        {children}
      </div>

      {/* Ambient Backglow */}
      <div
        className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-[80px] transition-transform duration-700 ease-out"
        style={{ transform: 'translate3d(var(--parallax-x,0px), var(--parallax-y,0px), 0)' }}
      />
    </motion.div>
  );
}
