'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import '../legal.css'

export default function TermsPage() {
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

  const tocItems = [
    ['s01','Acceptance of Terms'],['s02','The Service'],['s03','User Accounts'],
    ['s04','Subscription Plans'],['s05','Payment & Renewal'],['s06','eSIM Services'],
    ['s07','AI-Generated Content'],['s08','Intellectual Property'],['s09','User Content'],
    ['s10','Prohibited Uses'],['s11','Termination'],['s12','Disclaimer of Warranties'],
    ['s13','Limitation of Liability'],['s14','Governing Law'],['s15','Changes to Terms'],
    ['s16','Contact'],
  ]

  return (
    <div className="legal-root">

      <header className="lp-topbar">
        <div className="lp-topbar-inner">
          <Link href="/" className="lp-wordmark" aria-label="KurmaGo Home">
            <span className="accent-dot" aria-hidden="true" />Kurma<em>Go</em><span className="period">.</span>
          </Link>
          <Link href="/" className="lp-back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to Home
          </Link>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-deco-num" aria-hidden="true">02</div>
          <div className="lp-hero-eyebrow">Legal · KurmaGo</div>
          <h1 className="lp-hero-title">Terms of Service</h1>
          <p className="lp-hero-lead">
            These Terms of Service constitute a legally binding agreement between you and KurmaGo that governs your access to and use of our platform, applications, and related services.
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
            {tocItems.map(([id, label], i) => (
              <li key={id}><a href={`#${id}`}><span className="lp-num">{String(i+1).padStart(2,'0')}</span><span>{label}</span></a></li>
            ))}
          </ul>
        </div>

        <aside className="lp-toc" aria-label="Table of contents">
          <div className="lp-toc-eyebrow">Table of Contents</div>
          <ul className="lp-toc-list">
            {tocItems.map(([id, label], i) => (
              <li key={id}><a href={`#${id}`}><span className="lp-num">{String(i+1).padStart(2,'0')}</span>{label}</a></li>
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
            <p>The scope of destinations, features, and availability may change from time to time. We will use reasonable efforts to inform you of material changes through email or in-Service notifications.</p>
          </section>

          <section className="lp-section" id="s03">
            <div className="lp-section-eyebrow"><span className="lp-num">03</span><span>Section Three</span></div>
            <h2 className="lp-section-title">User Accounts</h2>
            <h3>3.1 Registration</h3>
            <p>To use most features of the Service, you must create an account using Email and Password authentication, Google Sign-In, or Apple Sign-In. You agree to provide accurate, complete, and current information at the time of registration and to update such information as needed.</p>
            <h3>3.2 Account Security</h3>
            <p>You are solely responsible for all activity that occurs under your account. You agree to:</p>
            <ul>
              <li>Maintain the confidentiality of your password and authentication credentials.</li>
              <li>Use a strong password that is not reused from other services.</li>
              <li>Promptly notify us at <a href="mailto:security@kurma.guide">security@kurma.guide</a> if you suspect unauthorized access to your account.</li>
            </ul>
            <p>We are not liable for any loss or damage arising from your failure to maintain the security of your account.</p>
            <h3>3.3 Third-Party Authentication</h3>
            <p>If you choose to sign in via Google or Apple, your use of those authentication services is subject to the respective terms and conditions of each provider. We access only the data you authorize to be shared, namely your name, email address, and profile picture.</p>
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
            <p>Detailed pricing, quota limits, and the features included in each plan are available on the Service&apos;s <a href="#">Pricing</a> page and may change from time to time with prior notice.</p>
            <h3>4.1 Pro Trial</h3>
            <p>New accounts are eligible for a <strong>thirty (30) day Pro trial</strong> without requiring a credit card. Upon expiration of the trial period, the account will automatically revert to the Free plan unless you choose to subscribe.</p>
          </section>

          <section className="lp-section" id="s05">
            <div className="lp-section-eyebrow"><span className="lp-num">05</span><span>Section Five</span></div>
            <h2 className="lp-section-title">Payment and Auto-Renewal</h2>
            <h3>5.1 Billing</h3>
            <p>Pro Subscriptions are billed periodically (monthly or annually) in accordance with the plan you select. Payments are made in advance through PCI-DSS certified payment gateways.</p>
            <h3>5.2 Auto-Renewal</h3>
            <p>Unless you cancel before the next billing period, your subscription will automatically renew at the rate then in effect. You may cancel at any time through your account settings; cancellation takes effect at the end of the current billing period.</p>
            <h3>5.3 Refunds</h3>
            <p>Except as required by applicable law, payments made are non-refundable. For exceptional circumstances, you may contact <a href="mailto:billing@kurma.guide">billing@kurma.guide</a> and your request will be evaluated under our refund policy.</p>
            <h3>5.4 Price Changes</h3>
            <p>We may change subscription pricing with at least <strong>thirty (30) days&apos; prior written notice</strong> via email. If you do not agree to the new pricing, you may cancel your subscription before the new rate takes effect.</p>
            <h3>5.5 Taxes</h3>
            <p>Prices displayed may be inclusive or exclusive of value-added tax (VAT) depending on your billing location and applicable tax regulations. Applicable taxes will be added at checkout.</p>
          </section>

          <section className="lp-section" id="s06">
            <div className="lp-section-eyebrow"><span className="lp-num">06</span><span>Section Six</span></div>
            <h2 className="lp-section-title">eSIM Services</h2>
            <p>KurmaGo facilitates the purchase of eSIM packages through partner connectivity providers. eSIM Services are subject to the following additional terms:</p>
            <ul>
              <li>You are responsible for ensuring that your device is <strong>eSIM-compatible and carrier-unlocked</strong> prior to purchase. A list of compatible devices is provided on the purchase page.</li>
              <li>The eSIM activation code will be delivered via email upon successful payment confirmation. Please ensure your email is active and check your spam folder if necessary.</li>
              <li>Once an eSIM has been activated on a device, the package is <strong>non-refundable, non-transferable, and non-exchangeable</strong>.</li>
              <li>The quality, speed, and availability of service depend on local carriers in your destination and are beyond the control of KurmaGo.</li>
              <li>The validity period of each package is calculated from the date of first activation, and there is no automatic renewal for eSIM packages.</li>
            </ul>
            <div className="lp-callout lp-callout-mist">
              <div className="lp-label">Important</div>
              <p>To avoid disputes, we strongly recommend testing eSIM activation while at home prior to your departure, following the instructions provided in your confirmation email.</p>
            </div>
          </section>

          <section className="lp-section" id="s07">
            <div className="lp-section-eyebrow"><span className="lp-num">07</span><span>Section Seven</span></div>
            <h2 className="lp-section-title">AI-Generated Content</h2>
            <p>The Service includes artificial intelligence features that assist in drafting itineraries, suggesting places, and estimating budgets. You acknowledge and agree to the following limitations:</p>
            <ul>
              <li>Content generated by AI is intended as a <strong>starting point that you may edit</strong>, not as final, locked content.</li>
              <li>The accuracy of information (operating hours, prices, reservation status, transportation availability) is <strong>subject to change</strong> and is not guaranteed by KurmaGo. Always verify through official sources before making bookings.</li>
              <li>AI budget estimates are based on historical data and current exchange rates; actual costs may differ.</li>
              <li>AI suggestions do not substitute for professional advice on safety, health, legal, or regulatory matters.</li>
              <li>You are solely responsible for travel decisions made based on AI-generated suggestions.</li>
            </ul>
            <div className="lp-callout lp-callout-warning">
              <div className="lp-label">Warning</div>
              <p>For matters such as visa requirements, health protocols, travel restrictions, or immigration rules, always consult official government sources of the destination country, not AI feature suggestions.</p>
            </div>
          </section>

          <section className="lp-section" id="s08">
            <div className="lp-section-eyebrow"><span className="lp-num">08</span><span>Section Eight</span></div>
            <h2 className="lp-section-title">Intellectual Property</h2>
            <p>All content on the Service — including but not limited to the name &ldquo;KurmaGo&rdquo;, the logo, wordmark, designs, illustrations, source code, the structure of the curated places database, city guides, curated photographs, and editorial text — is the property of <strong>[Legal Entity Name]</strong> or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws.</p>
            <p>We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms. You <strong>may not</strong>:</p>
            <ul>
              <li>Reproduce, modify, distribute, or create derivative works of KurmaGo content without prior written authorization.</li>
              <li>Reverse engineer, decompile, or attempt to access the source code of the Service.</li>
              <li>Use robots, scrapers, or other automated tools to extract data from the Service.</li>
              <li>Use KurmaGo trademarks or visual identity for any purpose without prior written consent.</li>
            </ul>
          </section>

          <section className="lp-section" id="s09">
            <div className="lp-section-eyebrow"><span className="lp-num">09</span><span>Section Nine</span></div>
            <h2 className="lp-section-title">User Content</h2>
            <p>You retain full ownership of the content you upload or create within the Service, including itineraries, notes, photographs, and travel documents (&ldquo;User Content&rdquo;).</p>
            <p>By uploading User Content, you grant KurmaGo a non-exclusive, royalty-free, worldwide license to:</p>
            <ul>
              <li>Store, display, and process User Content solely for the purpose of operating and providing the Service to you.</li>
              <li>Process User Content through third-party AI providers when you use AI features.</li>
              <li>Share User Content according to your instructions, such as via view-only links you generate.</li>
            </ul>
            <p>You represent and warrant that you possess all necessary rights to the User Content you upload, and that such content does not infringe upon the rights of any third party.</p>
          </section>

          <section className="lp-section" id="s10">
            <div className="lp-section-eyebrow"><span className="lp-num">10</span><span>Section Ten</span></div>
            <h2 className="lp-section-title">Prohibited Uses</h2>
            <p>When using the Service, you <strong>may not</strong>:</p>
            <ul>
              <li>Use the Service for any unlawful purpose or in violation of applicable laws.</li>
              <li>Upload content that infringes on third-party rights, including intellectual property or privacy rights.</li>
              <li>Upload content that is defamatory, threatening, harassing, hateful, or pornographic in nature.</li>
              <li>Attempt to disrupt, damage, or unreasonably burden the Service infrastructure (e.g., DDoS attacks, brute-force attempts, or unauthorized fuzzing).</li>
              <li>Access another user&apos;s account without authorization or engage in social engineering to obtain credentials.</li>
              <li>Sell, lease, or transfer access to your account to a third party.</li>
              <li>Use AI features to create misleading, unlawful, or reputation-damaging content.</li>
              <li>Misuse eSIM features, including the unauthorized resale of activation codes purchased through the Service.</li>
            </ul>
            <p>Violation of these provisions may result in suspension or termination of your account without prior notice, depending on the severity of the violation.</p>
          </section>

          <section className="lp-section" id="s11">
            <div className="lp-section-eyebrow"><span className="lp-num">11</span><span>Section Eleven</span></div>
            <h2 className="lp-section-title">Termination</h2>
            <h3>11.1 Termination by You</h3>
            <p>You may terminate your account at any time through the account settings menu. Upon termination, your data will be handled in accordance with the retention periods described in our <Link href="/privacy">Privacy Policy</Link>.</p>
            <h3>11.2 Termination by Us</h3>
            <p>We reserve the right to suspend or terminate your account if:</p>
            <ul>
              <li>You materially breach these Terms.</li>
              <li>Your account exhibits suspicious activity or potentially harms other users.</li>
              <li>It is necessary to comply with a legal order or request from a competent authority.</li>
              <li>Your account remains inactive for more than <strong>twenty-four (24) consecutive months</strong>.</li>
            </ul>
            <p>Except in cases of material breach, we will provide notice and a reasonable opportunity to respond before terminating your account.</p>
          </section>

          <section className="lp-section" id="s12">
            <div className="lp-section-eyebrow"><span className="lp-num">12</span><span>Section Twelve</span></div>
            <h2 className="lp-section-title">Disclaimer of Warranties</h2>
            <p>The Service is provided on an <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> basis, without warranties of any kind, whether express or implied, to the maximum extent permitted by applicable law.</p>
            <p>Without limiting the foregoing, we specifically do not warrant that:</p>
            <ul>
              <li>The Service will always be available, timely, secure, or error-free.</li>
              <li>Results obtained from use of the Service will be accurate or reliable for any particular purpose.</li>
              <li>The quality of any product, service, or information obtained through the Service will meet your expectations.</li>
              <li>Any errors in the Service will be corrected within any specific timeframe.</li>
            </ul>
            <p>Our internal availability target is <strong>99.5% per month</strong>; however, this is not a contractual guarantee.</p>
          </section>

          <section className="lp-section" id="s13">
            <div className="lp-section-eyebrow"><span className="lp-num">13</span><span>Section Thirteen</span></div>
            <h2 className="lp-section-title">Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, KurmaGo, together with its directors, employees, partners, and affiliates, <strong>shall not be liable</strong> for:</p>
            <ul>
              <li>Indirect, incidental, special, consequential, or punitive damages.</li>
              <li>Loss of profits, revenue, business opportunities, or goodwill.</li>
              <li>Losses arising from travel decisions made based on information or suggestions from the Service, including AI suggestions.</li>
              <li>Losses caused by errors, delays, or cancellations of third parties (airlines, hotels, restaurants, transportation operators, eSIM partners).</li>
              <li>Loss of internet access, eSIM failure, or quality of connectivity at destinations.</li>
              <li>Losses caused by security breaches outside our reasonable control.</li>
            </ul>
            <p>Our total aggregate liability for all claims arising out of or relating to these Terms and the Service <strong>shall not exceed the amount you paid to us during the twelve (12) months preceding the event giving rise to the claim</strong>, or IDR 1,000,000 (one million Indonesian Rupiah), whichever is greater.</p>
          </section>

          <section className="lp-section" id="s14">
            <div className="lp-section-eyebrow"><span className="lp-num">14</span><span>Section Fourteen</span></div>
            <h2 className="lp-section-title">Governing Law and Dispute Resolution</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of Indonesia</strong>, without regard to conflict of law principles.</p>
            <p>Any dispute arising out of or in connection with these Terms or the Service shall first be resolved through good-faith negotiation. If such negotiation does not result in a resolution within <strong>thirty (30) days</strong>, the dispute shall be resolved through:</p>
            <ul>
              <li>The <strong>District Court of [South Jakarta / appropriate jurisdiction]</strong>; or</li>
              <li>The <strong>Indonesian National Arbitration Board (BANI)</strong> in Jakarta, in accordance with BANI&apos;s then-current rules and procedures, as agreed by both parties.</li>
            </ul>
          </section>

          <section className="lp-section" id="s15">
            <div className="lp-section-eyebrow"><span className="lp-num">15</span><span>Section Fifteen</span></div>
            <h2 className="lp-section-title">Changes to These Terms</h2>
            <p>We may update these Terms from time to time to reflect changes in the Service, applicable laws, or our business practices. If we make material changes, we will notify you via email or through a prominent notice on the Service at least <strong>fourteen (14) days</strong> before the changes take effect.</p>
            <p>Your continued use of the Service after the changes take effect constitutes your acceptance of the updated Terms. If you do not agree to the changes, you may terminate your account before the changes take effect.</p>
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
                Billing email: <a href="mailto:billing@kurma.guide">billing@kurma.guide</a><br />
                General inquiries: <a href="mailto:hello@kurma.guide">hello@kurma.guide</a>
              </p>
            </div>
            <p>We will respond to your inquiries within a reasonable time, typically within <strong>five (5) business days</strong>.</p>
          </section>

        </main>
      </div>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-wordmark" aria-label="KurmaGo Home">
                <span className="accent-dot" aria-hidden="true" />Kurma<em>Go</em><span className="period">.</span>
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
