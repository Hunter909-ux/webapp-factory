/**
 * Generate raster brand assets from SVGs for patchworkheroes.de.
 *
 * Outputs:
 * - public/og-default.png   (1200x630 Open Graph fallback)
 * - public/apple-touch-icon.png (180x180 iOS home screen icon)
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const fontsDir = path.resolve(publicDir, "fonts");

const woff2Buffer = readFileSync(path.join(fontsDir, "dm-serif-display-regular.woff2"));
const woff2Base64 = woff2Buffer.toString("base64");

const fontFace = `
@font-face {
  font-family: 'DM Serif Display';
  src: url('data:font/woff2;base64,${woff2Base64}') format('woff2');
  font-weight: 400;
  font-style: normal;
}
`;

/**
 * Render the Open Graph fallback image.
 * Off-white background, Kintsugi symbol and brand wordmark.
 */
function buildOgSvg() {
  const symbol = `
    <circle cx="120" cy="120" r="100" fill="#2C3E50"/>
    <path d="M60 50 C80 80 70 100 110 120 S 150 160 180 190" stroke="#D4903C" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M40 140 C70 120 100 150 130 110 S 180 90 200 70" stroke="#E8B168" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M110 30 C100 70 130 90 150 120 S 170 170 180 200" stroke="#D4903C" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <style>${fontFace}</style>
    </defs>
    <rect width="1200" height="630" fill="#F5F0EB"/>
    <g transform="translate(940, 20)">
      <svg width="80" height="80" viewBox="0 0 64 64">
        ${symbol}
      </svg>
    </g>
    <g transform="translate(600, 300)" text-anchor="middle">
      <text font-family="'DM Serif Display', Georgia, serif" font-size="72" fill="#2C3E50" letter-spacing="-0.02em">patchworkheroes</text>
      <text y="60" font-family="'Inter', system-ui, sans-serif" font-size="24" fill="#5D7080">Coaching, Klang-Meditationen und körperbasierte Impulse für Väter.</text>
    </g>
    <rect x="540" y="420" width="120" height="6" fill="#D4903C" rx="3"/>
  </svg>`;
}

/**
 * Render the iOS home screen icon.
 * Off-white rounded square with the Kintsugi symbol.
 */
function buildAppleTouchIconSvg() {
  const symbol = `
    <circle cx="90" cy="90" r="80" fill="#2C3E50"/>
    <path d="M45 30 C60 55 55 70 80 85 S 110 115 130 140" stroke="#D4903C" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M30 100 C50 90 70 110 90 80 S 130 60 150 45" stroke="#E8B168" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M75 20 C70 50 90 65 100 90 S 125 130 135 160" stroke="#D4903C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" rx="36" fill="#F5F0EB"/>
    <g transform="translate(0, 0)">
      <svg width="180" height="180" viewBox="0 0 180 180">
        ${symbol}
      </svg>
    </g>
  </svg>`;
}

const ogSvg = buildOgSvg();
const appleSvg = buildAppleTouchIconSvg();

await sharp(Buffer.from(ogSvg, "utf-8"))
  .resize(1200, 630)
  .png()
  .toFile(path.join(publicDir, "og-default.png"));

await sharp(Buffer.from(appleSvg, "utf-8"))
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, "apple-touch-icon.png"));

console.log("Generated og-default.png and apple-touch-icon.png");
