import fs from 'node:fs';
import path from 'node:path';
import { SERVICES } from './data-services.mjs';
import { OAKLEY_NEIGHBORHOODS, NEARBY_CITIES } from './data-areas.mjs';
import {
  SITE_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  BUSINESS_NAME,
  escapeHtml,
  canonicalUrl,
  hrefFor,
  assetFor,
  localBusinessSchema,
  breadcrumbSchema,
  renderHead,
  renderHeader,
  renderBreadcrumbs,
  renderFaqList,
  renderCtaBanner,
  renderMapEmbed,
  renderEstimateForm,
  renderFooter
} from './templates.mjs';

const OUT_DIR = path.resolve(process.cwd(), 'allamericanroofing');
const generatedUrls = [];

function writePage(relRoute, html) {
  const clean = relRoute.replace(/^\/+/, '').replace(/\/+$/, '');
  const targetFile = clean ? path.join(OUT_DIR, clean, 'index.html') : path.join(OUT_DIR, 'index.html');
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, html, 'utf8');
  generatedUrls.push(canonicalUrl(relRoute));
}

function writeRawFile(filename, html) {
  const targetFile = path.join(OUT_DIR, filename);
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, html, 'utf8');
}

/* ============================================================================
   1. HOMEPAGE (/) — All 21 Requested Sections
   ============================================================================ */
