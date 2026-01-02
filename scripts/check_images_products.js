const fs = require('fs');
const path = require('path');

/**
 * Convertit un nom de produit en nom de fichier image
 * (Même logique que dans lib/data.ts)
 */
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
    'fructis_hydrating_garnier.jpg': 'fructis_hydrating_garnier..jpg',
    'the_ritual_of_karma_rituals.jpg': 'he_ritual_of_sakura_body_mist_rituals.jpg',
  };

  return fileMapping[result] || result;
}

/**
 * Extrait le nom de fichier depuis un chemin d'image
 */
function extractImageFileName(imagePath) {
  if (!imagePath) return null;
  const fileName = imagePath.replace('/image-products/', '').replace(/^\//, '');
  return fileName;
}

/**
 * Lit le fichier data.ts et extrait les produits
 * (Approche simple : lire le fichier et extraire les patterns)
 */
function extractProductsFromDataFile() {
  const dataFile = path.join(__dirname, '../lib/data.ts');
  const content = fs.readFileSync(dataFile, 'utf-8');
  
  const products = [];
  
  // Extraire les images des produits en cherchant les patterns
  // Format: image: getProductImagePath('Product Name'),
  const imagePattern = /image:\s*(?:getProductImagePath\(['"]([^'"]+)['"]\)|getProductImagePathDirect\(['"]([^'"]+)['"]\)|['"]\/image-products\/([^'"]+)['"])/g;
  
  // Extraire les noms de produits
  // Format: name: 'Product Name',
  const namePattern = /name:\s*['"]([^'"]+)['"]/g;
  
  // Extraire les IDs
  // Format: id: '123',
  const idPattern = /id:\s*['"]([^'"]+)['"]/g;
  
  // Extraire les blocs de produits
  const productBlocks = content.split(/\{\s*id:/);
  
  for (let i = 1; i < productBlocks.length; i++) {
    const block = productBlocks[i];
    
    // Extraire l'ID
    const idMatch = block.match(/^['"]([^'"]+)['"]/);
    if (!idMatch) continue;
    const id = idMatch[1];
    
    // Extraire le nom
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    
    // Extraire l'image
    let imageFileName = null;
    
    // Pattern 1: getProductImagePath('Product Name')
    const imagePathMatch = block.match(/image:\s*getProductImagePath\(['"]([^'"]+)['"]\)/);
    if (imagePathMatch) {
      imageFileName = productNameToImageName(imagePathMatch[1]);
    }
    
    // Pattern 2: getProductImagePathDirect('filename.jpg')
    const imageDirectMatch = block.match(/image:\s*getProductImagePathDirect\(['"]([^'"]+)['"]\)/);
    if (imageDirectMatch) {
      imageFileName = imageDirectMatch[1].endsWith('.jpg') ? imageDirectMatch[1] : imageDirectMatch[1] + '.jpg';
    }
    
    // Pattern 3: image: '/image-products/filename.jpg'
    const imageLiteralMatch = block.match(/image:\s*['"]\/image-products\/([^'"]+)['"]/);
    if (imageLiteralMatch) {
      imageFileName = imageLiteralMatch[1];
    }
    
    if (imageFileName) {
      products.push({
        id,
        name,
        imageFileName: imageFileName.toLowerCase(),
        imagePath: imagePathMatch ? imagePathMatch[1] : (imageDirectMatch ? imageDirectMatch[1] : imageLiteralMatch[1])
      });
    }
  }
  
  return products;
}

// Lire toutes les images dans le dossier
const imagesDir = path.join(__dirname, '../public/image-products');
const allImageFiles = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.jpg') || file.endsWith('.JPG'))
  .map(file => file.toLowerCase());

console.log('\n🔍 Analyse des images et produits...\n');
console.log(`📁 Total d'images dans le dossier: ${allImageFiles.length}`);

// Extraire les produits
const products = extractProductsFromDataFile();
console.log(`📦 Total de produits dans data.ts: ${products.length}\n`);

// Créer des maps pour faciliter la recherche
const imageToProducts = new Map();
const productImageFiles = new Set();

products.forEach(product => {
  const imageFile = product.imageFileName;
  productImageFiles.add(imageFile);
  
  if (!imageToProducts.has(imageFile)) {
    imageToProducts.set(imageFile, []);
  }
  imageToProducts.get(imageFile).push(product);
});

// Trouver les images orphelines (images sans produit)
const orphanImages = allImageFiles.filter(img => !productImageFiles.has(img));

// Trouver les produits avec images manquantes
const productsWithoutImages = products.filter(product => {
  return !allImageFiles.includes(product.imageFileName);
});

// Afficher les résultats
console.log('='.repeat(80));
console.log('📊 RÉSULTATS DE L\'ANALYSE');
console.log('='.repeat(80));

if (orphanImages.length > 0) {
  console.log(`\n❌ Images orphelines (${orphanImages.length} images sans produit):`);
  console.log('-'.repeat(80));
  orphanImages.forEach((img, index) => {
    console.log(`${index + 1}. ${img}`);
  });
} else {
  console.log('\n✅ Toutes les images sont associées à au moins un produit');
}

if (productsWithoutImages.length > 0) {
  console.log(`\n⚠️  Produits avec images manquantes (${productsWithoutImages.length} produits):`);
  console.log('-'.repeat(80));
  productsWithoutImages.forEach((product, index) => {
    console.log(`${index + 1}. ID: ${product.id} | Nom: ${product.name}`);
    console.log(`   Image attendue: ${product.imageFileName}`);
  });
} else {
  console.log('\n✅ Tous les produits ont leurs images');
}

// Trouver les images utilisées par plusieurs produits
const duplicateImages = Array.from(imageToProducts.entries())
  .filter(([img, prods]) => prods.length > 1);

if (duplicateImages.length > 0) {
  console.log(`\n🔄 Images partagées par plusieurs produits (${duplicateImages.length} images):`);
  console.log('-'.repeat(80));
  duplicateImages.forEach(([img, prods], index) => {
    console.log(`${index + 1}. ${img} (utilisée par ${prods.length} produits):`);
    prods.forEach(prod => {
      console.log(`   - ID: ${prod.id} | ${prod.name}`);
    });
  });
}

// Statistiques
const imagesWithProducts = allImageFiles.filter(img => productImageFiles.has(img));
console.log('\n' + '='.repeat(80));
console.log('📈 STATISTIQUES');
console.log('='.repeat(80));
console.log(`✅ Images avec produits: ${imagesWithProducts.length}`);
console.log(`❌ Images orphelines: ${orphanImages.length}`);
console.log(`✅ Produits avec images: ${products.length - productsWithoutImages.length}`);
console.log(`⚠️  Produits sans images: ${productsWithoutImages.length}`);
console.log(`🔄 Images partagées: ${duplicateImages.length}`);
console.log('='.repeat(80));

// Sauvegarder le rapport dans un fichier
const reportPath = path.join(__dirname, '../IMAGE_PRODUCT_ANALYSIS_REPORT.txt');
let report = 'RAPPORT D\'ANALYSE IMAGES/PRODUITS\n';
report += '='.repeat(80) + '\n\n';
report += `Date: ${new Date().toLocaleString('fr-FR')}\n\n`;
report += `Total d'images dans le dossier: ${allImageFiles.length}\n`;
report += `Total de produits dans data.ts: ${products.length}\n\n`;

if (orphanImages.length > 0) {
  report += `\nIMAGES ORPHELINES (${orphanImages.length}):\n`;
  report += '-'.repeat(80) + '\n';
  orphanImages.forEach((img, index) => {
    report += `${index + 1}. ${img}\n`;
  });
}

if (productsWithoutImages.length > 0) {
  report += `\nPRODUITS AVEC IMAGES MANQUANTES (${productsWithoutImages.length}):\n`;
  report += '-'.repeat(80) + '\n';
  productsWithoutImages.forEach((product, index) => {
    report += `${index + 1}. ID: ${product.id} | Nom: ${product.name}\n`;
    report += `   Image attendue: ${product.imageFileName}\n`;
  });
}

fs.writeFileSync(reportPath, report, 'utf-8');
console.log(`\n📄 Rapport sauvegardé dans: ${reportPath}\n`);

