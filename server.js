const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// API Configuration - Có thể chọn provider
const API_PROVIDER = process.env.API_PROVIDER || 'openmeteo'; // 'openmeteo', 'openweather', 'weatherapi'
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY || '';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Helper function to get coordinates from city name
// Sử dụng Open-Meteo Geocoding API (miễn phí, không cần key) hoặc OpenWeatherMap
async function getCoordinates(city) {
    // Thử Open-Meteo Geocoding API trước (miễn phí, không cần key)
    try {
        const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const openMeteoResponse = await fetch(openMeteoUrl);
        
        if (openMeteoResponse.ok) {
            const openMeteoData = await openMeteoResponse.json();
            if (openMeteoData.results && openMeteoData.results.length > 0) {
                const result = openMeteoData.results[0];
                return {
                    lat: result.latitude,
                    lon: result.longitude,
                    name: result.name,
                    country: result.country_code || result.country || ''
                };
            }
        }
    } catch (error) {
        console.error('Error getting coordinates from Open-Meteo:', error);
    }

    // Fallback: Thử OpenWeatherMap Geocoding nếu có API key
    if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'YOUR_API_KEY_HERE') {
        try {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
                }
            }
        } catch (error) {
            console.error('Error getting coordinates from OpenWeatherMap:', error);
        }
    }
    
    return null;
}

// Open-Meteo API (HOÀN TOÀN MIỄN PHÍ - KHÔNG CẦN API KEY)
async function fetchOpenMeteo(city) {
    const coords = await getCoordinates(city);
    if (!coords) {
        throw new Error('City not found');
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    const current = data.current;

    // Map weather code to OpenWeatherMap format
    const weatherCodeMap = {
        0: { main: 'Clear', description: 'clear sky' },
        1: { main: 'Clouds', description: 'mainly clear' },
        2: { main: 'Clouds', description: 'partly cloudy' },
        3: { main: 'Clouds', description: 'overcast' },
        45: { main: 'Mist', description: 'fog' },
        48: { main: 'Mist', description: 'depositing rime fog' },
        51: { main: 'Drizzle', description: 'light drizzle' },
        53: { main: 'Drizzle', description: 'moderate drizzle' },
        55: { main: 'Drizzle', description: 'dense drizzle' },
        56: { main: 'Drizzle', description: 'light freezing drizzle' },
        57: { main: 'Drizzle', description: 'dense freezing drizzle' },
        61: { main: 'Rain', description: 'slight rain' },
        63: { main: 'Rain', description: 'moderate rain' },
        65: { main: 'Rain', description: 'heavy rain' },
        66: { main: 'Rain', description: 'light freezing rain' },
        67: { main: 'Rain', description: 'heavy freezing rain' },
        71: { main: 'Snow', description: 'slight snow fall' },
        73: { main: 'Snow', description: 'moderate snow fall' },
        75: { main: 'Snow', description: 'heavy snow fall' },
        77: { main: 'Snow', description: 'snow grains' },
        80: { main: 'Rain', description: 'slight rain showers' },
        81: { main: 'Rain', description: 'moderate rain showers' },
        82: { main: 'Rain', description: 'violent rain showers' },
        85: { main: 'Snow', description: 'slight snow showers' },
        86: { main: 'Snow', description: 'heavy snow showers' },
        95: { main: 'Thunderstorm', description: 'thunderstorm' },
        96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail' },
        99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail' }
    };

    const weather = weatherCodeMap[current.weather_code] || { main: 'Clear', description: 'clear sky' };

    return {
        weather: [{
            main: weather.main,
            description: weather.description
        }],
        main: {
            temp: current.temperature_2m,
            humidity: current.relative_humidity_2m
        },
        wind: {
            speed: current.wind_speed_10m / 3.6 // Convert from km/h to m/s
        },
        name: coords.name,
        sys: {
            country: coords.country
        }
    };
}

// OpenWeatherMap API
async function fetchOpenWeather(city) {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('OpenWeatherMap API key is not configured');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found');
        } else if (response.status === 401) {
            throw new Error('Invalid API key');
        } else {
            throw new Error('Failed to fetch weather data');
        }
    }

    return await response.json();
}

// WeatherAPI.com
async function fetchWeatherAPI(city) {
    if (!WEATHERAPI_KEY || WEATHERAPI_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('WeatherAPI key is not configured');
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('City not found');
        } else if (response.status === 401) {
            throw new Error('Invalid API key');
        } else {
            throw new Error('Failed to fetch weather data');
        }
    }

    const data = await response.json();
    
    // Convert WeatherAPI format to OpenWeatherMap format
    return {
        weather: [{
            main: data.current.condition.text.includes('rain') ? 'Rain' : 
                  data.current.condition.text.includes('cloud') ? 'Clouds' :
                  data.current.condition.text.includes('clear') || data.current.condition.text.includes('sunny') ? 'Clear' :
                  data.current.condition.text.includes('snow') ? 'Snow' :
                  data.current.condition.text.includes('thunder') ? 'Thunderstorm' : 'Clear',
            description: data.current.condition.text.toLowerCase()
        }],
        main: {
            temp: data.current.temp_c,
            humidity: data.current.humidity
        },
        wind: {
            speed: data.current.wind_kph / 3.6 // Convert from km/h to m/s
        },
        name: data.location.name,
        sys: {
            country: data.location.country
        }
    };
}

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ 
            error: 'City parameter is required' 
        });
    }

    try {
        let weatherData;
        
        switch (API_PROVIDER.toLowerCase()) {
            case 'openmeteo':
                weatherData = await fetchOpenMeteo(city);
                break;
            case 'openweather':
                weatherData = await fetchOpenWeather(city);
                break;
            case 'weatherapi':
                weatherData = await fetchWeatherAPI(city);
                break;
            default:
                // Try Open-Meteo first (no API key needed), fallback to others
                try {
                    weatherData = await fetchOpenMeteo(city);
                } catch (error) {
                    if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'YOUR_API_KEY_HERE') {
                        weatherData = await fetchOpenWeather(city);
                    } else {
                        throw error;
                    }
                }
        }

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        let statusCode = 500;
        if (error.message.includes('not found')) {
            statusCode = 404;
        } else if (error.message.includes('API key') || error.message.includes('Invalid')) {
            statusCode = 401;
        }

        res.status(statusCode).json({ 
            error: error.message || 'Failed to fetch weather data' 
        });
    }
});

// Get available API providers
app.get('/api/providers', (req, res) => {
    res.json({
        current: API_PROVIDER,
        available: [
            {
                name: 'openmeteo',
                description: 'Open-Meteo (Hoàn toàn miễn phí - KHÔNG CẦN API KEY)',
                requiresKey: false
            },
            {
                name: 'openweather',
                description: 'OpenWeatherMap (Miễn phí - Cần API key)',
                requiresKey: true,
                configured: OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'YOUR_API_KEY_HERE'
            },
            {
                name: 'weatherapi',
                description: 'WeatherAPI.com (Miễn phí - Cần API key)',
                requiresKey: true,
                configured: WEATHERAPI_KEY && WEATHERAPI_KEY !== 'YOUR_API_KEY_HERE'
            }
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        provider: API_PROVIDER,
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Provider: ${API_PROVIDER}`);
    if (API_PROVIDER === 'openmeteo') {
        console.log('✅ Using Open-Meteo (FREE - No API key required)');
    } else {
        console.log(`OpenWeatherMap API Key: ${OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'YOUR_API_KEY_HERE' ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
        console.log(`WeatherAPI Key: ${WEATHERAPI_KEY && WEATHERAPI_KEY !== 'YOUR_API_KEY_HERE' ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
    }
});
