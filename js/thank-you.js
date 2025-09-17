// Check for submission results in sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    const submissionSuccess = sessionStorage.getItem('submissionSuccess');
    const submissionError = sessionStorage.getItem('submissionError');
    
    if (submissionSuccess) {
        try {
            const successData = JSON.parse(submissionSuccess);
            updatePageWithSuccessData(successData);
        } catch (error) {
            console.error('Error parsing submission success data:', error);
        }
    } else if (submissionError) {
        try {
            const errorData = JSON.parse(submissionError);
            updatePageWithErrorData(errorData);
        } catch (error) {
            console.error('Error parsing submission error data:', error);
        }
    }
});

function updatePageWithSuccessData(data) {
    const messageElement = document.querySelector('.message');
    const nextStepsElement = document.querySelector('.next-steps ul');
    
    // Standard message for all submissions
    messageElement.innerHTML = `
        Your assessment has been successfully submitted. We'll get back to you within 5 business days!
    `;
    
    // Standard next steps
    nextStepsElement.innerHTML = `
        <li>Our team will verify your benefits (if applicable)</li>
        <li>We'll match you with a qualified registered dietitian in your area</li>
        <li>You'll receive an email with next steps within 5 business days</li>
        <li>Schedule your first consultation at your convenience</li>
    `;
}

function updatePageWithErrorData(errorData) {
    const titleElement = document.querySelector('h1');
    const messageElement = document.querySelector('.message');
    const successIcon = document.querySelector('.success-icon');
    
    // Update to show error state
    titleElement.textContent = 'Submission Error';
    successIcon.textContent = '✗';
    successIcon.style.backgroundColor = '#dc2626';
    
    messageElement.innerHTML = `
        There was an issue submitting your assessment: ${errorData.message}
        <br><br>
        Please try again or contact our support team for assistance.
        <br><br>
        <strong>Error occurred at:</strong> ${new Date(errorData.timestamp).toLocaleString()}
    `;
    
    // Change button to retry
    const homeButton = document.querySelector('.home-button');
    homeButton.textContent = 'Try Again';
    homeButton.href = '../index.html#assessment';
}

// Auto-redirect after 10 seconds
let timeLeft = 10;
const timer = document.getElementById('timer');
const countdown = document.getElementById('countdown');

const countdownInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        window.location.href = '../index.html';
    }
}, 1000);

// Allow user to cancel auto-redirect by interacting with page
document.addEventListener('click', () => {
    clearInterval(countdownInterval);
    countdown.style.display = 'none';
});

// Clear session storage after displaying results
setTimeout(() => {
    sessionStorage.removeItem('submissionSuccess');
    sessionStorage.removeItem('submissionError');
}, 1000);
