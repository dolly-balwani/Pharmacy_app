'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PillVisual3DProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PillVisual3D({ size = 'md', className = '' }: PillVisual3DProps) {
  const sizeMap = {
    sm: { width: 140, height: 140, capsuleW: 90, capsuleH: 38 },
    md: { width: 220, height: 220, capsuleW: 130, capsuleH: 52 },
    lg: { width: 320, height: 320, capsuleW: 190, capsuleH: 72 },
  };

  const current = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center perspective-1000 ${className}`}>
      {/* Ambient background energy field */}
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl animate-pulse-glow" />
      <div className="absolute w-36 h-36 rounded-full bg-blue-600/20 blur-2xl" />

      {/* Floating 3D Capsule */}
      <motion.div
        animate={{
          rotateY: [0, 20, 0, -20, 0],
          rotateX: [0, -12, 0, 12, 0],
          y: [-6, 6, -6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: current.capsuleW,
          height: current.capsuleH,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex items-center justify-center rounded-full shadow-2xl shadow-cyan-500/30 cursor-pointer"
      >
        {/* Left Half: Metallic Royal Blue */}
        <div
          style={{ width: '50%', height: '100%' }}
          className="relative rounded-l-full overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-inner"
        >
          {/* 3D Highlight specular reflection */}
          <div className="absolute top-1 left-2 right-1 h-3 rounded-full bg-white/40 blur-[1px]" />
          <div className="absolute bottom-1 left-2 right-1 h-2 rounded-full bg-blue-900/40" />
        </div>

        {/* Center Ring Divider */}
        <div className="w-[3px] h-full bg-white/50 z-20 shadow-[0_0_8px_#00D2FF]" />

        {/* Right Half: Glowing Electric Cyan Glass */}
        <div
          style={{ width: '50%', height: '100%' }}
          className="relative rounded-r-full overflow-hidden bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-300 shadow-inner"
        >
          {/* Specular highlight */}
          <div className="absolute top-1 left-1 right-2 h-3 rounded-full bg-white/60 blur-[1px]" />
          <div className="absolute bottom-1 left-1 right-2 h-2 rounded-full bg-teal-800/20" />
          {/* Micro medicine particle indicators */}
          <div className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-white/80 animate-ping" />
        </div>
      </motion.div>

      {/* Orbiting Ring Particles */}
      <div className="absolute w-48 h-20 rounded-full border border-cyan-400/20 rotate-[-25deg] pointer-events-none" />
      <div className="absolute w-56 h-28 rounded-full border border-blue-500/15 rotate-[20deg] pointer-events-none" />
    </div>
  );
}

