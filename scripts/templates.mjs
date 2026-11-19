import { SERVICES } from './data-services.mjs';
import { OAKLEY_NEIGHBORHOODS, NEARBY_CITIES } from './data-areas.mjs';

export const SITE_URL = 'https://allamericanroofing.homes';
export const PHONE_DISPLAY = '(855) 235-0472';
export const PHONE_HREF = 'tel:+18552350472';
export const BUSINESS_NAME = 'All American Roofing';

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function prefixForDepth(depth) {
  if (depth === 0) return '';
  return '../'.repeat(depth);
}

export function canonicalUrl(relPath) {
  if (!relPath || relPath === '/') return `${SITE_URL}/`;
  const cleaned = relPath.replace(/^\/+/, '').replace(/\/+$/, '');
  return `${SITE_URL}/${cleaned}/`;
}

export function hrefFor(depth, targetRelPath) {
  const prefix = prefixForDepth(depth);
  if (!targetRelPath || targetRelPath === '/') {
    return depth === 0 ? './' : prefix;
  }
  const cleaned = targetRelPath.replace(/^\/+/, '').replace(/\/+$/, '');
  return `${prefix}${cleaned}/`;
}

export function assetFor(depth, assetRelPath) {
  const prefix = prefixForDepth(depth);
  return `${prefix}${assetRelPath.replace(/^\/+/, '')}`;
}

