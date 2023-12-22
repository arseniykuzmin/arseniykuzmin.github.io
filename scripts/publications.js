var originalPublications = []; // Store the original publications array separately
var sortedPublications = [];
var filteredPublications = []; // Store the filtered publications array

// Function to parse BibTeX data
function parseBibTeX(data) {
    var entries = data.split('@');
    var publications = [];
    for (var i = 1; i < entries.length; i++) {
        var entry = entries[i].trim();
        var typeEnd = entry.indexOf('{');
        var type = entry.substring(0, typeEnd);
        var fields = entry.substring(typeEnd + 1);

        var publication = {
            type: type,
            authors: getFieldValue(fields, 'author'),
            title: getFieldValue(fields, 'title'),
            venue: getFieldValue(fields, 'journal'),
            year: getFieldValue(fields, ['year', 'date']), // Use 'year' or 'date' field
            note: getFieldValue(fields, 'note'),
            issn: getFieldValue(fields, 'issn'),
            doi: getFieldValue(fields, 'doi'),
            url: getFieldValue(fields, 'url'),
            volume: getFieldValue(fields, 'volume'),
            pages: getFieldValue(fields, 'pages'),
            abstract: getFieldValue(fields, 'abstract'),
            language: getFieldValue(fields, 'language'),
            aknotes: getFieldValue(fields, 'aknotes'),
            keywords: getFieldValue(fields, 'keywords'),
        };
        //console.log(entry)
        //console.log(publication)
        publications.push(publication);
    }
    return publications;
}


// Function to extract a field value from BibTeX fields
function getFieldValue(fields, fieldNames) {
    if (!Array.isArray(fieldNames)) {
        fieldNames = [fieldNames];
    }

    for (var i = 0; i < fieldNames.length; i++) {
        var fieldName = fieldNames[i];
        var fieldRegex = new RegExp(fieldName + '\\s*=\\s*(?:\\{((?:[^{}]|\\{[^{}]*\\})*)\\}|"([^"]*)"),', 'g');
        var match = fieldRegex.exec(fields);
        if (match && (match[1] || match[2])) {
            var fieldValue = match[1] || match[2];
            fieldValue = fieldValue.replace(/\\([{}])/g, '$1'); // Remove escape characters before curly brackets            
            fieldValue = fieldValue.replace(/[\{\}]/g, ''); // Remove curly brackets
            return fieldValue.trim();
        }
    }

    return '';
}


// Function to transform the author list
function transformAuthors(authors) {
    if (!authors) {
        return ''; // Return an empty string if authors is undefined or empty
    }

    if (authors.indexOf(' and ') === -1) {
        // Single author case
        var nameParts = authors.trim().split(', ');
        if (nameParts.length === 2) {
            // Last Name, First Initials format
            var initials = nameParts[1].split(' ').map(function (initial) {
                return initial.charAt(0) + '.';
            }).join(' ');
            return initials + ' ' + nameParts[0];

        } else {
            // First Initials Last Name format
            var initials = nameParts.slice(0, -1).map(function (initial) {
                return initial.charAt(0) + '.';
            }).join(' ');
            return initials + ' ' + nameParts[nameParts.length - 1];
        }
    } else {
        // Multiple authors case
        var authorList = authors.split(' and ');
        var transformedAuthors = authorList.map(function (author) {
            var nameParts = author.trim().split(', ');
            if (nameParts.length === 2) {
                // Last Name, First Initials format
                var initials = nameParts[1].split(' ').map(function (initial) {
                    return initial.charAt(0) + '.';
                }).join(' ');
                if (nameParts[0].toLowerCase().includes('kuzmin')) {
                    return `<b><u>${initials} ${nameParts[0]}</u></b>`;
                }
                return initials + ' ' + nameParts[0];
            } else {
                // First Initials Last Name format
                var initials = nameParts.slice(0, -1).map(function (initial) {
                    return initial.charAt(0) + '.';
                }).join(' ');
                if (nameParts[0].toLowerCase().includes('kuzmin')) {
                    return `<b><u>${initials} ${nameParts[nameParts.length - 1]}</b></u>`;
                }
                return `${initials} ${nameParts[nameParts.length - 1]}`;
            }
        });
        return transformedAuthors.join(', ');
    }
}


function renderPublications(publications) {
    // Generate HTML for publication list
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
            html += '<a class="citations-link" href="https://doi.org/' + publication.doi + '">' + publication.doi + '</a>';
        }
        html += '</div></div>';
    }
    document.getElementById('citations').innerHTML = html;

    var count = publications.length;
    document.getElementById('publicationCount').textContent = count;

}
function sortPublications(ascending) {
    sortedPublications = originalPublications.slice(); // Create a copy of the original publications array
    if (filterFeatured) {
        sortedPublications = filteredPublications;
    }
    if (filterFirst) {
        sortedPublications = filteredPublications;
    }

    sortedPublications.sort(function (a, b) {
        if (ascending) {
            return a.year - b.year;
        } else {
            return b.year - a.year;
        }
    });

    return sortedPublications;
}

// get featured publications
function filterPublicationsbackup() {
    filteredPublications = originalPublications.filter(function (publication) {
        var authors = publication.authors.split(' and '); // Split authors by 'and' to handle multiple authors
        return (
            (
                authors[0].toLowerCase().includes('kuzmin') ||
                authors[1].toLowerCase().includes('kuzmin') ||
                publication.authors.toLowerCase().includes('begrambekov') ||
                publication.authors.toLowerCase().includes('matsuyama')
            ) &&
            !publication.title.toLowerCase().includes('corrigendum')
        );
    });

    renderPublications(sortPublications(sortAscending));
}

function filterPublications() {
    filteredPublications = originalPublications.filter(function (publication) {
        return (
            publication.aknotes.includes('featured')

        );
    });

    renderPublications(sortPublications(sortAscending));
}


// get first autor publications
function filterPublicationsFirst() {
    filteredPublications = originalPublications.filter(function (publication) {
        var authors = publication.authors.split(' and '); // Split authors by 'and' to handle multiple authors
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

let sortAscending = false; // Flag to keep track of the sorting order
let filterFeatured = false; // Flag to keep track of the filtering
let filterFirst = false; // Flag to keep track of the filtering

const sortButton = document.getElementById('sortButton');
const filterButton = document.getElementById('filterButton');
const firstButton = document.getElementById('firstButton');

document.getElementById('sortButton').addEventListener('click', function () {
    sortAscending = !sortAscending; // Toggle the sorting order
    sortedPublications = sortPublications(sortAscending);
    renderPublications(sortedPublications);
    sortButton.classList.toggle('asc', sortAscending);
    sortButton.classList.toggle('desc', !sortAscending);
    sortButton.classList.toggle('active');
    console.log('sorting ascending:', sortAscending);
});

document.getElementById('filterButton').addEventListener('click', function () {
    filterFeatured = !filterFeatured; // Toggle filter
    filterFirst = false;
    filterButton.classList.toggle('active');
    firstButton.classList.remove('active');
    filterPublications();
});

document.getElementById('firstButton').addEventListener('click', function () {
    filterFirst = !filterFirst;
    filterFeatured = false;
    filterButton.classList.remove('active');
    firstButton.classList.toggle('active');
    filterPublicationsFirst();
});


fetch('mypapers.bib')
    .then((response) => response.text())
    .then((data) => {
        originalPublications = parseBibTeX(data); // Store the original publications array
        sortedPublications = originalPublications.slice(); // Create a copy for initial rendering
        sortPublications(sortAscending);
        renderPublications(sortedPublications);
    })
    .catch((error) => {
        console.error('Error fetching BibTeX data:', error);
    });
