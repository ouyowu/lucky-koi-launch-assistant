'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const polaroids = [
  { label: 'Fushimi Inari', color: '#8B4513', angle: -3 },
  { label: 'Arashiyama', color: '#2D6A4F', angle: 2 },
  { label: 'Gion District', color: '#C2185B', angle: -1.5 },
  { label: 'Nishiki Market', color: '#E65100', angle: 3 },
  { label: 'Kinkaku-ji', color: '#B8860B', angle: -2 },
]

interface PolaroidStripProps {
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress']
}

export default function PolaroidStrip({ scrollProgress }: PolaroidStripProps) {
  const translateX = useTransform(scrollProgress, [0, 1], [0, -300])

  return (
    <motion.div
      className="flex gap-4 md:gap-6"
      style={{ x: translateX, willChange: 'transform' }}
    >
      {polaroids.map((p, i) => (
        <motion.div
          key={p.label}
          data-cursor-hover
          className="polaroid flex-shrink-0 cursor-none"
          style={{ rotate: p.angle }}
          whileHover={{
            y: -8,
            scale: 1.02,
            rotate: 0,
            boxShadow: '0 20px 40px rgba(255, 184, 197, 0.2)',
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Photo area */}
          <div
            className="w-28 h-28 md:w-36 md:h-36"
            style={{
              background: `linear-gradient(135deg, ${p.color}88 0%, ${p.color}44 100%)`,
            }}
          />
          {/* Caption */}
          <p
            className="text-center mt-2"
            style={{
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              fontSize: '0.6rem',
              color: '#444',
              letterSpacing: '0.05em',
            }}
          >
            {p.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
