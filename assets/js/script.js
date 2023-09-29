window.onload = function() {
    document.activeElement.blur();
};
$(document).ready(function() {
    const apiKey = '389d7b50532c55e84bfb73fbd4b66fe8';

    $('.search').submit(function(event) {
        event.preventDefault();
        const city = $('input[type="search"]').val();
        fetchCurrentWeather(city);
        fetchForecast(city);
    });

    function fetchCurrentWeather(city) {
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        $.get(endpoint, function(data) {
            $('.city').text(data.name);
            $('.temp').text(`Temperature: ${data.main.temp}°F`);
            $('.humid').text(`Humidity: ${data.main.humidity}%`);
            $('.wind').text(`Wind Speed: ${data.wind.speed} MPH`);
        });
    }

    function fetchForecast(city) {
        const endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

        $.get(endpoint, function(data) {
            for (let i = 0; i < 5; i++) {
                const forecastData = data.list[i];
                $(`.forecast-info:eq(${i}) .temp`).text(`Temperature: ${forecastData.main.temp}°F`);
                $(`.forecast-info:eq(${i}) .humid`).text(`Humidity: ${forecastData.main.humidity}%`);
                $(`.forecast-info:eq(${i}) .wind`).text(`Wind Speed: ${forecastData.wind.speed} MPH`);
            }
        });
    }
});

const searchForm = document.querySelector('.search');
const recentSearches = document.querySelector('.recent-searches');

searchForm.addEventListener('submit', function(event) {
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

recentSearches.addEventListener('click', function(event) {
    if (event.target.tagName === 'P') {
        const cityNameFromRecent = event.target.textContent;
        fetchWeatherData(cityNameFromRecent);
    }
});

function displayWeather(data) {
    document.querySelector('.city').textContent = data.name;
    document.querySelector('.temp').textContent = `Temperature: ${data.temp}°F`;
    document.querySelector('.humid').textContent = `Humidity: ${data.humidity}%`;
    document.querySelector('.wind').textContent = `Wind Speed: ${data.wind} MPH`;
}

function fetchWeatherData(city) {
    const apiKey = '389d7b50532c55e84bfb73fbd4b66fe8';
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const weatherData = {
                city: data.name,
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                icon: data.weather[0].icon
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

function addRecentSearch(city) {
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

function renderRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches.innerHTML = searches.map(city => `<p>${city}</p>`).join('');
    recentSearches.style.display = searches.length ? 'block' : 'none';
}

renderRecentSearches();

searchForm.querySelector('input[type="search"]').addEventListener('click', function() {
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (searches.length) {
        recentSearches.style.display = 'block';
    }
});