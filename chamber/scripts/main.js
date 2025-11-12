// ============================
// CONSTANTS
// ============================
const lat = 5.5167; // Warri, Delta State latitude
const lon = 5.7500; // Warri, Delta State longitude
const API_KEY = '2a7c410ae5711bad39818da0723796d6';

// ============================
// THEME TOGGLE FUNCTIONALITY
// ============================
const themeToggle = document.getElementById('themeToggle');
const themeDropdown = document.getElementById('themeDropdown');

function createThemeDropdown() {
    if (!themeToggle) return;
    
    const dropdown = document.createElement('div');
    dropdown.id = 'themeDropdown';
    dropdown.className = 'theme-dropdown';
    dropdown.innerHTML = `
        <button class="theme-option" data-theme="light">
            <span class="theme-icon">☀</span> Light
        </button>
        <button class="theme-option" data-theme="dark">
            <span class="theme-icon">🌙</span> Dark
        </button>
        <button class="theme-option" data-theme="auto">
            <span class="theme-icon">🌓</span> Auto
        </button>
    `;
    
    themeToggle.parentNode.insertBefore(dropdown, themeToggle.nextSibling);
    return dropdown;
}

function applyTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
            updateThemeIcon('🌙');
        } else {
            document.body.classList.remove('dark-mode');
            updateThemeIcon('☀');
        }
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon('🌙');
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon('☀');
    }
}

function updateThemeIcon(icon) {
    if (themeToggle) {
        themeToggle.textContent = icon;
    }
}

const savedTheme = localStorage.getItem('theme') || 'auto';
applyTheme(savedTheme);

if (themeToggle) {
    const dropdown = createThemeDropdown();
    
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    dropdown.addEventListener('click', (e) => {
        const button = e.target.closest('.theme-option');
        if (!button) return;
        
        const selectedTheme = button.dataset.theme;
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
        dropdown.classList.remove('show');
        
        dropdown.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('active');
        });
        button.classList.add('active');
    });
    
    const activeOption = dropdown.querySelector(`[data-theme="${savedTheme}"]`);
    if (activeOption) activeOption.classList.add('active');
    
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== themeToggle) {
            dropdown.classList.remove('show');
        }
    });
}

if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            applyTheme('auto');
        }
    });
}

// ============================
// MOBILE MENU TOGGLE
// ============================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ============================
// DIRECTORY VIEW TOGGLE
// ============================
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const memberDirectory = document.getElementById('memberDirectory');

if (gridBtn && listBtn && memberDirectory) {
    gridBtn.addEventListener('click', () => {
        memberDirectory.className = 'member-grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
        memberDirectory.className = 'member-list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

// ============================
// DIRECTORY - LOAD MEMBERS
// ============================
async function loadMembers() {
    if (!memberDirectory) return;
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error loading members:', error);
        memberDirectory.innerHTML = '<p>Error loading member directory. Please try again later.</p>';
    }
}

function displayMembers(members) {
    if (!memberDirectory) return;
    memberDirectory.innerHTML = '';

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        const badgeClass =
            member.membershipLevel === 4 ? 'badge-diamond' :
            member.membershipLevel === 3 ? 'badge-gold' :
            member.membershipLevel === 2 ? 'badge-silver' :
            member.membershipLevel === 1 ? 'badge-bronze' :
            'badge-member';

        const badgeText =
            member.membershipLevel === 4 ? '💎 Diamond Member' :
            member.membershipLevel === 3 ? '🥇 Gold Member' :
            member.membershipLevel === 2 ? '🥈 Silver Member' :
            member.membershipLevel === 1 ? '🥉 Bronze Member' :
            'Member';

        memberCard.innerHTML = `
            <img src="${member.image || ''}" alt="${escapeHtml(member.name)}" class="member-image" loading="lazy">
            <div class="member-info">
                <h3>${escapeHtml(member.name)}</h3>
                <p class="member-tagline">${escapeHtml(member.tagline || '')}</p>
                <div class="member-details">
                    ${member.address ? `<p>📍 ${escapeHtml(member.address)}</p>` : ''}
                    ${member.phone ? `<p>📞 <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                    ${member.website ? `<p>🌐 <a href="${member.website}" target="_blank" rel="noopener">${escapeHtml(member.website)}</a></p>` : ''}
                    ${member.email ? `<p>✉ <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                </div>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
            </div>
        `;

        memberDirectory.appendChild(memberCard);
    });
}

// ============================
// HOME PAGE - WEATHER API
// ============================
async function fetchCurrentWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Weather data not available');
        
        const data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        const weatherIcon = document.getElementById('weatherIcon');
        const currentTemp = document.getElementById('currentTemp');
        const weatherDescription = document.getElementById('weatherDescription');
        
        if (weatherIcon) weatherIcon.alt = 'Weather unavailable';
        if (currentTemp) currentTemp.textContent = 'N/A';
        if (weatherDescription) weatherDescription.textContent = 'Unable to load weather data';
    }
}

