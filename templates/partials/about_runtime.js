document.querySelectorAll('.experience-item .skills-arrow').forEach(function (expArrow) {
    var experienceItem = expArrow.closest('.experience-item');
    var descriptionDiv = experienceItem.querySelector('.experience-description');
    if (!descriptionDiv) return;
    expArrow.addEventListener('click', function () {
        descriptionDiv.classList.toggle('collapsed');
        experienceItem.classList.toggle('expanded');
        expArrow.textContent = expArrow.innerText === 'show more' ? 'hide' : 'show more';
    });
});

(function () {
    var profile = document.getElementById('profile');
    var info = document.querySelector('.info');
    var personalInfo = document.querySelector('.personal-info');
    if (!profile || !info || !personalInfo || !personalInfo.parentNode) return;
    var parent = personalInfo.parentNode;

    function moveProfileIfNeeded() {
        var alreadyOutside = profile.parentNode !== info;

        if (window.innerWidth <= 768 && !alreadyOutside) {
            info.removeChild(profile);
            parent.insertBefore(profile, personalInfo.nextSibling);
        } else if (window.innerWidth > 768 && alreadyOutside) {
            parent.removeChild(profile);
            info.appendChild(profile);
        }
    }

    moveProfileIfNeeded();
    window.addEventListener('resize', moveProfileIfNeeded);
})();
