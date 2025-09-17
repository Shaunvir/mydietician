// Email configuration for EmailJS
// SECURITY WARNING: These are public API keys for a static website hosted on GoDaddy.
// EmailJS public keys are designed to be exposed in client-side code, but you should:
// 1. Configure domain restrictions in your EmailJS dashboard
// 2. Set up rate limiting and usage monitoring
// 3. Regularly rotate these keys if needed
// 4. Monitor usage in your EmailJS dashboard

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = '6fXer2OnVAybIBX6Y';
const EMAILJS_SERVICE_ID = 'service_1mejwpv';
const EMAILJS_TEMPLATE_ID = 'template_e433nzb';

// EmailJS-only configuration (legacy SMTP removed)

// EmailJS send function
async function sendEmailWithEmailJS(formData) {
    console.log('📧 Attempting to send email with EmailJS...');
    
    // Check if EmailJS is initialized
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS not loaded. Please ensure the EmailJS CDN script is included.');
    }
    
    // Check if configuration is set up
    if (EMAILJS_PUBLIC_KEY === '<YOUR_EMAILJS_PUBLIC_KEY>' || 
        EMAILJS_SERVICE_ID === '<YOUR_EMAILJS_SERVICE_ID>' || 
        EMAILJS_TEMPLATE_ID === '<YOUR_EMAILJS_TEMPLATE_ID>') {
        throw new Error('EmailJS not configured. Please update the configuration values in email-config.js');
    }
    
    // Prepare template parameters (sending TO the patient using {{email}})
    const templateParams = {
        name: formData.get('first_name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        province: formData.get('province') || '',
        benefits: formData.get('benefits') || '',
        member_id: formData.get('member-id') || '',
        health_goals: Array.from(formData.getAll('health_goals[]')).join(', '),
        message: 'Thank you for submitting your My-Dietitian assessment',
        timestamp: new Date().toLocaleString(),
        // Additional template variables
        patient_name: formData.get('first_name') || '',
        patient_email: formData.get('email') || '',
        dietitian_name: '[Dietitian Name]', // This can be customized later
        your_name: 'My-Dietitian Team' // This can be customized later
    };
    
    console.log('📤 Sending email with template params:', templateParams);
    
    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ EmailJS send successful:', result);
        return result;
    } catch (error) {
        console.error('❌ EmailJS send failed:', error);
        throw error;
    }
}


// Debug function to test email configuration
function debugEmailConfig() {
    console.log('🔧 Email Configuration Debug:');
    
    // Check EmailJS configuration
    console.log('EmailJS Config:', {
        HasPublicKey: !!EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== '<YOUR_EMAILJS_PUBLIC_KEY>',
        HasServiceId: !!EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID !== '<YOUR_EMAILJS_SERVICE_ID>',
        HasTemplateId: !!EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== '<YOUR_EMAILJS_TEMPLATE_ID>',
        EmailJSLoaded: typeof emailjs !== 'undefined'
    });
    
    // Test basic connectivity
    console.log('🌐 Testing CORS and connectivity...');
    try {
        // This is a simple test to see if we can make requests
        fetch('https://httpbin.org/get', { method: 'GET', mode: 'cors' })
            .then(() => console.log('✅ CORS requests working'))
            .catch((err) => console.warn('⚠️ CORS might be restricted:', err.message));
    } catch (e) {
        console.warn('⚠️ Basic connectivity test failed:', e.message);
    }
    
    return true;
}

// Auto-run debug on load
window.addEventListener('load', () => {
    setTimeout(debugEmailConfig, 1000);
});

// Make functions globally available
window.sendEmailWithEmailJS = sendEmailWithEmailJS;

// Instructions:
/*
EmailJS Setup Instructions:

1. CREATE EMAILJS ACCOUNT:
   - Go to https://www.emailjs.com and sign up
   - Create a new service (Gmail, Outlook, etc.)
   - Note down your Service ID (e.g., service_xxx)

2. CREATE EMAIL TEMPLATE:
   - Go to Email Templates > New Template
   - Use these variables in your template:
     * {{name}} - Patient's name
     * {{email}} - Patient's email
     * {{phone}} - Patient's phone
     * {{province}} - Patient's province
     * {{benefits}} - Benefits information
     * {{member_id}} - Member ID
     * {{health_goals}} - Selected health goals
     * {{message}} - Form message
     * {{timestamp}} - Submission timestamp
     * {{html_body}} - Pre-rendered HTML template
   - Note down your Template ID (e.g., template_xxx)

3. GET PUBLIC KEY:
   - Go to Integration > General
   - Copy your Public Key (e.g., user_xxx or starts with user_)

4. UPDATE CONFIGURATION:
   - Replace <YOUR_EMAILJS_PUBLIC_KEY> with your actual public key
   - Replace <YOUR_EMAILJS_SERVICE_ID> with your actual service ID
   - Replace <YOUR_EMAILJS_TEMPLATE_ID> with your actual template ID

5. INCLUDE EMAILJS CDN:
   - Add the EmailJS script to your HTML pages (see index.html)

Example EmailJS Template:
Subject: New My-Dietitian Assessment from {{name}}

HTML Body:
<div>
  <h2>New Assessment Submission</h2>
  <p><strong>Name:</strong> {{name}}</p>
  <p><strong>Email:</strong> {{email}}</p>
  <p><strong>Phone:</strong> {{phone}}</p>
  <p><strong>Province:</strong> {{province}}</p>
  <p><strong>Benefits:</strong> {{benefits}}</p>
  <p><strong>Member ID:</strong> {{member_id}}</p>
  <p><strong>Health Goals:</strong> {{health_goals}}</p>
  <p><strong>Submitted:</strong> {{timestamp}}</p>
  <hr/>
  <div>{{html_body}}</div>
</div>

*/
