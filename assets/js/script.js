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