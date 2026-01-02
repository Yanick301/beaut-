const fs = require('fs');
const path = require('path');

// Fonction pour convertir le nom du produit en nom de fichier (comme dans le code source)
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

  // Mapping spécifique pour les fichiers existants avec noms différents
  const fileMapping = {
    'the_ritual_of_sakura_body_mist_rituals.jpg': 'he_ritual_of_sakura_body_mist_rituals.jpg',
    'the_ritual_of_ayurveda_eau_de_parfum_rituals.jpg': 'the_ritual_of_ayurveda_eau_de_parfum_ritual.jpg',
    'fructis_hydrating_garnier.jpg': 'fructis_hydrating_garnier..jpg'
  };

  if (fileMapping[result]) {
    return fileMapping[result];
  }

  return result;
}

// Lire le contenu du fichier data.ts
const dataContent = fs.readFileSync('lib/data.ts', 'utf8');

// Extraire les noms des produits
const productMatches = dataContent.match(/name: '([^']*)'/g);
const products = productMatches ? productMatches.map(match => match.replace(/name: '|'/g, '')) : [];

// Lire les fichiers d'images
const imageDir = 'public/image-products';
const imageFiles = fs.readdirSync(imageDir);

// Trouver les produits sans images
const productsWithoutImages = [];

for (const product of products) {
  const imageName = productNameToImageName(product);
  const imageExists = imageFiles.some(file => file === imageName);
  
  if (!imageExists) {
    productsWithoutImages.push({ product, imageName });
  }
}

console.log('Nombre total de produits:', products.length);
console.log('Nombre de produits sans images:', productsWithoutImages.length);
console.log('Produits sans images:');
productsWithoutImages.forEach(item => {
  console.log('- ' + item.product + ' (recherche: ' + item.imageName + ')');
});