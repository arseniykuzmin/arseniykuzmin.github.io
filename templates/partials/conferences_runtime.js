var conferencesData = [];
var sortButton;
var filterInput;
var sortAscending = false;
var filterText = '';

function conferenceMatches(conference, text) {
    if (!text) return true;
    var c = conference.conference || {};
    var hay = [
        conference.title,
        conference.authors,
        c.name,
        c.conf,
        c.location,
        c.year
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
        var num = i + 1;

        var conferenceItem = document.createElement('div');
        conferenceItem.classList.add('conference-item');

        var title = document.createElement('h3');
        title.textContent = num + '. ' + conference.title;
        conferenceItem.appendChild(title);

        var authors = document.createElement('div');
        authors.classList.add('authors');
        authors.textContent = conference.authors;
        conferenceItem.appendChild(authors);

        var conferenceDetails = document.createElement('div');
        conferenceDetails.classList.add('conference-details');

        var conferenceName = document.createElement('p');
        conferenceName.textContent = 'Conference: ' + conference.conference.name;
        conferenceDetails.appendChild(conferenceName);

        var conferenceLocation = document.createElement('p');
        conferenceLocation.textContent = 'Location: ' + conference.conference.location;
        conferenceDetails.appendChild(conferenceLocation);

        var conferenceDate = document.createElement('p');
        conferenceDate.textContent = 'Date: ' + conference.conference.date;
        conferenceDetails.appendChild(conferenceDate);

        var presentationType = document.createElement('p');
        presentationType.textContent = 'Presentation: ' + conference.presentation;
        conferenceDetails.appendChild(presentationType);

        conferenceItem.appendChild(conferenceDetails);
        conferenceList.appendChild(conferenceItem);
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
