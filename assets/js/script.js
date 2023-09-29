// On page load, blur the search input to hide the keyboard on mobile
window.onload = function() {
    document.activeElement.blur();
};

// This function will be called when the user clicks the search button
$(document).ready(function() {
    const apiKey = '389d7b50532c55e84bfb73fbd4b66fe8'; // API key for OpenWeatherMap

    $('.search').submit(function(event) { // Click event for search button
        event.preventDefault();
        const city = $('input[type="search"]').val(); // Get the value of the search input
        fetchCurrentWeather(city); // Fetch current weather data
        fetchForecast(city); // Fetch forecast data
    });

    function fetchCurrentWeather(city) {
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        $.get(endpoint, function(data) { // Make a GET request to the endpoint
            $('.city').text(data.name); // Update city name
            $('.temp').text(`Temperature: ${data.main.temp}°F`); // Update temperature
            $('.humid').text(`Humidity: ${data.main.humidity}%`); // Update humidity
            $('.wind').text(`Wind Speed: ${data.wind.speed} MPH`); // Update wind speed
        });
    }

    function fetchForecast(city) {
        const endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

        $.get(endpoint, function(data) { // Make a GET request to the endpoint
            for (let i = 0; i < 5; i++) { // Loop through the next 5 days
                const forecastData = data.list[i]; // Get the forecast data for the current day
                $(`.forecast-info:eq(${i}) .temp`).text(`Temperature: ${forecastData.main.temp}°F`); // Update temperature
                $(`.forecast-info:eq(${i}) .humid`).text(`Humidity: ${forecastData.main.humidity}%`); // Update humidity
                $(`.forecast-info:eq(${i}) .wind`).text(`Wind Speed: ${forecastData.wind.speed} MPH`); // Update wind speed
                const forecastIcon = weatherIcon(forecastData.weather[0].main); // Get the icon name
                $(`.forecast-card:eq(${i}) .icon`).attr('src', `./assets/img/${forecastIcon}`); // Update icon
            }
        });
    }
});

function weatherIcon(weatherDescription) { // Function to get the icon name based on the weather description
    switch (weatherDescription) {
        case 'Clear':
            return 'clear.png';
        case 'Clouds':
            return 'clouds.png';
        case 'Rain':
            return 'rain.png';
        case 'Thunderstorm':
            return 'storm.png';
        case 'Snow':
            return 'snow.png';
        default:
            return 'clear.png'; 
    }
}

const searchForm = document.querySelector('.search');
const recentSearches = document.querySelector('.recent-searches');

searchForm.addEventListener('submit', function(event) { // Click event for search button for local storage
    event.preventDefault();
    const cityNameInput = event.target.querySelector('input[type="search"]');
    const cityNameValue = cityNameInput.value.trim();
    
    if (cityNameValue) {
        // Fetch weather data and update UI
        fetchWeatherData(cityNameValue);
        
        // Update recent searches
        addRecentSearch(cityNameValue);
    }
});

recentSearches.addEventListener('click', function(event) { // Click event for recent searches
    if (event.target.tagName === 'P') {
        const cityNameFromRecent = event.target.textContent;
        fetchWeatherData(cityNameFromRecent);
    }
});

function displayWeather(data) { // Function to display weather data
    document.querySelector('.city').textContent = data.name;
    document.querySelector('.temp').textContent = `Temperature: ${data.temp}°F`;
    document.querySelector('.humid').textContent = `Humidity: ${data.humidity}%`;
    document.querySelector('.wind').textContent = `Wind Speed: ${data.wind} MPH`;
    const weatherIconName = weatherIcon(data.icon.toLowerCase());
    document.querySelector('.current-weather .icon').src = `./assets/img/${weatherIconName}`;
}

function fetchWeatherData(city) { // Function to fetch weather data
    const apiKey = '389d7b50532c55e84bfb73fbd4b66fe8';
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiURL) 
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const weatherData = { // Object to store weather data
                city: data.name,
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                icon: data.weather[0].main
            };
        displayWeather(weatherData);
    });
}
$(document).ready(function() { 
    // Show recent searches when the input is focused
    $(".search input").on("focus", function() {
        $(".recent-searches").fadeIn(200);
    });

    // Hide recent searches when clicked outside of search input and recent-searches div
    $(document).on("click", function(event) {
        if (!$(event.target).closest('.search').length) {
            $(".recent-searches").fadeOut(200);
        }
    });
});

function addRecentSearch(city) { // Function to add recent searches to local storage
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    const index = searches.indexOf(city);
    if (index > -1) {
        searches.splice(index, 1);
    }
    
    searches.unshift(city);
    searches.lenght = Math.min(searches.length, 5);

    localStorage.setItem('recentSearches', JSON.stringify(searches));

    renderRecentSearches();
}

function renderRecentSearches() { // Function to render recent searches
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches.innerHTML = searches.map(city => `<p>${city}</p>`).join('');
    recentSearches.style.display = searches.length ? 'block' : 'none';
}

renderRecentSearches();

// Show recent searches when the input is clicked
searchForm.querySelector('input[type="search"]').addEventListener('click', function() {
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (searches.length) {
        recentSearches.style.display = 'block';
    }
});