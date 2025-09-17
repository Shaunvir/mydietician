// SheetMonkey and EmailJS email submission
const SHEET_MONKEY_URL = 'https://api.sheetmonkey.io/form/9MoRQbyaVfkrCsZGZW3Mt2';
const FORMSPREE_URL = 'https://formspree.io/f/xeozkgvr';

/**
 * Creates a professional HTML email template for My-Dietitian submissions
 * @param {FormData} formData - The form data containing user information
 * @returns {string} Complete HTML email template with inline styles
 */
function createEmailTemplate(formData) {
    const firstName = formData.get('first_name') || '';
    const lastName = formData.get('last_name') || '';
    const fullName = `${firstName} ${lastName}`.trim();

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

/**
 * Sends custom email using EmailJS service
 * @param {FormData} formData - The form data to send via email
 * @returns {Promise<boolean>} True if email sent successfully, throws error if failed
 * @throws {Error} When EmailJS is not configured or send fails
 */
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

/**
 * Submits form data to SheetMonkey for database storage
 * @param {FormData} formData - The form data to submit
 * @returns {Promise<boolean>} True if submission successful
 * @throws {Error} When submission fails or HTTP error occurs
 */
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

/**
 * Submits form data to Formspree for email notifications
 * @param {FormData} formData - The form data to submit
 * @returns {Promise<boolean>} True if submission successful
 * @throws {Error} When submission fails or HTTP error occurs
 */
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



/**
 * Submits form data to multiple services in parallel with error handling
 * @param {FormData} formData - The form data to submit to all services
 * @returns {Promise<Object>} Object containing success status and service results
 * @property {boolean} success - True if at least one service succeeded
 * @property {boolean} sheetMonkey - SheetMonkey submission result
 * @property {boolean} email - Formspree submission result  
 * @property {boolean} customEmail - EmailJS submission result
 * @property {string[]} errors - Array of error messages for failed services
 * @throws {Error} When all services fail to submit
 */
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

/**
 * Validates required form fields based on current form state
 * @param {boolean} hasBenefits - Whether user has insurance benefits
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateFormFields(hasBenefits) {
    const errors = [];
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    
    // Define required fields
    const requiredFields = [
        {id: 'first-name', error: 'firstNameError', message: 'First name is required'},
        {id: 'last-name', error: 'lastNameError', message: 'Last name is required'},
        {id: 'date-of-birth', error: 'dateOfBirthError', message: 'Date of birth is required'},
        {id: 'email', error: 'emailError', message: 'Email is required'},
        {id: 'phone', error: 'phoneError', message: 'Phone number is required'},
        {id: 'province', error: 'provinceError', message: 'Province is required'},
        {id: 'benefits', error: 'benefitsError', message: 'Benefits information is required'}
    ];

    // Add insurance fields if benefits = "Yes"
    if (hasBenefits) {
        requiredFields.push(
            {id: 'insurance', error: 'insuranceError', message: 'Insurance provider is required'},
            {id: 'member-id', error: 'memberIdError', message: 'Member ID is required'},
            {id: 'group-number', error: 'groupNumberError', message: 'Group number is required'}
        );
    }
    
    // Validate required fields
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.error);
        
        if (!input) {
            console.error(`Form validation error: Element with ID '${field.id}' not found`);
            return;
        }
        
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
            errors.push(field.message);
        }
    });
    
    return { isValid, errors };
}

/**
 * Validates email format using standard regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates Canadian phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone format is valid
 */
function validatePhoneFormat(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * Performs comprehensive form validation
 * @returns {boolean} True if all validation passes
 */
function performFormValidation() {
    const benefitsValue = document.getElementById('benefits')?.value;
    const hasBenefits = benefitsValue === 'Yes';
    
    // Validate required fields
    const fieldValidation = validateFormFields(hasBenefits);
    let isValid = fieldValidation.isValid;
    
    // Validate email format
    const emailElement = document.getElementById('email');
    if (emailElement && emailElement.value && !validateEmailFormat(emailElement.value)) {
        const emailError = document.getElementById('emailError');
        if (emailError) {
            emailError.textContent = 'Please enter a valid email address';
        }
        isValid = false;
    }
    
    // Validate phone format  
    const phoneElement = document.getElementById('phone');
    if (phoneElement && phoneElement.value && !validatePhoneFormat(phoneElement.value)) {
        const phoneError = document.getElementById('phoneError');
        if (phoneError) {
            phoneError.textContent = 'Please enter a valid Canadian phone number: (___) ___-____';
        }
        isValid = false;
    }
    
    // Validate health goals
    const goals = document.querySelectorAll('input[name="health_goals[]"]:checked');
    if (goals.length === 0) {
        const goalsError = document.getElementById('goalsError');
        if (goalsError) {
            goalsError.textContent = 'Please select at least one health goal';
        }
        isValid = false;
    }
    
    return isValid;
}

/**
 * Handles form submission with error boundaries and validation
 * @param {Event} e - Form submit event
 */
async function handleFormSubmission(e) {
    e.preventDefault();
    
    try {
        // Check for insurance redirect
        const benefitsSelect = document.getElementById('benefits');
        if (benefitsSelect && benefitsSelect.value === 'No') {
            window.location.href = 'html/health811-redirect.html';
            return;
        }
        
        // Validate form
        if (!performFormValidation()) {
            return false;
        }
        
        // Show loading state
        const submitButton = document.getElementById('submitButton');
        const originalText = submitButton.innerHTML;
        submitButton.classList.add('loading');
        submitButton.innerHTML = 'Submitting...';
        submitButton.disabled = true;
        
        try {
            // Submit to services
            const formData = new FormData(e.target);
            console.log('📋 Form data collected, starting submission...');
            
            const result = await submitDualData(formData);
            console.log('🎯 Submission result:', result);
            
            // Handle success
            handleSubmissionSuccess(result);
            
        } catch (error) {
            // Handle submission error
            handleSubmissionError(error, submitButton, originalText);
        }
        
    } catch (error) {
        // Handle unexpected errors
        console.error('💥 Unexpected error in form submission:', error);
        const successDiv = document.getElementById('successMessage');
        successDiv.innerHTML = '❌ An unexpected error occurred. Please refresh and try again.';
        successDiv.style.display = 'block';
        successDiv.style.background = '#fef2f2';
        successDiv.style.color = '#dc2626';
        successDiv.style.borderColor = '#fecaca';
    }
}

/**
 * Handles successful form submission
 * @param {Object} result - Submission result object
 */
function handleSubmissionSuccess(result) {
    let successMessage = '✅ Your assessment has been submitted successfully!';
    if (result.errors.length > 0) {
        console.warn('⚠️ Some submission errors occurred:', result.errors);
        successMessage += ' Note: ' + result.errors.join(', ') + '.';
    }
    
    const successDiv = document.getElementById('successMessage');
    successDiv.innerHTML = successMessage;
    successDiv.style.display = 'block';
    successDiv.style.background = '#f0fdf4';
    successDiv.style.color = '#15803d';
    successDiv.style.borderColor = '#bbf7d0';
    
    // Store success info
    sessionStorage.setItem('submissionSuccess', JSON.stringify({
        timestamp: new Date().toISOString(),
        sheetMonkey: result.sheetMonkey,
        email: result.email,
        customEmail: result.customEmail,
        errors: result.errors
    }));
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'html/thank-you.html';
    }, 2000);
}

