'use client';
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function ThreeDCard({ children, className = '', glowColor = 'rgba(56, 189, 248, 0.25)' }: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl transition-shadow duration-300 ${className}`}
    >
      {/* 3D Dynamic Ambient Glow */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
          opacity: isHovered ? 0.8 : 0,
        }}
      />
      <div className="relative z-10 w-full h-full rounded-2xl glass-card preserve-3d">
        {children}
      </div>
    </motion.div>
  );
}

