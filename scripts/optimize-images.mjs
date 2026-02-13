import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const IMG_DIR = './public/images';
const MAX_WIDTH = 1200;
const QUALITY = 80;

async function optimize() {
  const files = await readdir(IMG_DIR);

  for (const file of files) {
    const filePath = join(IMG_DIR, file);
    const stats = await stat(filePath);

    if (!stats.isFile()) continue;

    const ext = file.split('.').pop()?.toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(ext)) continue;

    const originalSize = stats.size;
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Resize if wider than MAX_WIDTH
    const needsResize = metadata.width && metadata.width > MAX_WIDTH;

    let pipeline = sharp(filePath);
    if (needsResize) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    // Output as WebP and also keep original format optimized
    const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await pipeline.clone().webp({ quality: QUALITY }).toFile(webpPath);

    // Also optimize the original
    if (ext === 'png') {
      const optimized = await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toBuffer();
      const { default: fs } = await import('fs');
      fs.writeFileSync(filePath, optimized);
    } else {
      const optimized = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
      const { default: fs } = await import('fs');
      fs.writeFileSync(filePath, optimized);
    }

    const newStats = await stat(filePath);
    const webpStats = await stat(webpPath);

    console.log(
      `${file}: ${(originalSize / 1024).toFixed(0)}KB -> ${(newStats.size / 1024).toFixed(0)}KB (original) / ${(webpStats.size / 1024).toFixed(0)}KB (webp)`
    );
  }

  console.log('\nDone!');
}

optimize().catch(console.error);