function buildHomepage() {
  const depth = 0;
  const canonical = canonicalUrl('/');
  const homeFaqs = [
    {
      q: 'What roofing services does All American Roofing offer in Oakley, CA?',
      a: 'We handle roof repairs, roof leak detection, complete roof replacements, new roof installations, roof inspections, preventive maintenance, storm damage repairs, shingle, tile, metal, and flat roofing, as well as residential, commercial, and gutter services.'
    },
    {
      q: 'How do I know whether my roof needs a repair or full replacement?',
      a: 'We perform an on-site inspection of your shingles or tiles, flashing seams, valleys, and accessible attic decking. If damage is localized and surrounding roofing remains sound, we recommend targeted repair rather than unnecessary replacement.'
    },
    {
      q: 'Which Oakley neighborhoods and nearby cities do you serve?',
      a: 'Oakley, CA is our primary service hub—including Summer Lake, Emerson Ranch, Cypress Grove, Vintage Parkway, Laurel Crest, Downtown Oakley, and Magnolia Park. Call (855) 235-0472 to confirm current scheduling for nearby cities such as Brentwood, Antioch, Discovery Bay, Knightsen, Bethel Island, and Pittsburg.'
    },
    {
      q: 'How can I request a roofing estimate in Oakley?',
      a: 'Call (855) 235-0472 directly or submit your property location and roofing concern through our Contact page to arrange an on-site evaluation.'
    }
  ];

  const schemas = [
    localBusinessSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BUSINESS_NAME,
      url: `${SITE_URL}/`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    }
  ];

  const serviceCardsHtml = SERVICES.map(
    (s) => `<a class="directory-link" href="${hrefFor(depth, s.slug)}">
          <span class="directory-link__title">${escapeHtml(s.shortName)}</span>
          <span class="directory-link__sub">View Oakley ${escapeHtml(s.shortName.toLowerCase())} details &rarr;</span>
        </a>`
  ).join('\n        ');

  const oakleyAreasHtml = OAKLEY_NEIGHBORHOODS.map(
    (a) => `<a class="directory-link" href="${hrefFor(depth, `areas/${a.slug}`)}">
          <span class="directory-link__title">${escapeHtml(a.name)}</span>
          <span class="directory-link__sub">${a.isPrimaryHub ? 'Primary Oakley Service Hub' : 'Proposed Neighborhood Coverage'} &rarr;</span>
        </a>`
  ).join('\n        ');

  const nearbyCitiesHtml = NEARBY_CITIES.map(
    (c) => `<a class="directory-link" href="${hrefFor(depth, `areas/${c.slug}`)}">
          <span class="directory-link__title">${escapeHtml(c.name)}</span>
          <span class="directory-link__sub">Confirm East County availability &rarr;</span>
        </a>`
  ).join('\n        ');

  const html = `${renderHead({
    title: 'All American Roofing | Roofing Contractor in Oakley, CA',
    description:
      'All American Roofing is an Oakley, CA roofing contractor providing roof repair, replacement, inspections, shingle, tile, metal, and commercial roofing. Call (855) 235-0472.',
    canonical,
    depth,
    schemas
  })}
${renderHeader(depth, 'home')}
  <main id="main-content">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__media">
        <img
          class="hero__img"
          src="${assetFor(depth, 'assets/images/hero/oakley-roofing-hero.jpg')}"
          alt="Oakley, California ranch residence with freshly installed dark charcoal architectural shingle roof"
          width="1376"
          height="768"
          loading="eager"
          fetchpriority="high" />
        <div class="hero__scrim" aria-hidden="true"></div>
      </div>
      <div class="container">
        <div class="hero__content">
          <span class="hero__kicker">Oakley, California · Residential &amp; Commercial Roofing</span>
          <h1>Dependable Roofing Contractor in Oakley, CA</h1>
          <p class="hero__lead">
            All American Roofing protects homes and businesses across Oakley with honest roof inspections, targeted leak repairs, complete tear-off replacements, and durable shingle, tile, metal, and flat roofing systems.
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${hrefFor(depth, 'contact')}">Request a Free Estimate</a>
            <a class="btn btn--outline-light tabular-nums" href="${PHONE_HREF}">Call Now: ${PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Strip -->
    <div class="trust-strip">
      <div class="container">
        <div class="trust-strip__grid">
          <div class="trust-strip__item">
            <span class="trust-strip__title">Oakley, CA Focus</span>
            <span class="trust-strip__text">Built for East Contra Costa heat, wind &amp; rain</span>
          </div>
          <div class="trust-strip__item">
            <span class="trust-strip__title">Residential &amp; Commercial</span>
            <span class="trust-strip__text">Single-family homes, ADUs &amp; retail roofs</span>
          </div>
          <div class="trust-strip__item">
            <span class="trust-strip__title">Clear Written Scopes</span>
            <span class="trust-strip__text">Straightforward repair vs. replacement advice</span>
          </div>
          <div class="trust-strip__item">
            <span class="trust-strip__title">Direct Phone Access</span>
            <span class="trust-strip__text tabular-nums">Speak with our team at ${PHONE_DISPLAY}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Roofing Services Overview (All 15 Services Linked) -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Roofing Services in Oakley, CA</span>
          <h2>Complete Roofing &amp; Gutter Solutions</h2>
          <p>
            From stopping a single flashing leak to tearing off and replacing an aging residential or commercial roof, explore our specialized roofing services. Final material availability and project scope are confirmed during your on-site inspection.
          </p>
        </div>
        <div class="directory-grid">
          ${serviceCardsHtml}
        </div>
        <div class="mt-4">
          <a class="btn btn--navy" href="${hrefFor(depth, 'services')}">Explore All Roofing Services</a>
        </div>
      </div>
    </section>

    <!-- Why Choose All American Roofing -->
    <section class="section section--surface">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">Why Choose All American Roofing</span>
            <h2>Straightforward Craftsmanship Built for Oakley Weather</h2>
            <p>
              Roofs in Oakley and the East Bay Delta corridor face harsh summer UV exposure, strong afternoon gusts, and concentrated winter storms. Shortcuts in flashing, underlayment, or fastening show up quickly when heavy rain arrives.
            </p>
            <ul class="check-list">
              <li><strong>Thorough Diagnostics First:</strong> We trace leaks to flashing, pipe boots, valleys, or underlayment rather than relying on quick surface tar.</li>
              <li><strong>Full Deck Inspection on Replacements:</strong> Torn-off roofs are checked board by board so compromised sheathing is replaced cleanly.</li>
              <li><strong>Clean Job Sites:</strong> Landscaping and driveways are covered during work, followed by careful cleanup and magnetic nail sweeps.</li>
              <li><strong>Honest Recommendations:</strong> If a targeted repair will reliably extend your roof’s life, we tell you upfront.</li>
            </ul>
            <a class="btn btn--outline-dark" href="${hrefFor(depth, 'about')}">Learn About Our Approach</a>
          </div>
          <div class="media-frame">
            <img
              src="${assetFor(depth, 'assets/images/about/all-american-roofing-crew.jpg')}"
              alt="All American Roofing crew standing neatly beside a service truck in California"
              width="1200"
              height="896"
              loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- Residential Roofing -->
    <section class="section">
      <div class="container">
        <div class="split split--reverse">
          <div>
            <span class="eyebrow">Residential Roofing Oakley, CA</span>
            <h2>Protecting Single-Family Homes, Ranch Houses &amp; ADUs</h2>
            <p>
              Whether you own an established ranch home near Vintage Parkway or a two-story tile property in Summer Lake or Emerson Ranch, your roof protects your framing, insulation, and interior finishes year-round.
            </p>
            <p>
              We service architectural asphalt shingles, concrete and clay tiles, standing seam metal roofs, and low-slope patio or garage transitions—keeping HOA guidelines and balanced attic ventilation in mind.
            </p>
            <div class="hero__actions">
              <a class="btn btn--navy" href="${hrefFor(depth, 'residential-roofing')}">Residential Roofing Details</a>
              <a class="btn btn--outline-dark" href="${hrefFor(depth, 'roof-inspection')}">Schedule Roof Inspection</a>
            </div>
          </div>
          <div class="media-frame">
            <img
              src="${assetFor(depth, 'assets/images/projects/oakley-shingle-project.jpg')}"
              alt="Residential home in Oakley, California with dark architectural shingle roof and clean white eaves"
              width="1200"
              height="896"
              loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- Commercial Roofing -->
    <section class="section section--surface">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">Commercial Roofing Oakley, CA</span>
            <h2>Low-Slope Membranes &amp; Storefront Roof Care</h2>
            <p>
              Retail centers, offices, warehouses, and multi-family buildings along Main Street and East County corridors depend on watertight low-slope membranes, clean parapet coping, and clear roof drains.
            </p>
            <p>
              All American Roofing inspects HVAC curbs, scuppers, and membrane seams carefully—scheduling repair, coating, or replacement work to minimize disruption to tenants, staff, and customers.
            </p>
            <div class="hero__actions">
              <a class="btn btn--navy" href="${hrefFor(depth, 'commercial-roofing')}">Commercial Roofing Services</a>
              <a class="btn btn--outline-dark" href="${hrefFor(depth, 'flat-roofing')}">Flat &amp; TPO Roofing</a>
            </div>
          </div>
          <div class="media-frame">
            <img
              src="${assetFor(depth, 'assets/images/commercial-roofing/commercial-tpo-roof.jpg')}"
              alt="White commercial TPO flat roof with heat-welded seams and sealed HVAC curb flashing"
              width="1200"
              height="896"
              loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- Roof Repair & Replacement Comparison -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Repair vs. Replacement</span>
          <h2>Roof Repair &amp; Roof Replacement in Oakley, CA</h2>
          <p>
            Knowing when a targeted repair solves the issue—and when a full tear-off replacement is the smarter long-term decision—starts with an accurate roof evaluation.
          </p>
        </div>
        <div class="grid grid--2">
          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/roof-repair/roof-repair-flashing.jpg')}"
                alt="Roofing technician replacing chimney step flashing and damaged asphalt shingles"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <span class="card__meta">Targeted Diagnostics · Flashing &amp; Shingles</span>
              <h3 class="card__title">Roof Repair &amp; Leak Detection</h3>
              <p class="card__text">
                Ideal for wind-lifted tabs, cracked pipe boots, chimney step flashing leaks, valley debris backups, and isolated broken concrete tiles on otherwise healthy roofs.
              </p>
              <a class="card__link" href="${hrefFor(depth, 'roof-repair')}">Explore Roof Repair &rarr;</a>
            </div>
          </article>

          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/roof-replacement/roof-replacement-tearoff.jpg')}"
                alt="Full residential roof replacement showing synthetic underlayment and new architectural shingles"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <span class="card__meta">Full Tear-Off · Decking &amp; Ventilation</span>
              <h3 class="card__title">Complete Roof Replacement</h3>
              <p class="card__text">
                Recommended when shingles shed heavy granules across multiple slopes, tile underlayment reaches age limits, or widespread wear causes recurring leaks.
              </p>
              <a class="card__link" href="${hrefFor(depth, 'roof-replacement')}">Explore Roof Replacement &rarr;</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Roofing Materials & Options -->
    <section class="section section--surface">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Materials &amp; Systems</span>
          <h2>Roofing Materials Suited to East Contra Costa Homes</h2>
          <p>
            Every material option comes with distinct thermal performance, wind resistance, architectural appearance, and maintenance requirements.
          </p>
        </div>
        <div class="grid grid--4">
          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/shingle-roofing/architectural-shingle-roof.jpg')}"
                alt="Dimensional asphalt shingle roof with aluminum gutters"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <h3 class="card__title">Architectural Shingles</h3>
              <p class="card__text">Multi-layer laminated asphalt shingles offering strong wind protection and rich curb appeal.</p>
              <a class="card__link" href="${hrefFor(depth, 'shingle-roofing')}">Shingle Roofing &rarr;</a>
            </div>
          </article>

          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/tile-roofing/california-tile-roof.jpg')}"
                alt="California concrete and clay tile roof with ridge caps"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <h3 class="card__title">Concrete &amp; Clay Tile</h3>
              <p class="card__text">Long-lasting tile profiles, broken tile replacements, and underlayment lift-and-reset service.</p>
              <a class="card__link" href="${hrefFor(depth, 'tile-roofing')}">Tile Roofing &rarr;</a>
            </div>
          </article>

          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/metal-roofing/standing-seam-metal-roof.jpg')}"
                alt="Dark matte standing seam metal roof on a modern residence"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <h3 class="card__title">Standing Seam Metal</h3>
              <p class="card__text">Concealed-fastener steel panels built for heat reflection, fire safety, and crisp modern lines.</p>
              <a class="card__link" href="${hrefFor(depth, 'metal-roofing')}">Metal Roofing &rarr;</a>
            </div>
          </article>

          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/commercial-roofing/commercial-tpo-roof.jpg')}"
                alt="White TPO flat roof membrane on commercial structure"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <h3 class="card__title">Flat &amp; Low-Slope</h3>
              <p class="card__text">Heat-welded TPO and modified bitumen systems engineered for low-slope drainage reliability.</p>
              <a class="card__link" href="${hrefFor(depth, 'flat-roofing')}">Flat Roofing &rarr;</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Our Work / Project Gallery -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Workmanship Showcase</span>
          <h2>Roofing Project Capabilities &amp; Standards</h2>
          <p>
            Representative residential and commercial roof configurations illustrating clean flashing transitions, straight courses, and organized job sites.
          </p>
        </div>
        <div class="grid grid--3">
          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/projects/oakley-shingle-project.jpg')}"
                alt="Residential architectural shingle installation showcase in Oakley, CA"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <span class="card__meta">Residential · Architectural Shingles</span>
              <h3 class="card__title">Oakley Residential Shingle System</h3>
              <p class="card__text">Dimensional slate shingle installation paired with new drip edge flashing, valley metal, and ventilated ridge caps.</p>
              <a class="card__link" href="${hrefFor(depth, 'projects')}">View Project Details &rarr;</a>
            </div>
          </article>

          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/projects/brentwood-tile-project.jpg')}"
                alt="Two-story California home with restored concrete tile roof"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <span class="card__meta">Residential · Concrete Tile</span>
              <h3 class="card__title">Two-Story Concrete Tile Restoration</h3>
              <p class="card__text">Underlayment renewal, matched replacement tiles, kickout wall flashing, and clean ridge cap alignment.</p>
              <a class="card__link" href="${hrefFor(depth, 'projects')}">View Project Details &rarr;</a>
            </div>
          </article>

          <article class="card">
            <div class="card__media">
              <img
                src="${assetFor(depth, 'assets/images/projects/commercial-flat-project.jpg')}"
                alt="Commercial building with white reflective flat roof and clean parapet coping"
                width="1200"
                height="896"
                loading="lazy" />
            </div>
            <div class="card__body">
              <span class="card__meta">Commercial · Low-Slope Membrane</span>
              <h3 class="card__title">Commercial Flat Roof &amp; Scupper Upgrade</h3>
              <p class="card__text">Reflective single-ply membrane assembly with crisp metal coping and unobstructed rainwater scuppers.</p>
              <a class="card__link" href="${hrefFor(depth, 'projects')}">View Project Details &rarr;</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Our Roofing Process -->
    <section class="section section--navy">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Our Roofing Process</span>
          <h2>Clear Communication from Inspection to Final Sweep</h2>
          <p>
            Every roofing repair and replacement follows a consistent four-step process so property owners know exactly what to expect.
          </p>
        </div>
        <div class="process-grid">
          <div class="process-step">
            <span class="process-step__num">01. Inspection</span>
            <h3 style="color: var(--ink-900);">On-Site Roof Evaluation</h3>
            <p style="color: var(--ink-700);">We examine slopes, flashing seams, vents, valleys, gutters, and accessible attic areas to pinpoint wear accurately.</p>
          </div>
          <div class="process-step">
            <span class="process-step__num">02. Written Scope</span>
            <h3 style="color: var(--ink-900);">Transparent Proposal</h3>
            <p style="color: var(--ink-700);">You receive clear repair or replacement options, material specifications, and an estimated schedule before committing.</p>
          </div>
          <div class="process-step">
            <span class="process-step__num">03. Installation</span>
            <h3 style="color: var(--ink-900);">Careful Execution</h3>
            <p style="color: var(--ink-700);">Landscaping is protected, worn materials and soft decking are addressed cleanly, and new components are installed to spec.</p>
          </div>
          <div class="process-step">
            <span class="process-step__num">04. Cleanup</span>
            <h3 style="color: var(--ink-900);">Magnetic Sweep &amp; Review</h3>
            <p style="color: var(--ink-700);">Debris is cleared off-site, walkways and driveways are swept with magnets, and we review the finished work with you.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Oakley Neighborhoods & Nearby Cities Served -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Local Service Coverage</span>
          <h2>Oakley Neighborhoods We Focus On</h2>
          <p>
            Oakley, CA is our primary service market. Explore neighborhood-specific roofing considerations below and call <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a> to confirm scheduling for your street.
          </p>
        </div>
        <div class="directory-grid">
          ${oakleyAreasHtml}
        </div>

        <div class="section-header mt-6">
          <span class="eyebrow">Proposed East Contra Costa Coverage</span>
          <h2>Nearby Cities Around Oakley</h2>
          <p>
            In addition to Oakley, these proposed service area pages outline surrounding East County communities. Please call <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a> to confirm current crew availability for properties outside Oakley city limits.
          </p>
        </div>
        <div class="directory-grid">
          ${nearbyCitiesHtml}
        </div>
      </div>
    </section>

    <!-- Homeowner Feedback & Service Commitments (No Fabricated Reviews) -->
    <section class="section section--surface">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Homeowner Feedback &amp; Standards</span>
          <h2>Accountable Service on Every Oakley Roof</h2>
          <p>
            We believe trust is earned through real completed projects—not invented testimonials. Here are the practical standards every homeowner can expect when working with All American Roofing.
          </p>
        </div>
        <div class="grid grid--3">
          <article class="card">
            <div class="card__body">
              <span class="card__meta">01 · Written Clarity</span>
              <h3 class="card__title">Plain-Language Inspection Notes</h3>
              <p class="card__text">
                Instead of vague verbal guesses, we explain what was observed on your roof, flashing, and decking so you can compare repair and replacement choices calmly.
              </p>
            </div>
          </article>
          <article class="card">
            <div class="card__body">
              <span class="card__meta">02 · Property Respect</span>
              <h3 class="card__title">Clean Staging &amp; Nail Sweeps</h3>
              <p class="card__text">
                Protecting flowerbeds, patios, and driveways during tear-off and finishing with thorough debris haul-away and magnetic fastener checks are standard on every job.
              </p>
            </div>
          </article>
          <article class="card">
            <div class="card__body">
              <span class="card__meta">03 · Verified Feedback</span>
              <h3 class="card__title">Share Your Project Experience</h3>
              <p class="card__text">
                Verified customer testimonials from Oakley and East Contra Costa homeowners will be published here as completed project reviews are collected directly from clients.
              </p>
              <a class="card__link" href="${hrefFor(depth, 'contact')}">Schedule Your Estimate &rarr;</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Frequently Asked Questions -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Frequently Asked Questions</span>
          <h2>Common Roofing Questions in Oakley, CA</h2>
        </div>
        ${renderFaqList(homeFaqs, 'home-faq')}
        <div class="mt-4">
          <a class="btn btn--outline-dark" href="${hrefFor(depth, 'faq')}">Read All Roofing FAQs</a>
        </div>
      </div>
    </section>

    <!-- Final Estimate CTA + Oakley Map -->
    <section class="section section--surface">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">Oakley, California</span>
            <h2>Ready for an Honest Roof Inspection?</h2>
            <p>
              Call All American Roofing directly at <a class="tabular-nums" href="${PHONE_HREF}"><strong>${PHONE_DISPLAY}</strong></a> or complete the estimate request form on our Contact page to schedule an on-site roof evaluation in Oakley or confirm nearby availability.
            </p>
            <div class="hero__actions mt-4">
              <a class="btn btn--primary tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
              <a class="btn btn--navy" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
            </div>
          </div>
          <div>
            ${renderMapEmbed('Oakley,+CA,+USA', 'Oakley, CA, USA')}
          </div>
        </div>
      </div>
    </section>
  </main>
${renderFooter(depth)}`;

  writePage('/', html);
}

