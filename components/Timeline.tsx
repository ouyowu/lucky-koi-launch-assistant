'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const cities = [
  {
    name: 'Osaka',
    days: 'Days 1 – 3',
    color: '#FF6B35',
    kanji: '大阪',
    highlights: [
      'Dotonbori neon district at midnight',
      'Kuromon Ichiba morning market',
      'Osaka Castle at golden hour',
      'Shinsekai retro neighbourhood',
    ],
    description:
      "The soul of Japan’s food culture. Osaka rewards wanderers — every alley hides a takoyaki stand or an izakaya with a three-generation story.",
  },
  {
    name: 'Kyoto',
    days: 'Days 4 – 7',
    color: '#E91E8C',
    kanji: '京都',
    highlights: [
      'Fushimi Inari dawn hike',
      'Arashiyama bamboo forest',
      'Tea ceremony in Gion',
      "Philosopher's Path in bloom",
    ],
    description:
      "Seventeen UNESCO sites and a city that still moves at a pre-industrial tempo. Kyoto teaches you to slow down before you've realised you were rushing.",
  },
  {
    name: 'Tokyo',
    days: 'Days 8 – 11',
    color: '#7C3AED',
    kanji: '東京',
    highlights: [
      'Tsukiji outer market breakfast',
      'Yanaka old town preservation district',
      'Shibuya crossing at rush hour',
      'Harajuku back-street vintage hunting',
    ],
    description:
      'Thirty-seven million people, twelve thousand restaurants, and a transit system that operates within 30 seconds of schedule. Tokyo is organised chaos at its most beautiful.',
  },
]

const STAGGER_DELAY = 0.2

function CityCluster({
  city,
  index,
}: {
  city: (typeof cities)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.8,
        delay: index * STAGGER_DELAY,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      {/* Timeline connector line */}
      {index < cities.length - 1 && (
        <div
          className="absolute left-6 top-full hidden md:block"
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(180deg, ${city.color}60 0%, transparent 100%)`,
          }}
        />
      )}

      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Left column */}
        <div className="flex-shrink-0 md:w-64">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `${city.color}20`, border: `1px solid ${city.color}50` }}
            >
              <span style={{ color: city.color, fontSize: '1.2rem' }}>◆</span>
            </div>
            <div>
              <p className="section-label" style={{ color: city.color }}>
                {city.days}
              </p>
              <h3 className="city-name" style={{ color: 'var(--parchment)' }}>
                {city.name}
              </h3>
            </div>
          </div>

          {/* Kanji character */}
          <div
            style={{
              fontSize: 'clamp(4rem, 10vw, 8rem)',
              fontFamily: 'serif',
              color: city.color,
              opacity: 0.12,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {city.kanji}
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 pt-2">
          <p
            style={{
              color: 'var(--parchment)',
              opacity: 0.6,
              lineHeight: 1.8,
              fontSize: '0.95rem',
              maxWidth: 480,
              marginBottom: '2rem',
            }}
          >
            {city.description}
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {city.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ color: 'var(--parchment)', fontSize: '0.85rem' }}
              >
                <span style={{ color: city.color, marginTop: 2, flexShrink: 0 }}>—</span>
                <span style={{ opacity: 0.75 }}>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  return (
    <section
      id="itinerary"
      className="relative py-24 md:py-36 px-6 md:px-12"
      style={{ background: 'var(--ink)' }}
    >
      {/* Section header */}
      <div className="mb-20 md:mb-28 max-w-2xl">
        <p className="section-label mb-4" style={{ color: 'var(--sakura)' }}>
          The Itinerary
        </p>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            color: 'var(--parchment)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          11 days.
          <br />
          Three cities.
          <br />
          One country.
        </h2>
      </div>

      {/* City clusters */}
      <div className="flex flex-col gap-24 md:gap-32 max-w-5xl">
        {cities.map((city, i) => (
          <CityCluster key={city.name} city={city} index={i} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-24 md:mt-36 flex flex-col md:flex-row items-start md:items-center gap-8">
        <div>
          <p className="section-label mb-2" style={{ color: 'var(--matcha)' }}>
            Total
          </p>
          <p
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              color: 'var(--parchment)',
              fontWeight: 700,
            }}
          >
            From $4,800 USD
          </p>
          <p style={{ color: 'var(--parchment)', opacity: 0.4, fontSize: '0.8rem', marginTop: 4 }}>
            Per person · small groups of 8 max
          </p>
        </div>
        <a
          id="book"
          href="#book"
          className="px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300"
          style={{
            background: 'var(--sakura)',
            color: 'var(--ink)',
            fontWeight: 600,
            letterSpacing: '0.2em',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'var(--parchment)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'var(--sakura)'
          }}
        >
          Reserve Your Seat
        </a>
      </div>
    </section>
  )
}
