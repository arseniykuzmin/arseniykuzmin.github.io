// Build vertical navigation with scroll progress
function initScrollNav() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    const headings = mainContent.querySelectorAll('h1, h2, h3');
    if (!headings.length) return;

    const nav = document.createElement('div');
    nav.className = 'scroll-nav';

    const progress = document.createElement('div');
    progress.className = 'progress';
    nav.appendChild(progress);

    const list = document.createElement('ul');
    nav.appendChild(list);

    const label = document.createElement('div');
    label.className = 'progress-label';
    nav.appendChild(label);

    headings.forEach(h => {
        let baseId = h.id || h.textContent.trim().split(' ').join('-').toLowerCase();
        let id = baseId;
        let counter = 1;
        while (document.getElementById(id) && document.getElementById(id) !== h) {
            id = `${baseId}-${counter++}`;
        }
        h.id = id;

        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + id;
        link.addEventListener('click', e => {
            e.preventDefault();
            const headerOffset = 80;
            const offsetPosition = h.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
        li.appendChild(link);
        list.appendChild(li);
    });

    document.body.appendChild(nav);

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.height = percent + '%';
        label.textContent = Math.round(percent) + '%';

        headings.forEach((h, idx) => {
            const link = list.children[idx].firstChild;
            const rect = h.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
}

function setupScrollNav() {
    const tryInit = () => {
        if (document.querySelector('.main-content h1, .main-content h2, .main-content h3')) {
            initScrollNav();
            return true;
        }
        return false;
    };
    if (tryInit()) return;
    const observer = new MutationObserver(() => {
        if (tryInit()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', setupScrollNav);