/* ============================================================================
   2. ABOUT PAGE (/about/)
   ============================================================================ */
function buildAboutPage() {
  const depth = 1;
  const canonical = canonicalUrl('about');
  const crumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'About Us', path: 'about', canonical }
  ];

  const html = `${renderHead({
    title: 'About All American Roofing | Oakley, CA Roofing Contractor',
    description:
      'Learn about All American Roofing in Oakley, CA—our residential and commercial roofing standards, inspection-first approach, and local East Contra Costa focus. Call (855) 235-0472.',
    canonical,
    depth,
    schemas: [localBusinessSchema(), breadcrumbSchema(crumbs)]
  })}
${renderHeader(depth, 'about')}
  <main id="main-content">
    <section class="page-hero page-hero--split">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <div class="page-hero__grid">
          <div>
            <h1>About All American Roofing in Oakley, CA</h1>
            <p class="page-hero__lead">
              Dedicated to straightforward roof diagnostics, solid flashing and decking workmanship, and dependable residential and commercial roofing across Oakley, California.
            </p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
              <a class="btn btn--outline-light tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
            </div>
          </div>
          <div class="page-hero__media">
            <img
              src="${assetFor(depth, 'assets/images/about/all-american-roofing-crew.jpg')}"
              alt="All American Roofing team standing in front of a service vehicle in California"
              width="1200"
              height="896"
              loading="eager" />
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">Our Approach</span>
            <h2>Practical Roofing Built Around Honest Inspections</h2>
            <p>
              Homeowners and property managers rarely need sales pressure—they need clear facts about what is happening on their roof. At All American Roofing, every job begins with an evaluation of shingles or tiles, metal flashing seams, pipe boots, valleys, and accessible attic framing.
            </p>
            <p>
              Because Oakley sits where intense summer Central Valley heat meets gusty Delta breezes and winter Pacific storms, roofs here fail fastest at poorly flashed transitions and under-ventilated attics. We focus on getting those foundational details right.
            </p>
          </div>
          <div>
            <span class="eyebrow">What You Can Expect</span>
            <h3>Core Workmanship Standards</h3>
            <ul class="check-list">
              <li>Clear written repair or replacement scopes before any work begins</li>
              <li>Full tear-off inspection of plywood or OSB roof decking during replacements</li>
              <li>Upgraded galvanized or corrosion-resistant step, valley, and counter flashing</li>
              <li>Respectful staging, tarped landscaping, and daily magnetic nail sweeps</li>
              <li>Direct phone communication at <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Where We Operate</span>
          <h2>Based in Oakley, California</h2>
          <p>
            Oakley, CA is our primary service market, with proposed service coverage available upon confirmation for surrounding East Contra Costa communities including Brentwood, Antioch, Discovery Bay, Knightsen, Bethel Island, and Pittsburg.
          </p>
        </div>
        <div class="hero__actions">
          <a class="btn btn--navy" href="${hrefFor(depth, 'services')}">Explore Roofing Services</a>
          <a class="btn btn--outline-dark" href="${hrefFor(depth, 'service-areas')}">View Service Areas</a>
        </div>
      </div>
    </section>

    ${renderCtaBanner(depth)}
  </main>
${renderFooter(depth)}`;

  writePage('about', html);
}

