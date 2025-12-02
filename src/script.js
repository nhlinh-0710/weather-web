// Backend API endpoint
// Tự động detect backend URL (hỗ trợ cả Live Server và backend server)
const getApiUrl = () => {
    // Nếu đang chạy trên Live Server (port 5500), gọi backend trên port 3000
    if (window.location.port === '5500' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api/weather';
    }
    // Nếu chạy qua backend server, dùng relative path
    return '/api/weather';
};
const API_URL = getApiUrl();

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherContainer = document.querySelector('.weather-container');
const messageContainer = document.getElementById('message-container');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const cityName = document.getElementById('city-name');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const messageImage = document.getElementById('message-image');
const messageText = document.getElementById('message-text');

// Weather icon mapping
const weatherIcons = {
    'Thunderstorm': '/assets/weather/thunderstorm.svg',
    'Drizzle': '/assets/weather/drizzle.svg',
    'Rain': '/assets/weather/rain.svg',
    'Snow': '/assets/weather/snow.svg',
    'Mist': '/assets/weather/atmosphere.svg',
    'Smoke': '/assets/weather/atmosphere.svg',
    'Haze': '/assets/weather/atmosphere.svg',
    'Dust': '/assets/weather/atmosphere.svg',
    'Fog': '/assets/weather/atmosphere.svg',
    'Sand': '/assets/weather/atmosphere.svg',
    'Ash': '/assets/weather/atmosphere.svg',
    'Squall': '/assets/weather/atmosphere.svg',
    'Tornado': '/assets/weather/atmosphere.svg',
    'Clear': '/assets/weather/clear.svg',
    'Clouds': '/assets/weather/clouds.svg'
};

// Initialize app
function init() {
    // Add event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Show initial message
    showMessage('/assets/message/search-city.png', 'Search for a city to get weather information');
}

// Handle search
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showMessage('/assets/message/search-city.png', 'Please enter a city name');
        return;
    }
    
    try {
        showLoading();
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        const errorMessage = error.message || 'City not found. Please try another city.';
        showMessage('/assets/message/not-found.png', errorMessage);
    }
}

// Fetch weather data from backend API
async function fetchWeatherData(city) {
    const url = `${API_URL}?city=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
            throw new Error(errorData.error || 'City not found');
        } else if (response.status === 401) {
            throw new Error(errorData.error || 'Invalid API key. Please configure OPENWEATHER_API_KEY environment variable.');
        } else if (response.status === 500) {
            throw new Error(errorData.error || 'Server error. Please check API key configuration.');
        } else {
            throw new Error(errorData.error || 'Failed to fetch weather data');
        }
    }
    
    return await response.json();
}

// Display weather data
function displayWeather(data) {
    const weatherMain = data.weather[0].main;
    const iconPath = weatherIcons[weatherMain] || '/assets/weather/clear.svg';
    
    // Update weather icon
    weatherIcon.src = iconPath;
    weatherIcon.alt = weatherMain;
    
    // Update temperature
    temperature.textContent = Math.round(data.main.temp);
    
    // Update description
    description.textContent = data.weather[0].description;
    
    // Update city name
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Update humidity
    humidity.textContent = `${data.main.humidity}%`;
    
    // Update wind speed
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    
    // Show weather container, hide message
    weatherContainer.style.display = 'flex';
    messageContainer.style.display = 'none';
}

// Show message
function showMessage(imagePath, text) {
    messageImage.src = imagePath;
    messageText.textContent = text;
    messageContainer.style.display = 'flex';
    weatherContainer.style.display = 'none';
}

// Show loading state
function showLoading() {
    messageImage.src = '/assets/message/search-city.png';
    messageText.textContent = 'Loading...';
    messageContainer.style.display = 'flex';
    weatherContainer.style.display = 'none';
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

