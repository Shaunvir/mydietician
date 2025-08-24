// Contest page JavaScript functionality

// Animate contest elements on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to contest cards
    const contestCards = document.querySelectorAll('.contest-card, .step-card');
    contestCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add hover effects
    contestCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Contest form submission (if needed)
function submitContestEntry() {
    // This would handle contest entry submission
    console.log('Contest entry submitted');
}

// Prize animation
function animateRainbow() {
    const rainbowText = document.querySelector('.rainbow-text');
    if (rainbowText) {
        rainbowText.style.animation = 'rainbow 2s linear infinite';
    }
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', animateRainbow);
