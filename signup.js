document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('confirmpassword').value.trim();

        if (password !== confirmPassword) {
            showToast('Passwords do not match! Please check again.', 'error');
            return;
        }

        try {
            const apiUrl = typeof window.getApiUrl === 'function' ? window.getApiUrl('/api/auth/register') : '/api/auth/register';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();

            if (data.success) {
                showToast('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1200);
            } else {
                showToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Server connection failed. Please try again later.', 'error');
        }
    });
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
    }

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} custom-toast-icon" style="color: ${type === 'error' ? 'var(--accent-danger)' : 'var(--accent-cyan)'}"></i>
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