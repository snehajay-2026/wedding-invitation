import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const INPUT_REL = "public/assets/SneJay.png";
const OUTPUT_REL = "public/assets/SneJay-transparent.png";

function isNeutral({ r, g, b }) {
  return Math.max(r, g, b) - Math.min(r, g, b) <= 14;
}

function dist2(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

function quantKey(r, g, b) {
  // 4-bit quantization per channel (0-15)
  const rq = r >> 4;
  const gq = g >> 4;
  const bq = b >> 4;
  return (rq << 8) | (gq << 4) | bq;
}

function unquantKey(key) {
  const rq = (key >> 8) & 0x0f;
  const gq = (key >> 4) & 0x0f;
  const bq = key & 0x0f;
  // center of bin
  return {
    r: rq * 16 + 8,
    g: gq * 16 + 8,
    b: bq * 16 + 8,
  };
}

async function main() {
  const root = process.cwd();
  const inputPath = path.join(root, INPUT_REL);
  const outputPath = path.join(root, OUTPUT_REL);

  if (!existsSync(inputPath)) {
    console.log(`[prepare-logo] Skip: missing ${INPUT_REL}`);
    return;
  }

  try {
    const inStat = await fs.stat(inputPath);
    if (existsSync(outputPath)) {
      const outStat = await fs.stat(outputPath);
      if (outStat.mtimeMs >= inStat.mtimeMs) {
        console.log(`[prepare-logo] Up to date: ${OUTPUT_REL}`);
        return;
      }
    }
  } catch {
    // ignore
  }

  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.warn(
      "[prepare-logo] 'sharp' not available. Run 'npm install' to generate a transparent logo."
    );
    return;
  }

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels < 4) {
    console.warn("[prepare-logo] Unexpected channels; skipping");
    return;
  }

  // Find the two most common neutral colors (the checkerboard squares)
  const step = Math.max(2, Math.floor(Math.min(width, height) / 120));
  const counts = new Map();

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if (a === 0) continue;

      const key = quantKey(r, g, b);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  } 

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const bgColors = [];
  for (const [key] of sorted) {
    const c = unquantKey(key);
    if (!isNeutral(c)) continue;
    bgColors.push(c);
    if (bgColors.length >= 2) break;
  }

  // Fallback if we didn't detect enough neutral tones
  if (bgColors.length < 2) {
    for (const [key] of sorted) {
      bgColors.push(unquantKey(key));
      if (bgColors.length >= 2) break;
    }
  }  

  const threshold = 30; // per-channel-ish
  const threshold2 = threshold * threshold * 3;

  // Key out pixels that are both (a) neutral-ish and (b) close to either bg tone
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const a = out[i + 3];
    if (a === 0) continue;

    const pix = { r, g, b };
    if (!isNeutral(pix)) continue;

    const d = Math.min(dist2(pix, bgColors[0]), dist2(pix, bgColors[1]));
    if (d <= threshold2) {
      out[i + 3] = 0;
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`[prepare-logo] Generated ${OUTPUT_REL}`);
}

main().catch((err) => {
  console.warn("[prepare-logo] Failed to generate transparent logo:", err);
  // Don't fail dev/build; just keep original image.
  process.exitCode = 0;
});
