import { useEffect, useRef } from 'react';

interface GalaxyProps {
  className?: string;
  opacity?: number;
  maxStars?: number;
  color?: string;
  twinkle?: boolean;
  driftSpeed?: number;
}

type Star = {
  x: number;
  y: number;
  r: number;
  baseA: number;
  twPhase: number;
  twSpeed: number;
};

export default function Galaxy({
  className = '',
  opacity = 0.15,
  maxStars = 90,
  color = '#ffffff',
  twinkle = true,
  driftSpeed = 2
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const driftOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.floor((w * h / (1920 * 1080)) * maxStars);
      const stars: Star[] = [];
      for (let i = 0; i < targetCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 0.9 + 0.4,
          baseA: 0.4 + Math.random() * 0.6,
          twPhase: Math.random() * Math.PI * 2,
          twSpeed: 0.2 + Math.random() * 0.4
        });
      }
      starsRef.current = stars;
    };

    const draw = (t: number) => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dtMs = t - lastTimeRef.current;
      lastTimeRef.current = t;

      driftOffsetRef.current.x = (driftOffsetRef.current.x + driftSpeed * (dtMs / 1000)) % (w + 50);
      driftOffsetRef.current.y = (driftOffsetRef.current.y + driftSpeed * 0.5 * (dtMs / 1000)) % (h + 50);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      starsRef.current.forEach(s => {
        let a = s.baseA;
        if (twinkle) a *= (0.75 + 0.25 * Math.sin(s.twPhase + t * 0.001 * s.twSpeed));
        ctx.globalAlpha = a * opacity;
        const dx = (s.x + driftOffsetRef.current.x) % (w + 50);
        const dy = (s.y + driftOffsetRef.current.y) % (h + 50);
        ctx.beginPath();
        ctx.arc(dx, dy, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [maxStars, opacity, color, twinkle, driftSpeed]);

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none -z-10 ${className}`} />;
}
