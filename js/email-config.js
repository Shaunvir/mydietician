// Email configuration for SMTP.js
// IMPORTANT: You need to set up an SMTP service to use this functionality

const EMAIL_CONFIG = {
    // Option 1: Use ElasticEmail (recommended for production)
    elasticEmail: {
        Host: "smtp.elasticemail.com",
        Username: "my.dietitian.ca@gmail.com",
        Password: "09A704EB69609A97EC51C3DF6F9BB4455894", // ElasticEmail API key
        Port: 2525,
        EnableSSL: true
    },
    
    // Option 2: Use SMTP2GO
    smtp2go: {
        Host: "mail.smtp2go.com",
        Username: "my.dietitian.ca@gmail.com", 
        Password: "YOUR_SMTP2GO_PASSWORD",
        Port: 2525,
        EnableSSL: true
    },
    
    // Option 3: Use SendGrid SMTP
    sendGrid: {
        Host: "smtp.sendgrid.net",
        Username: "apikey",
        Password: "YOUR_SENDGRID_API_KEY",
        Port: 587,
        EnableSSL: true
    },
    
    // Option 4: SMTP.js Secure Token (Alternative approach for CORS issues)
    // You can get a secure token from: https://smtpjs.com/
    secureToken: {
        SecureToken: "YOUR_SECURE_TOKEN_HERE", // Get this from smtpjs.com after setting up
        UseSecureToken: true
    }
};

// Default configuration (you can switch between services)
const SMTP_CONFIG = EMAIL_CONFIG.elasticEmail;

// Alternative email sending function using secure token (CORS-friendly)
async function sendEmailWithSecureToken(formData) {
    console.log('🔐 Attempting to send email with secure token...');
    
    if (!EMAIL_CONFIG.secureToken.SecureToken || EMAIL_CONFIG.secureToken.SecureToken === "YOUR_SECURE_TOKEN_HERE") {
        throw new Error('Secure token not configured. Please set up at https://smtpjs.com/');
    }
    
    const userEmail = formData.get('email');
    const userName = formData.get('name');
    const emailBody = createEmailTemplate(formData);
    
    const result = await Email.send({
        SecureToken: EMAIL_CONFIG.secureToken.SecureToken,
        To: userEmail,
        From: "my.dietitian.ca@gmail.com",
        Subject: `Welcome to My-Dietitian, ${userName}! Your Assessment Received`,
        Body: emailBody
    });
    
    return result;
}

// Debug function to test email configuration
function debugEmailConfig() {
    console.log('🔧 Email Configuration Debug:');
    console.log('SMTP_CONFIG:', {
        Host: SMTP_CONFIG.Host,
        Username: SMTP_CONFIG.Username,
        Port: SMTP_CONFIG.Port,
        HasPassword: !!SMTP_CONFIG.Password,
        PasswordLength: SMTP_CONFIG.Password ? SMTP_CONFIG.Password.length : 0,
        EnableSSL: SMTP_CONFIG.EnableSSL
    });
    
    console.log('Secure Token Config:', {
        HasSecureToken: !!EMAIL_CONFIG.secureToken.SecureToken,
        IsConfigured: EMAIL_CONFIG.secureToken.SecureToken !== "YOUR_SECURE_TOKEN_HERE"
    });
    
    // Check if Email object is available (SMTP.js loaded)
    if (typeof Email === 'undefined') {
        console.error('❌ SMTP.js not loaded! Email object is undefined.');
        alert('SMTP.js not loaded! Check the script tag in your HTML.');
        return false;
    } else {
        console.log('✅ SMTP.js loaded successfully');
    }
    
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

// Make secure token function globally available
window.sendEmailWithSecureToken = sendEmailWithSecureToken;

// Instructions:
/*
CORS Solutions:

1. DIRECT SMTP (Current setup):
   - Uses ElasticEmail directly
   - May have CORS issues in some browsers
   - Requires proper SMTP credentials

2. SECURE TOKEN (Alternative):
   - Visit https://smtpjs.com/
   - Set up your SMTP server there
   - Get a secure token
   - Update EMAIL_CONFIG.secureToken.SecureToken
   - This bypasses CORS by using SMTP.js proxy

3. SERVER-SIDE (Recommended for production):
   - Move email sending to your server
   - Use server-side libraries
   - No CORS issues

Setup Steps:
1. Try current ElasticEmail setup first
2. If CORS errors occur, set up secure token at smtpjs.com
3. For production, consider server-side email sending
*/
