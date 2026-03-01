document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    }

    // Toggle theme on button click
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-mode');

            // Save preference to localStorage
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Update icon visually
            updateIcon(isDark);
        });
    }

    function updateIcon(isDark) {
        if (!toggleButton) return;
        const icon = toggleButton.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});
