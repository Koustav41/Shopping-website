// Central Theme Controller Utility
window.getApiUrl = function (path) {
    const origin = window.location.origin;
    if (!origin || origin.startsWith('file://') || (origin.includes('localhost') && !origin.includes(':5000')) || (origin.includes('127.0.0.1') && !origin.includes(':5000'))) {
        return 'http://localhost:5000' + path;
    }
    return path;
};

(function () {
    // 1. Immediately apply the saved theme to prevent FOUT (Flash of Un-themed Content)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = savedTheme + '-theme';

    // 2. Function to update all theme toggle icons and accessibility attributes on the page
    function updateToggleButtons() {
        const theme = localStorage.getItem('theme') || 'dark';
        const buttons = document.querySelectorAll('.theme-btn');
        buttons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'light') {
                    icon.className = 'fas fa-moon';
                    btn.setAttribute('title', 'Switch to dark theme');
                    btn.setAttribute('aria-label', 'Switch to dark theme');
                } else {
                    icon.className = 'fas fa-sun';
                    btn.setAttribute('title', 'Switch to light theme');
                    btn.setAttribute('aria-label', 'Switch to light theme');
                }
            }
        });
    }

    // 3. Centralised toggler logic exposed to window
    window.toggleTheme = function () {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.className = newTheme + '-theme';
        updateToggleButtons();

        // Integrate with existing premium Toast systems (handles index.html & cart.html)
        if (typeof showToast === 'function') {
            const themeName = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
            showToast(`${themeName} mode enabled successfully!`, 'info');
        }
    };

    // Function to auto-wrap any un-wrapped password inputs with wrapper & toggle button
    function initPasswordToggles() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            if (!input.closest('.password-input-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'password-input-wrapper';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'password-toggle-btn';
                btn.setAttribute('aria-label', 'Show password');
                btn.setAttribute('tabindex', '-1');
                btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
                wrapper.appendChild(btn);
            }
        });
    }

    // 4. Initialize elements as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        updateToggleButtons();
        initPasswordToggles();

        // Event delegation handles clicking on theme button or password toggle button dynamically
        document.body.addEventListener('click', function (e) {
            const btn = e.target.closest('.theme-btn');
            if (btn) {
                toggleTheme();
                return;
            }

            const toggleBtn = e.target.closest('.password-toggle-btn');
            if (toggleBtn) {
                e.preventDefault();
                const wrapper = toggleBtn.closest('.password-input-wrapper') || toggleBtn.parentElement;
                const input = wrapper ? wrapper.querySelector('input') : null;
                if (input) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    const icon = toggleBtn.querySelector('i');
                    if (icon) {
                        icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
                    }
                    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
                    input.focus();
                }
            }
        });
    });
})();

// 5. Register Service Worker for PWA (installability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered successfully:', reg.scope))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

