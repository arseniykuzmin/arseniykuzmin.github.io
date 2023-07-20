// Function to scroll back to the top when the button is clicked
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

// Attach the scrollToTop function to the button's click event
document.addEventListener('DOMContentLoaded', () => {
    // Get the button element after the page has fully loaded
    const scrollToTopButton = document.getElementById('scrollToTopButton');

    // Show the button when the user scrolls down 20px from the top of the document
    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    };

    // Attach the scrollToTop function to the button's click event
    scrollToTopButton.addEventListener('click', scrollToTop);
});
