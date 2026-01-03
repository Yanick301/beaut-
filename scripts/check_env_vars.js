
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const vars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SITE_URL'
];

console.log('--- Env Var Check ---');
vars.forEach(v => {
    const present = !!process.env[v];
    const value = process.env[v];
    const masked = value ? (value.length > 8 ? value.substring(0, 4) + '...' + value.substring(value.length - 4) : 'set') : 'MISSING';
    console.log(`${v}: ${masked}`);
});
console.log('---------------------');
