// Constant for the JSON data source URL
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Select the div where the cards will be displayed
const cards = document.querySelector('#cards');

// ASYNC Function: Fetch data from the external JSON file
async function getProphetData() {
    try {
        // 1. Fetch the resource and await the response
        const response = await fetch(url);
        
        // 2. Parse the response into a JSON object and await the data
        const data = await response.json(); 

        // Call the display function, sending ONLY the array of prophets
        displayProphets(data.prophets);
        
    } catch (error) {
        // Log any errors that occur during fetch or parsing
        console.error("Error fetching or processing data:", error);
    }
}

// ARROW Function Expression: Process the array and build the HTML cards
const displayProphets = (prophets) => {
    // Loop through each prophet object in the array
    prophets.forEach((prophet) => {
        // --- 1. Create the card structure elements ---
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let birthDate = document.createElement('p'); 
        let birthPlace = document.createElement('p'); 
        let portrait = document.createElement('img');

        // --- 2. Populate the text elements ---
        // Use a template string to combine name and lastname for the heading
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        // Add the Date of Birth (DOB) and Place of Birth (POB)
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        // --- 3. Set image attributes ---
        portrait.setAttribute('src', prophet.imageurl);
        
        // Set the alt attribute for good accessibility
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname})`);
        
        portrait.setAttribute('loading', 'lazy'); 
        portrait.setAttribute('width', '340'); 
        portrait.setAttribute('height', '440'); 

        // --- 4. Append elements to the section 'card' ---
        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait);

        // --- 5. Append the final card to the main 'cards' container ---
        cards.appendChild(card);
    });
}

// Call the main function to initiate the data process
getProphetData();