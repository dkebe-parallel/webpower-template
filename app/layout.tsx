import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WebPower — Le site web des artisans',
  description: 'WebPower crée votre site vitrine professionnel en 72h pour 490€ tout compris. Personnalisé pour votre métier, votre ville et vos clients.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
