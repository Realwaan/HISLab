// ============================================
// LOGIN PAGE JAVASCRIPT
// ============================================

// ============================================
// SECURE DATABASE STORAGE
// ============================================

// Simple encryption function (for demonstration - in production use proper backend encryption)
function encryptPassword(password) {
    // Base64 encoding with additional salt (NOT secure for production, use backend encryption)
    const salt = 'ClinikaBayan2025';
    return btoa(salt + password + salt);
}

function decryptPassword(encrypted) {
    try {
        const decoded = atob(encrypted);
        const salt = 'ClinikaBayan2025';
        return decoded.substring(salt.length, decoded.length - salt.length);
    } catch (e) {
        return null;
    }
}

// Database initialization
function initDatabase() {
    if (!localStorage.getItem('clinikabayan_users_db')) {
        localStorage.setItem('clinikabayan_users_db', JSON.stringify([]));
    }
}

// Get all users from database
function getAllUsers() {
    const db = localStorage.getItem('clinikabayan_users_db');
    return db ? JSON.parse(db) : [];
}

// Save user to database
function saveUser(userData) {
    const users = getAllUsers();
    users.push({
        id: Date.now().toString(),
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role,
        password: encryptPassword(userData.password),
        createdAt: new Date().toISOString(),
        lastLogin: null
    });
    localStorage.setItem('clinikabayan_users_db', JSON.stringify(users));
    return true;
}

// Find user by email
function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Validate user credentials
function validateCredentials(email, password) {
    const user = findUserByEmail(email);
    if (!user) return { error: 'USER_NOT_FOUND' };
    
    const decrypted = decryptPassword(user.password);
    if (decrypted === password) {
        return { success: true, user: user };
    }
    return { error: 'WRONG_PASSWORD' };
}

// Update last login
function updateLastLogin(email) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
        users[userIndex].lastLogin = new Date().toISOString();
        localStorage.setItem('clinikabayan_users_db', JSON.stringify(users));
    }
}

// ============================================
// LOGIN ERROR POPUP
// ============================================

