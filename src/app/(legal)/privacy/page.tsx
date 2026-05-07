'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import '../legal.css'

export default function PrivacyPage() {
  const tocMobileRef = useRef<HTMLDivElement>(null)
  const tocMobileTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const wrap = tocMobileRef.current
    const trigger = tocMobileTriggerRef.current
    if (!wrap || !trigger) return

    const onTriggerClick = () => {
      const isOpen = wrap.classList.toggle('open')
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    }
    trigger.addEventListener('click', onTriggerClick)

    const links = wrap.querySelectorAll('a')
    const onLinkClick = () => {
      wrap.classList.remove('open')
      trigger.setAttribute('aria-expanded', 'false')
    }
    links.forEach(a => a.addEventListener('click', onLinkClick))

    return () => {
      trigger.removeEventListener('click', onTriggerClick)
      links.forEach(a => a.removeEventListener('click', onLinkClick))
    }
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('.lp-section')
    const tocLinks = document.querySelectorAll('.lp-toc-list a')
    if (!('IntersectionObserver' in window) || sections.length === 0) return

    const byId: Record<string, Element> = {}
    tocLinks.forEach(a => {
      const href = a.getAttribute('href')
      if (href && href[0] === '#') byId[href.slice(1)] = a
    })

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = byId[entry.target.id]
        if (!link) return
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'))
          link.classList.add('active')
        }
      })
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 })

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="legal-root">

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

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-deco-num" aria-hidden="true">01</div>
          <div className="lp-hero-eyebrow">Legal · KurmaGo</div>
          <h1 className="lp-hero-title">Privacy Policy</h1>
          <p className="lp-hero-lead">
            This Privacy Policy describes how KurmaGo collects, uses, discloses, and safeguards your personal information when you access or use our services.
          </p>
          <div className="lp-hero-meta">
            <div className="lp-hero-meta-item">
              <span className="lp-label">Effective Date</span>
              <span className="lp-value">[Effective Date]</span>
            </div>
            <div className="lp-hero-meta-item">
              <span className="lp-label">Last Updated</span>
              <span className="lp-value">[Last Updated]</span>
            </div>
            <div className="lp-hero-meta-item">
              <span className="lp-label">Version</span>
              <span className="lp-value">1.0</span>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-disclaimer" role="note">
        <div className="lp-label">Internal Note — Remove Before Publication</div>
        <p>This document is a <strong>draft template</strong> prepared based on the scope of the KurmaGo product. Prior to publication, it must be reviewed by qualified legal counsel and adapted to the company&apos;s final corporate structure, jurisdiction, and operational policies.</p>
      </div>

      <div className="lp-layout">

        <div className="lp-toc-mobile" id="tocMobile" ref={tocMobileRef}>
          <button className="lp-toc-mobile-trigger" aria-expanded="false" aria-controls="tocMobileList" ref={tocMobileTriggerRef}>
            <span>
              <span className="lp-label-prefix">Table of Contents</span>
              <span>Jump to a section</span>
            </span>
            <svg className="lp-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <ul className="lp-toc-mobile-list" id="tocMobileList">
            {[
              ['s01','Introduction'],['s02','Information We Collect'],['s03','How We Use Information'],
              ['s04','Sharing with Third Parties'],['s05','Cookies & Tracking'],['s06','Your Data Rights'],
              ['s07','Storage & Retention'],['s08','Security'],['s09','International Transfers'],
              ['s10',"Children's Privacy"],['s11','Changes to This Policy'],['s12','Contact Us'],
            ].map(([id, label], i) => (
              <li key={id}><a href={`#${id}`}><span className="lp-num">{String(i+1).padStart(2,'0')}</span><span>{label}</span></a></li>
            ))}
          </ul>
        </div>

        <aside className="lp-toc" aria-label="Table of contents">
          <div className="lp-toc-eyebrow">Table of Contents</div>
          <ul className="lp-toc-list">
            {[
              ['s01','Introduction'],['s02','Information We Collect'],['s03','How We Use Information'],
              ['s04','Sharing with Third Parties'],['s05','Cookies & Tracking'],['s06','Your Data Rights'],
              ['s07','Storage & Retention'],['s08','Security'],['s09','International Transfers'],
              ['s10',"Children's Privacy"],['s11','Changes to This Policy'],['s12','Contact Us'],
            ].map(([id, label], i) => (
              <li key={id}><a href={`#${id}`}><span className="lp-num">{String(i+1).padStart(2,'0')}</span>{label}</a></li>
            ))}
          </ul>
        </aside>

        <main className="lp-content">

          <section className="lp-section" id="s01">
            <div className="lp-section-eyebrow"><span className="lp-num">01</span><span>Section One</span></div>
            <h2 className="lp-section-title">Introduction</h2>
            <p>This Privacy Policy (&ldquo;Policy&rdquo;) applies to your use of the websites, mobile applications, and other digital products and services (collectively, the &ldquo;Service&rdquo;) operated by <strong>[Legal Entity Name, e.g., PT Kurma Guide Indonesia]</strong> (&ldquo;KurmaGo&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) and made available through <a href="https://kurma.guide">kurma.guide</a>.</p>
            <p>By accessing or using the Service, you acknowledge that you have read, understood, and agree to the practices described in this Policy. If you do not agree with this Policy, you must discontinue use of the Service.</p>
            <p>This Policy has been prepared with reference to applicable data protection laws, including the Republic of Indonesia Law Number 27 of 2022 on Personal Data Protection (the &ldquo;PDP Law&rdquo;), and to internationally recognized privacy principles such as the General Data Protection Regulation (&ldquo;GDPR&rdquo;) for users located in the European Economic Area.</p>
          </section>

          <section className="lp-section" id="s02">
            <div className="lp-section-eyebrow"><span className="lp-num">02</span><span>Section Two</span></div>
            <h2 className="lp-section-title">Information We Collect</h2>
            <p>We collect information that you provide to us directly, information generated through your use of the Service, and information from third parties that you authorize to share data with us.</p>
            <h3>2.1 Account Information</h3>
            <p>When you register for an account, we collect your full name, email address, encrypted password, and the authentication method you select (Email and Password, Google Sign-In, or Apple Sign-In). If you choose to authenticate through Google or Apple, we receive your name, email address, and profile picture in accordance with the permissions you grant.</p>
            <h3>2.2 Travel Content</h3>
            <p>When you use the Service to plan a trip, we store the trip name, destination, travel dates, list of places and activities, transportation legs, notes, multi-currency budget data (IDR, JPY, USD, SGD, EUR), booking references, and any file attachments you upload, such as tickets, vouchers, or other travel documents in PDF or image format.</p>
            <h3>2.3 Usage and Device Data</h3>
            <p>We automatically collect certain technical information when you use the Service, including your IP address, device type, operating system, browser type and version, browser language (used to detect default currency), time zone, pages accessed, session duration, and interaction events within the Service.</p>
            <h3>2.4 Payment Information</h3>
            <p>For Pro Subscription transactions and eSIM purchases, payment data (card numbers, CVV codes, and expiration dates) is <strong>never stored on our servers</strong>. Payment processing is performed by PCI-DSS certified payment gateways, and we receive only transaction tokens and payment status information.</p>
            <h3>2.5 eSIM Data</h3>
            <p>When you purchase an eSIM package through the Service, we process information necessary for activation, including your email address, order number, activation date, and the activation code issued by our eSIM partner. Data consumption and the location of eSIM usage are managed by our eSIM partner and are not accessible to KurmaGo.</p>
            <h3>2.6 AI Feature Inputs</h3>
            <p>For our paid AI features (AI Itinerary Draft, AI Place Suggestions, AI Budget Estimate, and AI Day Optimizer), the prompts you provide and the related itinerary context are transmitted to third-party language model providers for processing. We do not use your content to train AI models.</p>
            <h3>2.7 Optional Information</h3>
            <p>You may choose to provide additional information, such as a profile picture, travel preferences, travel style (couple, family, solo), or destination history, to personalize your experience.</p>
          </section>

          <section className="lp-section" id="s03">
            <div className="lp-section-eyebrow"><span className="lp-num">03</span><span>Section Three</span></div>
            <h2 className="lp-section-title">How We Use Information</h2>
            <p>We use the information we collect for the following purposes, in accordance with the applicable legal bases for processing:</p>
            <ul>
              <li><strong>Performance of contract.</strong> To provide, maintain, and improve the Service, including creating and storing itineraries, processing payments, activating eSIM packages, and sending transactional emails (such as payment confirmations, trip reminders, and email verification).</li>
              <li><strong>Legitimate interests.</strong> To understand usage patterns, diagnose technical issues, prevent misuse, and improve the quality of our destination content and AI suggestions.</li>
              <li><strong>Consent.</strong> To send marketing communications (such as newsletters and destination promotions), but only when you have opted in. You may withdraw your consent at any time.</li>
              <li><strong>Legal obligations.</strong> To comply with tax, accounting, and other legal requirements, or to respond to lawful requests from competent authorities.</li>
            </ul>
            <div className="lp-callout">
              <div className="lp-label">Our Commitment</div>
              <p>We will not sell your personal data to third parties for targeted advertising purposes outside the KurmaGo ecosystem.</p>
            </div>
          </section>

          <section className="lp-section" id="s04">
            <div className="lp-section-eyebrow"><span className="lp-num">04</span><span>Section Four</span></div>
            <h2 className="lp-section-title">Sharing with Third Parties</h2>
            <p>We engage trusted service providers to deliver the Service. Each provider is bound by confidentiality obligations and receives only the data necessary to perform its assigned function.</p>
            <table className="lp-data-table">
              <thead>
                <tr>
                  <th>Partner Category</th>
                  <th>Purpose</th>
                  <th>Data Accessed</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Authentication (Google, Apple)</td><td>Login and Sign-In</td><td>Name, email, profile picture</td></tr>
                <tr><td>AI Model Providers</td><td>Pro AI feature processing</td><td>User prompts and related itinerary context</td></tr>
                <tr><td>eSIM Partner</td><td>eSIM package activation</td><td>Email, order number, activation date</td></tr>
                <tr><td>Payment Gateways</td><td>Transaction processing</td><td>Transaction tokens, amount, status</td></tr>
                <tr><td>Hosting and CDN Providers</td><td>Infrastructure operations</td><td>All data encrypted in transit and at rest</td></tr>
                <tr><td>Email Service Providers</td><td>Transactional email delivery</td><td>Email address, name, notification content</td></tr>
                <tr><td>Product Analytics</td><td>Aggregate usage analysis</td><td>Anonymized event data, device type, session (no PII)</td></tr>
                <tr><td>Currency Exchange API</td><td>Multi-currency budget conversion</td><td>No personal data transmitted</td></tr>
              </tbody>
            </table>
            <p>We may also disclose information in the following circumstances: to comply with applicable laws or court orders; to protect the rights, property, or safety of KurmaGo, our users, or the public; or in connection with corporate transactions such as a merger, acquisition, or sale of assets, of which you will be notified in advance.</p>
          </section>

          <section className="lp-section" id="s05">
            <div className="lp-section-eyebrow"><span className="lp-num">05</span><span>Section Five</span></div>
            <h2 className="lp-section-title">Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to maintain your authenticated session, remember your preferences (such as default currency, language, and theme), and understand aggregate usage patterns of the Service.</p>
            <p>The categories of cookies we use are as follows:</p>
            <ul>
              <li><strong>Essential cookies.</strong> Required for the Service to function, including authentication sessions, security protections, and basic preferences. These cannot be disabled.</li>
              <li><strong>Functional cookies.</strong> Remember your currency, language, and display preferences to maintain a consistent experience across visits.</li>
              <li><strong>Analytics cookies.</strong> Help us understand which features are most useful and which require improvement. You may opt out at any time.</li>
            </ul>
            <p>You may manage your cookie preferences through your browser settings or through the cookie preference panel available within the Service. Disabling certain cookies may affect the functionality of the Service.</p>
          </section>

          <section className="lp-section" id="s06">
            <div className="lp-section-eyebrow"><span className="lp-num">06</span><span>Section Six</span></div>
            <h2 className="lp-section-title">Your Data Rights</h2>
            <p>Subject to the PDP Law and internationally recognized privacy principles, you have the following rights with respect to your personal data:</p>
            <ul>
              <li><strong>Right of access.</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification.</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to erasure.</strong> Request deletion of your account and personal data, except where retention is required to comply with applicable legal obligations.</li>
              <li><strong>Right to data portability.</strong> Request your data in a structured, machine-readable format (JSON) for transfer to another service.</li>
              <li><strong>Right to restrict processing.</strong> Request limitations on the processing of your data for specific purposes.</li>
              <li><strong>Right to withdraw consent.</strong> Withdraw your consent for marketing communications at any time, via the unsubscribe link or your account settings.</li>
              <li><strong>Right to lodge a complaint.</strong> Submit a complaint to the competent data protection authority.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@kurma.guide">privacy@kurma.guide</a>. We will respond to your request within thirty (30) business days.</p>
          </section>

          <section className="lp-section" id="s07">
            <div className="lp-section-eyebrow"><span className="lp-num">07</span><span>Section Seven</span></div>
            <h2 className="lp-section-title">Data Storage and Retention</h2>
            <p>We retain your personal data for as long as your account remains active or as required to provide the Service to you.</p>
            <p>Following termination of your account:</p>
            <ul>
              <li>Profile and itinerary data will be permanently deleted within <strong>thirty (30) days</strong>.</li>
              <li>File attachments will be permanently deleted within <strong>thirty (30) days</strong>.</li>
              <li>Transaction records (invoices and payment receipts) will be retained for up to <strong>ten (10) years</strong> in accordance with Indonesian tax and accounting obligations.</li>
              <li>Security logs and fraud-prevention audit logs will be retained for up to <strong>two (2) years</strong>.</li>
              <li>Active eSIM data will remain accessible for technical support purposes for the duration of the active package.</li>
            </ul>
          </section>

          <section className="lp-section" id="s08">
            <div className="lp-section-eyebrow"><span className="lp-num">08</span><span>Section Eight</span></div>
            <h2 className="lp-section-title">Security</h2>
            <p>We implement reasonable technical and organizational measures appropriate to the risks involved, including:</p>
            <ul>
              <li>Encryption of data in transit (HTTPS/TLS 1.3) and at rest (AES-256).</li>
              <li>Password hashing using modern algorithms such as bcrypt or Argon2.</li>
              <li>Internal access controls based on the principle of least privilege.</li>
              <li>Periodic security audits and monitoring for suspicious activity.</li>
              <li>Encrypted backups and disaster recovery planning.</li>
            </ul>
            <p>While we strive to protect your data, no system can guarantee absolute security. In the event of a security incident affecting your data, we will notify you within <strong>seventy-two (72) hours</strong> of becoming aware of the incident, in accordance with the requirements of the PDP Law.</p>
          </section>

          <section className="lp-section" id="s09">
            <div className="lp-section-eyebrow"><span className="lp-num">09</span><span>Section Nine</span></div>
            <h2 className="lp-section-title">International Data Transfers</h2>
            <p>Some of our service providers operate outside the territory of Indonesia, including AI model providers and cloud hosting services. Cross-border transfers of your personal data are conducted under one of the following mechanisms:</p>
            <ul>
              <li>Your explicit consent.</li>
              <li>An adequate level of personal data protection in the recipient country.</li>
              <li>Standard contractual clauses or binding corporate rules providing equivalent protections.</li>
            </ul>
            <p>We will not transfer your data to a jurisdiction lacking an adequate level of protection without one of the safeguards described above.</p>
          </section>

          <section className="lp-section" id="s10">
            <div className="lp-section-eyebrow"><span className="lp-num">10</span><span>Section Ten</span></div>
            <h2 className="lp-section-title">Children&apos;s Privacy</h2>
            <p>The Service is intended for users aged <strong>eighteen (18) years and older</strong>. We do not knowingly collect personal data from children under the age of 18. If you are a parent or legal guardian and become aware that your child has provided personal data to us, please contact <a href="mailto:privacy@kurma.guide">privacy@kurma.guide</a> so that we may delete such data.</p>
          </section>

          <section className="lp-section" id="s11">
            <div className="lp-section-eyebrow"><span className="lp-num">11</span><span>Section Eleven</span></div>
            <h2 className="lp-section-title">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes to the Service, applicable laws, or industry best practices. If we make material changes, we will notify you by email or through a prominent notice on the Service at least <strong>fourteen (14) days</strong> before the changes take effect.</p>
            <p>The &ldquo;Last Updated&rdquo; date at the top of this document indicates when the Policy was last revised. Your continued use of the Service after the changes take effect constitutes your acceptance of the updated Policy.</p>
          </section>

          <section className="lp-section" id="s12">
            <div className="lp-section-eyebrow"><span className="lp-num">12</span><span>Section Twelve</span></div>
            <h2 className="lp-section-title">Contact Us</h2>
            <p>For any questions, complaints, or requests related to this Policy or to exercise your data rights, please contact:</p>
            <div className="lp-callout">
              <div className="lp-label">Data Protection Officer</div>
              <p>
                <strong>[Legal Entity Name]</strong><br />
                [Full registered address]<br />
                Privacy email: <a href="mailto:privacy@kurma.guide">privacy@kurma.guide</a><br />
                General inquiries: <a href="mailto:hello@kurma.guide">hello@kurma.guide</a>
              </p>
            </div>
            <p>We are committed to addressing your inquiries promptly and in good faith. For unresolved complaints, you have the right to lodge a complaint with the competent data protection authority in Indonesia.</p>
          </section>

        </main>
      </div>

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
            <span>© 2026 [Legal Entity Name]. All rights reserved.</span>
            <span>Crafted with care from Indonesia.</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
