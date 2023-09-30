// Load navbar
// Fetch the navigation bar content and insert it into the navbar element
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarElement = document.getElementById('navbar');
            navbarElement.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

// Toggle the navigation items visibility
function toggleNavbar() {
    const navbarItems = document.getElementById('navbarItems');
    const toggleIcon = document.getElementById('toggleIcon');

    navbarItems.classList.toggle('show');

    if (navbarItems.classList.contains('show')) {
        toggleIcon.innerHTML = '&#10005'; // Set the cross symbol when toggled
    } else {
        toggleIcon.innerHTML = '&#9776;'; // Set the default symbol when untoggled
    }
}

// Load the navbar when the page is fully loaded
window.addEventListener('load', loadNavbar);
