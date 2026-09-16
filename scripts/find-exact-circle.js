const sharp = require('sharp');

async function checkRows() {
  const { data, info } = await sharp('public/base-silver.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's sample along horizontal line y = 265 (near vertical middle)
  const y = 265;
  let line = [];
  for (let x = 0; x < w * 0.5; x += 10) {
    const idx = (y * w + x) * info.channels;
    line.push({ x, r: data[idx], g: data[idx+1], b: data[idx+2] });
  }
  // find contiguous where r,g,b are equal and > 220 (the light grey fill inside the circle)
  const lightGrey = line.filter(p => p.r > 220 && Math.abs(p.r - p.g) < 5 && Math.abs(p.r - p.b) < 5);
  console.log('Sample light grey at y=265:', lightGrey.slice(0, 3), '...', lightGrey.slice(-3));

  // Now scan all pixels for light grey fill: r > 220, |r-g| < 4, |r-b| < 4
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let count = 0;
  for (let cy = 0; cy < h; cy++) {
    for (let cx = 0; cx < w * 0.5; cx++) {
      const idx = (cy * w + cx) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r > 220 && Math.abs(r - g) < 4 && Math.abs(r - b) < 4) {
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
        count++;
      }
    }
  }

  console.log('Exact light-grey circle interior on Silver:', {
    minX, maxX, minY, maxY,
    widthPx: maxX - minX,
    heightPx: maxY - minY,
    xPercent: ((minX / w) * 100).toFixed(2),
    yPercent: ((minY / h) * 100).toFixed(2),
    widthPercent: (((maxX - minX) / w) * 100).toFixed(2),
    heightPercent: (((maxY - minY) / h) * 100).toFixed(2),
    centerXPct: ((((minX + maxX) / 2) / w) * 100).toFixed(2),
    centerYPct: ((((minY + maxY) / 2) / h) * 100).toFixed(2),
  });
}

checkRows().catch(console.error);
