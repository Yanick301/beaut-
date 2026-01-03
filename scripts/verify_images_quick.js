
const fs = require('fs');
const path = require('path');

// Mock data.ts logic since we can't easily import TS in a quick node script without compile
// Copying the relevant logic from lib/data.ts

function productNameToImageName(name) {
    let normalized = name
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’‘`ʼ\-]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    const result = `${normalized}.jpg`;

    const fileMapping = {
        'fructis_hydrating_garnier.jpg': 'fructis_hydrating_garnier_2.jpg'
    };

    const baseResult = result.replace(/_\d+_ml|_extrait|_private_blend/g, '');

    return fileMapping[result] || (result !== baseResult && baseResult !== '.jpg' ? baseResult : result);
}

// Extract product names from lib/data.ts content
const dataPath = path.join(__dirname, '../lib/data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Regex to find: image: getProductImagePath('Name')
// and also direct string usage if any
const imageRegex = /getProductImagePath\(['"](.+?)['"]\)/g;

const products = [];
let match;

while ((match = imageRegex.exec(dataContent)) !== null) {
    products.push(match[1]);
}

console.log(`Found ${products.length} product image references in lib/data.ts`);

const publicDir = path.join(__dirname, '../public/image-products');
const files = fs.readdirSync(publicDir);

const missing = [];
const existing = [];

products.forEach(name => {
    const imageName = productNameToImageName(name);
    if (files.includes(imageName)) {
        existing.push({ name, imageName });
    } else {
        // Try to find if the file exists with slightly different name
        // e.g. maybe logic is slightly different
        missing.push({ name, expectedImageName: imageName });
    }
});

console.log(`\n✅ Found ${existing.length} images.`);
console.log(`❌ Missing ${missing.length} images:`);

missing.forEach(m => {
    console.log(`- Product: "${m.name}" => Expected: ${m.expectedImageName}`);
});

if (missing.length === 0) {
    console.log("\nAll images appear to verify correctly! Maybe it's a browser caching issue or deployment issue?");
}
