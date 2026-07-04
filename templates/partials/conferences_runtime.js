var conferencesData = [];
var sortButton;
var filterInput;
var sortAscending = false;
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

function badgeHue(text) {
    var total = 0;
    var s = String(text || 'Work');
    for (var i = 0; i < s.length; i++) {
        total += s.charCodeAt(i);
    }
    return 20 + (total % 300);
}

function fallbackCode(name) {
    var fullName = String(name || '');
    var matches = fullName.match(/\(([^()]+)\)/g) || [];
    if (matches.length) {
        var code = matches[matches.length - 1].replace(/[()]/g, '');
        code = code.replace(/\b(?:19|20)\d{2}\b/g, '').replace(/^[\s-/]+|[\s-/]+$/g, '');
        var ordinal = fullName.match(/\b(\d+)(?:st|nd|rd|th)\b/i);
        if (code.toUpperCase() === 'PSI' && ordinal) {
            return 'PSI-' + ordinal[1];
        }
        if (code) return code;
    }
    var words = fullName.match(/[A-Za-z0-9]+/g) || [];
    var acronym = words.map(function (word) { return word.charAt(0).toUpperCase(); }).join('');
    return acronym.length > 1 && acronym.length <= 12 ? acronym : words.slice(0, 2).join('').slice(0, 12);
}

function conferenceBadge(conference) {
    var c = conference.conference || {};
    return c.abbr || c.conf || fallbackCode(c.name) || 'Conf';
}

function conferenceMatches(conference, text) {
    if (!text) return true;
    var c = conference.conference || {};
    var hay = [
        conference.title,
        conference.authors,
        c.name,
        c.conf,
        c.abbr,
        c.location,
        c.year,
        conference.presentation
    ].join(' ').toLowerCase();
    return hay.indexOf(text) !== -1;
}

function currentConferences() {
    var text = filterText.trim().toLowerCase();
    var list = conferencesData.filter(function (conference) {
        return conferenceMatches(conference, text);
    });
    list.sort(function (a, b) {
        var ya = parseInt(a.conference.year, 10);
        var yb = parseInt(b.conference.year, 10);
        return sortAscending ? ya - yb : yb - ya;
    });
    return list;
}

function renderConferences() {
    var list = currentConferences();
    var conferenceList = document.getElementById('conference-list');
    conferenceList.innerHTML = '';

    for (var i = 0; i < list.length; i++) {
        var conference = list[i];
        var c = conference.conference || {};
        var code = conferenceBadge(conference);

        var card = document.createElement('article');
        card.className = 'paper-card conference-card';
        card.style.setProperty('--badge-hue', c.badge_hue || badgeHue(code));

        var top = document.createElement('div');
        top.className = 'paper-card-top';
        top.innerHTML = '<span class="venue-badge">' + escapeHTML(code) + '</span>' +
            '<span class="paper-year">📅 ' + escapeHTML(c.year) + '</span>';
        card.appendChild(top);

        var title = document.createElement('h2');
        title.className = 'paper-title';
        title.textContent = conference.title || '';
        card.appendChild(title);

        var authors = document.createElement('div');
        authors.className = 'authors';
        authors.textContent = conference.authors || '';
        card.appendChild(authors);

        var meta = document.createElement('div');
        meta.className = 'paper-meta';
        var presentationIcon = String(conference.presentation || '').toLowerCase().indexOf('oral') !== -1 ? '🎤' : '📌';
        meta.innerHTML = '<span>' + escapeHTML(c.name) + '</span>' +
            '<span>📍 ' + escapeHTML(c.location) + '</span>' +
            '<span>' + escapeHTML(c.date) + '</span>' +
            '<span>' + presentationIcon + ' ' + escapeHTML(conference.presentation) + '</span>';
        card.appendChild(meta);

        conferenceList.appendChild(card);
    }

    document.getElementById('conferenceCount').textContent = list.length;
}

function sortConferences() {
    sortAscending = !sortAscending;
    sortButton.classList.toggle('active', sortAscending);
    renderConferences();
}

conferencesData = window.__CONFERENCES_DATA__ || [];
sortButton = document.getElementById('sortButton');
filterInput = document.getElementById('conferenceFilter');

if (sortButton) {
    sortButton.addEventListener('click', sortConferences);
}
if (filterInput) {
    filterInput.addEventListener('input', function () {
        filterText = filterInput.value;
        renderConferences();
    });
}

renderConferences();
