import React, { useMemo, useState, useEffect } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from 'next-themes';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  parallaxFactor: number;
  animationDelay: number;
  colorType: number;
}

const StarryBackground: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo(() => {
    const starCount = 150;
    const generatedStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        parallaxFactor: Math.random() * 0.08 + 0.02,
        animationDelay: Math.random() * 5,
        colorType: Math.floor(Math.random() * 3),
      });
    }
    return generatedStars;
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 100);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className={`fixed inset-0 pointer-events-none z-[-2] overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#050505]' : 'bg-background-light'}`}>
      {stars.map((star) => (
        <StarLayer 
          key={star.id} 
          star={star} 
          springX={springX} 
          springY={springY} 
          isDarkMode={isDarkMode}
        />
      ))}
      <div className={`absolute inset-0 transition-all duration-1000 ${isDarkMode ? 'bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)]' : 'bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(255,255,255,0.8)_100%)]'}`} />
    </div>
  );
};

interface StarLayerProps {
  star: Star;
  springX: any;
  springY: any;
  isDarkMode: boolean;
}

const StarLayer: React.FC<StarLayerProps> = ({ star, springX, springY, isDarkMode }) => {
  const x = useTransform(springX, (val: number) => val * star.parallaxFactor);
  const y = useTransform(springY, (val: number) => val * star.parallaxFactor);

  // Premium subtle colors for the particles
  const darkColors = ['bg-white', 'bg-blue-100', 'bg-amber-100'];
  const lightColors = ['bg-slate-400', 'bg-sky-400', 'bg-amber-400'];
  const colorClass = isDarkMode ? darkColors[star.colorType] : lightColors[star.colorType];

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: `${star.y}%`,
        left: `${star.x}%`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        opacity: star.opacity,
        x,
        y,
      }}
      className={`rounded-full blur-[0.4px] transition-colors duration-1000 ${colorClass}`}
      animate={{
        opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: star.animationDelay,
      }}
    />
  );
};

export default StarryBackground;
