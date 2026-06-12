interface NoReviewsCta {
  title: string
  subtitle: string
  button_text: string
}

interface ReviewsProps {
  rating: number | null
  reviewsCount: number | null
  reviewsNote: string
  mapsUrl: string
  reviews?: Array<{ author: string; location: string; rating: number; text: string }>
  noReviewsCta?: NoReviewsCta
}

const DEFAULT_NO_REVIEWS_CTA: NoReviewsCta = {
  title: 'Soyez parmi les premiers à témoigner',
  subtitle: 'Un service sérieux, des engagements tenus — partagez votre expérience après votre intervention.',
  button_text: 'Demander un devis gratuit',
}

export default function Reviews({ rating, reviewsCount, reviewsNote, mapsUrl, reviews = [], noReviewsCta }: ReviewsProps) {
  const displayed = reviews.slice(0, 3)
  const hasReviews = displayed.length > 0 && reviewsCount !== null && reviewsCount > 0
  const cta = noReviewsCta ?? DEFAULT_NO_REVIEWS_CTA

  return (
    <>
      <style>{`
        .reviews-section { background: var(--navy); color: #fff; position: relative; overflow: hidden; padding: 120px 0; }
        .reviews-section::before { content: ""; position: absolute; inset: 0; background: radial-gradient(640px 460px at 10% 110%, rgba(200,121,65,.16), transparent 55%); pointer-events: none; }
        .rev-wrap { position: relative; max-width: var(--maxw); margin: 0 auto; padding: 0 32px; }
        .rev-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-size: 0.75rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--copper-soft); opacity: .7; }
        .rev-eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--copper); border-radius: 2px; }
        .rev-eyebrow.center::after { content: ""; width: 26px; height: 2px; background: var(--copper); border-radius: 2px; }
        .rev-head { text-align: center; margin-bottom: 44px; }
        .rev-head h2 { font-size: clamp(1.75rem,4.4vw,2.75rem); font-weight: 700; line-height: 1.15; letter-spacing: -.01em; color: #fff; margin-top: 18px; }
        .rev-top { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: end; margin-bottom: 48px; }
        .gscore { display: flex; align-items: center; gap: 22px; background: rgba(255,255,255,.06); border: 1px solid var(--navy-line); border-radius: 18px; padding: 22px 26px; }
        .gscore .big { font-family: var(--display); font-size: 58px; line-height: .9; color: #fff; }
        .gscore .big small { font-size: 22px; color: rgba(255,255,255,.5); }
        .gscore .stars { color: var(--copper-soft); letter-spacing: 3px; font-size: 20px; margin-top: 6px; }
        .gscore .gmeta { font-size: 13.5px; color: rgba(255,255,255,.66); margin-top: 5px; display: flex; align-items: center; gap: 7px; }
        .gbadge { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; color: #fff; background: rgba(255,255,255,.08); padding: 6px 12px; border-radius: 100px; border: 1px solid var(--navy-line); }
        .rev-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
        .review-card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: #fff; border-radius: 16px; padding: 24px; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; transition: background .2s ease, transform .2s ease; }
        .review-card:hover { background: rgba(255,255,255,.1); transform: translateY(-2px); }
        .review-card .qstars { color: var(--copper-soft); letter-spacing: 2px; font-size: 15px; }
        .review-card p { font-size: 15.5px; line-height: 1.65; letter-spacing: .01em; margin: 14px 0 0; color: rgba(255,255,255,.82); }
        .review-card .who { display: flex; align-items: center; gap: 13px; margin-top: 22px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.1); }
        .review-card .who b { font-size: 15px; display: block; font-family: var(--display); color: #fff; }
        .review-card .who span { font-size: 12.5px; color: rgba(255,255,255,.55); display: flex; align-items: center; gap: 5px; }
        .rev-cta { display: flex; justify-content: center; margin-top: 42px; }
        .btn-ghost-rev { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.35); transition: border-color .18s ease, background .2s ease; text-decoration: none; }
        .btn-ghost-rev:hover { border-color: #fff; background: rgba(255,255,255,.08); }
        .btn-copper-rev { display: inline-flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 16px; padding: 15px 26px; border-radius: 13px; background: var(--copper); color: #fff; box-shadow: var(--shadow-accent); transition: transform .18s ease; text-decoration: none; white-space: nowrap; }
        .btn-copper-rev:hover { transform: translateY(-2px); }
        /* No-reviews CTA block */
        .no-rev-cta { text-align: center; max-width: 560px; margin: 0 auto; }
        .no-rev-cta h2 { font-size: clamp(1.6rem,3.8vw,2.5rem); font-weight: 700; line-height: 1.2; letter-spacing: -.01em; color: #fff; margin-top: 18px; }
        .no-rev-cta p { font-size: 18px; line-height: 1.65; color: rgba(255,255,255,.72); margin-top: 16px; }
        .no-rev-cta .rev-cta { margin-top: 36px; }
        @media (max-width: 1000px) { .reviews-section { padding: 84px 0; } .rev-grid { grid-template-columns: 1fr; } .rev-top { grid-template-columns: 1fr; } .gscore { justify-content: center; } }
        @media (max-width: 600px) { .rev-wrap { padding: 0 20px; } }
      `}</style>

      <section className="reviews-section" id="avis">
        <div className="rev-wrap">

          {hasReviews ? (
            <>
              <div className="rev-head">
                <span className="rev-eyebrow center" style={{ justifyContent: 'center' }}>Avis clients</span>
                <h2>Ils nous ont fait confiance</h2>
              </div>

              <div className="rev-top">
                {rating && (
                  <div className="gscore">
                    <div>
                      <div className="big">{rating}<small>/5</small></div>
                      <div className="stars">{'★'.repeat(Math.round(rating))}</div>
                    </div>
                    <div>
                      <div className="gbadge">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.9z"/>
                          <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.2 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z"/>
                          <path fill="#FBBC05" d="M6 14.3a6.6 6.6 0 0 1 0-4.2V7.3H2.3a11 11 0 0 0 0 9.8L6 14.3z"/>
                          <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.3L6 10.1c.9-2.6 3.2-4.7 6-4.7z"/>
                        </svg>
                        Google Reviews
                      </div>
                      <div className="gmeta">
                        Basé sur <strong style={{ color: '#fff' }}>{reviewsNote}</strong>
                      </div>
                    </div>
                  </div>
                )}
                <a className="btn-copper-rev" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Voir tous les avis sur Google
                </a>
              </div>

              <div className="rev-grid">
                {displayed.map((r, i) => (
                  <article key={i} className="review-card">
                    <div className="qstars">{'★'.repeat(r.rating)}</div>
                    <p>{r.text}</p>
                    <div className="who">
                      <div>
                        <b>{r.author}</b>
                        <span>Avis Google · {r.location}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="rev-cta">
                <a className="btn-ghost-rev" href="#contact">Rejoindre nos clients satisfaits</a>
              </div>
            </>
          ) : (
            <div className="no-rev-cta">
              <span className="rev-eyebrow center" style={{ justifyContent: 'center' }}>Avis clients</span>
              <h2>{cta.title}</h2>
              <p>{cta.subtitle}</p>
              <div className="rev-cta">
                <a className="btn-copper-rev" href="#contact">{cta.button_text}</a>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
