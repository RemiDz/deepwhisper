'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
  accentColor: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function ToolCard({ title, description, cta, href, accentColor, icon, delay = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    >
      <Link href={href} className="block no-underline group">
        <div
          className="studio-card relative overflow-hidden transition-all duration-300 group-hover:border-[var(--border-focus)]"
          style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
              <span className="text-sm font-medium transition-colors" style={{ color: accentColor }}>
                {cta}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
