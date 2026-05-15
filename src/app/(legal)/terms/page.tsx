import Link from 'next/link'
import '../legal.css'

const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

interface LegalPageData {
  title: string
  content: string
  meta_description: string | null
  is_published: boolean
  published_at: string | null
  updated_at: string
}

async function fetchLegalPage(slug: string): Promise<LegalPageData | null> {
  try {
    const res = await fetch(`${API}/api/legal-pages/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.status === 'success' && data.data?.is_published ? data.data : null
  } catch {
    return null
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface LegalSection { eyebrow: string; title: string; content: string }

function parseSections(content: string): LegalSection[] | null {
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].title === 'string') {
      return parsed as LegalSection[]
    }
  } catch { /* legacy HTML */ }
  return null
}

const TOC_ITEMS: [string, string][] = [
  ['s01', 'Acceptance of Terms'], ['s02', 'The Service'], ['s03', 'User Accounts'],
  ['s04', 'Subscription Plans'], ['s05', 'Payment & Renewal'], ['s06', 'eSIM Services'],
  ['s07', 'AI-Generated Content'], ['s08', 'Intellectual Property'], ['s09', 'User Content'],
  ['s10', 'Prohibited Uses'], ['s11', 'Termination'], ['s12', 'Disclaimer of Warranties'],
  ['s13', 'Limitation of Liability'], ['s14', 'Governing Law'], ['s15', 'Changes to Terms'],
  ['s16', 'Contact'],
]

function Topbar() {
  return (
    <header className="lp-topbar">
      <div className="lp-topbar-inner">
        <Link href="/" className="lp-wordmark" aria-label="KurmaGo Home">
          <span aria-hidden="true" />Kurma<em>Go</em><span className="period">.</span>
        </Link>
        <Link href="/" className="lp-back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to Home
        </Link>
      </div>
    </header>
  )
}

function LegalFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <Link href="/" className="lp-wordmark" aria-label="KurmaGo Home">
              <span aria-hidden="true" />Kurma<em>Go</em><span className="period">.</span>
            </Link>
            <div className="lp-tagline">Plan Smart · Go Beyond</div>
          </div>
          <div className="lp-footer-links">
            <div className="lp-footer-col">
              <h4>Product</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><a href="#">Destinations</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 KurmaGo. All rights reserved.</span>
          <span>Crafted with care from Indonesia.</span>
        </div>
      </div>
    </footer>
  )
}

export default async function TermsPage() {
  const page     = await fetchLegalPage('terms-of-service')
  const sections = page ? parseSections(page.content) : null

  return (
    <div className="legal-root">
      <Topbar />

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-deco-num" aria-hidden="true">02</div>
          <div className="lp-hero-eyebrow">Legal · KurmaGo</div>
          <h1 className="lp-hero-title">{page?.title ?? 'Terms of Service'}</h1>
          <p className="lp-hero-lead">
            {page?.meta_description ?? 'These Terms of Service constitute a legally binding agreement between you and KurmaGo that governs your access to and use of our platform, applications, and related services.'}
          </p>
          <div className="lp-hero-meta">
            {page ? (
              <>
                {page.published_at && (
                  <div className="lp-hero-meta-item">
                    <span className="lp-label">Effective Date</span>
                    <span className="lp-value">{fmtDate(page.published_at)}</span>
                  </div>
                )}
                <div className="lp-hero-meta-item">
                  <span className="lp-label">Last Updated</span>
                  <span className="lp-value">{fmtDate(page.updated_at)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="lp-hero-meta-item"><span className="lp-label">Effective Date</span><span className="lp-value">[Effective Date]</span></div>
                <div className="lp-hero-meta-item"><span className="lp-label">Last Updated</span><span className="lp-value">[Last Updated]</span></div>
                <div className="lp-hero-meta-item"><span className="lp-label">Version</span><span className="lp-value">1.0</span></div>
              </>
            )}
          </div>
        </div>
      </section>

      {page ? (
        /* ── DB content ──────────────────────────────────────────────────────── */
        sections ? (
          <div className="lp-layout">
            <aside className="lp-toc" aria-label="Table of contents">
              <div className="lp-toc-eyebrow">Table of Contents</div>
              <ul className="lp-toc-list">
                {sections.map((s, i) => {
                  const n = String(i + 1).padStart(2, '0')
                  return (
                    <li key={i}>
                      <a href={`#s${n}`}>
                        <span className="lp-num">{n}</span>{s.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </aside>
            <main className="lp-content">
              {sections.map((s, i) => {
                const id  = `s${String(i + 1).padStart(2, '0')}`
                const num = String(i + 1).padStart(2, '0')
                return (
                  <section key={i} className="lp-section" id={id}>
                    <div className="lp-section-eyebrow">
                      <span className="lp-num">{num}</span>
                      <span>{s.eyebrow || `Section ${num}`}</span>
                    </div>
                    <h2 className="lp-section-title">{s.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: s.content }} />
                  </section>
                )
              })}
            </main>
          </div>
        ) : (
          <div className="lp-layout" style={{ gridTemplateColumns: '1fr' }}>
            <main className="lp-content" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        )
      ) : (
        /* ── Static fallback ─────────────────────────────────────────────────── */
        <>
          <div className="lp-disclaimer" role="note">
            <div className="lp-label">Internal Note — Remove Before Publication</div>
            <p>This document is a <strong>draft template</strong> prepared based on the scope of the KurmaGo product. Prior to publication, it must be reviewed by qualified legal counsel and adapted to the company&apos;s final corporate structure, jurisdiction, and operational policies.</p>
          </div>

          <div className="lp-layout">
            <aside className="lp-toc" aria-label="Table of contents">
              <div className="lp-toc-eyebrow">Table of Contents</div>
              <ul className="lp-toc-list">
                {TOC_ITEMS.map(([id, label], i) => (
                  <li key={id}>
                    <a href={`#${id}`}>
                      <span className="lp-num">{String(i + 1).padStart(2, '0')}</span>{label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="lp-content">
              <section className="lp-section" id="s01">
                <div className="lp-section-eyebrow"><span className="lp-num">01</span><span>Section One</span></div>
                <h2 className="lp-section-title">Acceptance of Terms</h2>
                <p>These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;, or &ldquo;your&rdquo;) and <strong>[Legal Entity Name, e.g., PT Kurma Guide Indonesia]</strong> (&ldquo;KurmaGo&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) governing your access to and use of the kurma.guide website, our mobile applications, and all related features and services (collectively, the &ldquo;Service&rdquo;).</p>
                <p>By registering for, accessing, or using the Service, you represent and warrant that:</p>
                <ul>
                  <li>You are at least <strong>eighteen (18) years of age</strong>, or you have obtained the consent of a parent or legal guardian.</li>
                  <li>You have the legal capacity to enter into a binding agreement.</li>
                  <li>You have read, understood, and agree to be bound by these Terms and our <Link href="/privacy">Privacy Policy</Link>.</li>
                </ul>
                <p>If you do not agree to these Terms, you must not access or use the Service.</p>
              </section>

              <section className="lp-section" id="s02">
                <div className="lp-section-eyebrow"><span className="lp-num">02</span><span>Section Two</span></div>
                <h2 className="lp-section-title">The Service</h2>
                <p>KurmaGo is a web-based travel planning and connectivity platform that provides, among other features:</p>
                <ul>
                  <li>Creation and management of multi-day travel itineraries with places, activities, and transportation legs.</li>
                  <li>A curated database of destinations and city guides maintained by the KurmaGo team.</li>
                  <li>A multi-currency budget tracker with automatic conversion (IDR, JPY, USD, SGD, EUR).</li>
                  <li>The ability to purchase eSIM packages for connectivity while traveling, through partner providers.</li>
                  <li>Artificial intelligence features that assist in drafting, optimizing, and personalizing itineraries (Pro plan).</li>
                  <li>Storage of booking references, documents, vouchers, and tickets related to your trips.</li>
                  <li>Sharing of itineraries with companions through view-only links.</li>
                </ul>
              </section>

              <section className="lp-section" id="s03">
                <div className="lp-section-eyebrow"><span className="lp-num">03</span><span>Section Three</span></div>
                <h2 className="lp-section-title">User Accounts</h2>
                <h3>3.1 Registration</h3>
                <p>To use most features of the Service, you must create an account using Email and Password authentication, Google Sign-In, or Apple Sign-In. You agree to provide accurate, complete, and current information at the time of registration and to update such information as needed.</p>
                <h3>3.2 Account Security</h3>
                <p>You are solely responsible for all activity that occurs under your account. You agree to maintain the confidentiality of your password, use a strong password not reused from other services, and promptly notify us at <a href="mailto:security@kurma.guide">security@kurma.guide</a> if you suspect unauthorized access.</p>
              </section>

              <section className="lp-section" id="s04">
                <div className="lp-section-eyebrow"><span className="lp-num">04</span><span>Section Four</span></div>
                <h2 className="lp-section-title">Subscription Plans</h2>
                <p>The Service is offered in three tiers:</p>
                <div className="lp-tier-grid">
                  <div className="lp-tier-card">
                    <div className="lp-tier-eyebrow">Free Forever</div>
                    <h4>Free</h4>
                    <p>Up to 3 active trips, manual itinerary building, basic place database access, view-only sharing, and eSIM purchasing.</p>
                  </div>
                  <div className="lp-tier-card">
                    <div className="lp-tier-eyebrow">Subscription</div>
                    <h4>Pro</h4>
                    <p>Unlimited trips, AI Itinerary Draft (10 generations per month), AI Place Suggestions, AI Budget Estimate, AI Day Optimizer, and collaborative editing.</p>
                  </div>
                  <div className="lp-tier-card">
                    <div className="lp-tier-eyebrow">Custom Pricing</div>
                    <h4>Enterprise</h4>
                    <p>Team workspace, unlimited AI generation, custom place curation, advanced access controls, bulk eSIM purchasing, and analytics and reporting.</p>
                  </div>
                </div>
              </section>

              <section className="lp-section" id="s05">
                <div className="lp-section-eyebrow"><span className="lp-num">05</span><span>Section Five</span></div>
                <h2 className="lp-section-title">Payment and Auto-Renewal</h2>
                <h3>5.1 Billing</h3>
                <p>Pro Subscriptions are billed periodically (monthly or annually) in advance through PCI-DSS certified payment gateways.</p>
                <h3>5.2 Auto-Renewal</h3>
                <p>Unless you cancel before the next billing period, your subscription will automatically renew at the rate then in effect. You may cancel at any time through your account settings; cancellation takes effect at the end of the current billing period.</p>
                <h3>5.3 Refunds</h3>
                <p>Except as required by applicable law, payments made are non-refundable. For exceptional circumstances, contact <a href="mailto:billing@kurma.guide">billing@kurma.guide</a>.</p>
                <h3>5.4 Price Changes</h3>
                <p>We may change subscription pricing with at least <strong>thirty (30) days&apos; prior written notice</strong> via email.</p>
              </section>

              <section className="lp-section" id="s06">
                <div className="lp-section-eyebrow"><span className="lp-num">06</span><span>Section Six</span></div>
                <h2 className="lp-section-title">eSIM Services</h2>
                <p>KurmaGo facilitates the purchase of eSIM packages through partner connectivity providers. eSIM Services are subject to the following additional terms:</p>
                <ul>
                  <li>You are responsible for ensuring that your device is <strong>eSIM-compatible and carrier-unlocked</strong> prior to purchase.</li>
                  <li>The eSIM activation code will be delivered via email upon successful payment confirmation.</li>
                  <li>Once an eSIM has been activated on a device, the package is <strong>non-refundable, non-transferable, and non-exchangeable</strong>.</li>
                  <li>The quality, speed, and availability of service depend on local carriers in your destination and are beyond the control of KurmaGo.</li>
                </ul>
              </section>

              <section className="lp-section" id="s07">
                <div className="lp-section-eyebrow"><span className="lp-num">07</span><span>Section Seven</span></div>
                <h2 className="lp-section-title">AI-Generated Content</h2>
                <p>The Service includes artificial intelligence features that assist in drafting itineraries, suggesting places, and estimating budgets. You acknowledge and agree to the following limitations:</p>
                <ul>
                  <li>Content generated by AI is intended as a <strong>starting point that you may edit</strong>, not as final, locked content.</li>
                  <li>The accuracy of information (operating hours, prices, reservation status, transportation availability) is <strong>subject to change</strong> and is not guaranteed by KurmaGo. Always verify through official sources before making bookings.</li>
                  <li>AI budget estimates are based on historical data and current exchange rates; actual costs may differ.</li>
                  <li>You are solely responsible for travel decisions made based on AI-generated suggestions.</li>
                </ul>
              </section>

              <section className="lp-section" id="s08">
                <div className="lp-section-eyebrow"><span className="lp-num">08</span><span>Section Eight</span></div>
                <h2 className="lp-section-title">Intellectual Property</h2>
                <p>All content on the Service — including the name &ldquo;KurmaGo&rdquo;, the logo, wordmark, designs, illustrations, source code, the curated places database, city guides, and editorial text — is the property of <strong>[Legal Entity Name]</strong> or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws.</p>
                <p>We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms.</p>
              </section>

              <section className="lp-section" id="s09">
                <div className="lp-section-eyebrow"><span className="lp-num">09</span><span>Section Nine</span></div>
                <h2 className="lp-section-title">User Content</h2>
                <p>You retain full ownership of the content you upload or create within the Service, including itineraries, notes, photographs, and travel documents (&ldquo;User Content&rdquo;).</p>
                <p>By uploading User Content, you grant KurmaGo a non-exclusive, royalty-free, worldwide license to store, display, and process User Content solely for the purpose of operating and providing the Service to you.</p>
              </section>

              <section className="lp-section" id="s10">
                <div className="lp-section-eyebrow"><span className="lp-num">10</span><span>Section Ten</span></div>
                <h2 className="lp-section-title">Prohibited Uses</h2>
                <p>When using the Service, you <strong>may not</strong>:</p>
                <ul>
                  <li>Use the Service for any unlawful purpose or in violation of applicable laws.</li>
                  <li>Upload content that infringes on third-party rights, including intellectual property or privacy rights.</li>
                  <li>Upload content that is defamatory, threatening, harassing, hateful, or pornographic in nature.</li>
                  <li>Attempt to disrupt, damage, or unreasonably burden the Service infrastructure.</li>
                  <li>Access another user&apos;s account without authorization or engage in social engineering to obtain credentials.</li>
                  <li>Sell, lease, or transfer access to your account to a third party.</li>
                </ul>
              </section>

              <section className="lp-section" id="s11">
                <div className="lp-section-eyebrow"><span className="lp-num">11</span><span>Section Eleven</span></div>
                <h2 className="lp-section-title">Termination</h2>
                <h3>11.1 Termination by You</h3>
                <p>You may terminate your account at any time through the account settings menu. Upon termination, your data will be handled in accordance with the retention periods described in our <Link href="/privacy">Privacy Policy</Link>.</p>
                <h3>11.2 Termination by Us</h3>
                <p>We reserve the right to suspend or terminate your account if you materially breach these Terms, your account exhibits suspicious activity, or it is necessary to comply with a legal order or request from a competent authority.</p>
              </section>

              <section className="lp-section" id="s12">
                <div className="lp-section-eyebrow"><span className="lp-num">12</span><span>Section Twelve</span></div>
                <h2 className="lp-section-title">Disclaimer of Warranties</h2>
                <p>The Service is provided on an <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> basis, without warranties of any kind, whether express or implied, to the maximum extent permitted by applicable law.</p>
              </section>

              <section className="lp-section" id="s13">
                <div className="lp-section-eyebrow"><span className="lp-num">13</span><span>Section Thirteen</span></div>
                <h2 className="lp-section-title">Limitation of Liability</h2>
                <p>To the maximum extent permitted by applicable law, KurmaGo shall not be liable for indirect, incidental, special, consequential, or punitive damages. Our total aggregate liability shall not exceed the amount you paid to us during the twelve (12) months preceding the event giving rise to the claim, or IDR 1,000,000, whichever is greater.</p>
              </section>

              <section className="lp-section" id="s14">
                <div className="lp-section-eyebrow"><span className="lp-num">14</span><span>Section Fourteen</span></div>
                <h2 className="lp-section-title">Governing Law and Dispute Resolution</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of Indonesia</strong>. Any dispute shall first be resolved through good-faith negotiation, then through the District Court of the appropriate jurisdiction or the Indonesian National Arbitration Board (BANI).</p>
              </section>

              <section className="lp-section" id="s15">
                <div className="lp-section-eyebrow"><span className="lp-num">15</span><span>Section Fifteen</span></div>
                <h2 className="lp-section-title">Changes to These Terms</h2>
                <p>We may update these Terms from time to time. If we make material changes, we will notify you via email or through a prominent notice on the Service at least <strong>fourteen (14) days</strong> before the changes take effect. Your continued use of the Service after the changes take effect constitutes your acceptance of the updated Terms.</p>
              </section>

              <section className="lp-section" id="s16">
                <div className="lp-section-eyebrow"><span className="lp-num">16</span><span>Section Sixteen</span></div>
                <h2 className="lp-section-title">Contact</h2>
                <p>For any questions, clarifications, or formal notices regarding these Terms, please contact:</p>
                <div className="lp-callout">
                  <div className="lp-label">KurmaGo Legal Team</div>
                  <p>
                    <strong>[Legal Entity Name]</strong><br />
                    [Full registered address]<br />
                    Legal email: <a href="mailto:legal@kurma.guide">legal@kurma.guide</a><br />
                    General inquiries: <a href="mailto:hello@kurma.guide">hello@kurma.guide</a>
                  </p>
                </div>
              </section>
            </main>
          </div>
        </>
      )}

      <LegalFooter />
    </div>
  )
}
