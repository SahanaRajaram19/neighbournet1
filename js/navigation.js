// NeighbourNet Navigation JavaScript
// Handles navigation, user menu, and cross-page interactions

document.addEventListener('DOMContentLoaded', function() {
    // User menu functionality
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.style.display = 'none';
        });

        // Handle logout
        const logoutBtn = userDropdown.querySelector('.dropdown-item:last-child');
        if (logoutBtn && logoutBtn.textContent.includes('Logout')) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Clear any stored tokens/sessions
                localStorage.removeItem('user_token');
                sessionStorage.clear();
                // Redirect to home
                window.location.href = 'index.html';
            });
        }
    }

    // Mobile menu toggle (for future mobile implementation)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
        });
    }

    // Dropdown menu functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;

            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Search functionality across pages
    const searchInputs = document.querySelectorAll('.search-input, .support-search-input');

    searchInputs.forEach(input => {
        const searchButton = input.closest('.search-container, .support-search')?.querySelector('button');

        if (searchButton) {
            searchButton.addEventListener('click', function() {
                const query = input.value.trim();
                if (query) {
                    performSearch(query);
                }
            });

            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchButton.click();
                }
            });
        }
    });

    function performSearch(query) {
        // In a real implementation, this would call the API
        console.log('Searching for:', query);

        // For demo purposes, redirect to browse page with search
        if (window.location.pathname.includes('index.html') ||
            window.location.pathname.includes('support.html')) {
            window.location.href = `borrow.html?search=${encodeURIComponent(query)}`;
        }
    }

    // Button click handlers for navigation
    document.querySelectorAll('.btn').forEach(button => {
        // Handle "Explore Neighbourhood" button
        if (button.textContent.includes('Explore Neighbourhood')) {
            button.addEventListener('click', function() {
                window.location.href = 'borrow.html';
            });
        }

        // Handle "Login / Sign Up" button
        if (button.textContent.includes('Login') && button.textContent.includes('Sign Up')) {
            button.addEventListener('click', function() {
                window.location.href = 'auth.html';
            });
        }

        // Handle "List New Item" button
        if (button.textContent.includes('List New Item')) {
            button.addEventListener('click', function() {
                window.location.href = 'auth.html';
            });
        }
    });

    // Breadcrumb navigation
    const breadcrumbs = document.querySelectorAll('.breadcrumb a, .profile-breadcrumb a');

    breadcrumbs.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });

    // Active page highlighting
    highlightActivePage();

    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Category dropdown selection
    const categoryLinks = document.querySelectorAll('.dropdown-item');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
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

    // Handle form submissions with loading states
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                // Add loading state
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                // Reset after 3 seconds (in real app, reset after API response)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 3000);
            }
        });
    });

    console.log('NeighbourNet Navigation loaded successfully!');
});
