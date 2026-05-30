// Central Theme Controller Utility
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

    // 4. Initialize elements as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        updateToggleButtons();

        // Event delegation handles clicking on any theme button dynamically
        document.body.addEventListener('click', function (e) {
            const btn = e.target.closest('.theme-btn');
            if (btn) {
                toggleTheme();
            }
        });
    });
})();
