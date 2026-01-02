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
 * Extrait les produits depuis le fichier data.ts
 */
function extractProductsFromDataFile() {
  const dataFile = path.join(__dirname, '../lib/data.ts');
  const content = fs.readFileSync(dataFile, 'utf-8');
  
  const products = [];
  
  // Extraire tous les blocs de produits entre { id: ... }
  // Utiliser une regex plus robuste pour extraire les objets produits
  const productRegex = /\{\s*id:\s*['"]([^'"]+)['"][^}]*?name:\s*['"]([^'"]+)['"][^}]*?image:\s*(getProductImagePath\(['"]([^'"]+)['"]\)|getProductImagePathDirect\(['"]([^'"]+)['"]\)|['"]\/image-products\/([^'"]+)['"])/gs;
  
  let match;
  while ((match = productRegex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    let imageFileName = null;
    
    // Pattern 1: getProductImagePath('Product Name')
    if (match[4]) {
      imageFileName = productNameToImageName(match[4]).toLowerCase();
    }
    // Pattern 2: getProductImagePathDirect('filename.jpg')
    else if (match[5]) {
      imageFileName = (match[5].endsWith('.jpg') ? match[5] : match[5] + '.jpg').toLowerCase();
    }
    // Pattern 3: '/image-products/filename.jpg'
    else if (match[6]) {
      imageFileName = match[6].toLowerCase();
    }
    
    if (imageFileName) {
      products.push({
        id,
        name,
        imageFileName
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
console.log(`📦 Total de produits extraits: ${products.length}\n`);

if (products.length === 0) {
  console.log('⚠️  Aucun produit extrait. Vérifiez la structure du fichier data.ts');
  process.exit(1);
}

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
  orphanImages.slice(0, 50).forEach((img, index) => {
    console.log(`${index + 1}. ${img}`);
  });
  if (orphanImages.length > 50) {
    console.log(`... et ${orphanImages.length - 50} autres images orphelines`);
  }
} else {
  console.log('\n✅ Toutes les images sont associées à au moins un produit');
}

if (productsWithoutImages.length > 0) {
  console.log(`\n⚠️  Produits avec images manquantes (${productsWithoutImages.length} produits):`);
  console.log('-'.repeat(80));
  productsWithoutImages.slice(0, 50).forEach((product, index) => {
    console.log(`${index + 1}. ID: ${product.id} | Nom: ${product.name}`);
    console.log(`   Image attendue: ${product.imageFileName}`);
  });
  if (productsWithoutImages.length > 50) {
    console.log(`... et ${productsWithoutImages.length - 50} autres produits sans images`);
  }
} else {
  console.log('\n✅ Tous les produits ont leurs images');
}

// Trouver les images utilisées par plusieurs produits
const duplicateImages = Array.from(imageToProducts.entries())
  .filter(([img, prods]) => prods.length > 1);

if (duplicateImages.length > 0) {
  console.log(`\n🔄 Images partagées par plusieurs produits (${duplicateImages.length} images):`);
  console.log('-'.repeat(80));
  duplicateImages.slice(0, 20).forEach(([img, prods], index) => {
    console.log(`${index + 1}. ${img} (utilisée par ${prods.length} produits):`);
    prods.slice(0, 5).forEach(prod => {
      console.log(`   - ID: ${prod.id} | ${prod.name}`);
    });
    if (prods.length > 5) {
      console.log(`   ... et ${prods.length - 5} autres produits`);
    }
  });
  if (duplicateImages.length > 20) {
    console.log(`... et ${duplicateImages.length - 20} autres images partagées`);
  }
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