/* ============================================================================
   3. SERVICES OVERVIEW PAGE (/services/)
   ============================================================================ */
function buildServicesOverviewPage() {
  const depth = 1;
  const canonical = canonicalUrl('services');
  const crumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'Roofing Services', path: 'services', canonical }
  ];

  const cardsHtml = SERVICES.map(
    (s) => `<article class="card" data-category="${escapeHtml(s.category)}">
          <div class="card__media">
            <img
              src="${assetFor(depth, s.image)}"
              alt="${escapeHtml(s.imageAlt)}"
              width="1200"
              height="896"
              loading="lazy" />
          </div>
          <div class="card__body">
            <span class="card__meta">Oakley, CA · ${escapeHtml(s.category.charAt(0).toUpperCase() + s.category.slice(1))}</span>
            <h2 class="card__title">${escapeHtml(s.shortName)}</h2>
            <p class="card__text">${escapeHtml(s.heroLead)}</p>
            <a class="card__link" href="${hrefFor(depth, s.slug)}">Learn About ${escapeHtml(s.shortName)} &rarr;</a>
          </div>
        </article>`
  ).join('\n        ');

  const html = `${renderHead({
    title: 'Roofing Services in Oakley, CA | All American Roofing',
    description:
      'Complete residential and commercial roofing services in Oakley, CA: roof repair, replacement, installation, inspection, shingle, tile, metal, flat roofing & gutters. Call (855) 235-0472.',
    canonical,
    depth,
    schemas: [localBusinessSchema(), breadcrumbSchema(crumbs)]
  })}
${renderHeader(depth, 'services')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <h1>Roofing Services in Oakley, CA</h1>
        <p class="page-hero__lead" style="max-width: 58ch;">
          Explore residential, commercial, repair, replacement, and gutter services offered by All American Roofing. Exact material options and service availability for your property are confirmed during your estimate.
        </p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
          <a class="btn btn--outline-light tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="filter-bar" data-filter-bar data-filter-target="#services-grid .card" role="group" aria-label="Filter roofing services">
          <button class="filter-tab is-active" type="button" data-filter="all" aria-pressed="true">All 15 Services</button>
          <button class="filter-tab" type="button" data-filter="repairs" aria-pressed="false">Repairs &amp; Inspections</button>
          <button class="filter-tab" type="button" data-filter="installations" aria-pressed="false">Replacements &amp; Installs</button>
          <button class="filter-tab" type="button" data-filter="systems" aria-pressed="false">Roofing Systems</button>
          <button class="filter-tab" type="button" data-filter="gutters" aria-pressed="false">Gutters</button>
        </div>

        <div id="services-grid" class="grid grid--3">
          ${cardsHtml}
        </div>
      </div>
    </section>

    ${renderCtaBanner(depth)}
  </main>
${renderFooter(depth)}`;

  writePage('services', html);
}

/* ============================================================================
   4. PROJECTS PAGE (/projects/)
   ============================================================================ */
