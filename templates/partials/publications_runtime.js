var publicationsData = [];
var sortButton;
var filterButton;
var filterInput;
var sortAscending = false;
var filterFeatured = false;
var filterText = '';

function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch];
    });
}

function venueCode(publication) {
    if (publication.venue_abbr) return publication.venue_abbr;
    if (!publication.venue) return 'Work';
    var words = publication.venue.match(/[A-Za-z0-9]+/g) || [];
    var code = words.map(function (word) { return word.charAt(0).toUpperCase(); }).join('');
    return code.length > 1 && code.length <= 10 ? code : words.slice(0, 2).join('').slice(0, 10);
}

function badgeHue(text) {
    var total = 0;
    var s = String(text || 'Work');
    for (var i = 0; i < s.length; i++) {
        total += s.charCodeAt(i);
    }
    return 20 + (total % 300);
}

function authorNameSpan(name, isMe) {
    var safeName = escapeHTML(String(name || '').trim());
    if (isMe) {
        safeName = '<b><u>' + safeName + '</u></b>';
    }
    return '<span class="author-name">' + safeName + '</span>';
}

function cleanPublicationTitle(title) {
    return String(title || '')
        .replaceAll('$\\beta$p', 'βₚ')
        .replaceAll('$\\beta_p$', 'βₚ')
        .replaceAll('\\beta', 'β')
        .replaceAll('$', '')
        .replace(/\bH2\b/g, 'H₂')
        .replace(/\bD2\b/g, 'D₂')
        .replaceAll('Q-shu university experiment', 'Q-shu University Experiment');
}

function normalizeAuthorText(author) {
    return String(author || '').trim().replace(/,(?=\S)/g, ', ').replace(/\s+/g, ' ');
}

function initialsName(nameParts) {
    nameParts = nameParts.map(function (part) {
        return part.trim();
    }).filter(Boolean);
    if (nameParts.length === 2) {
        var initials = nameParts[1].split(' ').map(function (initial) {
            return initial.charAt(0) + '.';
        }).join(' ');
        return (initials + ' ' + nameParts[0]).trim();
    }
    if (nameParts.length <= 1) {
        return nameParts[0] || '';
    }
    var initials = nameParts.slice(0, -1).map(function (initial) {
        return initial.charAt(0) + '.';
    }).join(' ');
    return (initials + ' ' + nameParts[nameParts.length - 1]).trim();
}

function transformAuthors(authors) {
    if (!authors) {
        return '';
    }

    if (authors.indexOf(' and ') === -1) {
        var nameParts = normalizeAuthorText(authors).split(', ');
        return authorNameSpan(initialsName(nameParts), authors.toLowerCase().includes('kuzmin'));
    } else {
        var authorList = authors.split(' and ');
        var transformedAuthors = authorList.map(function (author) {
            var nameParts = normalizeAuthorText(author).split(', ');
            return authorNameSpan(initialsName(nameParts), author.toLowerCase().includes('kuzmin'));
        });
        return transformedAuthors.join(', ');
    }
}

function publicationMatches(publication, text) {
    if (!text) return true;
    var hay = [
        publication.title,
        publication.authors,
        publication.venue,
        publication.venue_abbr,
        publication.year,
        publication.doi
    ].join(' ').toLowerCase();
    return hay.indexOf(text) !== -1;
}

function isFeatured(publication) {
    return Boolean(publication.aknotes && publication.aknotes.indexOf('featured') !== -1);
}

function currentPublications() {
    var text = filterText.trim().toLowerCase();
    var list = publicationsData.filter(function (publication) {
        return (
            publicationMatches(publication, text) &&
            (!filterFeatured || isFeatured(publication))
        );
    });

    list.sort(function (a, b) {
        var ya = parseInt(a.year, 10);
        var yb = parseInt(b.year, 10);
        return sortAscending ? ya - yb : yb - ya;
    });
    return list;
}

function renderPublications() {
    var list = currentPublications();
    var citations = document.getElementById('citations');
    citations.innerHTML = '';

    for (var i = 0; i < list.length; i++) {
        var publication = list[i];
        var code = venueCode(publication);
        var card = document.createElement('article');
        card.className = 'paper-card publication-card';
        card.style.setProperty('--badge-hue', publication.badge_hue || badgeHue(code));

        var top = document.createElement('div');
        top.className = 'paper-card-top';
        top.innerHTML = '<span class="venue-badge">' + escapeHTML(code) + '</span>' +
            '<span class="paper-year">📅 ' + escapeHTML(publication.year) + '</span>';
        card.appendChild(top);

        var title = document.createElement('h2');
        title.className = 'paper-title';
        title.textContent = cleanPublicationTitle(publication.title);
        card.appendChild(title);

        var authors = document.createElement('div');
        authors.className = 'authors';
        authors.innerHTML = transformAuthors(publication.authors);
        card.appendChild(authors);

        var meta = document.createElement('div');
        meta.className = 'paper-meta';
        var venueLine = String(publication.venue || '');
        if (publication.year) venueLine += ' ' + publication.year;
        if (publication.volume) venueLine += ', ' + publication.volume;
        if (publication.pages) venueLine += ', ' + publication.pages;
        meta.innerHTML = '<span class="paper-venue">' + escapeHTML(venueLine) + '</span>';
        card.appendChild(meta);

        if (publication.doi) {
            var actions = document.createElement('div');
            actions.className = 'paper-actions';
            var doi = document.createElement('a');
            doi.className = 'paper-link';
            doi.href = 'https://doi.org/' + publication.doi;
            doi.target = '_blank';
            doi.rel = 'noopener noreferrer';
            doi.textContent = 'open DOI';
            actions.appendChild(doi);
            card.appendChild(actions);
        }

        citations.appendChild(card);
    }

    document.getElementById('publicationCount').textContent = list.length;
}

publicationsData = window.__PUBLICATIONS_DATA__ || [];
sortButton = document.getElementById('sortButton');
filterButton = document.getElementById('filterButton');
filterInput = document.getElementById('publicationFilter');

if (sortButton) {
    sortButton.addEventListener('click', function () {
        sortAscending = !sortAscending;
        sortButton.classList.toggle('active', sortAscending);
        renderPublications();
    });
}

if (filterButton) {
    filterButton.addEventListener('click', function () {
        filterFeatured = !filterFeatured;
        filterButton.classList.toggle('active', filterFeatured);
        renderPublications();
    });
}

if (filterInput) {
    filterInput.addEventListener('input', function () {
        filterText = filterInput.value;
        renderPublications();
    });
}

renderPublications();
