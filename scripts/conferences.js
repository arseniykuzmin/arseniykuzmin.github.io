// Store the conferences data
let conferencesData = [];
let sortedConferences = [];
let sortButton;

// Function to populate conferences from the stored data and sort by year
function renderConferences() {

    const conferenceList = document.getElementById('conference-list');
    conferenceList.innerHTML = '';

    //sortedConferences.forEach(conference => {
    for (var i = 0; i < sortedConferences.length; i++) {
        var conference = sortedConferences[i];
        var num = i + 1;
        const conferenceItem = document.createElement('div');
        conferenceItem.classList.add('conference-item');

        const title = document.createElement('h3');
        title.textContent = `${num}. ${conference.title}`;
        conferenceItem.appendChild(title);

        const authors = document.createElement('div');
        authors.classList.add('authors')
        authors.textContent = conference.authors;
        conferenceItem.appendChild(authors);

        const conferenceDetails = document.createElement('div');
        conferenceDetails.classList.add('conference-details');

        const conferenceName = document.createElement('p');
        conferenceName.textContent = `Conference: ${conference.conference.name}`;
        conferenceDetails.appendChild(conferenceName);

        const conferenceLocation = document.createElement('p');
        conferenceLocation.textContent = `Location: ${conference.conference.location}`;
        conferenceDetails.appendChild(conferenceLocation);

        const conferenceDate = document.createElement('p');
        conferenceDate.textContent = `Date: ${conference.conference.date}`;
        conferenceDetails.appendChild(conferenceDate);

        const presentationType = document.createElement('p');
        presentationType.textContent = `Presentation: ${conference.presentation}`;
        conferenceDetails.appendChild(presentationType);

        conferenceItem.appendChild(conferenceDetails);

        conferenceList.appendChild(conferenceItem);
    };

    var count = sortedConferences.length;
    document.getElementById('conferenceCount').textContent = count;
}

let sortAscending = true;

function sortConferences() {
    sortAscending = !sortAscending;
    sortButton.classList.toggle('active', sortAscending);
    // Sort the conferences data by year
    sortedConferences = conferencesData.slice().sort((a, b) => {
        if (sortAscending) {
            console.log('ascending')
            return parseInt(a.conference.year) - parseInt(b.conference.year);
        } else {
            console.log('descending')
            return parseInt(b.conference.year) - parseInt(a.conference.year);
        }
    });

    renderConferences();
}

function fetchConferencesData() {
    fetch('data/conferences.json')
        .then(response => response.json())
        .then(data => {
            conferencesData = data;
            sortButton = document.getElementById('sortButton');
            sortConferences();
            if (sortButton) {
                sortButton.addEventListener('click', sortConferences);
            } else {
                console.error("Button not found.");
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    sortButton = document.getElementById('sortButton');
    fetchConferencesData();
});