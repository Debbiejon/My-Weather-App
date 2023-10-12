function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector(".forecast-list");
  forecastElement.innerHTML = ""; // Clear out the existing forecast

  for (let i = 0; i < 7; i++) {
    let forecast = response.data.daily[i];
    let minTemp = Math.round(forecast.temp.min);
    let maxTemp = Math.round(forecast.temp.max);
    let icon = forecast.weather[0].icon;
    let description = forecast.weather[0].description;

    forecastElement.innerHTML += `
      <li>
        <span>${formatDay(forecast.dt * 1000)}</span>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="" class="emoji"/>
        <span>${description}</span>
        <span>${minTemp}°C/${maxTemp}°C</span>
      </li>
    `;
  }
}

function getForecast(lat, lon) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let city = response.data.name;

  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#temperature-description");

  cityElement.innerHTML = city;
  temperatureElement.innerHTML = `${temperature}°C`;
  descriptionElement.innerHTML = response.data.weather[0].description;

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

function search(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  getWeather(city);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = 77;
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = 25;
}

function getWeather(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTemperature);
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(retrievePosition);
});

let apiKey = "a8d72e823d3cd2108dd77df5483f3098";

// Initial weather data for a default city
getWeather("Antwerp");
