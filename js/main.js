// NeighbourNet JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (for future mobile responsiveness)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Hamburger menu toggle
    window.toggleHamburger = function() {
        const hamburgerModal = document.getElementById('hamburgerModal');
        if (hamburgerModal) {
            hamburgerModal.classList.toggle('active');
        }
    };

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                // In a real app, this would redirect to search results
                console.log('Searching for:', query);
                alert(`Searching for: ${query}`);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Category card hover effects
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Button click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Form validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });

    // Image lazy loading (for future use)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Testimonial carousel (if needed in future)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (testimonials.length > 1) {
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            testimonials[currentTestimonial].style.opacity = '0.5';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.opacity = '1';
        }, 5000);
    }

    // Add to wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart"></i> Wishlisted';
                this.style.color = '#FF6F61';
            } else {
                this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
                this.style.color = '#666';
            }
        });
    });

    // Chat/Modal functionality
    const chatButtons = document.querySelectorAll('.chat-btn');
    chatButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openChatModal();
        });
    });

    function openChatModal() {
        // Create chat modal if it doesn't exist
        if (!document.querySelector('.chat-modal')) {
            const modal = document.createElement('div');
            modal.className = 'chat-modal';
            modal.innerHTML = `
                <div class="chat-modal-content">
                    <div class="chat-header">
                        <h3>Chat with Owner</h3>
                        <button class="chat-close">&times;</button>
                    </div>
                    <div class="chat-messages">
                        <div class="message owner-message">
                            <div class="message-content">Hi! I'm interested in your item. Is it still available?</div>
                            <div class="message-time">2:30 PM</div>
                        </div>
                        <div class="message user-message">
                            <div class="message-content">Yes, it's still available! When would you like to pick it up?</div>
                            <div class="message-time">2:32 PM</div>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" placeholder="Type your message...">
                        <button class="chat-send">Send</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .chat-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                }

                .chat-modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .chat-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #096C6C;
                    color: white;
                    border-radius: 12px 12px 0 0;
                }

                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    max-height: 400px;
                }

                .message {
                    margin-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                }

                .owner-message {
                    align-items: flex-start;
                }

                .user-message {
                    align-items: flex-end;
                }

                .message-content {
                    background: #f1f1f1;
                    padding: 12px 16px;
                    border-radius: 18px;
                    max-width: 80%;
                    word-wrap: break-word;
                }

                .user-message .message-content {
                    background: #096C6C;
                    color: white;
                }

                .message-time {
                    font-size: 12px;
                    color: #666;
                    margin-top: 4px;
                    padding: 0 8px;
                }

                .user-message .message-time {
                    text-align: right;
                }

                .chat-input-area {
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e1e5e9;
                    border-radius: 24px;
                    outline: none;
                    font-size: 14px;
                }

                .chat-input:focus {
                    border-color: #096C6C;
                }

                .chat-send {
                    background: #096C6C;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 24px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background 0.3s ease;
                }

                .chat-send:hover {
                    background: #074e4e;
                }
            `;
            document.head.appendChild(style);

            // Add event listeners for the modal
            modal.querySelector('.chat-close').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Handle sending messages
            const sendButton = modal.querySelector('.chat-send');
            const input = modal.querySelector('.chat-input');

            sendButton.addEventListener('click', () => {
                const message = input.value.trim();
                if (message) {
                    addMessage(message, 'user');
                    input.value = '';

                    // Simulate owner response after 1-2 seconds
                    setTimeout(() => {
                        addMessage("Thanks for your message! I'll get back to you soon.", 'owner');
                    }, Math.random() * 1000 + 1000);
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendButton.click();
                }
            });

            function addMessage(text, type) {
                const messagesContainer = modal.querySelector('.chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${type}-message`;

                const now = new Date();
                const time = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');

                messageDiv.innerHTML = `
                    <div class="message-content">${text}</div>
                    <div class="message-time">${time}</div>
                `;

                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }

    // Filter toggles
    const filterToggles = document.querySelectorAll('.filter-toggle');
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const filterContent = this.nextElementSibling;
            filterContent.classList.toggle('active');
            
            const icon = this.querySelector('.toggle-icon');
            if (filterContent.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Rating stars interaction
    const starRatings = document.querySelectorAll('.star-rating');
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                // Remove active class from all stars
                stars.forEach(s => s.classList.remove('active'));
                // Add active class to clicked star and all before it
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }
            });
        });
    });

    console.log('NeighbourNet JavaScript loaded successfully!');
});

// Ripple effect CSS (to be added to CSS file)
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
