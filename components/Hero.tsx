'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PolaroidStrip from './PolaroidStrip'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Parallax layers — each moves at a different rate
  const mountainY = useTransform(scrollYProgress, [0, 1], [0, 180]) // 0.3x
  const japanTextY = useTransform(scrollYProgress, [0, 1], [0, 300])  // 0.5x
  const polaroidX = useTransform(scrollYProgress, [0, 1], [0, -240]) // 0.4x leftward

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 600 }}
    >
      {/* ─── PLANE 1: Sky background (lowest z-index) ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0d0822 0%, #1a1040 25%, #2d1b69 55%, #5b21b6 80%, #7c3aed 100%)',
          zIndex: 0,
        }}
      >
        {/* Stars */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              top: `${Math.random() * 55}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        ))}
        {/* Moon */}
        <div
          className="absolute"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #FFF8DC, #FFD700)',
            top: '8%',
            right: '18%',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
          }}
        />
      </div>

      {/* ─── PLANE 2: JAPAN typography (z-index 1, behind mountains) ─── */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pointer-events-none select-none"
        style={{
          zIndex: 1,
          y: japanTextY,
          willChange: 'transform',
          paddingBottom: '8%',
        }}
      >
        <h1 className="hero-japan-text text-center px-4">
          JAPAN
        </h1>
      </motion.div>

      {/* ─── PLANE 3: Mountain silhouette (z-index 2, covers lower ~60% of text) ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 2,
          y: mountainY,
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          className="w-full"
          style={{ display: 'block', height: 'clamp(320px, 55vh, 520px)' }}
        >
          <defs>
            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a0f3a" />
              <stop offset="40%" stopColor="#0f0820" />
              <stop offset="100%" stopColor="#070410" />
            </linearGradient>
            <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e4f0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c8c0d8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background ridge — far mountains */}
          <path
            d="M0,380 L80,290 L180,340 L260,240 L360,300 L440,200 L520,260 L600,180 L680,240 L760,160 L840,220 L920,170 L1000,230 L1080,150 L1160,210 L1240,170 L1320,230 L1440,200 L1440,520 L0,520 Z"
            fill="#160d30"
            opacity="0.7"
          />

          {/* Main mountain range */}
          <path
            d="M-40,440 L60,310 L140,370 L220,260 L300,320 L400,180 L480,250 L560,140 L640,200 L720,120 L800,180 L880,100 L960,165 L1040,85 L1120,150 L1200,100 L1280,160 L1360,120 L1480,200 L1480,520 L-40,520 Z"
            fill="url(#mountainGrad)"
          />

          {/* Snow caps on peaks */}
          <path
            d="M400,180 L420,210 L380,210 Z"
            fill="url(#snowGrad)"
          />
          <path
            d="M560,140 L583,172 L537,172 Z"
            fill="url(#snowGrad)"
          />
          <path
            d="M720,120 L745,155 L695,155 Z"
            fill="url(#snowGrad)"
          />
          <path
            d="M880,100 L908,138 L852,138 Z"
            fill="url(#snowGrad)"
          />
          <path
            d="M1040,85 L1070,125 L1010,125 Z"
            fill="url(#snowGrad)"
          />

          {/* Foreground fill — darkest, richest color */}
          <path
            d="M0,480 L120,420 L240,450 L360,410 L480,440 L600,400 L720,430 L840,395 L960,425 L1080,400 L1200,430 L1320,410 L1440,440 L1440,520 L0,520 Z"
            fill="#0a0618"
          />

          {/* Subtle fog at mountain bases */}
          <path
            d="M0,400 Q360,360 720,380 Q1080,400 1440,370 L1440,430 Q1080,450 720,440 Q360,430 0,450 Z"
            fill="#2d1b69"
            opacity="0.15"
          />
        </svg>
      </motion.div>

      {/* ─── PLANE 4: Kimono figure (highest z-index, no transform) ─── */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ zIndex: 3, width: 'clamp(160px, 22vw, 320px)' }}
      >
        <svg
          viewBox="0 0 320 540"
          fill="none"
          className="w-full"
          style={{ display: 'block' }}
        >
          {/* Kimono figure — simplified silhouette */}
          {/* Body */}
          <ellipse cx="160" cy="200" rx="55" ry="20" fill="#FFB8C5" opacity="0.9" />
          <path
            d="M105,215 Q80,320 75,480 L245,480 Q240,320 215,215 Z"
            fill="#C2185B"
          />
          {/* Kimono pattern overlay */}
          <path
            d="M105,215 Q80,320 75,480 L160,480 L160,215 Z"
            fill="#AD1457"
          />
          {/* Obi belt */}
          <rect x="100" y="290" width="120" height="28" rx="4" fill="#FFD54F" />
          <rect x="100" y="290" width="120" height="8" rx="4" fill="#FFC107" />
          {/* Sleeves */}
          <path
            d="M105,220 Q60,250 55,310 Q65,325 80,315 Q90,270 115,250 Z"
            fill="#E91E63"
          />
          <path
            d="M215,220 Q260,250 265,310 Q255,325 240,315 Q230,270 205,250 Z"
            fill="#E91E63"
          />
          {/* Head */}
          <ellipse cx="160" cy="165" rx="38" ry="42" fill="#FDBCAB" />
          {/* Hair — traditional updo */}
          <ellipse cx="160" cy="140" rx="38" ry="20" fill="#1a0a0a" />
          <ellipse cx="160" cy="130" rx="28" ry="12" fill="#0d0505" />
          {/* Hair ornament */}
          <line x1="180" y1="120" x2="210" y2="100" stroke="#FFD700" strokeWidth="2" />
          <circle cx="212" cy="98" r="5" fill="#FFD700" />
          <circle cx="210" cy="92" r="3" fill="#FF69B4" />
          {/* Fan */}
          <path
            d="M240,310 Q280,260 300,290 Q285,320 260,330 Z"
            fill="#FF8A65"
            opacity="0.8"
          />
          <path
            d="M240,310 L300,290"
            stroke="#FF5722"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M240,310 L285,263"
            stroke="#FF5722"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M240,310 L272,254"
            stroke="#FF5722"
            strokeWidth="1.5"
            opacity="0.6"
          />
          {/* Geta sandals */}
          <rect x="110" y="470" width="45" height="12" rx="3" fill="#5D4037" />
          <rect x="165" y="470" width="45" height="12" rx="3" fill="#5D4037" />
        </svg>
      </div>

      {/* ─── Hero UI overlay: Nav + CTA ─── */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-between items-start px-6 md:px-12 pt-8"
        style={{ zIndex: 4 }}
      >
        <div>
          <span className="section-label text-parchment">Lucky Koi</span>
          <p style={{ color: 'var(--sakura)', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            Curated Japan Tours
          </p>
        </div>
        <nav className="hidden md:flex gap-8">
          {['About', 'Itinerary', 'Gallery', 'Book'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="section-label text-parchment hover:text-sakura transition-colors duration-200"
              style={{ color: 'var(--parchment)' }}
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="hidden md:block text-xs tracking-widest uppercase px-6 py-3 transition-all duration-300"
          style={{
            border: '1px solid var(--sakura)',
            color: 'var(--sakura)',
            letterSpacing: '0.2em',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'var(--sakura)'
            el.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'transparent'
            el.style.color = 'var(--sakura)'
          }}
        >
          Book Now
        </a>
      </div>

      {/* Hero subtitle */}
      <div
        className="absolute left-6 md:left-12 pointer-events-none"
        style={{ zIndex: 4, bottom: 'clamp(180px, 30vh, 260px)' }}
      >
        <p className="section-label text-parchment mb-2">2025 Season</p>
        <p
          style={{
            color: 'var(--parchment)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            opacity: 0.7,
            maxWidth: 280,
            lineHeight: 1.6,
          }}
        >
          Cherry blossoms, hidden temples,<br />
          and the art of slow travel.
        </p>
      </div>

      {/* ─── Polaroid strip ─── */}
      <div
        className="absolute left-0 overflow-hidden"
        style={{
          zIndex: 4,
          bottom: 'clamp(40px, 8vh, 80px)',
          width: '100%',
          paddingLeft: 'clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        <p className="section-label text-parchment mb-3">Destinations</p>
        <PolaroidStrip scrollProgress={scrollYProgress} />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute right-8 flex flex-col items-center gap-2"
        style={{ zIndex: 4, bottom: 40 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="section-label text-parchment">Scroll</span>
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(180deg, var(--parchment) 0%, transparent 100%)',
            opacity: 0.4,
          }}
        />
      </motion.div>
    </section>
  )
}
