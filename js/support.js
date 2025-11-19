// Support Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.support-tab-btn');
    const supportSections = document.querySelectorAll('.support-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            supportSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active');
            document.getElementById(targetTab + '-section').classList.add('active');
        });
    });

    // FAQ Category switching
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqContents = document.querySelectorAll('.faq-category-content');

    faqCategories.forEach(category => {
        category.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active class from all categories and contents
            faqCategories.forEach(cat => cat.classList.remove('active'));
            faqContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked category and corresponding content
            this.classList.add('active');
            document.querySelector(`[data-category="${targetCategory}"]`).classList.add('active');
        });
    });

    // FAQ Accordion functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');
            
            // Toggle answer visibility
            faqAnswer.classList.toggle('active');
            
            // Update icon
            if (faqAnswer.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.support-search-input');
    const searchButton = document.querySelector('.support-search-btn');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                searchFAQ(query);
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });

        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (query.length >= 3) {
                searchFAQ(query);
            } else {
                // Show all FAQs if search is cleared
                showAllFAQs();
            }
        });
    }

    function searchFAQ(query) {
        const faqItems = document.querySelectorAll('.faq-item');
        let foundResults = false;

        faqItems.forEach(item => {
            const question = item.querySelector('h4').textContent.toLowerCase();
            const answer = item.querySelector('p').textContent.toLowerCase();
            const faqQuestion = item.querySelector('.faq-question');
            
            if (question.includes(query) || answer.includes(query)) {
                item.style.display = 'block';
                highlightText(faqQuestion, query);
                foundResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show search results message
        showSearchResults(query, foundResults);
    }

    function showAllFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.style.display = 'block';
        });
        
        // Remove search results message
        const searchMessage = document.querySelector('.search-results-message');
        if (searchMessage) {
            searchMessage.remove();
        }
    }

    function highlightText(element, query) {
        // Remove existing highlights
        const text = element.textContent;
        const highlightedText = text.replace(new RegExp(query, 'gi'), `<mark>$&</mark>`);
        element.innerHTML = highlightedText;
    }

    function showSearchResults(query, foundResults) {
        // Remove existing search message
        const existingMessage = document.querySelector('.search-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = 'search-results-message';
        
        if (foundResults) {
            message.innerHTML = `
                <div style="background: #e8f5e8; color: #2e7d32; padding: 12px 16px; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #4CAF50;">
                    <i class="fas fa-search"></i>
                    Found results for "${query}"
                </div>
            `;
        } else {
            message.innerHTML = `
                <div style="background: #fff3cd; color: #856404; padding: 12px 16px; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #ffc107;">
                    <i class="fas fa-exclamation-triangle"></i>
                    No results found for "${query}". Try different keywords.
                </div>
            `;
        }

        const faqQuestions = document.querySelector('.faq-questions');
        faqQuestions.insertBefore(message, faqQuestions.firstChild);
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const contactData = {};
            
            formData.forEach((value, key) => {
                contactData[key] = value;
            });

            // Basic validation
            if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
                showFormError('Please fill in all required fields');
                return;
            }

            if (!validateEmail(contactData.email)) {
                showFormError('Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.disabled = false;
                
                showFormSuccess('Your message has been sent successfully! We\'ll get back to you within 24 hours.');
                this.reset();
            }, 1500);
        });
    }

    // Report form handling
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const reportData = {};
            
            formData.forEach((value, key) => {
                reportData[key] = value;
            });

            // Basic validation
            if (!reportData.type || !reportData.name || !reportData.email || !reportData.description) {
                showFormError('Please fill in all required fields');
                return;
            }

            if (!validateEmail(reportData.email)) {
                showFormError('Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-flag"></i> Submit Report';
                submitBtn.disabled = false;
                
                showFormSuccess('Your report has been submitted successfully! Our team will review it within 48 hours.');
                this.reset();
            }, 1500);
        });
    }

    // File upload handling
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('reportFiles');
    
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function() {
            const files = this.files;
            if (files.length > 0) {
                let totalSize = 0;
                let validFiles = true;
                
                for (let file of files) {
                    totalSize += file.size;
                    
                    // Check file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                        showFormError('File size should be less than 5MB');
                        validFiles = false;
                        break;
                    }
                    
                    // Check file type
                    if (!file.type.startsWith('image/') && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
                        showFormError('Only image files, PDF, and Word documents are allowed');
                        validFiles = false;
                        break;
                    }
                }
                
                if (validFiles && totalSize > 0) {
                    const uploadContent = fileUploadArea.querySelector('.upload-content');
                    uploadContent.innerHTML = `
                        <i class="fas fa-check-circle" style="color: #4CAF50;"></i>
                        <p>${files.length} file(s) selected</p>
                        <small>Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB</small>
                    `;
                }
            }
        });
    }

    // Form validation helpers
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Form feedback functions
    function showFormError(message) {
        // Remove existing messages
        document.querySelectorAll('.form-error, .form-success').forEach(msg => msg.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background-color: #fee;
            color: #c33;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #c33;
            margin-bottom: 1rem;
            font-size: 14px;
        `;
        
        const activeForm = document.querySelector('.support-section.active form');
        if (activeForm) {
            activeForm.insertBefore(errorDiv, activeForm.firstChild);
        }
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showFormSuccess(message) {
        // Remove existing messages
        document.querySelectorAll('.form-error, .form-success').forEach(msg => msg.remove());
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            background-color: #efe;
            color: #363;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #363;
            margin-bottom: 1rem;
            font-size: 14px;
        `;
        
        const activeForm = document.querySelector('.support-section.active form');
        if (activeForm) {
            activeForm.insertBefore(successDiv, activeForm.firstChild);
        }
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

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

    // Auto-expand FAQ answers on search match
    function expandMatchingFAQs(query) {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('h4').textContent.toLowerCase();
            const answer = item.querySelector('p').textContent.toLowerCase();
            
            if (question.includes(query) || answer.includes(query)) {
                const answer = item.querySelector('.faq-answer');
                const toggle = item.querySelector('.faq-toggle i');
                
                answer.classList.add('active');
                toggle.classList.remove('fa-chevron-down');
                toggle.classList.add('fa-chevron-up');
            }
        });
    }

    // Enhanced search with auto-expand
    const originalSearchFAQ = searchFAQ;
    searchFAQ = function(query) {
        originalSearchFAQ(query);
        expandMatchingFAQs(query);
    };

    // Setup support form
    setupSupportForm();
    
    // Load support tickets if user is logged in
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
        loadSupportTickets();
    }

    console.log('Support page JavaScript loaded successfully!');
});

