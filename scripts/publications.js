var originalPublications = []; // Store the original publications array separately
var sortedPublications = [];
var filteredPublications = []; // Store the filtered publications array

// Function to transform the author list
function transformAuthors(authors) {
    if (!authors) {
        return ''; // Return an empty string if authors is undefined or empty
    }

    if (authors.indexOf(' and ') === -1) {
        // Single author case
        var nameParts = authors.trim().split(', ');
        if (nameParts.length === 2) {
            var initials = nameParts[1].split(' ').map(function (initial) {
                return initial.charAt(0) + '.';
            }).join(' ');
            return initials + ' ' + nameParts[0];
        } else {
            var initials = nameParts.slice(0, -1).map(function (initial) {
                return initial.charAt(0) + '.';
            }).join(' ');
            return initials + ' ' + nameParts[nameParts.length - 1];
        }
    } else {
        var authorList = authors.split(' and ');
        var transformedAuthors = authorList.map(function (author) {
            var nameParts = author.trim().split(', ');
            if (nameParts.length === 2) {
                var initials = nameParts[1].split(' ').map(function (initial) {
                    return initial.charAt(0) + '.';
                }).join(' ');
                if (nameParts[0].toLowerCase().includes('kuzmin')) {
                    return `<b><u>${initials} ${nameParts[0]}</u></b>`;
                }
                return initials + ' ' + nameParts[0];
            } else {
                var initials = nameParts.slice(0, -1).map(function (initial) {
                    return initial.charAt(0) + '.';
                }).join(' ');
                if (nameParts[0].toLowerCase().includes('kuzmin')) {
                    return `<b><u>${initials} ${nameParts[nameParts.length - 1]}</u></b>`;
                }
                return `${initials} ${nameParts[nameParts.length - 1]}`;
            }
        });
        return transformedAuthors.join(', ');
    }
}

function renderPublications(publications) {
    var html = '';
    for (var i = 0; i < publications.length; i++) {
        var publication = publications[i];
        var num = i + 1;
        html += `
        <div class="citations-item">
          <div class="title"><p> [${num}] ${publication.title}</p></div>
          <div class="authors">${transformAuthors(publication.authors)}</div>
          <div class="journal">${publication.venue} ${publication.volume} (${publication.year}) ${publication.pages}
      `;
        if (publication.doi) {
            html += '<a class="citations-link" href="https://doi.org/' + publication.doi + '" target="_blank" rel="noopener noreferrer">' + publication.doi + '</a>';
        }
        html += '</div></div>';
    }
    document.getElementById('citations').innerHTML = html;

    var count = publications.length;
    document.getElementById('publicationCount').textContent = count;
}

function sortPublications(ascending) {
    sortedPublications = originalPublications.slice();
    if (filterFeatured) {
        sortedPublications = filteredPublications;
    }
    if (filterFirst) {
        sortedPublications = filteredPublications;
    }

    sortedPublications.sort(function (a, b) {
        return ascending ? a.year - b.year : b.year - a.year;
    });

    return sortedPublications;
}

function filterPublications() {
    filteredPublications = originalPublications.filter(function (publication) {
        return publication.aknotes.includes('featured');
    });
    renderPublications(sortPublications(sortAscending));
}

function filterPublicationsFirst() {
    filteredPublications = originalPublications.filter(function (publication) {
        var authors = publication.authors.split(' and ');
        return (
            (
                authors[0].toLowerCase().includes('kuzmin') ||
                publication.title.toLowerCase().includes('ro-vibrational population')
            ) &&
            !publication.title.toLowerCase().includes('corrigendum')
        );
    });
    renderPublications(sortPublications(sortAscending));
}

let sortAscending = false;
let filterFeatured = false;
let filterFirst = false;

const sortButton = document.getElementById('sortButton');
const filterButton = document.getElementById('filterButton');
const firstButton = document.getElementById('firstButton');

sortButton.addEventListener('click', function () {
    sortAscending = !sortAscending;
    sortedPublications = sortPublications(sortAscending);
    renderPublications(sortedPublications);
    sortButton.classList.toggle('asc', sortAscending);
    sortButton.classList.toggle('desc', !sortAscending);
    sortButton.classList.toggle('active');
});

filterButton.addEventListener('click', function () {
    filterFeatured = !filterFeatured;
    filterFirst = false;
    filterButton.classList.toggle('active');
    firstButton.classList.remove('active');
    filterPublications();
});

firstButton.addEventListener('click', function () {
    filterFirst = !filterFirst;
    filterFeatured = false;
    filterButton.classList.remove('active');
    firstButton.classList.toggle('active');
    filterPublicationsFirst();
});

// Load publications from JSON file
fetch('assets/data/publications.json')
    .then((response) => response.json())
    .then((data) => {
        originalPublications = data;
        sortedPublications = originalPublications.slice();
        sortPublications(sortAscending);
        renderPublications(sortedPublications);
    })
    .catch((error) => {
        console.error('Error loading publications JSON:', error);
    });
