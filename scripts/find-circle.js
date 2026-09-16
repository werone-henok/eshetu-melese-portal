const sharp = require('sharp');

async function findCircle() {
  const { data, info } = await sharp('public/base-silver.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = info.channels;

  // Let's find white pixels in the circle: R > 200, G > 200, B > 200
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let count = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w * 0.5; x++) { // only left half
      const idx = (y * w + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (r > 210 && g > 210 && b > 210) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        count++;
      }
    }
  }

  console.log('Silver photo circle inside bounds:', {
    minX, maxX, minY, maxY,
    widthPx: maxX - minX,
    heightPx: maxY - minY,
    xPercent: (minX / w * 100).toFixed(2),
    yPercent: (minY / h * 100).toFixed(2),
    widthPercent: ((maxX - minX) / w * 100).toFixed(2),
    heightPercent: ((maxY - minY) / h * 100).toFixed(2),
    centerXPct: (((minX + maxX) / 2) / w * 100).toFixed(2),
    centerYPct: (((minY + maxY) / 2) / h * 100).toFixed(2),
  });
}

findCircle().catch(console.error);
