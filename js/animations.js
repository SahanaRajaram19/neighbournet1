// NeighbourNet Advanced Animations & Effects
// Handles glassmorphism, parallax, floating animations, and micro-interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initParallaxEffects();
    initFloatingAnimations();
    initGlassmorphismEffects();
    initScrollAnimations();
    initHoverMicroInteractions();
    initNeighborhoodIconAnimation();

    console.log('🎨 NeighbourNet Enhanced Animations Loaded!');
});

// Parallax and Mouse Tracking Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.category-icon, .hero-illustration, .testimonial-card');

    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        parallaxElements.forEach((element, index) => {
            const speed = (index % 3 + 1) * 0.5; // Vary speed for each element
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;

            element.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
        });
    });
}

// Floating Animation for Cards and Elements
function initFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.category-card, .testimonial-card, .card');

    floatingElements.forEach((element, index) => {
        const delay = index * 0.5;
        const duration = 6 + (index % 3) * 2;

        element.style.animation = `float ${duration}s ease-in-out infinite`;
        element.style.animationDelay = `${delay}s`;
    });

    // Add floating particles effect
    createFloatingParticles();
}

// Create Floating Background Particles
function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;

    // Create 20 floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        particlesContainer.appendChild(particle);
    }

    document.body.appendChild(particlesContainer);
}

// Glassmorphism Effects
function initGlassmorphismEffects() {
    const glassElements = document.querySelectorAll('.card, .navbar, .dropdown-menu, .btn');

    glassElements.forEach(element => {
        element.style.background = 'rgba(255, 255, 255, 0.1)';
        element.style.backdropFilter = 'blur(20px)';
        element.style.webkitBackdropFilter = 'blur(20px)';
        element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    });
}

// Scroll-triggered Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Staggered animation for category cards
                if (entry.target.classList.contains('category-card')) {
                    const cards = document.querySelectorAll('.category-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `slideInUp 0.8s ease-out forwards`;
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.category-card, .testimonial-card, .section-title');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced Hover Micro-interactions
function initHoverMicroInteractions() {
    // Button ripple effect
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Card hover effects with glass reflection
    document.querySelectorAll('.category-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glass reflection effect
            const reflection = document.createElement('div');
            reflection.className = 'glass-reflection';
            reflection.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                animation: glassShimmer 1.5s ease-in-out;
                pointer-events: none;
            `;

            this.appendChild(reflection);

            setTimeout(() => {
                reflection.remove();
            }, 1500);
        });
    });

    // Icon pulse animation on hover
    document.querySelectorAll('.category-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'iconPulse 0.8s ease-in-out';
        });

        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
}

// Neighborhood Icon Animation
function initNeighborhoodIconAnimation() {
    const neighborhoodIcon = document.querySelector('#neighborhood-icon');

    if (neighborhoodIcon) {
        // Add click interaction for neighborhood icon
        neighborhoodIcon.addEventListener('click', function() {
            // Trigger house bounce animation
            const houses = this.querySelectorAll('#houses g');
            houses.forEach((house, index) => {
                house.style.animation = `houseBounce 0.6s ease-in-out`;
                setTimeout(() => {
                    house.style.animation = '';
                }, 600);
            });

            // Trigger tree sway animation
            const tree = this.querySelector('#tree');
            tree.style.animation = 'treeSway 1s ease-in-out';
            setTimeout(() => {
                tree.style.animation = '';
            }, 1000);
        });

        // Add hover effect
        neighborhoodIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3))';
        });

        neighborhoodIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'none';
        });
    }
}

// CSS Animation Keyframes (added via JavaScript)
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes glassShimmer {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
        }

        @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes treeSway {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(2deg); }
            75% { transform: rotate(-2deg); }
        }

        /* Enhanced category card animations */
        .category-card.animate-in {
            animation: slideInUp 0.8s ease-out forwards;
        }

        .testimonial-card.animate-in {
            animation: slideInUp 0.8s ease-out forwards;
        }

        /* Parallax hover effects */
        .category-icon {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Floating particles */
        .floating-particles {
            animation: backgroundFloat 20s ease-in-out infinite;
        }
    `;

    document.head.appendChild(style);
}

// Initialize animation styles
addAnimationStyles();

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Enhanced scroll handler with throttling
const throttledScrollHandler = throttle(function() {
    // Add scroll-based parallax effects
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-illustration');

    parallaxElements.forEach(element => {
        const speed = scrolled * 0.5;
        element.style.transform = `translateY(${speed}px)`;
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Add smooth scrolling for anchor links
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

// Add loading animation for dynamic content
function showLoadingState(element) {
    element.classList.add('loading');
    element.style.position = 'relative';
}

function hideLoadingState(element) {
    element.classList.remove('loading');
}

// Export functions for use in other scripts
window.NeighbourNetAnimations = {
    showLoadingState,
    hideLoadingState,
    initParallaxEffects,
    initFloatingAnimations
};
