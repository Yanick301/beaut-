const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');

console.log('🔍 Checking configuration in .env.local...\n');

if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file NOT found!');
    process.exit(1);
}

// Manual parsing to avoid dependencies
const content = fs.readFileSync(envPath, 'utf8');
const env = {};
content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        env[key] = value;
    }
});

const requiredKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL' // Recommended
];

let hasError = false;

requiredKeys.forEach(key => {
    const value = env[key];
    if (!value) {
        console.error(`❌ Missing variable: ${key}`);
        hasError = true;
    } else {
        // Check for placeholders
        if (value.includes('votre-') || value.includes('your-') || value.includes('re_123') || value === '') {
            console.warn(`⚠️  WARNING: ${key} seems to contain a placeholder or default value: "${value.substring(0, 15)}..."`);
            // We don't fail, but we warn
        } else {
            // Obfuscated output
            const visible = value.length > 8 ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : '****';
            console.log(`✅ ${key} is set (${visible})`);
        }
    }
});

if (hasError) {
    console.log('\n❌ Configuration incomplete. Please check .env.local');
    process.exit(1);
} else {
    console.log('\n✅ Configuration structure looks correct!');
    console.log('👉 Next step: Run "npm run dev" manually to test the full flow.');
}
