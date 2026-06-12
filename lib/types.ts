export interface HeroStat {
  value: string
  label: string
}

export interface WhyUsItem {
  title: string
  desc: string
}

export interface ServiceItem {
  title: string
  desc: string
  icon: string
  image?: string
  tag?: string
}

export interface ReassuranceItem {
  title: string
  subtitle: string
}

export interface BusinessData {
  business: {
    name: string
    slug: string
    city: string
    country: string
    phone: string
    address: string
    maps_url: string
    rating: number | null
    reviews_count: number | null
  }
  lang: string
  theme: {
    palette: {
      primary: string
      secondary: string
      accent: string
      bg: string
      text: string
      muted: string
    }
    fonts: {
      heading: string
      body: string
    }
    hero_variant: 'image-bg' | 'gradient' | 'split'
    imagery_mood: string
  }
  layout: {
    sections_order: string[]
    enabled_blocks: string[]
  }
  /** Optional top-level image URLs */
  images?: {
    hero?: string
    why_us?: string
  }
  badges?: {
    /** Certifications earned, e.g. ["RGE"]. Empty array = no cert badge. */
    certifications?: string[]
    /** Fallback highlight text when no certification. Max 20 chars. e.g. "5/5 sur Google" */
    highlight?: string
  }
  content: {
    hero_title: string
    hero_subtitle: string
    /** Exactly 3 stat tiles below the hero CTA. */
    hero_stats?: HeroStat[]
    /** 3 items for the reassurance band below the hero. */
    reassurance_items?: ReassuranceItem[]
    value_prop: string
    /** Short intro for the services section header (≤ 100 chars). Falls back to value_prop. */
    services_intro?: string
    about: string
    services: ServiceItem[]
    /** Array of why-us items. Can be {title,desc} objects or legacy plain strings. */
    why_us: Array<WhyUsItem | string>
    /** Floating badge on the why-us image. Falls back to {value:"2h",label:"délai moyen d'intervention"}. */
    why_us_badge?: { value: string; label: string } | null
    service_area: string
    /** Pills shown in service area section */
    service_area_cities?: string[]
    /** City labels shown on the radar map orbit (4–6 items) */
    service_area_map_cities?: string[]
    /** Stats shown below the radar. If absent, stats row is hidden. */
    service_area_stats?: Array<{ value: string; label: string }>
    /** Short commercial sentence for the info box (≤ 125 chars). If absent, box is hidden. */
    service_area_note?: string
    reviews_note: string
    cta_primary: string
    cta_secondary: string
    contact: {
      phone: string
      email: string
      hours: string
    }
    /** Description shown in footer brand column (≤ 205 chars). Falls back to about. */
    footer_description?: string
    seo_title: string
    meta_description: string
  }
  reviews?: Array<{
    author: string
    location: string
    rating: number
    text: string
  }>
}
