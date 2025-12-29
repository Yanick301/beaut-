/**
 * Script pour mettre à jour toutes les images de produits
 * et générer la liste complète des noms d'images nécessaires
 */

const fs = require('fs');
const path = require('path');

function productNameToImageName(name) {
  return name.toLowerCase().trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_àáâãäåèéêëìíîïòóôõöùúûüýÿç]/gi, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '') + '.jpg';
}

function getProductImagePath(name) {
  return `/image-products/${productNameToImageName(name)}`;
}

// Lire le fichier data.ts
const dataFile = path.join(__dirname, '../lib/data.ts');
let content = fs.readFileSync(dataFile, 'utf8');

// Extraire tous les noms de produits et remplacer les images
const productMatches = [];
const regex = /name: '([^']+)',[\s\S]*?image: '([^']+)'/g;
let match;

while ((match = regex.exec(content)) !== null) {
  const productName = match[1];
  const oldImage = match[2];
  const newImage = getProductImagePath(productName);
  
  productMatches.push({
    name: productName,
    oldImage,
    newImage: `getProductImagePath('${productName}')`
  });
  
  // Remplacer dans le contenu
  content = content.replace(
    new RegExp(`image: '${oldImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`),
    `image: getProductImagePath('${productName}')`
  );
}

console.log(`Trouvé ${productMatches.length} produits`);
console.log('\nPremiers produits:');
productMatches.slice(0, 5).forEach(p => {
  console.log(`${p.name} -> ${p.newImage}`);
});

// Sauvegarder le fichier mis à jour
fs.writeFileSync(dataFile, content);
console.log(`\nFichier ${dataFile} mis à jour !`);

// Générer la liste des noms d'images nécessaires
const imageNames = productMatches.map(p => productNameToImageName(p.name));
const imageListFile = path.join(__dirname, '../public/image-products/IMAGE_NAMES.txt');
fs.writeFileSync(imageListFile, imageNames.join('\n'));
console.log(`\nListe des noms d'images sauvegardée dans: ${imageListFile}`);














