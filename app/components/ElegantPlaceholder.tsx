interface ElegantPlaceholderProps {
  type?: 'hero' | 'service' | 'whyus'
  className?: string
}

const icons = {
  hero: (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  service: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
      <path d="M12 22a1 1 0 0 1-.707-.293l-9-9A1 1 0 0 1 2 12V7a5 5 0 0 1 5-5h5a1 1 0 0 1 .707.293l9 9a1 1 0 0 1 0 1.414l-7 7A1 1 0 0 1 12 22z"/>
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  whyus: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
      <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
}

export default function ElegantPlaceholder({ type = 'hero', className }: ElegantPlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #1C2B4A 0%, #243A5E 50%, #1e2e4a 100%)',
        display: 'grid',
        placeItems: 'center',
        color: '#C87941',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        {icons[type]}
        <div style={{
          width: '40px',
          height: '2px',
          background: 'rgba(200,121,65,0.35)',
          borderRadius: '2px',
        }} />
      </div>
    </div>
  )
}
