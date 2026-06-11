import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getBusiness } from '@/lib/getBusiness'
import DemoBanner from '@/app/components/DemoBanner'
import Header from '@/app/components/Header'
import Hero from '@/app/components/Hero'
import ValueProp from '@/app/components/ValueProp'
import Services from '@/app/components/Services'
import WhyUs from '@/app/components/WhyUs'
import ServiceArea from '@/app/components/ServiceArea'
import Reviews from '@/app/components/Reviews'
import ContactSection from '@/app/components/ContactSection'
import Footer from '@/app/components/Footer'
import StickyCallCTA from '@/app/components/StickyCallCTA'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params
  const data = getBusiness(slug)
  if (!data) notFound()

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  const sectionMap: Record<string, ReactNode> = {
    hero: (
      <Hero
        key="hero"
        business={data.business}
        content={{
          hero_title: data.content.hero_title,
          hero_subtitle: data.content.hero_subtitle,
          cta_primary: data.content.cta_primary,
          cta_secondary: data.content.cta_secondary,
        }}
        variant={data.theme.hero_variant}
      />
    ),
    value_prop: <ValueProp key="value_prop" items={data.content.why_us} />,
    services: (
      <Services
        key="services"
        services={data.content.services}
        valueProp={data.content.value_prop}
      />
    ),
    why_us: <WhyUs key="why_us" items={data.content.why_us} />,
    service_area: (
      <ServiceArea
        key="service_area"
        serviceArea={data.content.service_area}
        city={data.business.city}
      />
    ),
    reviews: (
      <Reviews
        key="reviews"
        rating={data.business.rating}
        reviewsCount={data.business.reviews_count}
        reviewsNote={data.content.reviews_note}
        mapsUrl={data.business.maps_url}
        reviews={data.reviews}
      />
    ),
    contact: (
      <ContactSection
        key="contact"
        contact={data.content.contact}
        ctaPrimary={data.content.cta_primary}
        ctaSecondary={data.content.cta_secondary}
        businessName={data.business.name}
      />
    ),
  }

  const mainSections = data.layout.sections_order.filter(s => s !== 'footer')
  const showFooter = data.layout.sections_order.includes('footer')

  return (
    <>
      {/* Sticky wrapper: demo banner + header together */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        {demoMode && <DemoBanner businessName={data.business.name} />}
        <Header
          businessName={data.business.name}
          phone={data.business.phone}
          ctaSecondary={data.content.cta_secondary}
        />
      </div>

      <main>
        {mainSections.map(section => sectionMap[section] ?? null)}
      </main>

      {showFooter && (
        <Footer
          businessName={data.business.name}
          phone={data.business.phone}
          email={data.content.contact.email}
          address={data.business.address}
          mapsUrl={data.business.maps_url}
          about={data.content.about}
          rating={data.business.rating}
          reviewsCount={data.business.reviews_count}
          services={data.content.services}
          demoMode={demoMode}
        />
      )}

      <StickyCallCTA phone={data.business.phone} ctaPrimary={data.content.cta_primary} />
    </>
  )
}
