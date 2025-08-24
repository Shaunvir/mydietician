// SheetMonkey and Formspree dual submission
const SHEET_MONKEY_URL = 'https://api.sheetmonkey.io/form/9MoRQbyaVfkrCsZGZW3Mt2';
const FORMSPREE_URL = 'https://formspree.io/f/xeozkgvr';

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
    let errors = [];

    // Try both submissions in parallel
    try {
        await Promise.allSettled([
            submitToSheetMonkey(new FormData(document.getElementById('assessmentForm'))),
            submitToFormspree(new FormData(document.getElementById('assessmentForm')))
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
        });

        // Require at least one to succeed
        if (!sheetMonkeySuccess && !formspreeSuccess) {
            throw new Error('Both database and email submissions failed');
        }

        return {
            success: true,
            sheetMonkey: sheetMonkeySuccess,
            email: formspreeSuccess,
            errors: errors
        };
    } catch (error) {
        console.error('Dual submission failed:', error);
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
        window.location.href = 'health811-redirect.html';
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
        const result = await submitDualData(formData);
        
        // Show success message
        let successMessage = '✅ Your assessment has been submitted successfully!';
        if (result.errors.length > 0) {
            successMessage += ' Note: ' + result.errors.join(', ') + '.';
        }
        
        // Show success message in the form
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = successMessage;
        successDiv.style.display = 'block';
        
        // Redirect to thank you page after brief delay
        setTimeout(() => {
            window.location.href = 'thank-you.html';
        }, 2000);
        
    } catch (error) {
        // Reset button state on error
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        submitButton.classList.remove('loading');
        
        // Show error message
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = '❌ There was an error submitting your information. Please try again.';
        successDiv.style.display = 'block';
        successDiv.style.background = '#fef2f2';
        successDiv.style.color = '#dc2626';
        successDiv.style.borderColor = '#fecaca';
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
