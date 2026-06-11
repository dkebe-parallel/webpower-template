import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WebsitePower',
  description: 'Sites web pour artisans et entreprises locales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
