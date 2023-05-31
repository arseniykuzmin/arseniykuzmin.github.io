// Fetch and parse the JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Access the data and update the HTML elements
        document.getElementById('name').textContent = data.name;
        document.getElementById('title').textContent = data.title;
        document.getElementById('location').textContent = `${data.position}, ${data.location}`;

        // Education
        const educationList = document.getElementById('education');
        data.education.forEach(education => {
            const divItem = document.createElement('div');
            divItem.classList.add('education-item');

            const degreeDiv = document.createElement('div');
            degreeDiv.classList.add('education-item-degree');
            degreeDiv.textContent = education.degree;
            divItem.appendChild(degreeDiv);

            const universityLink = document.createElement('a');
            universityLink.href = education.url;
            universityLink.textContent = education.university;
            divItem.appendChild(universityLink);

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('education-item-graduation');
            dateDiv.textContent = `${education.entrance} - ${education.graduation}`;
            divItem.appendChild(dateDiv);

            const locationDiv = document.createElement('div');
            locationDiv.classList.add('education-item-location');
            locationDiv.textContent = education.location;
            divItem.appendChild(locationDiv);

            educationList.appendChild(divItem);
        });


        // Experience
        const experienceList = document.getElementById('experience');
        data.experience.forEach(experience => {
            const divItem = document.createElement('div');
            divItem.classList.add('experience-item');
            divItem.innerHTML = `
            <h4>${experience.title}</h4>
            <p>${experience.employer} (${experience.location})</p>
            <p>${experience.startDate} - ${experience.endDate}</p>
            <p>${experience.description}</p>
          `;
            experienceList.appendChild(divItem);
        });

        // Skills
        const skillsList = document.getElementById('skills');
        data.skills.forEach(skill => {
            const listItem = document.createElement('li');
            listItem.textContent = skill;
            skillsList.appendChild(listItem);
        });

        // Interests
        const interestsList = document.getElementById('interests');
        data.interests.forEach(interest => {
            const listItem = document.createElement('li');
            listItem.textContent = interest;
            interestsList.appendChild(listItem);
        });
    });