function showLoginError(title, message) {
    // Create error modal
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal-overlay';
    errorModal.innerHTML = `
        <div class="error-modal">
            <div class="error-modal-header">
                <i class="fas fa-exclamation-circle"></i>
                <h3>${title}</h3>
            </div>
            <div class="error-modal-body">
                <p>${message}</p>
            </div>
            <div class="error-modal-footer">
                <button class="btn-error-ok" onclick="closeErrorModal()">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    // Animate in
    setTimeout(() => {
        errorModal.classList.add('active');
    }, 10);
}

function closeErrorModal() {
    const modal = document.querySelector('.error-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Make function globally available
window.closeErrorModal = closeErrorModal;

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Make function globally available
window.togglePasswordVisibility = togglePasswordVisibility;

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    initDatabase();
    
    // Initialize Philippine time clock
    updatePhilippineTime();
    setInterval(updatePhilippineTime, 1000);
    
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const loginCard = document.querySelector('.login-card:not(.registration-card)');
    const registrationCard = document.querySelector('.registration-card');

    // Check if all elements exist
    console.log('Form elements found:', {
        loginForm: !!loginForm,
        registrationForm: !!registrationForm,
        showRegisterBtn: !!showRegisterBtn,
        showLoginBtn: !!showLoginBtn,
        loginCard: !!loginCard,
        registrationCard: !!registrationCard
    });

    // Toggle between login and registration forms
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginCard.style.display = 'none';
            registrationCard.style.display = 'block';
            console.log('Switched to registration form');
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registrationCard.style.display = 'none';
            loginCard.style.display = 'block';
            console.log('Switched to login form');
        });
    }

    // Handle login form submission
    if (loginForm) {
        console.log('Login form listener attached');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted!');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

        // Email validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;

        // Validate credentials against database (Firebase or localStorage)
        setTimeout(async () => {
            try {
                let result;
                
                // Try Firebase first
                if (window.FirebaseAuth && window.FirebaseAuth.isAvailable()) {
                    console.log('Using Firebase for login');
                    result = await window.FirebaseAuth.login(email, password);
                } else {
                    // Fallback to localStorage
                    console.log('Firebase not available, using localStorage');
                    result = validateCredentials(email, password);
                }
                
                if (result.error === 'USER_NOT_FOUND') {
                    // Email not found in database
                    showLoginError('Account Not Found', 'No account found with this email address. Please check your email or create a new account.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                if (result.error === 'WRONG_PASSWORD') {
                    // Password is incorrect
                    showLoginError('Incorrect Password', 'The password you entered is incorrect. Please try again or click "Forgot password?" to reset it.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                if (result.error) {
                    // Other errors
                    showLoginError('Login Failed', 'An error occurred during login. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                if (result.success && result.user) {
                    // Login successful
                    const user = result.user;
                    
                    // Store user session
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('isAuthenticated', 'true');
                    
                    // Store user data
                    const userData = {
                        email: user.email,
                        name: user.fullname,
                        role: user.role
                    };
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    console.log('Login successful!');
                    
                    // Redirect to dashboard
                    window.location.href = 'pages/dashboard.html';
                }
            } catch (error) {
                console.error('Login error:', error);
                showLoginError('Login Failed', 'An unexpected error occurred. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1000);
        });
    } else {
        console.error('Login form not found!');
    }

    // Handle registration form submission
    if (registrationForm) {
        console.log('Registration form listener attached');
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Registration form submitted!');
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('reg-email').value;
            const role = document.getElementById('userRole').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;

            console.log('Form values:', { fullname, email, role, password, confirmPassword, terms });

            // Validation
            if (!fullname || !email || !role || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

        // Email validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Check if email already exists
        if (findUserByEmail(email)) {
            alert('An account with this email already exists. Please sign in or use a different email.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!terms) {
            alert('Please agree to the Terms and Conditions');
            return;
        }

        // Password strength check
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        // Additional password validation
        const strength = calculatePasswordStrength(password);
        if (strength === 'weak') {
            alert('Password is too weak. Please use a combination of uppercase, lowercase, numbers, and special characters.');
            return;
        }
        
        // Show loading state
        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;

        // Save to database (Firebase or localStorage)
        setTimeout(async () => {
            try {
                let success = false;
                
                // Try Firebase first
                if (window.FirebaseAuth && window.FirebaseAuth.isAvailable()) {
                    console.log('Using Firebase for registration');
                    const result = await window.FirebaseAuth.register(fullname, email, role, password);
                    
                    if (result.success) {
                        success = true;
                        console.log('User registered successfully to Firebase');
                    } else {
                        throw new Error(result.error);
                    }
                } else {
                    // Fallback to localStorage
                    console.log('Firebase not available, using localStorage');
                    success = saveUser({
                        fullname: fullname,
                        email: email,
                        role: role,
                        password: password
                    });
                }
                
                if (success) {
                    alert('Account created successfully! Please sign in with your credentials.');
                    
                    // Switch back to login form
                    registrationCard.style.display = 'none';
                    loginCard.style.display = 'block';
                    
                    // Pre-fill email in login form
                    document.getElementById('email').value = email;
                    
                    // Reset registration form
                    registrationForm.reset();
                    submitBtn.textContent = 'Create Account';
                    submitBtn.disabled = false;
                } else {
                    throw new Error('Failed to save user');
                }
            } catch (error) {
                alert('Registration failed: ' + error.message);
                submitBtn.textContent = 'Create Account';
                submitBtn.disabled = false;
                console.error('Registration error:', error);
            }
        }, 1000);
        });
    } else {
        console.error('Registration form not found!');
    }

    // Real-time password strength indicator
    const regPassword = document.getElementById('reg-password');
    if (regPassword) {
        regPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            // You can add a visual indicator here
            console.log('Password strength:', strength);
        });
    }

    // Password match validation
    const confirmPassword = document.getElementById('confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            const password = document.getElementById('reg-password').value;
            if (this.value && this.value !== password) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    }
});

// Password strength calculator
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// PHILIPPINE TIME CLOCK
// ============================================

function updatePhilippineTime() {
    // Get current time in Philippine timezone (GMT+8)
    const now = new Date();
    
    // Convert to Philippine Time (Asia/Manila timezone)
    const options = {
        timeZone: 'Asia/Manila',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateOptions = {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const timeString = now.toLocaleTimeString('en-US', options);
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    // Update the DOM elements
    const timeElement = document.getElementById('phTime');
    const dateElement = document.getElementById('phDate');
    
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}
