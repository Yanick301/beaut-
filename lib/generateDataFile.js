/**
 * Script pour générer le fichier data.ts avec tous les produits
 * Utilise cette fonction pour convertir les noms de produits en noms de fichiers d'images
 */

function productNameToImageName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_àáâãäåèéêëìíîïòóôõöùúûüýÿç]/gi, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '') + '.jpg';
}

function getProductImagePath(name) {
  return `/image-products/${productNameToImageName(name)}`;
}

// Test
console.log(getProductImagePath('Fluide Solaire Teinté SPF30'));
console.log(getProductImagePath('Sérum Anti-Âge Premium'));

module.exports = { productNameToImageName, getProductImagePath };















