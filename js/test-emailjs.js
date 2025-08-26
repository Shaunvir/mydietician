#!/usr/bin/env node

// Quick test to verify EmailJS configuration is valid
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing EmailJS Configuration...\n');

// Read the email-config.js file
const configPath = path.join(__dirname, 'js', 'email-config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract configuration values
const publicKeyMatch = configContent.match(/EMAILJS_PUBLIC_KEY = '([^']+)'/);
const serviceIdMatch = configContent.match(/EMAILJS_SERVICE_ID = '([^']+)'/);
const templateIdMatch = configContent.match(/EMAILJS_TEMPLATE_ID = '([^']+)'/);

if (publicKeyMatch && serviceIdMatch && templateIdMatch) {
    const publicKey = publicKeyMatch[1];
    const serviceId = serviceIdMatch[1];
    const templateId = templateIdMatch[1];
    
    console.log('✅ EmailJS Configuration Found:');
    console.log(`   Public Key: ${publicKey}`);
    console.log(`   Service ID: ${serviceId}`);
    console.log(`   Template ID: ${templateId}\n`);
    
    // Check if values are not placeholders
    if (publicKey !== '<YOUR_EMAILJS_PUBLIC_KEY>' && 
        serviceId !== '<YOUR_EMAILJS_SERVICE_ID>' && 
        templateId !== '<YOUR_EMAILJS_TEMPLATE_ID>') {
        console.log('✅ Configuration values appear to be set correctly!');
        console.log('\n📋 Next steps:');
        console.log('1. Open http://localhost:8000 in your browser');
        console.log('2. Open browser console (F12)');
        console.log('3. Run: testEmailJSSend() to test email sending');
        console.log('4. Check EmailJS dashboard for delivery logs');
        console.log('\n🎯 Template Variables Used:');
        console.log('   {{name}} - Patient\'s name');
        console.log('   {{email}} - Patient\'s email');
        console.log('   {{phone}} - Patient\'s phone');
        console.log('   {{province}} - Patient\'s province');
        console.log('   {{benefits}} - Benefits information');
        console.log('   {{member_id}} - Member ID');
        console.log('   {{health_goals}} - Selected health goals');
        console.log('   {{message}} - Form message');
        console.log('   {{timestamp}} - Submission timestamp');
        console.log('   {{html_body}} - Pre-rendered HTML template');
    } else {
        console.log('❌ Configuration still contains placeholder values');
        console.log('   Please update the values in js/email-config.js');
    }
} else {
    console.log('❌ Could not parse EmailJS configuration');
}

console.log('\n🌐 Local server is running at: http://localhost:8000');
console.log('📊 EmailJS Dashboard: https://dashboard.emailjs.com/');
