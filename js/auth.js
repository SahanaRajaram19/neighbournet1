// Authentication Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const forms = {
        login: document.getElementById('login-form'),
        signup: document.getElementById('signup-form'),
        otp: document.getElementById('otp-form'),
        forgot: document.getElementById('forgot-form')
    };

    const successMessage = document.getElementById('success-message');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSteps = document.getElementById('auth-steps');

    let currentForm = 'login';
    let signupStep = 1;

    // Form switching functionality
    document.querySelectorAll('[data-form]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetForm = this.getAttribute('data-form');
            switchForm(targetForm);
        });
    });

    function switchForm(formType) {
        // Hide all forms
        Object.values(forms).forEach(form => {
            form.classList.add('hidden');
        });
        
        // Hide success message
        if (successMessage) {
            successMessage.classList.add('hidden');
        }

        // Show target form
        if (forms[formType]) {
            forms[formType].classList.remove('hidden');
        }

        // Update header content
        updateHeaderContent(formType);
        
        // Update steps visibility
        updateStepsVisibility(formType);

        currentForm = formType;
    }

    function updateHeaderContent(formType) {
        if (!authTitle || !authSubtitle) return;

        switch(formType) {
            case 'login':
                authTitle.textContent = 'Welcome Back';
                authSubtitle.textContent = 'Sign in to your NeighbourNet account';
                break;
            case 'signup':
                authTitle.textContent = 'Join NeighbourNet';
                authSubtitle.textContent = 'Create your account to start sharing';
                break;
            case 'otp':
                authTitle.textContent = 'Verify Your Account';
                authSubtitle.textContent = 'Enter the verification code sent to your mobile';
                break;
            case 'forgot':
                authTitle.textContent = 'Reset Password';
                authSubtitle.textContent = 'Enter your email to receive a reset link';
                break;
        }
    }

    function updateStepsVisibility(formType) {
        if (!authSteps) return;

        if (formType === 'signup') {
            authSteps.classList.remove('hidden');
        } else {
            authSteps.classList.add('hidden');
        }
    }

    // Password visibility toggle
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

    // OTP input auto-focus and formatting
    const otpInput = document.getElementById('otp-code');
    if (otpInput) {
        otpInput.addEventListener('input', function() {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-submit when 6 digits are entered
            if (this.value.length === 6) {
                verifyOTP(this.value);
            }
        });
        
        // Auto-focus on OTP input when form is shown
        otpInput.addEventListener('focus', function() {
            this.select();
        });
    }

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateMobile(mobile) {
        const re = /^[6-9]\d{9}$/;
        return re.test(mobile.replace(/[^0-9]/g, ''));
    }

    function validateAadhaar(aadhaar) {
        if (!aadhaar) return true; // Optional field
        const re = /^\d{4}-\d{4}-\d{4}$/;
        return re.test(aadhaar);
    }

    function validateUPI(upi) {
        if (!upi) return true; // Optional field
        const re = /^[\w.-]+@[\w.-]+$/;
        return re.test(upi);
    }

    // Login form handler
    if (forms.login) {
        forms.login.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }
            
            // Call backend login
            handleLogin(email, password);
        });
    }

    // Signup form handler
    if (forms.signup) {
        forms.signup.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const mobile = document.getElementById('signup-mobile').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Validation
            if (name.length < 2) {
                showError('Please enter your full name');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (mobile.length < 10) {
                showError('Please enter a valid mobile number (10 digits)');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            // Call backend signup
            handleSignup(name, email, password);
        });
    }

    // OTP form handler
    if (forms.otp) {
        forms.otp.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const otp = document.getElementById('otp-code').value;
            
            if (otp.length !== 6) {
                showError('Please enter a valid 6-digit code');
                return;
            }
            
            verifyOTP(otp);
        });
    }

    // Forgot password handler
    if (forms.forgot) {
        forms.forgot.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('forgot-email').value;
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            simulateForgotPassword(email);
        });
    }

    // Resend OTP functionality
    document.querySelectorAll('.resend-otp').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            resendOTP();
        });
    });

    // Backend API functions
    function handleLogin(email, password) {
        showLoading();
        console.log('Login attempt:', email);
        
        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Login response:', data);
            hideLoading();
            
            if (data.success) {
                showSuccess('Login successful! Redirecting...');
                // Store user data in localStorage
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('full_name', data.full_name);
                localStorage.setItem('email', data.email);
                console.log('User data stored, redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                console.log('Login failed:', data.error);
                showError(data.error || 'Invalid email or password');
            }
        })
        .catch(err => {
            console.error('Login error:', err);
            hideLoading();
            showError('Login failed: ' + err);
        });
    }

    function handleSignup(name, email, password) {
        showLoading();
        console.log('Signup attempt:', name, email);
        
        fetch('register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: name.split(' ')[0].toLowerCase(),
                email: email,
                password: password,
                full_name: name
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Signup response:', data);
            hideLoading();
            
            if (data.success) {
                showSuccess('Account created successfully!');
                console.log('Signup successful, switching to login...');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    switchForm('login');
                    showSuccess('Account created! You can now login with your credentials.');
                }, 2000);
            } else {
                console.log('Signup failed:', data.error);
                showError(data.error || 'Registration failed');
            }
        })
        .catch(err => {
            console.error('Signup error:', err);
            hideLoading();
            showError('Registration failed: ' + err);
        });
    }

    // Simulated API functions
    function simulateLogin(email, password) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            
            // Simulate success/failure
            if (email === 'demo@example.com' && password === 'password123') {
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError('Invalid email or password');
            }
        }, 1500);
    }

    function simulateSignup(name, email, mobile, password, aadhaar, upi) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            
            // Show OTP form
            switchForm('otp');
            
            // Simulate sending OTP
            console.log('OTP sent to:', mobile);
        }, 1500);
    }

    function verifyOTP(otp) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            
            // Simulate OTP verification
            if (otp === '123456') {
                // Show success message
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    document.getElementById('success-text').textContent = 'Your account has been created successfully!';
                }
                
                // Hide all forms
                Object.values(forms).forEach(form => {
                    form.classList.add('hidden');
                });
            } else {
                showError('Invalid verification code');
                if (otpInput) {
                    otpInput.value = '';
                    otpInput.focus();
                }
            }
        }, 1500);
    }

    function simulateForgotPassword(email) {
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            
            showSuccess('Password reset link sent to your email!');
            
            setTimeout(() => {
                switchForm('login');
            }, 2000);
        }, 1500);
    }

    function resendOTP() {
        showSuccess('Verification code resent!');
        
        setTimeout(() => {
            hideSuccess();
        }, 2000);
    }

    // UI feedback functions
    function showError(message) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'background-color: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #fcc; font-weight: 500;';
        
        const authContent = document.querySelector('.auth-content');
        if (authContent) {
            authContent.insertBefore(errorDiv, authContent.firstChild);
        }
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess(message) {
        // Remove existing success messages
        document.querySelectorAll('.success-message').forEach(msg => msg.remove());
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = 'background-color: #efe; color: #0a0; padding: 12px; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #cfc; font-weight: 500;';
        
        const authContent = document.querySelector('.auth-content');
        if (authContent) {
            authContent.insertBefore(successDiv, authContent.firstChild);
        }
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    function hideSuccess() {
        document.querySelectorAll('.success-message').forEach(msg => msg.remove());
    }

    function showLoading() {
        const submitButtons = document.querySelectorAll('.auth-form button[type="submit"]');
        submitButtons.forEach(button => {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        });
    }

    function hideLoading() {
        const submitButtons = document.querySelectorAll('.auth-form button[type="submit"]');
        submitButtons.forEach(button => {
            button.disabled = false;
            
            // Restore original button text based on form
            if (button.closest('#login-form')) {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            } else if (button.closest('#signup-form')) {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            } else if (button.closest('#otp-form')) {
                button.innerHTML = '<i class="fas fa-check"></i> Verify Code';
            } else if (button.closest('#forgot-form')) {
                button.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
            }
        });
    }

    // Auto-format Aadhaar input
    const aadhaarInput = document.getElementById('signup-aadhaar');
    if (aadhaarInput) {
        aadhaarInput.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9]/g, '');
            
            if (value.length >= 4 && value.length < 8) {
                value = value.substring(0, 4) + '-' + value.substring(4);
            } else if (value.length >= 8) {
                value = value.substring(0, 4) + '-' + value.substring(4, 8) + '-' + value.substring(8, 12);
            }
            
            this.value = value.substring(0, 14); // Limit to 14 characters (XXXX-XXXX-XXXX)
        });
    }

    // Auto-format mobile input
    const mobileInput = document.getElementById('signup-mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);
        });
    }

    console.log('Authentication page JavaScript loaded successfully!');
});
