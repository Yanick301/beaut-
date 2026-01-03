const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/image-products');

const accentMap = {
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
  'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
  'ý': 'y', 'ÿ': 'y',
  'ç': 'c'
};

function normalizeBase(name) {
  return name
    .toLowerCase()
    .trim()
    .split('')
    .map(ch => accentMap[ch] || ch)
    .join('')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

function ensureJpgExtension(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return '.jpg';
  return '.jpg';
}

function buildPlannedRenames(files) {
  const planned = [];
  const targetCount = new Map();

  files.forEach(file => {
    const ext = ensureJpgExtension(file);
    const base = path.basename(file, path.extname(file));
    const normalizedBase = normalizeBase(base);
    const targetBase = normalizedBase || normalizedBase; // guard
    let targetName = `${targetBase}${ext}`;
    // ensure uniqueness among targets
    if (targetCount.has(targetName)) {
      const count = targetCount.get(targetName) + 1;
      targetCount.set(targetName, count);
      const newName = `${targetBase}_${count}${ext}`;
      targetName = newName;
      targetCount.set(newName, 1);
    } else {
      targetCount.set(targetName, 1);
    }

    if (file !== targetName) {
      planned.push({ from: file, to: targetName });
    }
  });

  return planned;
}

function previewAndMaybeApply(apply) {
  const all = fs.readdirSync(imagesDir);
  const jpgFiles = all.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));
  const planned = buildPlannedRenames(jpgFiles.map(f => f));

  const reportPath = path.join(__dirname, '../PLANNED_IMAGE_RENAMES.json');
  fs.writeFileSync(reportPath, JSON.stringify(planned, null, 2), 'utf-8');

  console.log(`Found ${jpgFiles.length} jpg/jpeg files. Planned renames: ${planned.length}`);
  planned.slice(0, 200).forEach((p, i) => {
    console.log(`${i + 1}. ${p.from} -> ${p.to}`);
  });
  if (planned.length > 200) console.log(`... and ${planned.length - 200} more`);
  console.log(`\nPlanned mapping saved to: ${reportPath}`);

  if (!apply) {
    console.log('\nRun with --apply to perform the renames.');
    return;
  }

  // Apply renames
  console.log('\nApplying renames...');
  planned.forEach(p => {
    const src = path.join(imagesDir, p.from);
    const dst = path.join(imagesDir, p.to);
    try {
      // if dst exists, move it to a backup name to avoid overwrite
      if (fs.existsSync(dst)) {
        const backup = dst + '.bak';
        fs.renameSync(dst, backup);
        console.log(`Existing target ${p.to} backed up as ${path.basename(backup)}`);
      }
      fs.renameSync(src, dst);
      console.log(`Renamed: ${p.from} -> ${p.to}`);
    } catch (err) {
      console.error(`Failed to rename ${p.from} -> ${p.to}: ${err.message}`);
    }
  });

  console.log('Renames applied.');
}

const apply = process.argv.includes('--apply');
previewAndMaybeApply(apply);
