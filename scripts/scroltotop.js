document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('scrollToTopButton');
    if (!button) return;

    let lastY = window.scrollY;
    let hideUntilDirectionChanges = false;

    function updateScrollTopButton() {
        const y = window.scrollY;
        const scrollingUp = y < lastY;
        const scrollingDown = y > lastY;

        if (y <= 420 || scrollingDown) {
            hideUntilDirectionChanges = false;
        }

        const show = y > 420 && scrollingUp && !hideUntilDirectionChanges;

        button.classList.toggle('show', show);
        button.setAttribute('aria-hidden', show ? 'false' : 'true');
        lastY = y;
    }

    button.addEventListener('click', () => {
        hideUntilDirectionChanges = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        button.classList.remove('show');
        button.setAttribute('aria-hidden', 'true');
    });

    button.setAttribute('aria-hidden', 'true');
    updateScrollTopButton();
    window.addEventListener('scroll', updateScrollTopButton, { passive: true });
});