function buildProjectsPage() {
  const depth = 1;
  const canonical = canonicalUrl('projects');
  const crumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'Our Projects', path: 'projects', canonical }
  ];

  const projects = [
    {
      cat: 'residential',
      img: 'assets/images/projects/oakley-shingle-project.jpg',
      alt: 'Residential home with newly installed dark charcoal architectural shingle roof in Oakley, CA',
      meta: 'Residential · Architectural Shingles',
      title: 'Full Tear-Off Architectural Shingle System',
      desc: 'Complete removal of worn composition layers, sheathing inspection, synthetic underlayment, new galvanized drip edge, valley metal, and ventilated ridge caps.',
      linkSlug: 'shingle-roofing'
    },
    {
      cat: 'residential',
      img: 'assets/images/projects/brentwood-tile-project.jpg',
      alt: 'Two-story residential property with restored concrete S-tile roof and clean ridge caps',
      meta: 'Residential · Concrete Tile',
      title: 'Two-Story Concrete Tile Underlayment Renewal',
      desc: 'Careful stacking of intact field tiles, replacement of deteriorated felt with heavy-duty underlayment, fresh valley metal, and matched replacement tiles.',
      linkSlug: 'tile-roofing'
    },
    {
      cat: 'commercial',
      img: 'assets/images/projects/commercial-flat-project.jpg',
      alt: 'Commercial retail and office building with white flat roof membrane and perimeter metal coping',
      meta: 'Commercial · Low-Slope Membrane',
      title: 'Commercial Flat Roof & Scupper Drainage Upgrade',
      desc: 'White reflective single-ply membrane installation with sealed parapet coping, clean drainage scuppers, and watertight curb transitions.',
      linkSlug: 'commercial-roofing'
    },
    {
      cat: 'residential',
      img: 'assets/images/metal-roofing/standing-seam-metal-roof.jpg',
      alt: 'Modern residence fitted with dark charcoal standing seam metal roof panels',
      meta: 'Residential · Standing Seam Metal',
      title: 'Concealed-Fastener Standing Seam Metal Roof',
      desc: 'High-temperature underlayment paired with crisp matte-charcoal standing seam steel panels and custom-hemmed eave and valley trim.',
      linkSlug: 'metal-roofing'
    },
    {
      cat: 'residential',
      img: 'assets/images/roof-repair/roof-repair-flashing.jpg',
      alt: 'Technician installing galvanized chimney step flashing and woven shingles',
      meta: 'Repair · Chimney & Flashing',
      title: 'Chimney Step Flashing & Slope Repair',
      desc: 'Removal of failed mastics and cracked shingles around a masonry chimney, rebuilt with proper metal step flashing and matched architectural courses.',
      linkSlug: 'roof-repair'
    },
    {
      cat: 'commercial',
      img: 'assets/images/commercial-roofing/commercial-tpo-roof.jpg',
      alt: 'Clean heat-welded TPO flat commercial roof with HVAC equipment curbs',
      meta: 'Commercial · TPO & HVAC Curbs',
      title: 'Heat-Welded Commercial TPO Roof Assembly',
      desc: 'Continuous single-ply TPO membrane system engineered to reduce rooftop summer heat and seal mechanical penetrations.',
      linkSlug: 'flat-roofing'
    }
  ];

  const cardsHtml = projects
    .map(
      (p) => `<article class="card" data-category="${p.cat}">
          <div class="card__media">
            <img src="${assetFor(depth, p.img)}" alt="${escapeHtml(p.alt)}" width="1200" height="896" loading="lazy" />
          </div>
          <div class="card__body">
            <span class="card__meta">${escapeHtml(p.meta)}</span>
            <h2 class="card__title">${escapeHtml(p.title)}</h2>
            <p class="card__text">${escapeHtml(p.desc)}</p>
            <a class="card__link" href="${hrefFor(depth, p.linkSlug)}">Related Service Details &rarr;</a>
          </div>
        </article>`
    )
    .join('\n        ');

  const html = `${renderHead({
    title: 'Roofing Projects & Work Showcase | All American Roofing Oakley, CA',
    description:
      'Review residential shingle, concrete tile, standing seam metal, and commercial flat roofing project capabilities from All American Roofing in Oakley, CA.',
    canonical,
    depth,
    schemas: [localBusinessSchema(), breadcrumbSchema(crumbs)]
  })}
${renderHeader(depth, 'projects')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <h1>Our Roofing Work &amp; System Capabilities</h1>
        <p class="page-hero__lead" style="max-width: 58ch;">
          Explore the residential and commercial roofing assemblies we inspect, repair, and install across Oakley and neighboring East Contra Costa communities.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="filter-bar" data-filter-bar data-filter-target="#projects-grid .card" role="group" aria-label="Filter roofing projects">
          <button class="filter-tab is-active" type="button" data-filter="all" aria-pressed="true">All Work</button>
          <button class="filter-tab" type="button" data-filter="residential" aria-pressed="false">Residential Roofing</button>
          <button class="filter-tab" type="button" data-filter="commercial" aria-pressed="false">Commercial &amp; Flat</button>
        </div>

        <div id="projects-grid" class="grid grid--3">
          ${cardsHtml}
        </div>
      </div>
    </section>

    ${renderCtaBanner(depth, 'Planning a Roofing Project in Oakley?', 'Call All American Roofing to arrange an inspection and discuss materials suited to your home or commercial building.')}
  </main>
${renderFooter(depth)}`;

  writePage('projects', html);
}

/* ============================================================================
   5. SERVICE AREAS OVERVIEW (/service-areas/)
   ============================================================================ */
function buildServiceAreasPage() {
  const depth = 1;
  const canonical = canonicalUrl('service-areas');
  const crumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'Service Areas', path: 'service-areas', canonical }
  ];

  const oakleyCards = OAKLEY_NEIGHBORHOODS.map(
    (a) => `<a class="directory-link" href="${hrefFor(depth, `areas/${a.slug}`)}">
          <span class="directory-link__title">${escapeHtml(a.name)}</span>
          <span class="directory-link__sub">${a.isPrimaryHub ? 'Primary Oakley Hub' : 'Proposed Neighborhood Page'} &rarr;</span>
        </a>`
  ).join('\n        ');

  const cityCards = NEARBY_CITIES.map(
    (c) => `<a class="directory-link" href="${hrefFor(depth, `areas/${c.slug}`)}">
          <span class="directory-link__title">${escapeHtml(c.name)}</span>
          <span class="directory-link__sub">Confirm East County availability &rarr;</span>
        </a>`
  ).join('\n        ');

  const html = `${renderHead({
    title: 'Service Areas | Oakley, CA & East Contra Costa Roofing',
    description:
      'All American Roofing serves Oakley, CA neighborhoods and nearby East Contra Costa communities. Call (855) 235-0472 to confirm roofing availability for your address.',
    canonical,
    depth,
    schemas: [localBusinessSchema(), breadcrumbSchema(crumbs)]
  })}
${renderHeader(depth, 'service-areas')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <h1>Oakley &amp; East Contra Costa Service Areas</h1>
        <p class="page-hero__lead" style="max-width: 60ch;">
          Oakley, California is our primary target market. Neighborhood and surrounding city pages below outline proposed East County coverage—call <a class="tabular-nums" style="color: #fff; font-weight: 700;" href="${PHONE_HREF}">${PHONE_DISPLAY}</a> to confirm availability for your property.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Primary Market</span>
          <h2>Oakley, CA &amp; Neighborhood Pages</h2>
          <p>Explore local roofing considerations across Oakley communities.</p>
        </div>
        <div class="directory-grid">
          ${oakleyCards}
        </div>

        <div class="section-header mt-6">
          <span class="eyebrow">Surrounding Communities</span>
          <h2>Nearby Cities Around Oakley (Confirm Availability)</h2>
          <p>These proposed nearby city pages help East Contra Costa property owners inquire about project scheduling near Oakley.</p>
        </div>
        <div class="directory-grid">
          ${cityCards}
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">Central Hub</span>
            <h2>Based in Oakley, California</h2>
            <p>
              From our Oakley hub, we evaluate residential and commercial roofs throughout town and respond to qualified inquiries across nearby Highway 4 and Delta communities.
            </p>
            <a class="btn btn--primary tabular-nums mt-2" href="${PHONE_HREF}">Call ${PHONE_DISPLAY} to Confirm Your Street</a>
          </div>
          <div>
            ${renderMapEmbed('Oakley,+CA,+USA', 'Oakley, CA, USA')}
          </div>
        </div>
      </div>
    </section>

    ${renderCtaBanner(depth)}
  </main>
${renderFooter(depth)}`;

  writePage('service-areas', html);
}

/* ============================================================================
   6. CONTACT PAGE (/contact/)
   ============================================================================ */
