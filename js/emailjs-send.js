// EmailJS Send Module
// This module provides a simplified interface for sending emails via EmailJS

// Import configuration from email-config.js
// Note: This assumes email-config.js is loaded before this module

/**
 * Generate a fallback HTML template when file loading fails
 * @param {Object} templateParams - Template parameters
 * @returns {String} HTML template string
 */
function generateFallbackHTMLTemplate(templateParams) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🥗 My-Dietitian</h1>
            </div>
            <div class="content">
                <h2>Hello ${templateParams.to_name || templateParams.patient_name || templateParams.name || 'Valued Customer'}!</h2>
                <p>Thank you for submitting your My-Dietitian assessment. We received your information and will get back to you within 5 business days.</p>
                <p><strong>Your Details:</strong></p>
                <ul>
                    <li>Name: ${templateParams.to_name || templateParams.patient_name || templateParams.name}</li>
                    <li>Email: ${templateParams.to_email || templateParams.patient_email || templateParams.email}</li>
                    <li>Phone: ${templateParams.phone}</li>
                    <li>Province: ${templateParams.province}</li>
                    <li>Health Goals: ${templateParams.health_goals}</li>
                </ul>
                <p>A registered Dietitian from our team will be in touch soon to help you achieve your health goals.</p>
            </div>
            <div class="footer">
                <p>© 2025 My-Dietitian. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Send form data via EmailJS
 * @param {HTMLFormElement|FormData} form - The form element or FormData object
 * @param {Object} options - Additional options
 * @returns {Promise} EmailJS send promise
 */
async function sendFormViaEmailJS(form, options = {}) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS not loaded. Please include the EmailJS CDN script.');
    }

    // Initialize EmailJS if not already done
    if (typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== '<YOUR_EMAILJS_PUBLIC_KEY>') {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            console.log('✅ EmailJS initialized in sendFormViaEmailJS');
        } catch (initError) {
            console.warn('EmailJS init warning:', initError);
        }
    }

    // Check if configuration is available
    if (typeof EMAILJS_PUBLIC_KEY === 'undefined' || 
        typeof EMAILJS_SERVICE_ID === 'undefined' || 
        typeof EMAILJS_TEMPLATE_ID === 'undefined') {
        throw new Error('EmailJS configuration not found. Please ensure email-config.js is loaded.');
    }

    // Check if configuration is set up
    if (EMAILJS_PUBLIC_KEY === '<YOUR_EMAILJS_PUBLIC_KEY>' || 
        EMAILJS_SERVICE_ID === '<YOUR_EMAILJS_SERVICE_ID>' || 
        EMAILJS_TEMPLATE_ID === '<YOUR_EMAILJS_TEMPLATE_ID>') {
        throw new Error('EmailJS not configured. Please update the configuration values in email-config.js');
    }

    let formData;
    if (form instanceof FormData) {
        formData = form;
    } else if (form instanceof HTMLFormElement) {
        formData = new FormData(form);
    } else {
        throw new Error('Invalid form parameter. Expected HTMLFormElement or FormData.');
    }

    // Option A: Send form directly (when input names match template variables)
    if (options.sendForm && form instanceof HTMLFormElement) {
        return emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    }

    // Option B: Send custom template parameters (sending TO the patient using {{email}})
    const firstName = formData.get('first_name') || '';
    const email = formData.get('email') || '';
    
    const templateParams = {
        // Multiple name field variations to ensure compatibility
        name: firstName,
        first_name: firstName,
        patient_name: firstName,
        to_name: firstName,
        user_name: firstName,
        
        // Multiple email field variations
        email: email,
        to_email: email,
        patient_email: email,
        user_email: email,
        
        // Other form fields
        phone: formData.get('phone') || '',
        province: formData.get('province') || '',
        benefits: formData.get('benefits') || '',
        member_id: formData.get('member-id') || '',
        health_goals: Array.from(formData.getAll('health_goals[]')).join(', '),
        message: options.message || 'Thank you for submitting your My-Dietitian assessment',
        timestamp: new Date().toLocaleString(),
        
        // Sender information
        dietitian_name: options.dietitianName || '[Dietitian Name]',
        your_name: options.yourName || 'My-Dietitian Team',
        from_name: options.fromName || 'My-Dietitian Team',
        
        // Additional fields can be added here
        ...options.templateParams
    };

    // Load HTML template if requested (but skip if running from file:// protocol)
    if (options.includeHtmlTemplate && window.location.protocol !== 'file:') {
        try {
            const templatePath = options.templatePath || '/email_templates/book_appointment.html';
            const response = await fetch(templatePath);
            if (response.ok) {
                templateParams.html_body = await response.text();
            }
        } catch (error) {
            console.warn('Could not load HTML template:', error);
            // Fallback to basic text template
            templateParams.html_body = generateFallbackHTMLTemplate(templateParams);
        }
    } else if (options.includeHtmlTemplate) {
        // Use fallback template when running from file:// protocol
        templateParams.html_body = generateFallbackHTMLTemplate(templateParams);
    }

    console.log('📤 Sending email with EmailJS:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        templateParams: { ...templateParams, html_body: templateParams.html_body ? '[HTML Content]' : undefined }
    });

    console.log('🔍 Template Parameters Debug:', {
        name: templateParams.name,
        patient_name: templateParams.patient_name,
        email: templateParams.email,
        patient_email: templateParams.patient_email,
        formDataKeys: Array.from(formData.keys())
    });

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}

/**
 * Send contact form (convenience function for the main assessment form)
 * @param {HTMLFormElement|FormData} form - The contact form
 * @returns {Promise} EmailJS send promise
 */
async function sendContactForm(form) {
    return sendFormViaEmailJS(form, {
        message: 'Thank you for submitting your My-Dietitian assessment',
        includeHtmlTemplate: true,
        templatePath: '/email_templates/book_appointment.html'
    });
}

/**
 * Test EmailJS configuration
 * @returns {Promise} Test send promise
 */
async function testEmailJSConfig() {
    const testData = new FormData();
    testData.set('name', 'Test User');
    testData.set('email', 'test@example.com');
    testData.set('phone', '(555) 123-4567');
    testData.set('province', 'ON');
    testData.set('benefits', 'Yes');
    testData.set('member-id', 'TEST123');
    testData.set('health_goals[]', 'Weight Loss');

    return sendFormViaEmailJS(testData, {
        message: 'Welcome to My-Dietitian! Thank you for your test submission.',
        templateParams: {
            test_mode: true,
            dietitian_name: 'Dr. Test Nutritionist',
            your_name: 'My-Dietitian Team'
        }
    });
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.sendFormViaEmailJS = sendFormViaEmailJS;
    window.sendContactForm = sendContactForm;
    window.testEmailJSConfig = testEmailJSConfig;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendFormViaEmailJS,
        sendContactForm,
        testEmailJSConfig
    };
}
