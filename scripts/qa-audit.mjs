import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'allamericanroofing');
const SITE_URL = 'https://allamericanroofing.homes';

function walkHtml(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, list);
    } else if (entry.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const htmlFiles = walkHtml(ROOT).sort();
const errors = [];
const titles = new Map();
const descriptions = new Map();
const canonicalSet = new Set();

for (const file of htmlFiles) {
  const relFile = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  const dirOfFile = path.dirname(file);

  // 1. Check H1 count
  const h1Matches = html.match(/<h1[\s>]/g) || [];
  if (h1Matches.length !== 1) {
    errors.push(`${relFile}: expected 1 <h1>, found ${h1Matches.length}`);
  }

  // 2. Check Title uniqueness
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    errors.push(`${relFile}: missing <title>`);
  } else if (relFile !== '404.html') {
    const t = titleMatch[1].trim();
    if (titles.has(t)) {
      errors.push(`${relFile}: duplicate title with ${titles.get(t)} -> "${t}"`);
    }
    titles.set(t, relFile);
  }

  // 3. Check Meta description uniqueness
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  if (!descMatch) {
    errors.push(`${relFile}: missing meta description`);
  } else if (relFile !== '404.html') {
    const d = descMatch[1].trim();
    if (descriptions.has(d)) {
      errors.push(`${relFile}: duplicate meta description with ${descriptions.get(d)}`);
    }
    descriptions.set(d, relFile);
  }

  // 4. Canonical URL check
  const canonMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonMatch) {
    errors.push(`${relFile}: missing canonical URL`);
  } else if (relFile !== '404.html') {
    canonicalSet.add(canonMatch[1]);
  }

  // 5. JSON-LD validation
  const ldRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let ldMatch;
  while ((ldMatch = ldRegex.exec(html)) !== null) {
    try {
      JSON.parse(ldMatch[1]);
    } catch (e) {
      errors.push(`${relFile}: invalid JSON-LD -> ${e.message}`);
    }
  }

  // 6. Verify all local src and href references
  const attrRegex = /\b(src|href)="([^"]+)"/g;
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const [, attr, val] = match;
    if (
      val.startsWith('http://') ||
      val.startsWith('https://') ||
      val.startsWith('tel:') ||
      val.startsWith('mailto:') ||
      val.startsWith('data:')
    ) {
      continue;
    }

    if (val === '#') {
      errors.push(`${relFile}: placeholder "#" href found`);
      continue;
    }

    // In-page anchor like #main-content
    if (val.startsWith('#')) {
      const id = val.slice(1);
      if (!html.includes(`id="${id}"`)) {
        errors.push(`${relFile}: broken fragment anchor ${val}`);
      }
      continue;
    }

    // Check against .html links in public navigation
    if (attr === 'href' && val.endsWith('.html')) {
      errors.push(`${relFile}: public href ends in .html -> ${val}`);
    }

    const cleanTarget = val.split('#')[0].split('?')[0];
    const resolved = path.resolve(dirOfFile, cleanTarget);
    const existsAsFile = fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    const existsAsDirIndex = fs.existsSync(path.join(resolved, 'index.html'));

    if (!existsAsFile && !existsAsDirIndex) {
      errors.push(`${relFile}: broken ${attr}="${val}" (resolved to ${resolved})`);
    }
  }
}

// 7. Verify sitemap.xml matches indexable pages 1:1
const sitemapPath = path.join(ROOT, 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const sitemapLocs = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
for (const loc of sitemapLocs) {
  if (!canonicalSet.has(loc)) {
    errors.push(`sitemap.xml contains unknown URL: ${loc}`);
  }
  const rel = loc.replace(SITE_URL, '').replace(/^\/+/, '');
  const expectedFile = rel ? path.join(ROOT, rel, 'index.html') : path.join(ROOT, 'index.html');
  if (!fs.existsSync(expectedFile)) {
    errors.push(`sitemap.xml URL does not exist on disk: ${loc}`);
  }
}
for (const canon of canonicalSet) {
  if (!sitemapLocs.includes(canon)) {
    errors.push(`canonical page missing from sitemap.xml: ${canon}`);
  }
}

// 8. Verify robots.txt & .htaccess
const robotsTxt = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
if (!robotsTxt.includes('https://allamericanroofing.homes/sitemap.xml')) {
  errors.push('robots.txt missing canonical sitemap URL');
}
if (!fs.existsSync(path.join(ROOT, '.htaccess'))) {
  errors.push('.htaccess missing');
}

console.log(`Audited ${htmlFiles.length} HTML files (${canonicalSet.size} indexable canonical URLs, ${sitemapLocs.length} sitemap entries).`);
if (errors.length > 0) {
  console.error('QA AUDIT FAILED WITH ERRORS:');
  for (const err of errors) console.error(' -', err);
  process.exit(1);
} else {
  console.log('QA AUDIT PASSED: 0 broken links, 0 broken images, 0 duplicate titles/descriptions, 100% valid JSON-LD & sitemap alignment.');
}
