// EmailJS Send Module
// This module provides a simplified interface for sending emails via EmailJS

// Import configuration from email-config.js
// Note: This assumes email-config.js is loaded before this module

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

    // Option B: Send custom template parameters (using {{name}} and {{email}} variables)
    const templateParams = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        province: formData.get('province') || '',
        benefits: formData.get('benefits') || '',
        member_id: formData.get('member-id') || '',
        health_goals: Array.from(formData.getAll('health_goals[]')).join(', '),
        message: options.message || 'New My-Dietitian assessment submission',
        timestamp: new Date().toLocaleString(),
        // Additional fields can be added here
        ...options.templateParams
    };

    // Load HTML template if requested
    if (options.includeHtmlTemplate) {
        try {
            const templatePath = options.templatePath || '/email_templates/book_appointment.html';
            const response = await fetch(templatePath);
            if (response.ok) {
                templateParams.html_body = await response.text();
            }
        } catch (error) {
            console.warn('Could not load HTML template:', error);
        }
    }

    console.log('📤 Sending email with EmailJS:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        templateParams: { ...templateParams, html_body: templateParams.html_body ? '[HTML Content]' : undefined }
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
        message: 'New My-Dietitian assessment submission',
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
        message: 'EmailJS Configuration Test',
        templateParams: {
            test_mode: true
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
