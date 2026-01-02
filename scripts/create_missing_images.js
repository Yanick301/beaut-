const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/image-products');

const copies = [
  { src: 'fructis_hydrating_garnier.jpg', dst: 'fructis_hydrating_garnier..jpg' },
  { src: 'amouage_jubilation_xxv.jpg', dst: 'amouage_interlude_man.jpg' },
];

function findAvailableSource(src) {
  const candidates = [src, src.replace('.jpg', '_2.jpg'), src + '.bak'];
  for (const c of candidates) {
    const p = path.join(imagesDir, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

copies.forEach(({ src, dst }) => {
  const srcPath = findAvailableSource(src);
  const dstPath = path.join(imagesDir, dst);
  try {
    if (!srcPath) {
      console.error(`Source not found (tried variants): ${src}`);
      return;
    }
    if (fs.existsSync(dstPath)) {
      console.log(`Destination already exists: ${dst}`);
      return;
    }
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Copied ${path.basename(srcPath)} -> ${dst}`);
  } catch (err) {
    console.error(`Failed to copy ${src} -> ${dst}: ${err.message}`);
  }
});