function buildContactPage() {
  const depth = 1;
  const canonical = canonicalUrl('contact');
  const crumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'Contact Us', path: 'contact', canonical }
  ];

  const html = `${renderHead({
    title: 'Contact All American Roofing | Free Roof Estimate in Oakley, CA',
    description:
      'Request a roof repair, replacement, or inspection estimate in Oakley, CA from All American Roofing. Call (855) 235-0472 or submit our estimate form.',
    canonical,
    depth,
    schemas: [localBusinessSchema(), breadcrumbSchema(crumbs)]
  })}
${renderHeader(depth, 'contact')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <h1>Contact All American Roofing</h1>
        <p class="page-hero__lead" style="max-width: 58ch;">
          Call <a class="tabular-nums" style="color: #fff; font-weight: 700;" href="${PHONE_HREF}">${PHONE_DISPLAY}</a> or fill out the estimate request form below to schedule a roof inspection in Oakley, CA or confirm availability in nearby communities.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split" style="align-items: start;">
          <div>
            <span class="eyebrow">Estimate Request</span>
            <h2>Request Your Free Roofing Estimate</h2>
            <p>Share your property location and roofing concern below. Required fields are validated immediately.</p>
            ${renderEstimateForm()}
          </div>

          <div>
            <span class="eyebrow">Direct Contact &amp; Location</span>
            <h2>Oakley, CA Roofing Inquiries</h2>
            <div class="form-card mb-0" style="margin-bottom: 1.5rem;">
              <p><strong>Business Name:</strong> ${BUSINESS_NAME}</p>
              <p><strong>Phone:</strong> <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a></p>
              <p><strong>Primary Location:</strong> Oakley, CA, USA</p>
              <p class="mb-0"><strong>Website:</strong> https://allamericanroofing.homes</p>
            </div>
            ${renderMapEmbed('Oakley,+CA,+USA', 'Oakley, CA, USA')}
          </div>
        </div>
      </div>
    </section>
  </main>
${renderFooter(depth)}`;

  writePage('contact', html);
}

/* ============================================================================
   7. FAQ PAGE (/faq/)
   ============================================================================ */
function buildFaqPage() {
  const depth = 1;
  const canonical = canonicalUrl('faq');
  const crumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'FAQ', path: 'faq', canonical }
  ];

  const allFaqs = [
    {
      q: 'How do I schedule a roof inspection or estimate in Oakley, CA?',
      a: 'Call All American Roofing directly at (855) 235-0472 or submit your property location and roof details through our Contact page.'
    },
    {
      q: 'When can a roof be repaired instead of replaced?',
      a: 'Targeted roof repair makes sense when damage is isolated—such as wind-lifted shingles, a split plumbing vent boot, chimney flashing wear, or a few cracked concrete tiles—while the rest of the roof retains solid life.'
    },
    {
      q: 'What signs indicate my Oakley roof may need full replacement?',
      a: 'Heavy granule accumulation in gutters, widespread curling or brittle shingles, multiple recurring leaks, soft plywood decking, or aging underlayment beneath 20+ year old roofs often point toward replacement.'
    },
    {
      q: 'What roofing materials do you work with?',
      a: 'We evaluate and service architectural asphalt shingles, concrete and clay tile roofs, standing seam metal roofing, and low-slope TPO or modified bitumen flat roofs.'
    },
    {
      q: 'Do you work on tile roof underlayment without replacing intact concrete tiles?',
      a: 'Yes, when concrete tiles are structurally sound, a tile lift-and-reset replaces the worn felt underlayment and metal flashing underneath before resetting your tiles.'
    },
    {
      q: 'Do you inspect and repair commercial flat roofs?',
      a: 'Yes, we evaluate commercial low-slope buildings, checking TPO or modified bitumen seams, parapet coping, HVAC curbs, and drainage scuppers.'
    },
    {
      q: 'Do you cover cities outside Oakley like Brentwood, Antioch, or Discovery Bay?',
      a: 'Oakley, CA is our primary target market. Nearby communities including Brentwood, Antioch, Discovery Bay, Knightsen, Bethel Island, and Pittsburg are proposed nearby coverage areas—please call (855) 235-0472 to confirm availability for your address.'
    },
    {
      q: 'Do you handle gutter installation and gutter repair?',
      a: 'Yes, we evaluate gutters, downspouts, fascia attachment, and drip-edge integration alongside roof work or as standalone drainage projects where confirmed during inspection.'
    }
  ];

  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    }
  ];

  const html = `${renderHead({
    title: 'Roofing FAQ | All American Roofing in Oakley, CA',
    description:
      'Answers to common roofing questions in Oakley, CA covering roof repairs, replacements, tile underlayment, inspections, gutters, and service areas.',
    canonical,
    depth,
    schemas
  })}
${renderHeader(depth, 'faq')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <h1>Frequently Asked Roofing Questions</h1>
        <p class="page-hero__lead" style="max-width: 58ch;">
          Clear answers about roof inspections, repairs, full replacements, materials, and scheduling in Oakley and surrounding communities.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${renderFaqList(allFaqs, 'main-faq')}
      </div>
    </section>

    ${renderCtaBanner(depth, 'Still Have Questions About Your Roof?', 'Call (855) 235-0472 to speak directly with our Oakley roofing team.')}
  </main>
${renderFooter(depth)}`;

  writePage('faq', html);
}

/* ============================================================================
   8. PRIVACY POLICY (/privacy-policy/) & TERMS (/terms/)
   ============================================================================ */
