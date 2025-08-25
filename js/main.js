// SheetMonkey, Formspree, and EmailJS email submission
const SHEET_MONKEY_URL = 'https://api.sheetmonkey.io/form/9MoRQbyaVfkrCsZGZW3Mt2';
const FORMSPREE_URL = 'https://formspree.io/f/xeozkgvr';

// Email template function
function createEmailTemplate(formData) {
    const fullName = formData.get('name') || '';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My-Dietitian Email</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, Arial, sans-serif;
                background-color: #fafbfc;
                line-height: 1.5;
                color: #1a1a1a;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e8eaed;
                border-radius: 12px;
                overflow: hidden;
            }
            
            .header {
                background-color: #ffffff;
                padding: 24px 32px;
                border-bottom: 1px solid #f0f2f5;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .logo-container {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .logo-icon {
                width: 48px;
                height: 48px;
                background-color: #22c55e;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            
            .logo-text {
                font-size: 24px;
                font-weight: 700;
                color: #1a1a1a;
                letter-spacing: -0.025em;
            }
            
            .content {
                padding: 32px;
            }
            
            .greeting {
                font-size: 16px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 24px;
            }
            
            .message {
                font-size: 16px;
                line-height: 1.6;
                color: #374151;
                margin-bottom: 20px;
            }
            
            .message strong {
                color: #22c55e;
                font-weight: 600;
            }
            
            .highlight-box {
                background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                border: 1px solid #bbf7d0;
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
            }
            
            .highlight-text {
                font-size: 15px;
                color: #166534;
                margin: 0;
                line-height: 1.5;
            }
            
            .next-steps {
                background-color: #f8fafc;
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
                border-left: 4px solid #22c55e;
            }
            
            .next-steps-title {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.025em;
            }
            
            .next-steps-text {
                font-size: 15px;
                color: #4b5563;
                margin: 0;
            }
            
            .closing {
                font-size: 16px;
                color: #374151;
                margin-top: 24px;
            }
            
            .signature {
                margin-top: 32px;
                padding-top: 20px;
                border-top: 1px solid #f0f2f5;
            }
            
            .signature-name {
                font-weight: 500;
                color: #1a1a1a;
                font-size: 16px;
                margin-bottom: 4px;
            }
            
            .signature-company {
                color: #6b7280;
                font-size: 14px;
            }
            
            .footer {
                background-color: #f8fafc;
                padding: 20px 32px;
                text-align: center;
                border-top: 1px solid #f0f2f5;
            }
            
            .footer-text {
                font-size: 12px;
                color: #9ca3af;
                margin: 0;
                line-height: 1.4;
            }
            
            .cta-button {
                display: inline-block;
                background-color: #22c55e;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                font-size: 15px;
                margin: 16px 0;
                transition: background-color 0.2s ease;
            }
            
            .cta-button:hover {
                background-color: #16a34a;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                    border-left: none;
                    border-right: none;
                }
                
                .content {
                    padding: 24px 20px;
                }
                
                .header {
                    padding: 20px;
                }
                
                .logo-text {
                    font-size: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo-container">
                    <div class="logo-icon">🥗</div>
                    <div class="logo-text">My-Dietitian</div>
                </div>
            </div>
            
            <div class="content">
                <div class="greeting">Hi ${fullName},</div>
                
                <div class="message">
                    <strong>Great news!</strong> We've received your assessment and found dietitians that are a perfect match for you, and accept your insurance.
                </div>
                
                <div class="highlight-box">
                    <p class="highlight-text">
                        To move forward with scheduling your appointment, we just need to quickly verify your insurance details with your insurance provider. This will only take a moment and ensures everything is set up correctly for your first session.
                    </p>
                </div>
                
                <div class="next-steps">
                    <div class="next-steps-title">What happens next</div>
                    <div class="next-steps-text">
                        We'll have you connected with your dietitian within 1-2 business days after verification is complete.
                    </div>
                </div>
                
                <div class="closing">
                    We're excited to help you get started on your health journey!
                </div>
                
                <div class="signature">
                    <div class="signature-name">Best regards,</div>
                    <div class="signature-name">The My-Dietitian Team</div>
                    <div class="signature-company">My-Dietitian</div>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    © 2025 My-Dietitian. All rights reserved.<br>
                    Connecting you with registered dietitians covered by your benefits.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

async function sendCustomEmail(formData) {
    console.log('🔄 Starting custom email send...');
    // EmailJS-only send path
    if (typeof sendContactForm === 'function' && typeof emailjs !== 'undefined') {
        try {
            console.log('📧 Sending email via EmailJS...');
            await sendContactForm(formData);
            console.log('✅ Email sent via EmailJS');
            return true;
        } catch (err) {
            console.error('❌ EmailJS send failed:', err);
            sessionStorage.setItem('emailError', JSON.stringify({
                message: err.message || String(err),
                timestamp: new Date().toISOString(),
                details: err.toString()
            }));
            throw err;
        }
    } else {
        const msg = 'EmailJS not configured or emailjs library not loaded.';
        console.error('❌', msg);
        throw new Error(msg);
    }
}

async function submitToSheetMonkey(formData) {
    try {
        const response = await fetch(SHEET_MONKEY_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Sheet Monkey typically returns a 200 status for successful submissions
        return true;
    } catch (error) {
        console.error('Sheet Monkey submission failed:', error);
        throw error;
    }
}

async function submitToFormspree(formData) {
    try {
        // Add Formspree configuration fields
        formData.append('_subject', 'New My-Dietitian Assessment Submission');
        formData.append('_autoresponse', 'Thanks! We received your assessment and will get back to you within 5 business days. A registered Dietitian from our team will be in touch soon to help you achieve your health goals.');
        formData.append('_captcha', 'false');
        
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Formspree email submission failed:', error);
        throw error;
    }
}

async function submitDualData(formData) {
    let sheetMonkeySuccess = false;
    let formspreeSuccess = false;
    let customEmailSuccess = false;
    let errors = [];

    // Try all three submissions in parallel
    try {
        await Promise.allSettled([
            submitToSheetMonkey(new FormData(document.getElementById('assessmentForm'))),
            submitToFormspree(new FormData(document.getElementById('assessmentForm'))),
            sendCustomEmail(new FormData(document.getElementById('assessmentForm')))
        ]).then(results => {
            if (results[0].status === 'fulfilled') {
                sheetMonkeySuccess = true;
            } else {
                errors.push('Database storage failed');
                console.error('SheetMonkey failed:', results[0].reason);
            }
            
            if (results[1].status === 'fulfilled') {
                formspreeSuccess = true;
            } else {
                errors.push('Email notification failed');
                console.error('Formspree failed:', results[1].reason);
            }

            if (results[2].status === 'fulfilled') {
                customEmailSuccess = true;
            } else {
                errors.push('Custom email failed');
                console.error('Custom email failed:', results[2].reason);
            }
        });

        // Require at least one submission to succeed
        if (!sheetMonkeySuccess && !formspreeSuccess) {
            throw new Error('Both database and email submissions failed');
        }

        return {
            success: true,
            sheetMonkey: sheetMonkeySuccess,
            email: formspreeSuccess,
            customEmail: customEmailSuccess,
            errors: errors
        };
    } catch (error) {
        console.error('Submission failed:', error);
        throw error;
    }
}

// Simplified form validation that works with dual submission
document.getElementById('assessmentForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Always prevent default to handle with dual submission
    
    // Check if user selected "No" for insurance benefits
    const benefitsSelect = document.getElementById('benefits');
    if (benefitsSelect && benefitsSelect.value === 'No') {
        // Redirect to Health811 page instead of submitting form
        window.location.href = 'html/health811-redirect.html';
        return;
    }
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    
    let isValid = true;
    
    // Validate required fields
    const requiredFields = [
        {id: 'name', error: 'nameError', message: 'Name is required'},
        {id: 'email', error: 'emailError', message: 'Email is required'},
        {id: 'phone', error: 'phoneError', message: 'Phone number is required'},
        {id: 'province', error: 'provinceError', message: 'Province is required'},
        {id: 'benefits', error: 'benefitsError', message: 'Benefits information is required'},
        {id: 'member-id', error: 'memberIdError', message: 'Member ID is required'}
    ];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.error);
        
        console.log(`Validating field: ${field.id}, element:`, input, `type: ${input?.type}, value:`, input?.value);
        
        if (!input) {
            console.error(`Form validation error: Element with ID '${field.id}' not found`);
            return;
        }
        
        // Simple validation - check if field has a value
        let isEmpty = false;
        if (input.type === 'checkbox') {
            isEmpty = !input.checked;
        } else if (input.value === undefined || input.value === null) {
            isEmpty = true;
        } else {
            isEmpty = !input.value.trim();
        }
        
        if (isEmpty) {
            if (errorElement) {
                errorElement.textContent = field.message;
            }
            isValid = false;
        }
    });
    
    // Validate email format
    const emailElement = document.getElementById('email');
    if (emailElement && emailElement.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailElement.value)) {
            const emailError = document.getElementById('emailError');
            if (emailError) {
                emailError.textContent = 'Please enter a valid email address';
            }
            isValid = false;
        }
    }
    
    // Validate phone number format
    const phoneElement = document.getElementById('phone');
    if (phoneElement && phoneElement.value) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(phoneElement.value)) {
            const phoneError = document.getElementById('phoneError');
            if (phoneError) {
                phoneError.textContent = 'Please enter a valid Canadian phone number: (___) ___-____';
            }
            isValid = false;
        }
    }
    
    // Validate health goals (at least one must be selected)
    const goals = document.querySelectorAll('input[name="health_goals[]"]:checked');
    if (goals.length === 0) {
        const goalsError = document.getElementById('goalsError');
        if (goalsError) {
            goalsError.textContent = 'Please select at least one health goal';
        }
        isValid = false;
    }
    
    if (!isValid) {
        return false;
    }
    
    // If validation passes, show loading state and submit to both services
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton.innerHTML;
    submitButton.classList.add('loading');
    submitButton.innerHTML = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Submit to both SheetMonkey and Formspree
        const formData = new FormData(this);
        console.log('📋 Form data collected, starting submission...');
        
        const result = await submitDualData(formData);
        console.log('🎯 Submission result:', result);
        
        // Show success message
        let successMessage = '✅ Your assessment has been submitted successfully!';
        if (result.errors.length > 0) {
            console.warn('⚠️ Some submission errors occurred:', result.errors);
            successMessage += ' Note: ' + result.errors.join(', ') + '.';
        }
        
        // Show success message in the form
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = successMessage;
        successDiv.style.display = 'block';
        
        // Store success info in sessionStorage
        sessionStorage.setItem('submissionSuccess', JSON.stringify({
            timestamp: new Date().toISOString(),
            sheetMonkey: result.sheetMonkey,
            email: result.email,
            customEmail: result.customEmail,
            errors: result.errors
        }));
        
        // Redirect to thank you page after brief delay
        setTimeout(() => {
            window.location.href = 'html/thank-you.html';
        }, 2000);
        
    } catch (error) {
        console.error('💥 Form submission failed:', {
            error: error,
            message: error.message,
            stack: error.stack
        });
        
        // Store detailed error info
        sessionStorage.setItem('submissionError', JSON.stringify({
            message: error.message,
            timestamp: new Date().toISOString(),
            details: error.toString(),
            stack: error.stack
        }));
        
        // Reset button state on error
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        submitButton.classList.remove('loading');
        
        // Show detailed error message
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = `❌ Submission failed: ${error.message}. Please try again or contact support.`;
        successDiv.style.display = 'block';
        successDiv.style.background = '#fef2f2';
        successDiv.style.color = '#dc2626';
        successDiv.style.borderColor = '#fecaca';
        
        // Also alert the error so it doesn't disappear
        alert(`Form submission failed: ${error.message}\n\nPlease check the console for more details and try again.`);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Phone number formatting
function formatPhoneNumber(value) {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format based on length
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

// Add phone number formatting on input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const cursorPosition = e.target.selectionStart;
            const formatted = formatPhoneNumber(e.target.value);
            const lengthDiff = formatted.length - e.target.value.length;
            
            e.target.value = formatted;
            
            // Maintain cursor position accounting for formatting characters
            e.target.setSelectionRange(cursorPosition + lengthDiff, cursorPosition + lengthDiff);
        });

        // Prevent non-digit characters except formatting ones
        phoneInput.addEventListener('keydown', function(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
});

