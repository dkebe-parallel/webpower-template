import type { Metadata } from 'next'
import { Schibsted_Grotesk, Hanken_Grotesk } from 'next/font/google'
import { getBusiness } from '@/lib/getBusiness'

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params
  const data = getBusiness(slug)
  if (!data) return {}
  return {
    title: data.content.seo_title,
    description: data.content.meta_description,
    openGraph: { title: data.content.seo_title },
  }
}

export default async function DemoLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const data = getBusiness(slug)

  const p = data?.theme.palette ?? {
    primary: '#1C2B4A',
    secondary: '#C87941',
    accent: '#F5F3EE',
    bg: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#6B7280',
  }

  const cssVars = `
    :root {
      /* JSON palette — kept for backward compat */
      --color-primary:   ${p.primary};
      --color-secondary: ${p.secondary};

      /* Design-system tokens */
      --navy:      ${p.primary};
      --navy-deep: color-mix(in srgb, ${p.primary} 80%, black);
      --navy-900:  color-mix(in srgb, ${p.primary} 60%, black);
      --navy-soft: color-mix(in srgb, ${p.primary} 85%, white);
      --navy-line: rgba(255,255,255,.10);

      --copper:      ${p.secondary};
      --copper-deep: color-mix(in srgb, ${p.secondary} 75%, black);
      --copper-soft: color-mix(in srgb, ${p.secondary} 70%, white);
      --copper-tint: color-mix(in srgb, ${p.secondary} 18%, white);

      --cream:  #f4f0e9;
      --paper:  #fbfaf7;
      --card:   #ffffff;
      --ink:    ${p.text};
      --ink-2:  #3c4a63;
      --muted:  ${p.muted};
      --hair:   #e7e2d8;

      --radius:    18px;
      --radius-sm: 12px;
      --radius-lg: 26px;

      --shadow-sm: 0 1px 2px rgba(20,30,52,.06), 0 2px 8px rgba(20,30,52,.05);
      --shadow-md: 0 14px 36px -14px rgba(20,30,52,.20), 0 2px 8px rgba(20,30,52,.06);
      --shadow-lg: 0 40px 70px -28px rgba(20,30,52,.40), 0 8px 24px -12px rgba(20,30,52,.18);
      --shadow-accent: 0 26px 50px -20px color-mix(in srgb, var(--copper) 60%, transparent);

      --display: 'Schibsted Grotesk', system-ui, sans-serif;
      --body:    'Hanken Grotesk', system-ui, sans-serif;

      --maxw: 1200px;
    }
    body {
      font-family: var(--body);
      background: var(--paper);
      color: var(--ink);
    }
    h1,h2,h3,h4 { font-family: var(--display); }
  `

  return (
    <div className={`${schibsted.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {children}
    </div>
  )
}
