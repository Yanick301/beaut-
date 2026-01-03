const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/image-products');
const dataFile = path.join(__dirname, '../lib/data.ts');

function productNameToImageName(name) {
  const accentMap = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ý': 'y', 'ÿ': 'y',
    'ç': 'c'
  };

  let result = name
    .toLowerCase()
    .trim()
    .split('')
    .map(char => accentMap[char] || char)
    .join('')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/gi, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '') + '.jpg';
  const fileMapping = {
    'the_ritual_of_sakura_body_mist_rituals.jpg': 'he_ritual_of_sakura_body_mist_rituals.jpg',
    'the_ritual_of_ayurveda_eau_de_parfum_rituals.jpg': 'the_ritual_of_ayurveda_eau_de_parfum_ritual.jpg',
    'fructis_hydrating_garnier.jpg': 'fructis_hydrating_garnier_2.jpg',
    'fructis_hydrating_garnier..jpg': 'fructis_hydrating_garnier_2.jpg'
  };

  return fileMapping[result] || result;
}

function extractProducts() {
  const content = fs.readFileSync(dataFile, 'utf-8');
  const products = [];
  const productRegex = /\{\s*id:\s*['"]([^'"]+)['"][^}]*?name:\s*['"]([^'"]+)['"][^}]*?image:\s*(getProductImagePath\(['"]([^'"]+)['"]\)|getProductImagePathDirect\(['"]([^'"]+)['"]\)|['"]\/image-products\/([^'"]+)['"][^}]*)/gs;
  let match;
  while ((match = productRegex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    let imageFile = null;
    if (match[3] && match[3].includes('getProductImagePath(')) {
      imageFile = productNameToImageName(match[3].match(/getProductImagePath\(['"]([^'"]+)['"]\)/)[1]);
    } else if (match[4] && match[4].includes('getProductImagePathDirect(')) {
      const fname = match[4].match(/getProductImagePathDirect\(['"]([^'"]+)['"]\)/)[1];
      imageFile = fname.endsWith('.jpg') ? fname : fname + '.jpg';
    } else if (match[5]) {
      imageFile = match[5];
    }
    if (imageFile) products.push({ id, name, imageFile: imageFile.toLowerCase() });
  }
  return products;
}

function isJpeg(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(3);
    fs.readSync(fd, buf, 0, 3, 0);
    fs.closeSync(fd);
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  } catch (e) {
    return false;
  }
}

const devices = {
  desktop: { accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
  android: { accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
  iphone: { accept: 'image/webp,image/*,*/*;q=0.8' }
};

function run() {
  const products = extractProducts();
  const report = [];
  let missingCount = 0;

  products.forEach(p => {
    const imgPath = path.join(imagesDir, p.imageFile);
    const exists = fs.existsSync(imgPath);
    const size = exists ? fs.statSync(imgPath).size : 0;
    const jpeg = exists ? isJpeg(imgPath) : false;
    if (!exists) missingCount++;

    const perDevice = {};
    Object.keys(devices).forEach(dev => {
      perDevice[dev] = {
        requested: `/image-products/${p.imageFile}`,
        status: exists ? 200 : 404,
        servedFormat: exists ? (jpeg ? 'image/jpeg' : 'unknown') : null,
        size
      };
    });

    report.push({ id: p.id, name: p.name, imageFile: p.imageFile, exists, size, isJpeg: jpeg, perDevice });
  });

  const summary = {
    date: new Date().toISOString(),
    totalProducts: products.length,
    missingImages: missingCount,
  };

  const out = { summary, report };
  const outPath = path.join(__dirname, '../IMAGE_DISPLAY_SIMULATION.txt');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Simulation complete. Products: ${products.length}, missing images: ${missingCount}`);
  console.log(`Report written to: ${outPath}`);
}

run();
