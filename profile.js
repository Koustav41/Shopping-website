document.addEventListener('DOMContentLoaded', async function () {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const sessionUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!token || !sessionUser) {
        // Not logged in - redirect to login
        showToast('Please login to view your profile page.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
        return;
    }

    // Initialize Navbar components
    initAuthNavbar();
    updateCartCountBadge();

    // Elements
    const form = document.getElementById('profile-details-form');
    const avatarBox = document.getElementById('profile-avatar-box');
    const summaryName = document.getElementById('summary-name');
    const summaryEmail = document.getElementById('summary-email');
    const statusBadge = document.getElementById('profile-status-badge');
    const metaMemberSince = document.getElementById('meta-member-since');
    const metaOrdersCount = document.getElementById('meta-orders-count');
    
    const inputName = document.getElementById('profileName');
    const inputEmail = document.getElementById('profileEmail');
    const inputPhone = document.getElementById('profilePhone');
    const inputAddress = document.getElementById('profileAddress');
    
    const passwordSection = document.getElementById('password-update-section');
    const googleInfoSection = document.getElementById('google-info-section');
    
    const inputPassword = document.getElementById('profilePassword');
    const inputConfirmPassword = document.getElementById('profileConfirmPassword');
    const saveBtn = document.getElementById('btn-save-profile-data');

    // Retrieve user details (Sync with backend or fallback to local storage)
    let userDetails = await fetchUserProfile(sessionUser.email, token);
    
    if (userDetails) {
        populateProfileFields(userDetails);
    } else {
        showToast('Failed to load profile details.', 'error');
    }

    // --- 1. Profile Retrieval Routine ---
    async function fetchUserProfile(email, authToken) {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        let user = localUsers.find(u => u.email === email);
        
        // If user is completely missing in localStorage for some reason, generate default
        if (!user) {
            user = {
                name: sessionUser.name,
                email: sessionUser.email,
                phone: '',
                address: '',
                picture: sessionUser.picture || '',
                isGoogle: sessionUser.isGoogle || false,
                createdAt: new Date().toISOString()
            };
            localUsers.push(user);
            localStorage.setItem('users', JSON.stringify(localUsers));
        }

        return user;
    }

    // Helper to sync user structure into users database in local storage
    function syncLocalUser(updatedUser) {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = localUsers.findIndex(u => u.email === updatedUser.email);
        
        const fullUser = {
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone || '',
            address: updatedUser.address || '',
            picture: updatedUser.picture || '',
            isGoogle: updatedUser.isGoogle || false,
            createdAt: updatedUser.createdAt || new Date().toISOString()
        };

        if (idx !== -1) {
            localUsers[idx] = { ...localUsers[idx], ...fullUser };
        } else {
            localUsers.push(fullUser);
        }
        localStorage.setItem('users', JSON.stringify(localUsers));
    }

    // --- 2. Populate Fields Routine ---
    function populateProfileFields(user) {
        // Summary box
        summaryName.innerText = user.name;
        summaryEmail.innerText = user.email;
        
        // Avatar rendering
        if (user.picture) {
            avatarBox.innerHTML = `<img src="${user.picture}" alt="${user.name}" class="profile-avatar-img">`;
        } else {
            const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
            avatarBox.innerHTML = `<div class="profile-avatar-initials">${initial}</div>`;
        }

        // Status badge
        if (user.isGoogle) {
            statusBadge.innerHTML = `
                <span class="profile-badge-auth profile-badge-google">
                    <i class="fa-brands fa-google me-1"></i> Google Account
                </span>
            `;
            // Hide password sections, show Google managed alert
            passwordSection.classList.add('d-none');
            googleInfoSection.classList.remove('d-none');
        } else {
            statusBadge.innerHTML = `
                <span class="profile-badge-auth profile-badge-standard">
                    <i class="fa-solid fa-shield-halved me-1"></i> Standard Account
                </span>
            `;
            passwordSection.classList.remove('d-none');
            googleInfoSection.classList.add('d-none');
        }

        // Metadata
        const joinedDate = user.createdAt ? new Date(user.createdAt) : new Date();
        const options = { year: 'numeric', month: 'long' };
        metaMemberSince.innerText = joinedDate.toLocaleDateString(undefined, options);

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const myOrders = orders.filter(o => o.userEmail === user.email);
        metaOrdersCount.innerText = myOrders.length;

        // Form Fields
        inputName.value = user.name;
        inputEmail.value = user.email;
        inputPhone.value = user.phone || '';
        inputAddress.value = user.address || '';
    }

    // --- 3. Form Submission handler ---
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const name = inputName.value.trim();
            const phone = inputPhone.value.trim();
            const address = inputAddress.value.trim();
            const password = inputPassword.value;
            const confirmPassword = inputConfirmPassword.value;

            // Password Validation (For Standard users only)
            if (!userDetails.isGoogle && password) {
                if (password.length < 6) {
                    showToast('New password must be at least 6 characters long.', 'error');
                    return;
                }
                if (password !== confirmPassword) {
                    showToast('Passwords do not match! Please check again.', 'error');
                    return;
                }
            }

            // Animate Save Button
            const originalBtnHtml = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-1"></i> Saving Changes...`;

            try {
                const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = localUsers.findIndex(u => u.email === userDetails.email);
                
                if (idx !== -1) {
                    localUsers[idx].name = name;
                    localUsers[idx].phone = phone;
                    localUsers[idx].address = address;
                    
                    if (!userDetails.isGoogle && password) {
                        localUsers[idx].password = password;
                    }
                    
                    localStorage.setItem('users', JSON.stringify(localUsers));
                    userDetails = localUsers[idx];
                    
                    // Update active currentUser session
                    const updatedSession = {
                        name: userDetails.name,
                        email: userDetails.email,
                        picture: userDetails.picture || '',
                        isGoogle: userDetails.isGoogle || false
                    };
                    localStorage.setItem('currentUser', JSON.stringify(updatedSession));
                    
                    // Re-render UI details
                    populateProfileFields(userDetails);
                    initAuthNavbar(); // Update navbar name greetings
                    
                    showToast('Profile updated successfully!', 'success');
                    
                    // Reset passwords
                    inputPassword.value = '';
                    inputConfirmPassword.value = '';
                } else {
                    showToast('Failed to save profile changes.', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('An error occurred during save.', 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    // --- 4. Navbar Auth Display (Displays current user) ---
    function initAuthNavbar() {
        const authSection = document.getElementById('nav-auth-section');
        if (!authSection) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

        if (currentUser) {
            authSection.innerHTML = `
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <a href="view orders.html" class="nav-link nav-link-custom text-nowrap">
                        <i class="fa-solid fa-receipt me-1 text-cyan"></i> My Orders
                    </a>
                    <a href="profile.html" class="nav-link nav-link-custom active text-nowrap" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.25);" title="View Profile">
                        <i class="fa-solid fa-circle-user text-emerald me-1"></i> Hi, ${currentUser.name.split(' ')[0]}
                    </a>
                    <a href="#" class="nav-link nav-link-custom text-danger" id="logout-btn-link" title="Logout">
                        <i class="fa-solid fa-sign-out-alt"></i>
                    </a>
                </div>
            `;

            document.getElementById('logout-btn-link').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                showToast('You have successfully logged out.', 'info');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            });
        } else {
            authSection.innerHTML = `
                <a class="nav-link nav-link-custom" href="login.html">
                    <i class="fa-solid fa-user me-1"></i> Login
                </a>
            `;
        }
    }

    // --- 5. Cart badge count updater ---
    function updateCartCountBadge() {
        const badge = document.getElementById('cart-badge-count');
        if (!badge) return;
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.innerText = count;
    }
});

// Toast popup utility
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
