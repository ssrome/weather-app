function changeToDoubleDigits(time) {
  if (time < 10) {
    return `0${time}`;
  } else {
    return time;
  }
}

//Display date and time
function formatTime(timestamp) {
  let now = new Date(timestamp * 1000);
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
  let day = days[now.getDay()];
  let hour = now.getHours();
  let minutes = now.getMinutes();

  return `${day} ${changeToDoubleDigits(hour)}:${changeToDoubleDigits(
    minutes
  )}`;
}
// let hour = now.getHours();
// let minutes = now.getMinutes();

// let currentDateTime = `${day} ${changeToDoubleDigits(
//   hour
// )}:${changeToDoubleDigits(minutes)}`;

// let time = document.querySelector("#time");
// time.innerHTML = currentDateTime;

//get weather for submitted city
function displayCityTemperature(response) {
  let city = document.querySelector("#city");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let precipitation = document.querySelector("#precipitation");
  let time = document.querySelector("#time");
  let todaysTemp = document.querySelector(".todays-temp");
  let todaysWeatherIcons = document.querySelector("#todays-icon");
  let windSpeed = document.querySelector("#wind-speed");
  city.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}`;
  precipitation.innerHTML = `?`;
  time.innerHTML = formatTime(response.data.dt + response.data.timezone);
  todaysTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
  todaysWeatherIcons.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png"/>`;
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed)} mps`;
}

function getCityTemperature(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  apiUrl = `${baseUrl}?q=${cityInput.value}&units=${units}&appid=${apiKey}`;
  if (cityInput.value.trim()) {
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
  let apiUrl = `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayCityTemperature);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentLocationTemperature);
}

let apiKey = "3da0bc581aafff18fab9e3c8f1962ca5";
let units = "metric";
let baseUrl = "https://api.openweathermap.org/data/2.5/weather";

let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", getCityTemperature);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getLocation);

//show weather for initial city
function getDefaultCity() {
  let apiUrl = `${baseUrl}?q=london&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayCityTemperature);
}

getDefaultCity();

//Convert temperature
function changeUnit(event) {
  event.preventDefault();
  let todaysTemp = document.querySelector(".todays-temp");
  if (event.target.id === "fahrenheit") {
    todaysTemp.innerHTML = "57°";
  } else {
    todaysTemp.innerHTML = "14°";
  }
}

// let changeToCelsius = document.querySelector("#celsius");
// changeToCelsius.addEventListener("click", changeUnit);

// let changeToFahrenheit = document.querySelector("#fahrenheit");
// changeToFahrenheit.addEventListener("click", changeUnit);

let changeToFahrenheit = document.querySelector("button.fahrenheit");
changeToFahrenheit.addEventListener("click", changeUnit);

{
  /* <button type="button" class="btn btn-primary mb-3 fahrenheit">
  Change to Fahrenheit
</button>; */
}
