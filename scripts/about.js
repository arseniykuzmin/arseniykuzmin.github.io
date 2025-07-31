// Fetch and parse the JSON data
fetch('data/about.json')
    .then(response => response.json())
    .then(data => {
        // Access the data and update the HTML elements
        // document.getElementById('name').textContent = data.name;
        document.getElementById('title').textContent = data.title;
        document.getElementById('location').textContent = `${data.position}, ${data.location}`;
        document.getElementById('profile').textContent = `${data.profile}`;

        // MARK: Education
        const educationList = document.getElementById('education');
        data.education.forEach(education => {
            const divItem = document.createElement('div');
            divItem.classList.add('education-item');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('education-item-title');
            titleDiv.textContent = education.title;
            divItem.appendChild(titleDiv);

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


        // MARK: Experience
        const experienceList = document.getElementById('experience');
        data.experience.forEach(experience => {
            const experienceItem = document.createElement('div');
            experienceItem.classList.add('experience-item');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('experience-title');
            titleDiv.innerHTML = `<h2>${experience.title}</h2>`;
            experienceItem.appendChild(titleDiv);

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('experience-details');
            detailsDiv.innerHTML = `
                <p>${experience.employer} (${experience.location})</p>
                <p>${experience.startDate} - ${experience.endDate}</p>              
            `;
            experienceItem.appendChild(detailsDiv);


            const expArrow = document.createElement('span');
            //expArrow.classList.add('plus-symbol');
            expArrow.classList.add('skills-arrow');
            expArrow.textContent = 'show more';
            experienceItem.appendChild(expArrow);

            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('experience-description', 'collapsed'); // Add the 'collapsed' class initially
            descriptionDiv.innerHTML = `      
                <p>${experience.description}</p>
            `;
            experienceItem.appendChild(descriptionDiv);
            expArrow.addEventListener('click', () => {
                descriptionDiv.classList.toggle('collapsed');
                experienceItem.classList.toggle('expanded');
                expArrow.textContent = expArrow.innerText == 'show more' ? '. . . . . . hide ' : 'show more';

            });

            experienceList.appendChild(experienceItem);
        });

        // MARK: Skills
        const skillsList = document.getElementById('skills');

        function createSkillsItem(title, skills) {
            const skillsItem = document.createElement('div');
            skillsItem.classList.add('skills-item');

            const skillsTitle = document.createElement('div');
            skillsTitle.classList.add('skills-title');
            skillsTitle.textContent = title;
            skillsItem.appendChild(skillsTitle);

            const skillsDescription = document.createElement('div');
            skillsDescription.classList.add('skills-description');
            skills.forEach(skill => {
                const skillItem = document.createElement('p');
                skillItem.innerHTML = skill;
                skillsDescription.appendChild(skillItem);
            });
            skillsItem.appendChild(skillsDescription);

            return skillsItem;
        }

        function populateSkills() {

            data.skills.forEach(skill => {
                const skillsItem = createSkillsItem(skill.title, skill.skills);
                skillsList.appendChild(skillsItem);
            });
        }
        populateSkills();

    });