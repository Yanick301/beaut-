const fs = require('fs');
const http = require('http');
const path = require('path');

const reportPath = path.join(__dirname, '../IMAGE_DISPLAY_SIMULATION.txt');
const baseUrl = 'http://127.0.0.1:3005';

const devices = {
  desktop: { accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
  android: { accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
  iphone: { accept: 'image/webp,image/*,*/*;q=0.8' }
};

function loadReport() {
  const content = fs.readFileSync(reportPath, 'utf-8');
  return JSON.parse(content);
}

function requestImage(pathname, accept, timeout = 5000) {
  return new Promise((resolve) => {
    const opts = {
      method: 'GET',
      host: '127.0.0.1',
      port: 3005,
      path: pathname,
      headers: { Accept: accept }
    };

    const req = http.request(opts, (res) => {
      // consume data to free socket
      res.on('data', () => {});
      res.on('end', () => {
        resolve({ status: res.statusCode, contentType: res.headers['content-type'] || null });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve({ error: 'timeout' });
    });
    req.end();
  });
}

async function run() {
  if (!fs.existsSync(reportPath)) {
    console.error('Report not found:', reportPath);
    process.exit(1);
  }

  const data = loadReport();
  const images = Array.from(new Set(data.report.map(r => r.imageFile)));

  console.log(`Testing ${images.length} unique images on ${baseUrl}...`);

  const results = [];

  for (const img of images) {
    const pathname = `/image-products/${img}`;
    const entry = { image: img, results: {} };
    for (const dev of Object.keys(devices)) {
      const res = await requestImage(pathname, devices[dev].accept);
      entry.results[dev] = res;
    }
    results.push(entry);
    // small delay to avoid overwhelming server
    await new Promise(r => setTimeout(r, 25));
  }

  const outPath = path.join(__dirname, '../HTTP_IMAGE_TEST_RESULT.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log('Done. Results saved to', outPath);

  // Summarize failures
  const failures = results.filter(r => Object.values(r.results).some(x => x.status !== 200));
  console.log(`Failures: ${failures.length} images returned non-200 for at least one device`);
  if (failures.length > 0) {
    failures.slice(0, 50).forEach(f => {
      console.log(`- ${f.image}:`, f.results);
    });
  }
}

run().catch(err => { console.error(err); process.exit(1); });