function displayCurrentWeather(data) {
    const weatherIcon = document.getElementById('weatherIcon');
    const currentTemp = document.getElementById('currentTemp');
    const weatherDescription = document.getElementById('weatherDescription');
    const highTemp = document.getElementById('highTemp');
    const lowTemp = document.getElementById('lowTemp');
    const humidity = document.getElementById('humidity');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');

    if (weatherIcon) {
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
    }

    if (currentTemp) currentTemp.textContent = `${Math.round(data.main.temp)}°F`;
    if (weatherDescription) weatherDescription.textContent = data.weather[0].description;
    if (highTemp) highTemp.textContent = `${Math.round(data.main.temp_max)}°F`;
    if (lowTemp) lowTemp.textContent = `${Math.round(data.main.temp_min)}°F`;
    if (humidity) humidity.textContent = `${data.main.humidity}%`;

    if (sunrise) {
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    if (sunset) {
        const sunsetTime = new Date(data.sys.sunset * 1000);
        sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
}

// ============================
// HOME PAGE - WEATHER FORECAST
// ============================
async function fetchWeatherForecast() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Forecast data not available');
        
        const data = await response.json();
        displayWeatherForecast(data);
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        const forecastList = document.getElementById('forecastList');
        if (forecastList) {
            forecastList.innerHTML = '<p>Unable to load forecast data</p>';
        }
    }
}

function displayWeatherForecast(data) {
    const forecastList = document.getElementById('forecastList');
    if (!forecastList) return;

    // Get forecasts for the next 3 days (at noon)
    const dailyForecasts = [];
    const processedDates = new Set();

    for (let item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString();
        const hour = date.getHours();

        // Get one forecast per day around midday (12pm)
        if (hour >= 11 && hour <= 13 && !processedDates.has(dateString) && dailyForecasts.length < 3) {
            dailyForecasts.push({
                day: date.toLocaleDateString('en-US', { weekday: 'long' }),
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                description: item.weather[0].description
            });
            processedDates.add(dateString);
        }
    }

    forecastList.innerHTML = dailyForecasts.map(forecast => `
        <div class="forecast-item">
            <span class="forecast-day-name">${forecast.day}</span>
            <span class="forecast-temp">${forecast.temp}°F</span>
        </div>
    `).join('');
}

// ============================
// HOME PAGE - MEMBER SPOTLIGHTS
// ============================
async function loadSpotlights() {
    const spotlightsGrid = document.getElementById('spotlightsGrid');
    if (!spotlightsGrid) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const members = await response.json();
        displaySpotlights(members, spotlightsGrid);
    } catch (error) {
        console.error('Error loading spotlights:', error);
        spotlightsGrid.innerHTML = '<p>Error loading member spotlights. Please try again later.</p>';
    }
}

function displaySpotlights(members, container) {
    // Filter for Gold (3) and Silver (2) members only
    const qualifiedMembers = members.filter(member => 
        member.membershipLevel === 3 || member.membershipLevel === 2
    );

    // Randomly select 2 or 3 members per assignment requirements
    const numSpotlights = Math.random() > 0.5 ? 3 : 2;
    const selectedMembers = getRandomMembers(qualifiedMembers, numSpotlights);

    container.innerHTML = selectedMembers.map(member => {
        const badgeClass = member.membershipLevel === 3 ? 'badge-gold' : 'badge-silver';
        const badgeText = member.membershipLevel === 3 ? '🥇 Gold Member' : '🥈 Silver Member';

        return `
            <div class="spotlight-card">
                <div class="spotlight-header">
                    <h3>${escapeHtml(member.name)}</h3>
                    <p class="spotlight-tagline">${escapeHtml(member.tagline || '')}</p>
                </div>
                <div class="spotlight-content">
                    <img src="${member.image}" alt="${escapeHtml(member.name)}" class="spotlight-image" loading="lazy">
                    <div class="spotlight-details">
                        ${member.email ? `<p>EMAIL: <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                        ${member.phone ? `<p>PHONE: <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                        ${member.website ? `<p>URL: <a href="${member.website}" target="_blank" rel="noopener">${escapeHtml(member.website)}</a></p>` : ''}
                        <span class="membership-badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getRandomMembers(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ============================
// UTILITY FUNCTIONS
// ============================
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function updateFooter() {
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    const lastModifiedEl = document.getElementById('lastModified');
    if (lastModifiedEl) {
        const lastModified = new Date(document.lastModified);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        lastModifiedEl.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// ============================
// INITIALIZE ON PAGE LOAD
// ============================
document.addEventListener('DOMContentLoaded', () => {
    // Update footer on all pages
    updateFooter();

    // Load directory members if on directory page
    if (memberDirectory) {
        loadMembers();
    }

    // Load weather and spotlights if on home page
    if (document.getElementById('currentTemp')) {
        fetchCurrentWeather();
        fetchWeatherForecast();
        loadSpotlights();
    }

    // Lazy loading images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.setAttribute('data-loaded', 'true');
        });
    });
});