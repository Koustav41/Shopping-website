document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        try {
            const apiUrl = typeof window.getApiUrl === 'function' ? window.getApiUrl('/api/auth/login') : '/api/auth/login';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                // Save currently logged in user session and JWT token
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showToast(data.message || 'Invalid email or password. Please try again.', 'error');
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