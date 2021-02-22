let apiKey = "3da0bc581aafff18fab9e3c8f1962ca5";
let units = "metric";
let weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
//let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
let onecallURL = "https://api.openweathermap.org/data/2.5/onecall?";

function changeToDoubleDigits(time) {
  if (time < 10) {
    return `0${time}`;
  } else {
    return time;
  }
}

function convertDay(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[timestamp.getDay()];
  return day;
}

//Display date and time
function formatTime(timestamp) {
  let now = new Date(timestamp * 1000);
  let day = convertDay(now);
  let hour = now.getHours();
  let minutes = now.getMinutes();

  return `${day} ${changeToDoubleDigits(hour)}:${changeToDoubleDigits(
    minutes
  )}`;
}
let cityTemperature = null;
let celsiusTemperature = null;

function convertCelsiusToFahrenheit(cTemp) {
  return Math.round((cTemp * 9) / 5 + 32);
}

function convertFahrenheitToCelsius(fTemp) {
  return Math.round(((fTemp - 32) * 5) / 9);
}

//get weather for submitted city
function displayCityTemperature(response) {
  cityTemperature = response;
  getForecast(response);
  let city = document.querySelector("#city");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let time = document.querySelector("#time");
  let todaysTemp = document.querySelector(".todays-temp");
  let todaysWeatherIcons = document.querySelector("#todays-icon");
  let windSpeed = document.querySelector("#wind-speed");
  celsiusTemperature = Math.round(response.data.main.temp);
  city.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}`;
  time.innerHTML = formatTime(response.data.dt + response.data.timezone);
  todaysTemp.innerHTML = `${celsiusTemperature}°C`;
  todaysWeatherIcons.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="${response.data.weather[0].description}"/>`;
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed * 2.237)} mph`;
}

function getForecast(response) {
  let buttonClickEvent = event.target.id;
  let latitudeResponse = response.data.coord.lat;
  let longitudeResponse = response.data.coord.lon;
  let apiUrl = `${onecallURL}lat=${latitudeResponse}&lon=${longitudeResponse}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(function (response) {
    displayForecast(response, buttonClickEvent);
  });
}

function displayForecast(response, buttonClickEvent) {
  let dailyForecast = response.data.daily;
  dailyForecast = dailyForecast.slice(0, 5);
  let forecastElements = document.querySelector("#forecast");
  if (buttonClickEvent && buttonClickEvent === "fahrenheit") {
    forecastElements.innerHTML = dailyForecast.map(function (item) {
      let forecastDate = new Date(item.dt * 1000);
      return `<!-- --> <div class="col-2 daily"><ul class="forecast-elements"><li class="day">${convertDay(
        forecastDate
      ).substring(0, 3)}</li><li class="daily-weather-icons">
    <img src="http://openweathermap.org/img/wn/${
      item.weather[0].icon
    }.png" alt="${item.weather[0].description}"/>
    </li><li class="temp">${Math.round(
      convertCelsiusToFahrenheit(item.temp.max)
    )}°</li></ul></div><!--`;
    });
  } else {
    forecastElements.innerHTML = dailyForecast.map(function (item) {
      let forecastDate = new Date(item.dt * 1000);
      return `<!-- --> <div class="col-2 daily"><ul class="forecast-elements"><li class="day">${convertDay(
        forecastDate
      ).substring(0, 3)}</li><li class="daily-weather-icons">
    <img src="http://openweathermap.org/img/wn/${
      item.weather[0].icon
    }.png" alt="${item.weather[0].description}"/>
    </li><li class="temp">${Math.round(item.temp.max)}°</li></ul></div><!--`;
    });
  }
}

function getCityTemperature(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let apiUrl = `${weatherUrl}?q=${cityInput.value}&units=${units}&appid=${apiKey}`;
  let city = cityInput.value.trim();
  if (city) {
    axios
      .get(apiUrl)
      .then(displayCityTemperature)
      .catch(function (error) {
        alert("The city entered hasn't been found. Try another city.");
      });
  } else {
    alert("Please enter a city.");
  }
}

function getCurrentLocationTemperature(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `${weatherUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayCityTemperature);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentLocationTemperature);
}

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", getCityTemperature);
searchCityForm.addEventListener("submit", convertUnit);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getLocation);
currentLocation.addEventListener("click", convertUnit);

//show weather for initial city
function getDefaultCity() {
  let city = "london";
  let apiUrl = `${weatherUrl}?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayCityTemperature);
}

//Convert temperature
function convertUnit(event) {
  event.preventDefault();
  let todaysTemp = document.querySelector(".todays-temp");
  let changeUnitButton = document.querySelector(".change-unit");
  if (event.target.id === "fahrenheit") {
    getForecast(cityTemperature);
    changeUnitButton.innerHTML = `<button
                  type="button"
                  class="btn btn-primary mb-3 celsius"
                  id="celsius"
                >
                  Change to Celsius
                </button>`;
    let fahrenheitTemperature = convertCelsiusToFahrenheit(celsiusTemperature);
    todaysTemp.innerHTML = `${fahrenheitTemperature}°F`;
  } else {
    getForecast(cityTemperature);
    todaysTemp.innerHTML = `${celsiusTemperature}°C`;
    changeUnitButton.innerHTML = `<button
                  type="button"
                  class="btn btn-primary mb-3 fahrenheit"
                  id="fahrenheit"
                >
                  Change to Fahrenheit
                </button>`;
  }
}
let changeUnit = document.querySelector("#change-unit");
changeUnit.addEventListener("click", convertUnit);

getDefaultCity();