export function logoSvg(className = 'brand-mark__icon') {
  return `<svg class="${className}" viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="10" fill="#0F1E36"/>
    <path d="M10 34L32 15L54 34" fill="none" stroke="#C83E2B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 36L32 22L48 36V50H16V36Z" fill="#FFFFFF"/>
    <path d="M27 50V39H37V50" fill="#0F1E36"/>
  </svg>`;
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: BUSINESS_NAME,
    url: `${SITE_URL}/`,
    telephone: '+1-855-235-0472',
    image: `${SITE_URL}/assets/images/hero/oakley-roofing-og.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Oakley',
      addressRegion: 'CA',
      addressCountry: 'US'
    },
    areaServed: {
      '@type': 'City',
      name: 'Oakley, CA'
    }
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.canonical
    }))
  };
}

export function renderHead({
  title,
  description,
  canonical,
  depth,
  ogImage = 'assets/images/hero/oakley-roofing-og.jpg',
  robots = 'index, follow',
  schemas = []
}) {
  const ogImgAbs = `${SITE_URL}/${ogImage.replace(/^\/+/, '')}`;
  const schemaTags = schemas
    .map((obj) => `  <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n  </script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="${escapeHtml(robots)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${BUSINESS_NAME}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(ogImgAbs)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImgAbs)}" />
  <link rel="icon" type="image/svg+xml" href="${assetFor(depth, 'assets/favicon/favicon.svg')}" />
  <link rel="icon" type="image/png" sizes="32x32" href="${assetFor(depth, 'assets/favicon/favicon-32x32.png')}" />
  <link rel="apple-touch-icon" sizes="180x180" href="${assetFor(depth, 'assets/favicon/apple-touch-icon.png')}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${assetFor(depth, 'assets/css/style.css')}" />
${schemaTags}
</head>`;
}

export function renderHeader(depth, activeKey) {
  const isServicesActive = activeKey === 'services' || SERVICES.some((s) => s.slug === activeKey);
  const isAreasActive =
    activeKey === 'service-areas' ||
    OAKLEY_NEIGHBORHOODS.some((a) => a.slug === activeKey) ||
    NEARBY_CITIES.some((a) => a.slug === activeKey);

  const serviceDropdownLinks = SERVICES.map(
    (s) =>
      `<a class="dropdown-link" href="${hrefFor(depth, s.slug)}"${activeKey === s.slug ? ' aria-current="page"' : ''}>${escapeHtml(s.shortName)}</a>`
  ).join('\n              ');

  const oakleyLinks = OAKLEY_NEIGHBORHOODS.map(
    (a) =>
      `<a class="dropdown-link" href="${hrefFor(depth, `areas/${a.slug}`)}"${activeKey === a.slug ? ' aria-current="page"' : ''}>${escapeHtml(a.name)}</a>`
  ).join('\n              ');

  const nearbyLinks = NEARBY_CITIES.map(
    (a) =>
      `<a class="dropdown-link" href="${hrefFor(depth, `areas/${a.slug}`)}"${activeKey === a.slug ? ' aria-current="page"' : ''}>${escapeHtml(a.name)}</a>`
  ).join('\n              ');

  const mobileServiceLinks = SERVICES.map(
    (s) => `<a href="${hrefFor(depth, s.slug)}">${escapeHtml(s.shortName)}</a>`
  ).join('\n            ');

  const mobileAreaLinks = [...OAKLEY_NEIGHBORHOODS, ...NEARBY_CITIES]
    .map((a) => `<a href="${hrefFor(depth, `areas/${a.slug}`)}">${escapeHtml(a.name)}</a>`)
    .join('\n            ');

  return `<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <div class="top-bar">
    <div class="container top-bar__inner">
      <div class="top-bar__location">
        <span>Serving Oakley, CA &amp; Nearby East Contra Costa Communities</span>
      </div>
      <div class="top-bar__actions">
        <a class="top-bar__link" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
        <a class="top-bar__link tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand-mark" href="${hrefFor(depth, '/')}">
        ${logoSvg()}
        <span>${BUSINESS_NAME}</span>
      </a>

      <nav class="primary-nav" aria-label="Main navigation">
        <ul class="nav-list">
          <li class="nav-item${activeKey === 'home' ? ' is-active' : ''}">
            <a class="nav-link" href="${hrefFor(depth, '/')}"${activeKey === 'home' ? ' aria-current="page"' : ''}>Home</a>
          </li>
          <li class="nav-item${activeKey === 'about' ? ' is-active' : ''}">
            <a class="nav-link" href="${hrefFor(depth, 'about')}"${activeKey === 'about' ? ' aria-current="page"' : ''}>About</a>
          </li>
          <li class="nav-item${isServicesActive ? ' is-active' : ''}" data-dropdown>
            <button class="nav-dropdown-trigger" type="button" aria-expanded="false" aria-controls="desktop-services-menu">
              <span>Services</span>
              <svg class="nav-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div class="dropdown-menu dropdown-menu--wide" id="desktop-services-menu">
              <div class="dropdown-heading">Roofing Services — <a href="${hrefFor(depth, 'services')}">View All Services</a></div>
              ${serviceDropdownLinks}
            </div>
          </li>
          <li class="nav-item${activeKey === 'projects' ? ' is-active' : ''}">
            <a class="nav-link" href="${hrefFor(depth, 'projects')}"${activeKey === 'projects' ? ' aria-current="page"' : ''}>Projects</a>
          </li>
          <li class="nav-item${isAreasActive ? ' is-active' : ''}" data-dropdown>
            <button class="nav-dropdown-trigger" type="button" aria-expanded="false" aria-controls="desktop-areas-menu">
              <span>Service Areas</span>
              <svg class="nav-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div class="dropdown-menu dropdown-menu--wide" id="desktop-areas-menu">
              <div class="dropdown-heading">Oakley Neighborhoods — <a href="${hrefFor(depth, 'service-areas')}">All Service Areas</a></div>
              ${oakleyLinks}
              <div class="dropdown-heading dropdown-heading--spaced">Nearby Cities (Confirm Availability)</div>
              ${nearbyLinks}
            </div>
          </li>
          <li class="nav-item${activeKey === 'faq' ? ' is-active' : ''}">
            <a class="nav-link" href="${hrefFor(depth, 'faq')}"${activeKey === 'faq' ? ' aria-current="page"' : ''}>FAQ</a>
          </li>
          <li class="nav-item${activeKey === 'contact' ? ' is-active' : ''}">
            <a class="nav-link" href="${hrefFor(depth, 'contact')}"${activeKey === 'contact' ? ' aria-current="page"' : ''}>Contact</a>
          </li>
        </ul>
      </nav>

      <div class="header-cta">
        <a class="header-phone-btn tabular-nums" href="${PHONE_HREF}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>${PHONE_DISPLAY}</span>
        </a>
        <button id="mobile-menu-toggle" class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav-drawer" aria-label="Toggle navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <div id="mobile-nav-drawer" class="mobile-nav-drawer" hidden>
    <nav aria-label="Mobile navigation">
      <ul class="mobile-nav-list">
        <li><a class="mobile-nav-link" href="${hrefFor(depth, '/')}">Home</a></li>
        <li><a class="mobile-nav-link" href="${hrefFor(depth, 'about')}">About</a></li>
        <li>
          <button class="mobile-submenu-toggle" type="button" aria-expanded="false" aria-controls="mobile-services-sub">
            <span>Services</span>
            <span aria-hidden="true">+</span>
          </button>
          <div id="mobile-services-sub" class="mobile-submenu" hidden>
            <a href="${hrefFor(depth, 'services')}">All Roofing Services</a>
            ${mobileServiceLinks}
          </div>
        </li>
        <li><a class="mobile-nav-link" href="${hrefFor(depth, 'projects')}">Projects</a></li>
        <li>
          <button class="mobile-submenu-toggle" type="button" aria-expanded="false" aria-controls="mobile-areas-sub">
            <span>Service Areas</span>
            <span aria-hidden="true">+</span>
          </button>
          <div id="mobile-areas-sub" class="mobile-submenu" hidden>
            <a href="${hrefFor(depth, 'service-areas')}">Service Areas Overview</a>
            ${mobileAreaLinks}
          </div>
        </li>
        <li><a class="mobile-nav-link" href="${hrefFor(depth, 'faq')}">FAQ</a></li>
        <li><a class="mobile-nav-link" href="${hrefFor(depth, 'contact')}">Contact</a></li>
      </ul>
      <div class="mobile-drawer-cta">
        <a class="btn btn--primary tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
        <a class="btn btn--navy" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
      </div>
    </nav>
  </div>`;
}

export function renderBreadcrumbs(depth, items) {
  const listItems = items
    .map((item, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast) {
        return `<li aria-current="page">${escapeHtml(item.label)}</li>`;
      }
      return `<li><a href="${hrefFor(depth, item.path)}">${escapeHtml(item.label)}</a></li>`;
    })
    .join('\n          ');

  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          ${listItems}
        </ol>
      </nav>`;
}

