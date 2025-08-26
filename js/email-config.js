// Email configuration for EmailJS
// IMPORTANT: Replace the placeholders with your actual EmailJS values

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
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        province: formData.get('province') || '',
        benefits: formData.get('benefits') || '',
        member_id: formData.get('member-id') || '',
        health_goals: Array.from(formData.getAll('health_goals[]')).join(', '),
        message: 'Thank you for submitting your My-Dietitian assessment',
        timestamp: new Date().toLocaleString(),
        // Include the full HTML template content for the patient email
        html_body: await loadEmailTemplate(),
        // Additional template variables
        patient_name: formData.get('name') || '',
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

// Load and customize email template content for the patient
async function loadEmailTemplate() {
    try {
        // For local development, we need to handle CORS restrictions
        // Try to load the template, but expect it might fail locally
        console.log('📧 Attempting to load email template...');
        
        const response = await fetch('./email_templates/book_appointment.html', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (response.ok) {
            let template = await response.text();
            
            // Replace placeholder text with EmailJS template variables
            template = template.replace(/\[Patient Name\]/g, '{{name}}');
            template = template.replace(/\[Dietitian Name\]/g, '{{dietitian_name}}');
            template = template.replace(/\[Your Name\]/g, '{{your_name}}');
            
            console.log('✅ Email template loaded successfully');
            return template;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.warn('❌ Could not load external template:', error.message);
        console.log('📧 Using fallback template (normal for local development)');
        return createFallbackTemplate();
    }
}

// Fallback template if the HTML file can't be loaded
function createFallbackTemplate() {
    return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #e8eaed; border-radius: 12px;">
        <div style="padding: 24px 32px; border-bottom: 1px solid #f0f2f5; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #1a1a1a;">🥗 My-Dietitian</div>
        </div>
        
        <div style="padding: 32px;">
            <div style="font-size: 16px; font-weight: 500; color: #1a1a1a; margin-bottom: 24px;">Hi {{name}},</div>
            
            <div style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
                <strong style="color: #22c55e; font-weight: 600;">Great news!</strong> We've received your My-Dietitian assessment and our team will review your information.
            </div>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
                <p style="font-size: 15px; color: #166534; margin: 0; font-weight: 500;">Assessment Received Successfully</p>
            </div>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center; border: 1px solid #e2e8f0;">
                <div style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px;">What happens next?</div>
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">We'll verify your insurance benefits and match you with a qualified dietitian</div>
                <a href="https://calendly.com/jstanislvskaia/" style="display: inline-block; background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Book Your Appointment</a>
            </div>
            
            <div style="font-size: 16px; color: #374151; margin-top: 24px;">
                Thank you for choosing My-Dietitian for your nutrition needs!
            </div>
            
            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0f2f5;">
                <div style="font-weight: 500; color: #1a1a1a; font-size: 16px; margin-bottom: 4px;">Best regards,</div>
                <div style="font-weight: 500; color: #1a1a1a; font-size: 16px; margin-bottom: 4px;">{{your_name}}</div>
                <div style="color: #6b7280; font-size: 14px;">My-Dietitian</div>
            </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #f0f2f5;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                © 2025 My-Dietitian. All rights reserved.<br>
                Connecting you with registered dietitians covered by your benefits.
            </p>
        </div>
    </div>
    `;
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
