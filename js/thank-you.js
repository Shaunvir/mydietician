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

// Debug panel removed for production
