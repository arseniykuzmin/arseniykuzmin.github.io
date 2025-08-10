document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.querySelector('.main-content');
    const h1Elements = mainContent.querySelectorAll('h1');
    const navList = document.querySelector('.section-nav');

    h1Elements.forEach(h1 => {
        const idName = h1.textContent.trim().split(' ').join('-').toLowerCase();
        h1.setAttribute('id', idName); // Set an id to the h1 tag

        const listItem = document.createElement('li');
        listItem.className = "toc-h1 nav-item toc-entry";

        const link = document.createElement('a');
        link.className = "reference internal nav-link";
        link.href = "#" + idName;
        link.textContent = h1.textContent;

        listItem.appendChild(link);
        navList.appendChild(listItem);
    });

    const navLinks = document.querySelectorAll('.nav-link'); // Initialize navLinks

    // Offset scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            let target = document.querySelector(this.hash);
            let headerOffset = 100; // Adjust this value according to your needs
            let elementPosition = target.offsetTop;
            let offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });
    // Track scrolling and set active link
    window.addEventListener("scroll", function () {
        let fromTop = window.scrollY;
        let viewportHeight = window.innerHeight;
        let maxVisibleHeight = 0;
        let mostVisibleLink = null;

        navLinks.forEach(link => {
            let section = document.querySelector(link.hash);
            let sectionStart = section.offsetTop;
            let sectionEnd = sectionStart + section.offsetHeight;

            let visibleStart = Math.max(sectionStart, fromTop);
            let visibleEnd = Math.min(sectionEnd, fromTop + viewportHeight);

            let visibleHeight = Math.max(visibleEnd - visibleStart, 0);

            if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                mostVisibleLink = link;
            }
        });

        navLinks.forEach(link => {
            if (link === mostVisibleLink) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });


});
