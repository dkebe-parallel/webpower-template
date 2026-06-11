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
  content: {
    hero_title: string
    hero_subtitle: string
    value_prop: string
    about: string
    services: Array<{ title: string; desc: string; icon: string }>
    why_us: string[]
    service_area: string
    reviews_note: string
    cta_primary: string
    cta_secondary: string
    contact: {
      phone: string
      email: string
      hours: string
    }
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
