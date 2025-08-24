const SHEET_MONKEY_URL = 'https://api.sheetmonkey.io/form/9MoRQbyaVfkrCsZGZW3Mt2';
// TODO: Replace with your Formspree endpoint for my.dietitian.ca@gmail.com
const FORMSPREE_URL = 'https://formspree.io/f/xeozkgvr'; // Replace with actual Formspree endpoint

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
        formData.append('_subject', 'New Dietitian Search Form Submission');
        formData.append('_autoresponse', 'Thanks! We received your dietitian search request and will get back to you within 3-5 business days. Our team will help match you with a registered dietitian in your area.');
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
            submitToSheetMonkey(new FormData(document.getElementById('searchForm'))),
            submitToFormspree(new FormData(document.getElementById('searchForm')))
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

function showValidationMessage(message, type = 'success') {
    const messageElement = document.getElementById('validationMessage');
    messageElement.textContent = message;
    messageElement.className = 'validation-message';
    
    if (type === 'error') {
        messageElement.classList.add('error');
    } else if (type === 'warning') {
        messageElement.classList.add('warning');
    }
    
    messageElement.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Simplified insurance validation - no scanning required
function validateInsuranceData() {
    const memberID = document.getElementById('member-id').value;
    const insurance = document.getElementById('insurance').value;
    
    // Basic validation - just check if fields are filled
    if (!memberID || !insurance) {
        showValidationMessage('❌ Please provide both Member ID and Insurance Provider to continue.', 'error');
        return false;
    }
    
    return true;
}

// Handle form validation for both scanned and manual data
function validateFormData() {
    const memberID = document.getElementById('member-id').value;
    const insurance = document.getElementById('insurance').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    
    // Check required fields
    if (!name || !email || !phone || !location || !memberID || !insurance) {
        showValidationMessage('❌ Please fill in all required fields to continue.', 'error');
        return false;
    }
    
    return true;
}

// Update form submission to use dual submission (database + email)
document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // First validate form data
    if (!validateFormData()) {
        return;
    }
    
    // Then validate insurance data (simplified - no scanning required)
    if (!validateInsuranceData()) {
        return;
    }
    
    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="search-icon">⏳</span> Submitting...';
    
    try {
        // Submit to both database and email
        const result = await submitDualData(formData);
        
        // Show success message with details
        let successMessage = '✅ Your request has been submitted successfully!';
        if (result.errors.length > 0) {
            successMessage += ' Note: ' + result.errors.join(', ') + '.';
        }
        showValidationMessage(successMessage, 'success');
        
        // Build URL parameters for results page (non-sensitive data only)
        const params = new URLSearchParams();
        for (let [key, value] of formData.entries()) {
            // Skip sensitive personal data from URL, only include search filters
            if (['location', 'insurance', 'specialty'].includes(key) && value) {
                params.append(key, value);
            }
        }
        
        // Redirect to results page after brief delay
        setTimeout(() => {
            window.location.href = 'results.html?' + params.toString();
        }, 1500);
        
    } catch (error) {
        // Reset button state on error
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show user-friendly error message
        showValidationMessage('❌ There was an error submitting your information. Please try again.', 'error');
    }
});

// Basic form validation for dropdown
document.getElementById('location').addEventListener('change', function() {
    if (this.value) {
        this.style.borderColor = '#6366f1';
    }
});

// Initialize the form on page load
document.addEventListener('DOMContentLoaded', function() {
    // Form is ready to use - no scanning setup needed
    console.log('Dietitian search form initialized');
});