/**
 * Handles form submission errors with user feedback
 * @param {Error} error - The error that occurred
 * @param {HTMLElement} submitButton - Submit button element
 * @param {string} originalText - Original button text
 */
function handleSubmissionError(error, submitButton, originalText) {
    console.error('💥 Form submission failed:', {
        error: error,
        message: error.message,
        stack: error.stack
    });
    
    // Store error info
    sessionStorage.setItem('submissionError', JSON.stringify({
        message: error.message,
        timestamp: new Date().toISOString(),
        details: error.toString(),
        stack: error.stack
    }));
    
    // Reset button state
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
    submitButton.classList.remove('loading');
    
    // Show error message
    const successDiv = document.getElementById('successMessage');
    const errorMessage = `❌ Submission failed: ${error.message}. Please try again or contact support.`;
    
    successDiv.innerHTML = errorMessage.replace(/\n/g, '<br>');
    successDiv.style.display = 'block';
    successDiv.style.background = '#fef2f2';
    successDiv.style.color = '#dc2626';
    successDiv.style.borderColor = '#fecaca';
    
    // Scroll to error message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Attach form submission handler with error boundary
document.getElementById('assessmentForm').addEventListener('submit', handleFormSubmission);

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

/**
 * Formats Canadian phone number with (xxx) xxx-xxxx pattern
 * @param {string} value - Raw phone number input
 * @returns {string} Formatted phone number string
 */
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
            // Allow special keys: backspace, delete, tab, escape, enter
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
            
            if (allowedKeys.includes(e.key) ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))) {
                return;
            }
            
            // Only allow digits
            if (!/[0-9]/.test(e.key)) {
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

// Conditional insurance fields logic
document.addEventListener('DOMContentLoaded', function() {
    const benefitsSelect = document.getElementById('benefits');
    const insuranceGroup = document.getElementById('insurance-group');
    const memberIdGroup = document.getElementById('member-id-group');
    const groupNumberGroup = document.getElementById('group-number-group');
    const policyNumberGroup = document.getElementById('policy-number-group');
    const insuranceSelect = document.getElementById('insurance');
    const memberIdInput = document.getElementById('member-id');
    const groupNumberInput = document.getElementById('group-number');

    if (benefitsSelect) {
        benefitsSelect.addEventListener('change', function() {
            const showInsurance = this.value === 'Yes';
            
            if (showInsurance) {
                // Show insurance fields with smooth CSS transition
                if (insuranceGroup) {
                    insuranceGroup.classList.add('show');
                }
                if (memberIdGroup) {
                    memberIdGroup.classList.add('show');
                }
                if (groupNumberGroup) {
                    groupNumberGroup.classList.add('show');
                }
                if (policyNumberGroup) {
                    policyNumberGroup.classList.add('show');
                }
                
                // Make required insurance fields required
                if (insuranceSelect) insuranceSelect.required = true;
                if (memberIdInput) memberIdInput.required = true;
                if (groupNumberInput) groupNumberInput.required = true;
                // Policy number is optional, so we don't make it required
            } else {
                // Hide insurance fields with smooth CSS transition
                if (insuranceGroup) {
                    insuranceGroup.classList.remove('show');
                }
                if (memberIdGroup) {
                    memberIdGroup.classList.remove('show');
                }
                if (groupNumberGroup) {
                    groupNumberGroup.classList.remove('show');
                }
                if (policyNumberGroup) {
                    policyNumberGroup.classList.remove('show');
                }
                
                // Remove required attribute and clear values
                if (insuranceSelect) {
                    insuranceSelect.required = false;
                    insuranceSelect.value = '';
                }
                if (memberIdInput) {
                    memberIdInput.required = false;
                    memberIdInput.value = '';
                }
                if (groupNumberInput) {
                    groupNumberInput.required = false;
                    groupNumberInput.value = '';
                }
                // Clear policy number field
                const policyNumberInput = document.getElementById('policy-number');
                if (policyNumberInput) {
                    policyNumberInput.value = '';
                }
            }
        });
    }

    // Character count for description field
    const descriptionField = document.getElementById('description');
    if (descriptionField) {
        descriptionField.addEventListener('input', function() {
            const maxLength = 500;
            const currentLength = this.value.length;
            
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
            }
            
            const characterCount = this.parentNode.querySelector('.character-count small');
            if (characterCount) {
                const remaining = maxLength - this.value.length;
                characterCount.textContent = `${remaining} characters remaining`;
                
                if (remaining < 50) {
                    characterCount.style.color = '#ef4444';
                } else if (remaining < 100) {
                    characterCount.style.color = '#f59e0b';
                } else {
                    characterCount.style.color = '#6b7280';
                }
            }
        });
    }
});
