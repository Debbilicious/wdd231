// weather.js

// 1. HTML Element Selectors
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// 2. API Credentials and Location
// Trier, Germany Coordinates (Rounded to 2 decimals)
const lat = 49.75; 
const lon = 6.64; 
const apiKey = "2a7c410ae5711bad39818da0723796d6"; // Your confirmed API Key
const units = "metric"; // Use 'imperial' for Fahrenheit or 'metric' for Celsius

// Construct the URL using the required parameters
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;


// 3. Define asynchronous apiFetch() function with error handling
async function apiFetch() {
    try {
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API Data Received:', data); // Required: Output to console for testing
            displayResults(data); 
            
        } else {
            // Required: Throw an error if response is not OK
            throw Error(`API Fetch Failed: ${response.status} - ${await response.text()}`);
        }
    } catch (error) {
        console.error('Fetch Error:', error); // Required: Output any error
        currentTemp.textContent = 'Data Unavailable'; // Display an error on the page
    }
}

// 4. Define displayResults() function
function displayResults(data) {
    // Current Temperature (temp)
    currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;C`;

    // Weather Description and Icon
    const weatherEvent = data.weather[0]; // Focus on the first weather event
    
    // Icon Source URL (using /wn/ for higher resolution)
    const iconCode = weatherEvent.icon;
    const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Capitalize the description (e.g., 'broken clouds' -> 'Broken Clouds')
    const description = weatherEvent.description;
    const capitalizedDesc = description.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Update HTML elements
    weatherIcon.setAttribute('src', iconSrc);
    weatherIcon.setAttribute('alt', capitalizedDesc + ' icon');
    captionDesc.textContent = capitalizedDesc;
}

// 5. Invoke the function
apiFetch();