// Support Form Functions
function setupSupportForm() {
    const form = document.getElementById('supportForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitSupportTicket();
        });
    }
}

function submitSupportTicket() {
    const subject = document.getElementById('supportSubject').value;
    const message = document.getElementById('supportMessage').value;
    const priority = document.getElementById('supportPriority').value || 'medium';

    if (!subject.trim() || !message.trim()) {
        showError('Please fill in all fields');
        return;
    }

    const formData = {
        subject: subject,
        message: message,
        priority: priority
    };

    fetch('submit-support.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('Support ticket submitted successfully!');
            document.getElementById('supportForm').reset();
            setTimeout(() => {
                loadSupportTickets();
            }, 1500);
        } else {
            showError(data.error || 'Failed to submit ticket');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showError('Failed to submit ticket');
    });
}

function loadSupportTickets() {
    fetch('fetch-support.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTickets(data.tickets || []);
            }
        })
        .catch(err => console.error('Error loading tickets:', err));
}

function displayTickets(tickets) {
    const ticketsDiv = document.getElementById('supportTickets');
    if (!ticketsDiv) return;

    ticketsDiv.innerHTML = '';
    if (tickets.length === 0) {
        ticketsDiv.innerHTML = '<p style="text-align: center; padding: 2rem;">No support tickets yet</p>';
        return;
    }

    tickets.forEach(ticket => {
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'ticket-card';
        ticketDiv.style.cssText = 'border: 1px solid #ddd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;';
        ticketDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="margin: 0;">${ticket.subject}</h3>
                <span style="background: ${getStatusColor(ticket.status)}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem;">${ticket.status.toUpperCase()}</span>
            </div>
            <p style="margin: 0.5rem 0;">${ticket.message}</p>
            <small style="color: #666;">${new Date(ticket.created_at).toLocaleString()}</small>
        `;
        ticketsDiv.appendChild(ticketDiv);
    });
}

function getStatusColor(status) {
    const colors = {
        'open': '#ff9800',
        'in_progress': '#2196F3',
        'resolved': '#4CAF50',
        'closed': '#757575'
    };
    return colors[status] || '#999';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background-color: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #fcc; font-weight: 500;';
    errorDiv.textContent = message;
    
    const form = document.getElementById('supportForm');
    if (form) {
        form.parentElement.insertBefore(errorDiv, form);
        setTimeout(() => errorDiv.remove(), 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = 'background-color: #efe; color: #0a0; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #cfc; font-weight: 500;';
    successDiv.textContent = message;
    
    const form = document.getElementById('supportForm');
    if (form) {
        form.parentElement.insertBefore(successDiv, form);
        setTimeout(() => successDiv.remove(), 3000);
    } else {
        alert(message);
    }
}
