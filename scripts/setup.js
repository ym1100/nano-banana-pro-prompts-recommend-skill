#!/usr/bin/env node
/**
 * setup.js - Downloads Nano Banana Pro prompt library from GitHub
 *
 * Runs automatically after `clawhub install` or `npm install`.
 * Fetches latest prompt reference JSON files from the public GitHub repo.
 * No credentials required — all data is publicly available.
 */

import { existsSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const refsDir = join(__dirname, '..', 'references');

const BASE_URL = 'https://raw.githubusercontent.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill/main/references';

const CATEGORIES = [
  'social-media-post', 'product-marketing', 'profile-avatar',
  'poster-flyer', 'infographic-edu-visual', 'ecommerce-main-image',
  'game-asset', 'comic-storyboard', 'youtube-thumbnail',
  'app-web-design', 'others',
];

async function setup() {
  if (!existsSync(refsDir)) mkdirSync(refsDir, { recursive: true });

  let downloaded = 0, skipped = 0;
  console.log('[setup] Downloading Nano Banana Pro prompt library from GitHub...');

  for (const cat of CATEGORIES) {
    const dest = join(refsDir, `${cat}.json`);
    if (existsSync(dest) && statSync(dest).size > 100) { skipped++; continue; }

    const url = `${BASE_URL}/${cat}.json`;
    process.stdout.write(`  → ${cat}.json ... `);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(dest, await res.text(), 'utf8');
      console.log('✓');
      downloaded++;
    } catch (err) {
      console.log(`✗ (${err.message})`);
    }
  }

  if (downloaded > 0) console.log(`[setup] Done! ${downloaded} file(s) downloaded. Skill is ready.`);
  else if (skipped === CATEGORIES.length) console.log('[setup] References already present. Skipped.');
}

setup().catch(err => {
  console.warn('[setup] Warning (non-fatal):', err.message);
  process.exit(0);
});
