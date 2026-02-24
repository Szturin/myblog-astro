import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join } from 'path';

const DIR = 'public/posts';
let totalBefore = 0;
let totalAfter = 0;
let count = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      const tmp = full + '.tmp';
      try {
        const before = (await stat(full)).size;
        const pipeline = entry.name.toLowerCase().endsWith('.png')
          ? sharp(full).png({ effort: 10, compressionLevel: 9 })
          : sharp(full).jpeg({ quality: 95, mozjpeg: true });
        await pipeline.toFile(tmp);
        const after = (await stat(tmp)).size;
        if (after < before) {
          await unlink(full);
          await rename(tmp, full);
          totalBefore += before;
          totalAfter += after;
          count++;
        } else {
          await unlink(tmp);
          totalBefore += before;
          totalAfter += before;
        }
      } catch (e) {
        console.error(`跳过: ${full} - ${e.message}`);
        try { await unlink(tmp); } catch {}
      }
    }
  }
}

await walk(DIR);
const saved = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : '0';
console.log(`优化完成: ${count} 张图片, ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB, 节省 ${saved}%`);
