// Function to fetch and populate data
async function fetchData() {
    try {
        const response = await fetch('data/projects.json'); // Replace with the path to your JSON file
        const data = await response.json();

        const gridContainer = document.getElementById('gridContainer');

        // Create grid items and popups based on the data
        data.forEach(item => {
            // Create grid item
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.style.backgroundImage = `url(${item.imageUrl})`;
            gridItem.innerHTML = `<h2>${item.title}</h2>`;
            gridItem.onclick = () => openPopup(item.id);
            gridContainer.appendChild(gridItem);

            // Create popup container
            const popupContainer = document.createElement('div');
            popupContainer.className = 'popup-container';
            popupContainer.id = `popup${item.id}`;
            popupContainer.style.display = 'none';

            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'popup-content';
            popupContent.innerHTML = `
    <span class="close-button" onclick="closePopup(${item.id})">X</span>
    <h2>${item.title}</h2>
    <img src="${item.imageUrl}" alt="${item.title}">
    ${item.content}
        `;
            popupContainer.appendChild(popupContent);

            // Add popup container to the body
            document.body.appendChild(popupContainer);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to open a popup
function openPopup(popupId) {
    const popup = document.getElementById(`popup${popupId}`);
    popup.style.display = 'flex';

    // Add an event listener to close the popup when clicking on the background
    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            closePopup(popupId);
        }
    });
}

// Function to close a popup
function closePopup(popupId) {
    const popup = document.getElementById(`popup${popupId}`);
    popup.style.display = 'none';
}

// Call the fetchData function to populate the grid and popups
fetchData();
