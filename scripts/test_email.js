require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testEmail() {
    console.log('📧 Testing Resend Configuration...');

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is missing in .env.local');
        return;
    }
    console.log(`🔑 API Key found (${apiKey.substring(0, 5)}...)`);

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Try to send to the admin email or a fallback
    // Note: On free Resend plan, you can ONLY send to the email you registered with 
    // unless you verified a domain.
    const toEmail = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',')[0] : 'delivered@resend.dev';

    console.log(`📨 Attempting to send email...`);
    console.log(`   From: ${fromEmail}`);
    console.log(`   To: ${toEmail}`);

    try {
        const data = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: 'Test Email via Script',
            html: '<p>Congrats! Your Resend configuration is working! 🎉</p>'
        });

        if (data.error) {
            console.error('❌ API returned an error:', data.error);
        } else {
            console.log('✅ Success! Email ID:', data.id);
            console.log('👉 Please check your inbox (and spam folder) for ' + toEmail);
        }
    } catch (error) {
        console.error('❌ Exception occurred:', error.message);
        if (error.response) {
            console.error('   Response data:', error.response.data);
        }
    }
}

testEmail();
