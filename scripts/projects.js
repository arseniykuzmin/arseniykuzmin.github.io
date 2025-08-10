// Function to fetch and populate data
async function fetchData() {
    try {
        const [data, sizes] = await Promise.all([
            fetch('data/projects.json').then(r => r.json()),
            fetch('data/image-sizes.json').then(r => r.json())
        ]);

        const sizeAttr = src => {
            const info = sizes[src.replace(/^\//, '')];
            return info ? ` width="${info.width}" height="${info.height}"` : '';
        };

        const gridContainer = document.getElementById('gridContainer');

        // Create link cards based on the data
        data.forEach(({ id, title, summary, imageUrl }) => {
            const card = document.createElement('a');
            card.className = 'grid-item';
            card.href = `project.html?id=${id}`;
            card.innerHTML = `
                <img src="${imageUrl}" alt="${title}" loading="lazy" decoding="async"${sizeAttr(imageUrl)}>
                <h2>${title}</h2>
                <p>${summary}</p>
            `;
            gridContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the fetchData function to populate the grid
fetchData();
