const fs = require('fs');
const path = require('path');

// Mock de la fonction de lib/data.ts
function productNameToImageName(name) {
    let normalized = name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’‘`ʼ]/g, "'").replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const result = `${normalized}.jpg`;
    const baseResult = result.replace(/_\d+_ml|_extrait|_private_blend/g, '');
    return (result !== baseResult && baseResult !== '.jpg' ? baseResult : result);
}

// Liste partielle des produits (extraite manuellement ou simulée)
// Idéalement je lirais lib/data.ts mais parser du TS en JS est relou ici.
// Je vais tester les cas problématiques identifiés.

const testCases = [
    "Buffet The Ordinary",
    "Niacinamide 10% + Zinc 1% The Ordinary",
    "Revitalift Filler L’Oréal Paris",
    "100% Plant-Derived Squalane The Ordinary",
    "Fructis Hydrating Garnier",
    "Age Perfect Cell Renewal L’Oréal Paris"
];

const files = fs.readdirSync('/home/deo/Vidéos/beaut-/public/image-products');

console.log("--- Diagnostic Images ---");

testCases.forEach(productName => {
    const computed = productNameToImageName(productName);
    const exists = files.includes(computed);

    // Chercher une correspondance proche
    const similar = files.find(f => f.includes(productName.split(' ')[0].toLowerCase()));

    console.log(`Product: "${productName}"`);
    console.log(`  Computed: ${computed}`);
    console.log(`  Exists: ${exists ? '✅' : '❌'}`);
    if (!exists && similar) {
        console.log(`  Did you mean: ${similar}?`);
    }
});