export function renderFaqList(faqs, prefix = 'faq') {
  return `<div class="faq-list">
        ${faqs
          .map((item, idx) => {
            const panelId = `${prefix}-panel-${idx + 1}`;
            return `<div class="faq-item">
          <button class="faq-trigger" type="button" aria-expanded="false" aria-controls="${panelId}">
            <span>${escapeHtml(item.q)}</span>
            <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div id="${panelId}" class="faq-panel" hidden>
            <p>${escapeHtml(item.a)}</p>
          </div>
        </div>`;
          })
          .join('\n        ')}
      </div>`;
}

export function renderCtaBanner(depth, heading = 'Schedule Your Oakley Roof Inspection or Estimate', subtext = 'Speak directly with All American Roofing for straightforward roof repair, replacement, or inspection options tailored to your property.') {
  return `<section class="section">
      <div class="container">
        <div class="cta-banner">
          <div>
            <h2>${escapeHtml(heading)}</h2>
            <p class="mb-0">${escapeHtml(subtext)}</p>
          </div>
          <div class="cta-banner__actions">
            <a class="btn btn--primary tabular-nums" href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a>
            <a class="btn btn--outline-light" href="${hrefFor(depth, 'contact')}">Request Free Estimate</a>
          </div>
        </div>
      </div>
    </section>`;
}

export function renderMapEmbed(query = 'Oakley,+CA,+USA', label = 'Oakley, CA, USA') {
  const src = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  const directHref = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return `<div class="map-embed-wrap">
        <iframe
          title="Map of ${escapeHtml(label)}"
          src="${src}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen></iframe>
        <div class="map-caption">
          <span>Area Map: ${escapeHtml(label)}</span>
          <a href="${directHref}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </div>
      </div>`;
}

