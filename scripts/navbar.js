function updateToggleIcon() {
    const toggleButton = document.getElementById('darkModeToggle');
    const isDark = document.body.classList.contains('dark-mode');
    if (toggleButton) {
        toggleButton.textContent = isDark ? '🌝' : '🌚';
    }
}

function setupDarkModeToggle() {
    const toggleButton = document.getElementById('darkModeToggle');

    if (!toggleButton) {
        console.warn('Dark mode toggle button not found after navbar load');
        return;
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? '1' : '0');
        updateToggleIcon();
    });

    // Apply saved preference
    if (localStorage.getItem('darkMode') === '1') {
        document.body.classList.add('dark-mode');
    }

    updateToggleIcon();
}

function toggleNavbar() {
    const navbarItems = document.getElementById('navbarItems');
    const toggleIcon = document.getElementById('toggleIcon');

    navbarItems.classList.toggle('show');

    toggleIcon.innerHTML = navbarItems.classList.contains('show') ? '&#10005;' : '&#9776;';
}

function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarElement = document.getElementById('navbar');
            navbarElement.innerHTML = data;

            console.log('Navbar loaded');
            setupDarkModeToggle();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

window.addEventListener('load', loadNavbar);
