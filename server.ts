import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SITE_ROOT = fs.existsSync(path.resolve(process.cwd(), 'allamericanroofing'))
  ? path.resolve(process.cwd(), 'allamericanroofing')
  : path.resolve(process.cwd(), 'dist');

// Clean URL middleware matching .htaccess rules
app.use((req, res, next) => {
  const reqPath = req.path;

  // Allow assets, sitemap.xml, and robots.txt directly
  if (
    reqPath.startsWith('/assets/') ||
    reqPath === '/sitemap.xml' ||
    reqPath === '/robots.txt'
  ) {
    return next();
  }

  // Redirect explicit /index.html or /*/index.html to clean canonical folder URL
  if (reqPath === '/index.html') {
    return res.redirect(301, '/');
  }
  if (reqPath.endsWith('/index.html')) {
    return res.redirect(301, reqPath.slice(0, -'index.html'.length));
  }

  // Redirect *.html (excluding 404.html) to clean trailing-slash URL
  if (reqPath.endsWith('.html') && reqPath !== '/404.html') {
    const clean = reqPath.slice(0, -'.html'.length);
    return res.redirect(301, `${clean}/`);
  }

  // Enforce trailing slash on directory routes when index.html exists
  if (!reqPath.endsWith('/') && !path.extname(reqPath)) {
    const dirIndex = path.join(SITE_ROOT, reqPath, 'index.html');
    if (fs.existsSync(dirIndex)) {
      return res.redirect(301, `${reqPath}/`);
    }
  }

  return next();
});

app.use(
  express.static(SITE_ROOT, {
    extensions: ['html'],
    index: 'index.html',
    dotfiles: 'deny'
  })
);

// Custom 404 page
app.use((_req, res) => {
  const notFoundFile = path.join(SITE_ROOT, '404.html');
  if (fs.existsSync(notFoundFile)) {
    res.status(404).sendFile(notFoundFile);
  } else {
    res.status(404).send('404 Page Not Found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`All American Roofing static preview listening on http://0.0.0.0:${PORT}`);
});
