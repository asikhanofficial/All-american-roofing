import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve(process.cwd(), 'allamericanroofing');
const distDir = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(srcDir)) {
  throw new Error(`Static site directory not found at ${srcDir}`);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.cpSync(srcDir, distDir, { recursive: true, force: true });

console.log(`Copied static website from ${srcDir} to ${distDir}`);
