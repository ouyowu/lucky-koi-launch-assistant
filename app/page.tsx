import Hero from '@/components/Hero'
import Timeline from '@/components/Timeline'

export default function Home() {
  return (
    <main>
      <Hero />
      <Timeline />

      {/* Footer */}
      <footer
        className="px-6 md:px-12 py-16 border-t"
        style={{ borderColor: 'rgba(245, 240, 232, 0.06)', background: '#0a0618' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.5rem',
                color: 'var(--parchment)',
                fontWeight: 700,
              }}
            >
              Lucky Koi
            </p>
            <p className="section-label mt-1" style={{ color: 'var(--sakura)' }}>
              Curated Japan Tours
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="/privacy-policy.html"
              className="section-label hover:text-sakura transition-colors"
              style={{ color: 'var(--parchment)' }}
            >
              Privacy Policy
            </a>
            <p className="section-label" style={{ color: 'var(--parchment)', opacity: 0.3 }}>
              © 2025 Lucky Koi
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
