'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  selected = false,
  hoverable = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`
        glass-card p-6
        ${hoverable ? 'cursor-pointer' : ''}
        ${selected ? 'border-conscious/30 bg-conscious/5' : ''}
        ${className}
      `}
      style={selected ? { borderColor: 'rgba(196, 161, 255, 0.3)', background: 'rgba(196, 161, 255, 0.05)' } : {}}
    >
      {children}
    </motion.div>
  );
}
