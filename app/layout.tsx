import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Lucky Koi — Curated Japan Tours',
  description:
    'Editorial, small-group Japan tours. Osaka, Kyoto, Tokyo — art-directed itineraries for the discerning traveller.',
  openGraph: {
    title: 'Lucky Koi — Curated Japan Tours',
    description: 'Cherry blossoms, hidden temples, and the art of slow travel.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
