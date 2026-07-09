(function () {
    var copyButtons = document.querySelectorAll('.email-user-copy[data-copy-text]');
    copyButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var text = button.getAttribute('data-copy-text') || '';
            if (!text) return;

            function markCopied() {
                button.dataset.copied = 'true';
                window.setTimeout(function () {
                    delete button.dataset.copied;
                }, 1200);
            }

            function selectButtonText() {
                if (!window.getSelection || !document.createRange) return;
                var range = document.createRange();
                range.selectNodeContents(button);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }

            function fallbackCopy() {
                var textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                var copied = false;
                try {
                    copied = document.execCommand('copy');
                } catch (e) {
                    copied = false;
                }
                document.body.removeChild(textarea);
                if (copied) {
                    markCopied();
                } else {
                    selectButtonText();
                }
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(markCopied, fallbackCopy);
            } else {
                fallbackCopy();
            }
        });
    });
})();

(function () {
    var educationItems = Array.prototype.slice.call(document.querySelectorAll('.education-item'));
    if (educationItems.length < 2 || !window.matchMedia) return;

    var desktopQuery = window.matchMedia('(min-width: 761px)');
    var syncing = false;

    function setSyncing(value) {
        syncing = value;
    }

    function syncEducation(open) {
        setSyncing(true);
        educationItems.forEach(function (item) {
            item.open = open;
        });
        window.requestAnimationFrame(function () {
            setSyncing(false);
        });
    }

    function normalizeDesktopState() {
        if (!desktopQuery.matches) return;
        var anyOpen = educationItems.some(function (item) {
            return item.open;
        });
        syncEducation(anyOpen);
    }

    educationItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (syncing || !desktopQuery.matches) return;
            syncEducation(item.open);
        });
    });

    if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', normalizeDesktopState);
    } else if (desktopQuery.addListener) {
        desktopQuery.addListener(normalizeDesktopState);
    }

    normalizeDesktopState();
})();

(function () {
    var reduceMotion = false;
    if (window.matchMedia) {
        reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var items = document.querySelectorAll('.reveal-item');
    if (!items.length) return;

    document.documentElement.classList.add('about-reveal-ready');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
    });

    items.forEach(function (item) {
        observer.observe(item);
    });
})();
