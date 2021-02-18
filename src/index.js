//Display date and time
let now = new Date();
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

function changeToDoubleDigits(time) {
  if (time < 10) {
    return "0" + time;
  } else {
    return time;
  }
}

let hour = now.getHours();
let minutes = now.getMinutes();

let currentDateTime = `${day} ${changeToDoubleDigits(
  hour
)}:${changeToDoubleDigits(minutes)}`;

let time = document.querySelector("#time");
time.innerHTML = currentDateTime;

//Display sumbitted city
// function displayCity(event) {
//   event.preventDefault();
//   let cityInput = document.querySelector("#city-input");
//   let city = document.querySelector("#city");
//   if (cityInput.value) {
//     city.innerHTML = cityInput.value;
//   }
// }

//get weather for submitted city
function displayCityTemperature(response) {
  let city = document.querySelector("#city");
  let todaysTemp = document.querySelector(".todays-temp");
  city.innerHTML = response.data.name;
  todaysTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
}

function getCityTemperature(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let apiUrl = `${baseUrl}?q=${cityInput.value}&units=${units}&appid=${apiKey}`;
  if (cityInput.value) {
    axios.get(apiUrl).then(displayCityTemperature);
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

//Convert temperature
// function changeUnit(event) {
//   event.preventDefault();
//   let todaysTemp = document.querySelector(".todays-temp");
//   if (event.target.id === "fahrenheit") {
//     todaysTemp.innerHTML = "57°";
//   } else {
//     todaysTemp.innerHTML = "14°";
//   }
// }

// let changeToCelsius = document.querySelector("#celsius");
// changeToCelsius.addEventListener("click", changeUnit);

// let changeToFahrenheit = document.querySelector("#fahrenheit");
// changeToFahrenheit.addEventListener("click", changeUnit);

//navigator.geoLocation.getCurrentPosition