function buildLegalPages() {
  const depth = 1;
  const privacyCanonical = canonicalUrl('privacy-policy');
  const privacyCrumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'Privacy Policy', path: 'privacy-policy', canonical: privacyCanonical }
  ];

  const privacyHtml = `${renderHead({
    title: 'Privacy Policy | All American Roofing',
    description: 'Privacy Policy for All American Roofing (https://allamericanroofing.homes) in Oakley, CA.',
    canonical: privacyCanonical,
    depth,
    schemas: [breadcrumbSchema(privacyCrumbs)]
  })}
${renderHeader(depth, 'privacy-policy')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, privacyCrumbs)}
        <h1>Privacy Policy</h1>
        <p class="page-hero__lead">How All American Roofing handles contact and estimate inquiry information.</p>
      </div>
    </section>

    <section class="section">
      <div class="container legal-prose">
        <p><strong>Effective Date:</strong> November 2026</p>
        <p>
          All American Roofing ("we", "our", or "us") respects your privacy. This Privacy Policy describes how information submitted through <strong>https://allamericanroofing.homes</strong> or shared by telephone at <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a> is used.
        </p>

        <h2>Information We Collect</h2>
        <p>When you request a roofing estimate or contact us, you may provide:</p>
        <ul>
          <li>Full name and contact details (phone number and email address)</li>
          <li>Property city, neighborhood, or service location in Oakley, CA or nearby communities</li>
          <li>Details describing your requested roofing service or roof condition</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to roof repair, replacement, inspection, or gutter estimate inquiries</li>
          <li>To confirm service area eligibility and inspection scheduling</li>
          <li>To communicate clearly regarding your roofing project</li>
        </ul>
        <p>We do not sell or rent your personal contact details to third-party marketing brokers.</p>

        <h2>Third-Party Embeds</h2>
        <p>
          Certain pages embed Google Maps location frames for Oakley, CA and nearby cities so visitors can view general service geography. Interacting with embedded maps is governed by Google’s privacy practices.
        </p>

        <h2>Contact Regarding Privacy</h2>
        <p>
          If you have questions about this Privacy Policy or wish to update or remove submitted inquiry details, please call <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a>.
        </p>
      </div>
    </section>
  </main>
${renderFooter(depth)}`;

  writePage('privacy-policy', privacyHtml);

  const termsCanonical = canonicalUrl('terms');
  const termsCrumbs = [
    { label: 'Home', path: '/', canonical: canonicalUrl('/') },
    { label: 'Terms and Conditions', path: 'terms', canonical: termsCanonical }
  ];

  const termsHtml = `${renderHead({
    title: 'Terms and Conditions | All American Roofing',
    description: 'Terms and Conditions for using the All American Roofing website (https://allamericanroofing.homes).',
    canonical: termsCanonical,
    depth,
    schemas: [breadcrumbSchema(termsCrumbs)]
  })}
${renderHeader(depth, 'terms')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container">
        ${renderBreadcrumbs(depth, termsCrumbs)}
        <h1>Terms and Conditions</h1>
        <p class="page-hero__lead">Terms governing use of https://allamericanroofing.homes.</p>
      </div>
    </section>

    <section class="section">
      <div class="container legal-prose">
        <p><strong>Effective Date:</strong> November 2026</p>
        <p>
          By accessing <strong>https://allamericanroofing.homes</strong>, you agree to these Terms and Conditions. All information on this website is provided by All American Roofing (Oakley, CA, USA) for general informational and estimate-inquiry purposes.
        </p>

        <h2>Estimates &amp; Service Scope</h2>
        <ul>
          <li>Website descriptions of roofing services, materials, and neighborhood or city pages do not constitute a binding contract or guaranteed scheduling commitment.</li>
          <li>Actual repair or replacement scope, material availability, pricing, and timelines are confirmed in writing only after an on-site property evaluation.</li>
          <li>Service coverage outside Oakley, CA is subject to confirmation based on project type and crew scheduling.</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          All website text, branding, and visual layouts on this domain belong to All American Roofing and may not be republished without permission.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Roofing maintenance tips and informational content on this website are not a substitute for an on-site professional roof inspection. Do not climb onto steep, wet, or damaged roofs without proper safety training and fall protection.
        </p>

        <h2>Contact Information</h2>
        <p>
          Questions regarding these Terms and Conditions may be directed to All American Roofing by phone at <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a>.
        </p>
      </div>
    </section>
  </main>
${renderFooter(depth)}`;

  writePage('terms', termsHtml);
}

/* ============================================================================
   9. ALL 15 ROOFING SERVICE PAGES (/<service-slug>/)
   ============================================================================ */
function buildServicePages() {
  const depth = 1;
  SERVICES.forEach((s) => {
    const canonical = canonicalUrl(s.slug);
    const crumbs = [
      { label: 'Home', path: '/', canonical: canonicalUrl('/') },
      { label: 'Services', path: 'services', canonical: canonicalUrl('services') },
      { label: s.shortName, path: s.slug, canonical }
    ];

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.h1,
      serviceType: s.shortName,
      description: s.metaDescription,
      url: canonical,
      provider: {
        '@type': 'RoofingContractor',
        name: BUSINESS_NAME,
        telephone: '+1-855-235-0472',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Oakley',
          addressRegion: 'CA',
          addressCountry: 'US'
        }
      },
      areaServed: {
        '@type': 'City',
        name: 'Oakley, CA'
      }
    };

    const problemsHtml = s.problems
      .map(
        (p) => `<article class="card">
            <div class="card__body">
              <h3 class="card__title">${escapeHtml(p.title)}</h3>
              <p class="card__text mb-0">${escapeHtml(p.detail)}</p>
            </div>
          </article>`
      )
      .join('\n          ');

    const processHtml = s.process
      .map(
        (step) => `<div class="process-step">
            <span class="process-step__num">${escapeHtml(step.step)}. Step</span>
            <h3>${escapeHtml(step.title)}</h3>
            <p class="mb-0">${escapeHtml(step.text)}</p>
          </div>`
      )
      .join('\n          ');

    const benefitsHtml = s.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join('\n              ');

    const relatedHtml = s.related
      .map((relSlug) => {
        const rel = SERVICES.find((item) => item.slug === relSlug);
        if (!rel) return '';
        return `<a class="directory-link" href="${hrefFor(depth, rel.slug)}">
            <span class="directory-link__title">${escapeHtml(rel.shortName)}</span>
            <span class="directory-link__sub">Oakley ${escapeHtml(rel.shortName)} &rarr;</span>
          </a>`;
      })
      .filter(Boolean)
      .join('\n          ');

    const areaLinks = ['oakley-ca', 'summer-lake-oakley-ca', 'emerson-ranch-oakley-ca', 'brentwood-ca', 'antioch-ca', 'discovery-bay-ca']
      .map((slug) => {
        const area = [...OAKLEY_NEIGHBORHOODS, ...NEARBY_CITIES].find((a) => a.slug === slug);
        if (!area) return '';
        return `<a class="directory-link" href="${hrefFor(depth, `areas/${area.slug}`)}">
            <span class="directory-link__title">${escapeHtml(area.name)}</span>
            <span class="directory-link__sub">Area roofing details &rarr;</span>
          </a>`;
      })
      .join('\n          ');

    const html = `${renderHead({
      title: s.title,
      description: s.metaDescription,
      canonical,
      depth,
      ogImage: s.image,
      schemas: [localBusinessSchema(), serviceSchema, breadcrumbSchema(crumbs)]
    })}
${renderHeader(depth, s.slug)}
  <main id="main-content">
    <section class="page-hero page-hero--split">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <div class="page-hero__grid">
          <div>
            <h1>${escapeHtml(s.h1)}</h1>
            <p class="page-hero__lead">${escapeHtml(s.heroLead)}</p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
              <a class="btn btn--outline-light tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
            </div>
          </div>
          <div class="page-hero__media">
            <img
              src="${assetFor(depth, s.image)}"
              alt="${escapeHtml(s.imageAlt)}"
              width="1200"
              height="896"
              loading="eager" />
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Service Overview</span>
          <h2>${escapeHtml(s.shortName)} Tailored to Oakley Properties</h2>
          ${s.intro.map((para) => `<p>${escapeHtml(para)}</p>`).join('\n          ')}
        </div>

        <h2 class="mt-6">Common Problems Addressed by ${escapeHtml(s.shortName)}</h2>
        <div class="grid grid--2 mt-4">
          ${problemsHtml}
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">How We Work</span>
          <h2>Our ${escapeHtml(s.shortName)} Process</h2>
        </div>
        <div class="process-grid">
          ${processHtml}
        </div>

        <div class="split mt-6">
          <div class="form-card">
            <h3>Materials &amp; Scope Confirmation</h3>
            <p>${escapeHtml(s.materialsNote)}</p>
            <p class="mb-0"><strong>Note:</strong> Specific product lines, warranty paperwork, and scheduling for your address are confirmed directly during your on-site estimate.</p>
          </div>
          <div class="form-card">
            <h3>Benefits of Professional ${escapeHtml(s.shortName)}</h3>
            <ul class="check-list mb-0">
              ${benefitsHtml}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Why All American Roofing</span>
          <h2>Straightforward Oakley Craftsmanship</h2>
          <p>
            We focus on clear communication, neat site staging, thorough flashing and underlayment details, and honest repair-versus-replacement advice. Call <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a> to discuss your roof.
          </p>
        </div>

        <h3>Related Roofing Services</h3>
        <div class="directory-grid mt-2">
          ${relatedHtml}
        </div>

        <h3 class="mt-6">Oakley &amp; Nearby Communities</h3>
        <div class="directory-grid mt-2">
          ${areaLinks}
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Service FAQs</span>
          <h2>${escapeHtml(s.shortName)} Questions &amp; Answers</h2>
        </div>
        ${renderFaqList(s.faqs, `${s.slug}-faq`)}
      </div>
    </section>

    ${renderCtaBanner(depth, `Need ${s.shortName} in Oakley, CA?`, `Call All American Roofing at ${PHONE_DISPLAY} or request a written estimate online.`)}
  </main>
${renderFooter(depth)}`;

    writePage(s.slug, html);
  });
}

