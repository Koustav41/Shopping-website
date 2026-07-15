document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');

    // --- 1. Traditional Login Form Handler ---
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                let user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    localStorage.setItem('token', `mock-jwt-token-${email}`);
                    localStorage.setItem('currentUser', JSON.stringify({
                        name: user.name,
                        email: user.email,
                        picture: user.picture || '',
                        isGoogle: user.isGoogle || false
                    }));
                    showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    // Sandbox testing fallback: create user if credentials are user@example.com / password123
                    if (email === 'user@example.com' && password === 'password123') {
                        const defaultUser = {
                            name: 'Demo User',
                            email: 'user@example.com',
                            password: 'password123',
                            picture: '',
                            isGoogle: false,
                            phone: '9876543210',
                            address: 'Kolkata, India',
                            createdAt: new Date().toISOString()
                        };
                        users.push(defaultUser);
                        localStorage.setItem('users', JSON.stringify(users));
                        
                        localStorage.setItem('token', 'mock-jwt-token-user@example.com');
                        localStorage.setItem('currentUser', JSON.stringify({
                            name: defaultUser.name,
                            email: defaultUser.email,
                            picture: defaultUser.picture,
                            isGoogle: defaultUser.isGoogle
                        }));
                        showToast('Default Login successful! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1000);
                    } else {
                        showToast('Invalid email or password. Please try again.', 'error');
                    }
                }
            } catch (error) {
                showToast('Login failed. Please try again.', 'error');
            }
        });
    }

    // --- 2. Google Identity Services (GIS) Integration ---
    function initGoogleAuth() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: '603341860384-jarfjo5pgimnom49p8gqu780ssbsbc0t.apps.googleusercontent.com', // Placeholder Client ID
                callback: handleGoogleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById('google-signin-btn'),
                { theme: 'outline', size: 'large', width: '280' }
            );
        } else {
            console.warn('Google Identity Services library not loaded yet. Retrying...');
            setTimeout(initGoogleAuth, 1000);
        }
    }

    // Initialize GIS after short delay
    setTimeout(initGoogleAuth, 500);

    // Decode JWT helper for Google Credential Token
    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to decode JWT:', e);
            return null;
        }
    }

    // Handler for official Google Login Response
    async function handleGoogleCredentialResponse(response) {
        try {
            const payload = decodeJwt(response.credential);
            if (!payload) {
                showToast('Invalid Google credentials response.', 'error');
                return;
            }
            await executeGoogleLogin(payload.email, payload.name, payload.picture, response.credential);
        } catch (err) {
            showToast('Google Sign-in failed.', 'error');
        }
    }

    // Common execution routine for both real and simulated Google login
    async function executeGoogleLogin(email, name, picture, token) {
        try {
            // Perform client-side local storage Google login
            const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
            let localUser = localUsers.find(u => u.email === email);

            if (!localUser) {
                localUser = {
                    name,
                    email,
                    picture: picture || '',
                    isGoogle: true,
                    phone: '',
                    address: '',
                    createdAt: new Date().toISOString()
                };
                localUsers.push(localUser);
            } else {
                localUser.isGoogle = true;
                if (picture) localUser.picture = picture;
            }

            localStorage.setItem('users', JSON.stringify(localUsers));
            localStorage.setItem('token', token || `mock-google-token-${email}`);
            localStorage.setItem('currentUser', JSON.stringify({
                name: localUser.name,
                email: localUser.email,
                picture: localUser.picture || '',
                isGoogle: true
            }));

            showToast(`Welcome back, ${name}! Logged in with Google.`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Google execution routine failed:', error);
            showToast('Google Sign-in failed. Please try again.', 'error');
        }
    }

    // --- 3. Google Sign-In Simulator Logic ---
    const simBtn = document.getElementById('custom-google-btn');
    const modalOverlay = document.getElementById('google-sim-modal-overlay');
    const modalClose = document.getElementById('google-sim-modal-close');
    const otherAccBtn = document.getElementById('google-sim-other-btn');
    const customForm = document.getElementById('google-sim-custom-form');

    if (simBtn && modalOverlay) {
        // Open Modal
        simBtn.addEventListener('click', () => {
            modalOverlay.classList.add('show');
            customForm.style.display = 'none';
        });

        // Close Modal
        const closeModal = () => modalOverlay.classList.remove('show');
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Select pre-configured account
        const accButtons = modalOverlay.querySelectorAll('.g-sim-account-item');
        accButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const email = btn.getAttribute('data-email');
                const name = btn.getAttribute('data-name');
                const picture = btn.getAttribute('data-picture');
                closeModal();
                await executeGoogleLogin(email, name, picture, `simulated-google-jwt-${email}`);
            });
        });

        // Toggle Custom Account Form
        otherAccBtn.addEventListener('click', () => {
            customForm.style.display = customForm.style.display === 'block' ? 'none' : 'block';
            if (customForm.style.display === 'block') {
                customForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        // Custom account submit
        customForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('simName').value.trim();
            const email = document.getElementById('simEmail').value.trim();
            const picture = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?q=80&w=150&auto=format&fit=crop`;

            closeModal();
            await executeGoogleLogin(email, name, picture, `simulated-google-jwt-${email}`);
        });
    }
});

// Toast popup utility for authentication forms
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-alerts-box');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';

    let iconClass = 'fa-check-circle';
    if (type === 'error') {
        iconClass = 'fa-exclamation-circle';
        toast.style.borderLeftColor = 'var(--accent-danger)';
    } else if (type === 'info') {
        iconClass = 'fa-info-circle';
        toast.style.borderLeftColor = 'var(--accent-cyan)';
    }

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} custom-toast-icon" style="color: ${type === 'error' ? 'var(--accent-danger)' : (type === 'info' ? 'var(--accent-cyan)' : 'var(--accent-emerald)')}"></i>
        <div class="custom-toast-body">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}