export function renderEstimateForm(preselectedService = '') {
  const options = [
    'Roof Repair',
    'Roof Replacement',
    'Roof Installation',
    'Roof Inspection',
    'Roof Maintenance',
    'Roof Leak Repair',
    'Shingle Roofing',
    'Tile Roofing',
    'Metal Roofing',
    'Flat Roofing',
    'Storm Damage Roof Repair',
    'Commercial Roofing',
    'Residential Roofing',
    'Gutter Installation',
    'Gutter Repair'
  ];

  const optionHtml = options
    .map(
      (opt) =>
        `<option value="${escapeHtml(opt)}"${preselectedService === opt ? ' selected' : ''}>${escapeHtml(opt)}</option>`
    )
    .join('\n              ');

  return `<!-- Configure data-form-endpoint with a live form handler URL (e.g., Formspree or server endpoint) before production email delivery. -->
      <form id="estimate-form" class="form-card" data-form-endpoint="" novalidate>
        <div class="form-grid form-grid--2">
          <div class="form-field">
            <label class="form-label" for="full-name">Full Name *</label>
            <input class="form-control" id="full-name" name="fullName" type="text" autocomplete="name" required placeholder="Your full name" />
            <span id="full-name-error" class="field-error" aria-live="polite"></span>
          </div>
          <div class="form-field">
            <label class="form-label" for="phone">Phone Number *</label>
            <input class="form-control" id="phone" name="phone" type="tel" autocomplete="tel" required placeholder="(855) 235-0472" />
            <span id="phone-error" class="field-error" aria-live="polite"></span>
          </div>
          <div class="form-field">
            <label class="form-label" for="email">Email Address *</label>
            <input class="form-control" id="email" name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
            <span id="email-error" class="field-error" aria-live="polite"></span>
          </div>
          <div class="form-field">
            <label class="form-label" for="location">Property Location *</label>
            <input class="form-control" id="location" name="location" type="text" required placeholder="Oakley, CA or nearby neighborhood/city" />
            <span id="location-error" class="field-error" aria-live="polite"></span>
          </div>
          <div class="form-field form-field--full">
            <label class="form-label" for="service-required">Roofing Service Required *</label>
            <select class="form-control" id="service-required" name="service" required>
              <option value="">Select a roofing service...</option>
              ${optionHtml}
            </select>
            <span id="service-required-error" class="field-error" aria-live="polite"></span>
          </div>
          <div class="form-field form-field--full">
            <label class="form-label" for="message">Project Details or Roof Issue *</label>
            <textarea class="form-control" id="message" name="message" required placeholder="Describe your roof material, leak location, age of roof, or project timeline."></textarea>
            <span id="message-error" class="field-error" aria-live="polite"></span>
          </div>
          <div class="form-field form-field--full">
            <button class="btn btn--primary" type="submit">Request Free Estimate</button>
          </div>
        </div>
        <div id="form-status" class="form-status" hidden role="status" aria-live="polite"></div>
      </form>`;
}

export function renderFooter(depth) {
  const serviceLinks = SERVICES.slice(0, 8)
    .map((s) => `<li><a href="${hrefFor(depth, s.slug)}">${escapeHtml(s.shortName)}</a></li>`)
    .join('\n            ');

  const oakleyLinks = OAKLEY_NEIGHBORHOODS.map(
    (a) => `<li><a href="${hrefFor(depth, `areas/${a.slug}`)}">${escapeHtml(a.name)}</a></li>`
  ).join('\n            ');

  const cityLinks = NEARBY_CITIES.map(
    (a) => `<li><a href="${hrefFor(depth, `areas/${a.slug}`)}">${escapeHtml(a.name)}</a></li>`
  ).join('\n            ');

  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="footer-brand" href="${hrefFor(depth, '/')}">
            ${logoSvg()}
            <span>${BUSINESS_NAME}</span>
          </a>
          <p class="footer-intro">
            Oakley, California roofing contractor providing residential and commercial roof repair, replacement, installation, inspections, and gutter services.
          </p>
          <ul class="footer-contact-list">
            <li>Location: Oakley, CA, USA</li>
            <li>Phone: <a class="tabular-nums" href="${PHONE_HREF}">${PHONE_DISPLAY}</a></li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">Company</h3>
          <ul class="footer-links">
            <li><a href="${hrefFor(depth, '/')}">Home</a></li>
            <li><a href="${hrefFor(depth, 'about')}">About Us</a></li>
            <li><a href="${hrefFor(depth, 'services')}">All Roofing Services</a></li>
            <li><a href="${hrefFor(depth, 'projects')}">Our Projects</a></li>
            <li><a href="${hrefFor(depth, 'service-areas')}">Service Areas</a></li>
            <li><a href="${hrefFor(depth, 'faq')}">Frequently Asked Questions</a></li>
            <li><a href="${hrefFor(depth, 'contact')}">Contact &amp; Free Estimate</a></li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">Roofing Services</h3>
          <ul class="footer-links">
            ${serviceLinks}
            <li><a href="${hrefFor(depth, 'services')}">View All 15 Services</a></li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">Oakley Neighborhoods</h3>
          <ul class="footer-links">
            ${oakleyLinks}
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">Nearby Service Areas</h3>
          <ul class="footer-links">
            ${cityLinks}
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="mb-0">&copy; 2026 ${BUSINESS_NAME}. Oakley, CA, USA. All rights reserved.</p>
        <div class="footer-legal">
          <a href="${hrefFor(depth, 'privacy-policy')}">Privacy Policy</a>
          <a href="${hrefFor(depth, 'terms')}">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>
  <script src="${assetFor(depth, 'assets/js/main.js')}" defer></script>
</body>
</html>`;
}