// Header background change on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Debug function to test EmailJS sending
function testEmailDebug() {
    console.log('🧪 Running EmailJS debug test...');

    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS library not loaded! Include the CDN script.');
        alert('EmailJS library not loaded. Check the script tag in index.html');
        return;
    }

    // Create test form data
    const testFormData = new FormData();
    testFormData.append('name', 'Test User');
    testFormData.append('email', 'test@example.com');

    // Test the email function
    sendCustomEmail(testFormData)
        .then(() => {
            console.log('✅ Test email sent successfully via EmailJS');
            alert('Test email sent successfully! Check the console for details.');
        })
        .catch((error) => {
            console.error('❌ Test email failed:', error);
            alert(`Test email failed: ${error.message}\nCheck the console for details.`);
        });
}

// Expose EmailJS test helper
function testEmailJSSend() {
    if (typeof testEmailJSConfig !== 'function') {
        alert('EmailJS test helper not available. Ensure js/emailjs-send.js is loaded and EMAILJS is configured.');
        return;
    }

    testEmailJSConfig()
        .then(() => {
            console.log('✅ EmailJS test send succeeded');
            alert('EmailJS test send succeeded!');
        })
        .catch((err) => {
            console.error('❌ EmailJS test send failed:', err);
            alert(`EmailJS test failed: ${err.message || String(err)}`);
        });
}

// Debug panel removed for production

// Make functions globally available for debugging
window.testEmailDebug = testEmailDebug;
window.testEmailJSSend = testEmailJSSend;
