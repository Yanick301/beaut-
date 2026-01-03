
const fs = require('fs');
const path = require('path');

// Logic from lib/data.ts
function cleanName(name) {
    // We assume the input 'name' is the FILENAME (without .jpg maybe, or with?)
    // Actually, data.ts logic is applied to PRODUCT NAME.
    // But here we only have FILES.
    // We need to assume the file names currently roughly match the product names but might have accents.
    // So we just want to strip accents from the filenames.

    // Logic to strip accents from a string
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    // We do NOT want to apply other regexes blindly if they were already applied partially,
    // but the safest is to just strip diacritics from the existing filename.
    // The existing filenames already have underscores instead of spaces presumably.
    // Let's just fix the non-ascii characters.
}

const dir = path.join(__dirname, '../public/image-products');
const files = fs.readdirSync(dir);

let renamedCount = 0;

files.forEach(file => {
    const cleaned = cleanName(file);

    if (file !== cleaned) {
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, cleaned);

        // Check if target already exists (collision)
        if (fs.existsSync(newPath)) {
            console.warn(`Skipping ${file} -> ${cleaned} because target exists.`);
        } else {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${file} -> ${cleaned}`);
            renamedCount++;
        }
    }
});

console.log(`\nRenamed ${renamedCount} files.`);
