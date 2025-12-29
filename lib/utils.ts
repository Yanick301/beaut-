/**
 * Convertit un nom de produit en nom de fichier image
 * Exemple: "Fluide Solaire Teinté SPF30" -> "fluide_solaire_teinté_spf30.jpg"
 */
export function productNameToImageName(productName: string): string {
  return productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_') // Remplace les espaces par des underscores
    .replace(/[^a-z0-9_àáâãäåèéêëìíîïòóôõöùúûüýÿç]/gi, '') // Garde uniquement lettres, chiffres, underscores et accents
    .replace(/_{2,}/g, '_') // Remplace plusieurs underscores consécutifs par un seul
    .replace(/^_|_$/g, '') // Supprime les underscores en début/fin
    + '.jpg';
}

/**
 * Génère le chemin complet vers l'image d'un produit
 */
export function getProductImagePath(productName: string): string {
  return `/image-products/${productNameToImageName(productName)}`;
}














