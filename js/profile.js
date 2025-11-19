// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        window.location.href = 'auth.html';
        return;
    }

    loadUserProfile();
    setupFormHandlers();
});

function loadUserProfile() {
    fetch('fetch-profile.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProfile(data.user);
            } else {
                showError(data.error || 'Failed to load profile');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showError('Failed to load profile');
        });
}

function displayProfile(user) {
    // Update profile info
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.full_name || user.username;
    
    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.textContent = user.email;
    
    const userPhone = document.getElementById('userPhone');
    if (userPhone) userPhone.textContent = user.phone || 'Not set';
    
    const userAddress = document.getElementById('userAddress');
    if (userAddress) userAddress.textContent = user.address || 'Not set';

    // Update stats if elements exist
    const itemsCount = document.getElementById('itemsCount');
    if (itemsCount) itemsCount.textContent = user.items_count || 0;
    
    const bookingsCount = document.getElementById('bookingsCount');
    if (bookingsCount) bookingsCount.textContent = user.bookings_count || 0;

    // Pre-fill edit form
    const editName = document.getElementById('editName');
    if (editName) editName.value = user.full_name || '';
    
    const editPhone = document.getElementById('editPhone');
    if (editPhone) editPhone.value = user.phone || '';
    
    const editAddress = document.getElementById('editAddress');
    if (editAddress) editAddress.value = user.address || '';

    // Update avatar
    const initials = (user.full_name || user.username).split(' ')[0].substring(0, 2).toUpperCase();
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.src = user.profile_image || 
            `https://via.placeholder.com/120x120/096C6C/ffffff?text=${initials}`;
    }
}

function setupFormHandlers() {
    const editForm = document.getElementById('editProfileForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
}

function updateProfile() {
    const full_name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const address = document.getElementById('editAddress').value;

    if (!full_name.trim()) {
        showError('Full name is required');
        return;
    }

    const formData = {
        full_name: full_name,
        phone: phone,
        address: address
    };

    fetch('update-profile.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('Profile updated successfully!');
            setTimeout(() => {
                loadUserProfile();
            }, 1500);
        } else {
            showError(data.error || 'Failed to update profile');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showError('Failed to update profile');
    });
}

function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('full_name');
    localStorage.removeItem('email');
    window.location.href = 'index.html';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background-color: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #fcc; font-weight: 500;';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.profile-content');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = 'background-color: #efe; color: #0a0; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #cfc; font-weight: 500;';
    successDiv.textContent = message;
    
    const container = document.querySelector('.profile-content');
    if (container) {
        container.insertBefore(successDiv, container.firstChild);
        setTimeout(() => successDiv.remove(), 3000);
    }
}
        });

        editToggle.classList.toggle('hidden', editing);
        saveProfile.classList.toggle('hidden', !editing);
    }

    function saveProfileChanges() {
        // Collect form data
        const formData = new FormData(profileForm);
        const profileData = {};
        
        formInputs.forEach(input => {
            if (input.name && !input.disabled) {
                profileData[input.name] = input.value;
            }
        });

        // Basic validation
        if (!profileData.fullName || profileData.fullName.trim().length < 2) {
            showError('Please enter a valid full name');
            return;
        }

        if (!validateEmail(profileData.email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        saveProfile.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveProfile.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Update profile display
            document.getElementById('profileName').textContent = profileData.fullName;
            
            // Reset form state
            isEditing = false;
            toggleEditMode(false);
            
            saveProfile.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            saveProfile.disabled = false;
            
            showSuccess('Profile updated successfully!');
        }, 1500);
    }

    // Password change functionality
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            passwordForm.classList.remove('hidden');
            changePasswordBtn.style.display = 'none';
            document.getElementById('currentPassword').focus();
        });
    }

    if (cancelPassword) {
        cancelPassword.addEventListener('click', function() {
            passwordForm.classList.add('hidden');
            changePasswordBtn.style.display = 'inline-block';
            passwordForm.reset();
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (currentPassword.length < 6) {
                showError('Current password must be at least 6 characters');
                return;
            }
            
            if (newPassword.length < 6) {
                showError('New password must be at least 6 characters');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showError('New passwords do not match');
                return;
            }
            
            // Show loading state
            const submitBtn = passwordForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                passwordForm.classList.add('hidden');
                changePasswordBtn.style.display = 'inline-block';
                passwordForm.reset();
                
                submitBtn.innerHTML = 'Update Password';
                submitBtn.disabled = false;
                
                showSuccess('Password updated successfully!');
            }, 1500);
        });
    }

    // Password visibility toggles
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling || this.parentElement.querySelector('input[type="password"]');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Avatar upload functionality
    if (avatarUpload) {
        avatarUpload.addEventListener('click', function() {
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('Please select a valid image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('Image size should be less than 5MB');
                return;
            }
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                profileAvatar.src = e.target.result;
                
                // Simulate upload
                showSuccess('Avatar updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });

    // Transaction item interactions
    document.querySelectorAll('.transaction-item').forEach(item => {
        item.addEventListener('click', function() {
            const transactionLink = this.querySelector('.transaction-link');
            if (transactionLink) {
                // In a real app, this would navigate to transaction details
                showSuccess('Transaction details would open here!');
            }
        });
    });

    // Load more transactions
    const loadMoreBtn = document.querySelector('.transactions-footer .btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading more transactions
            setTimeout(() => {
                this.innerHTML = 'Load More Transactions';
                this.disabled = false;
                showSuccess('More transactions loaded!');
            }, 1500);
        });
    }

    // Form validation helpers
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Real-time form validation
    formInputs.forEach(input => {
        if (input.type === 'email') {
            input.addEventListener('blur', function() {
                if (this.value && !validateEmail(this.value)) {
                    showFieldError(this, 'Please enter a valid email address');
                } else {
                    clearFieldError(this);
                }
            });
        }
        
        if (input.name === 'fullName') {
            input.addEventListener('blur', function() {
                if (this.value && this.value.trim().length < 2) {
                    showFieldError(this, 'Name must be at least 2 characters');
                } else {
                    clearFieldError(this);
                }
            });
        }
    });

    function showFieldError(input, message) {
        clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '0.25rem';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#dc3545';
    }

    function clearFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }

    // Error and success message functions
    function showError(message) {
        // Remove existing messages
        document.querySelectorAll('.error-message, .success-message').forEach(msg => msg.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
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
        
        const firstCard = document.querySelector('.profile-edit-card');
        firstCard.insertBefore(errorDiv, firstCard.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess(message) {
        // Remove existing messages
        document.querySelectorAll('.error-message, .success-message').forEach(msg => msg.remove());
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
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
        
        const firstCard = document.querySelector('.profile-edit-card');
        firstCard.insertBefore(successDiv, firstCard.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Initialize tooltips
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        badge.title = 'Click to view verification details';
        badge.style.cursor = 'help';
    });

    // Animate stats on scroll (optional enhancement)
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateNumber(stat);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const profileStats = document.querySelector('.profile-stats');
    if (profileStats) {
        statsObserver.observe(profileStats);
    }

    function animateNumber(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    console.log('Profile page JavaScript loaded successfully!');
});
