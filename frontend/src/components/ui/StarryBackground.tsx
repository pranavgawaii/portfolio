import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const STAR_COUNT_DESKTOP = 130;
const STAR_COUNT_MOBILE  = 60;

interface Star {
  x: number; y: number;
  size: number;
  baseOpacity: number;
  phase: number;       // twinkle phase offset
  speed: number;       // twinkle speed
  r: number; g: number; b: number; // color
}

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Generate stars once
    const stars: Star[] = Array.from({ length: count }, () => {
      const t = Math.random();
      // Color palette: white, blue-tint, amber-tint
      const palette = [
        { r: 255, g: 255, b: 255 },
        { r: 200, g: 220, b: 255 },
        { r: 255, g: 240, b: 200 },
      ];
      const col = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.4 + 0.4,
        baseOpacity: Math.random() * 0.45 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.4 + 0.2) * (isMobile ? 0.5 : 1),
        ...col,
      };
    });

    let raf: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark');

      for (const s of stars) {
        const twinkle = Math.sin(t * s.speed + s.phase) * 0.3 + 0.7;
        const alpha = s.baseOpacity * twinkle * (dark ? 1 : 0.55);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${alpha})`;
        ctx.fill();
      }

      t += 0.016; // ~1/60
      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      resize();
      // Reposition stars proportionally
      const scaleX = canvas.width  / (canvas.width  || 1);
      const scaleY = canvas.height / (canvas.height || 1);
      for (const s of stars) {
        s.x = Math.random() * canvas.width;
        s.y = Math.random() * canvas.height;
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[-2]"
        aria-hidden
      />
      {/* Background colour fill */}
      <div className="fixed inset-0 pointer-events-none z-[-3] bg-background-light dark:bg-[#050505]" />
      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)] opacity-0 dark:opacity-100" />
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.6)_100%)] opacity-100 dark:opacity-0" />
    </>
  );
};

export default StarryBackground;