/* ============================================================================
   10. ALL 14 AREA PAGES (/areas/<slug>/)
   ============================================================================ */
function buildAreaPages() {
  const depth = 2;
  const allAreas = [
    ...OAKLEY_NEIGHBORHOODS.map((a) => ({ ...a, type: 'oakley' })),
    ...NEARBY_CITIES.map((c) => ({ ...c, type: 'city', isPrimaryHub: false }))
  ];

  allAreas.forEach((area) => {
    const route = `areas/${area.slug}`;
    const canonical = canonicalUrl(route);
    const crumbs = [
      { label: 'Home', path: '/', canonical: canonicalUrl('/') },
      { label: 'Service Areas', path: 'service-areas', canonical: canonicalUrl('service-areas') },
      { label: area.name, path: route, canonical }
    ];

    const areaServices = [
      'roof-repair',
      'roof-replacement',
      'roof-inspection',
      'shingle-roofing',
      'tile-roofing',
      'metal-roofing',
      'commercial-roofing',
      'gutter-installation'
    ]
      .map((slug) => SERVICES.find((s) => s.slug === slug))
      .filter(Boolean)
      .map(
        (s) => `<a class="directory-link" href="${hrefFor(depth, s.slug)}">
            <span class="directory-link__title">${escapeHtml(s.shortName)}</span>
            <span class="directory-link__sub">View service details &rarr;</span>
          </a>`
      )
      .join('\n          ');

    const relatedLinks = area.nearbyLinks
      .map((slug) => {
        const foundArea = allAreas.find((a) => a.slug === slug);
        if (foundArea) {
          return `<a class="directory-link" href="${hrefFor(depth, `areas/${foundArea.slug}`)}">
              <span class="directory-link__title">${escapeHtml(foundArea.name)}</span>
              <span class="directory-link__sub">Explore area coverage &rarr;</span>
            </a>`;
        }
        const foundService = SERVICES.find((s) => s.slug === slug);
        if (foundService) {
          return `<a class="directory-link" href="${hrefFor(depth, foundService.slug)}">
              <span class="directory-link__title">${escapeHtml(foundService.shortName)}</span>
              <span class="directory-link__sub">Explore service details &rarr;</span>
            </a>`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n          ');

    const html = `${renderHead({
      title: area.title,
      description: area.metaDescription,
      canonical,
      depth,
      ogImage: area.image,
      schemas: [localBusinessSchema(), breadcrumbSchema(crumbs)]
    })}
${renderHeader(depth, area.slug)}
  <main id="main-content">
    <section class="page-hero page-hero--split">
      <div class="container">
        ${renderBreadcrumbs(depth, crumbs)}
        <div class="page-hero__grid">
          <div>
            <h1>${escapeHtml(area.h1)}</h1>
            <p class="page-hero__lead">${escapeHtml(area.heroLead)}</p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="${hrefFor(depth, 'contact')}">Request Estimate</a>
              <a class="btn btn--outline-light tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
            </div>
          </div>
          <div class="page-hero__media">
            <img
              src="${assetFor(depth, area.image)}"
              alt="${escapeHtml(area.imageAlt)}"
              width="1200"
              height="896"
              loading="eager" />
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">${area.isPrimaryHub ? 'Primary Service Hub' : 'Local Service Overview'}</span>
            <h2>Roofing Considerations in ${escapeHtml(area.name)}</h2>
            ${area.intro.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n            ')}
            <div class="form-card mt-4">
              <p class="mb-0"><strong>Coverage Note:</strong> ${escapeHtml(area.coverageNote)}</p>
            </div>
          </div>
          <div>
            <h3>Local Weather &amp; Roof Factors</h3>
            <ul class="check-list">
              ${area.localContext.map((c) => `<li>${escapeHtml(c)}</li>`).join('\n              ')}
            </ul>
            ${renderMapEmbed(area.mapQuery, area.name)}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Roofing Services</span>
          <h2>Services Available to Discuss for ${escapeHtml(area.name)}</h2>
        </div>
        <div class="directory-grid">
          ${areaServices}
        </div>

        <h3 class="mt-6">Nearby Locations &amp; Related Pages</h3>
        <div class="directory-grid mt-2">
          ${relatedLinks}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Location FAQs</span>
          <h2>Frequently Asked Questions for ${escapeHtml(area.name)}</h2>
        </div>
        ${renderFaqList(area.faqs, `${area.slug}-faq`)}
      </div>
    </section>

    ${renderCtaBanner(depth, `Need a Roofing Estimate in ${area.name}?`, `Call ${PHONE_DISPLAY} to confirm availability and arrange an on-site roof evaluation.`)}
  </main>
${renderFooter(depth)}`;

    writePage(route, html);
  });
}

/* ============================================================================
   11. CUSTOM 404 PAGE (404.html)
   ============================================================================ */
function build404Page() {
  const depth = 0;
  const canonical = `${SITE_URL}/404.html`;
  const html = `${renderHead({
    title: 'Page Not Found | All American Roofing',
    description: 'The requested page could not be found on All American Roofing.',
    canonical,
    depth,
    robots: 'noindex, follow'
  })}
${renderHeader(depth, '')}
  <main id="main-content">
    <section class="section">
      <div class="container" style="max-width: 44rem; padding-block: 3rem;">
        <span class="eyebrow">404 Error</span>
        <h1>Page Not Found</h1>
        <p>
          The roofing page you requested may have moved or the web address may have been typed incorrectly. Use the links below to browse our Oakley roofing services or contact us directly.
        </p>
        <div class="hero__actions mt-4">
          <a class="btn btn--primary" href="${hrefFor(depth, '/')}">Return to Homepage</a>
          <a class="btn btn--navy" href="${hrefFor(depth, 'services')}">View Roofing Services</a>
          <a class="btn btn--outline-dark tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
        </div>
      </div>
    </section>
  </main>
${renderFooter(depth)}`;

  writeRawFile('404.html', html);
}

/* ============================================================================
   12. SITEMAP.XML (All Real Canonical Pages Only)
   ============================================================================ */
function buildSitemap() {
  const today = '2026-11-18';
  const urlsXml = generatedUrls
    .map((url) => {
      const priority = url === `${SITE_URL}/` ? '1.0' : url.includes('/areas/') ? '0.8' : '0.9';
      return `  <url>
    <loc>${escapeHtml(url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
  writeRawFile('sitemap.xml', xml);
}

/* ============================================================================
   RUN GENERATOR
   ============================================================================ */
buildHomepage();
buildAboutPage();
buildServicesOverviewPage();
buildProjectsPage();
buildServiceAreasPage();
buildContactPage();
buildFaqPage();
buildLegalPages();
buildServicePages();
buildAreaPages();
build404Page();
buildSitemap();

console.log(`Generated ${generatedUrls.length} canonical pages + 404.html + sitemap.xml in ${OUT_DIR}`);
