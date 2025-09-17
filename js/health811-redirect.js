// Auto-redirect after 8 seconds
let timeLeft = 8;
const timer = document.getElementById('timer');
const countdown = document.getElementById('countdown');
let countdownInterval;

function startCountdown() {
    countdownInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'https://health811.ontario.ca/';
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    countdown.style.display = 'none';
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', startCountdown);

// Cancel auto-redirect if user interacts with the page
document.addEventListener('click', stopCountdown);
document.addEventListener('keydown', stopCountdown);

// Handle manual redirect button
document.getElementById('redirectButton').addEventListener('click', function() {
    stopCountdown();
    // Let the link work normally
});

// Add some visual feedback for accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = 'You are being redirected to Health811 Ontario for free nutrition support. You can speak to a registered dietitian at no cost.';
    document.body.appendChild(announcement);
});
