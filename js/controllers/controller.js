var app = angular.module("weatherApp");

// days of the week, for the 7 days forecast
const weekday = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const d = new Date();

// controller for the current weather
app.controller('meteovillesCtrl', function($scope, $http) {

    // if there is no city in the local storage, a message is shown
    $scope.hideNoCityMsg = false;
    if ( localStorage.length > 0 ) {
        $scope.hideNoCityMsg = true;
    }

    // we get the cities from the local storage
    var cities = [];
    i=0;
    while ( cities.length < localStorage.length ) {
        if ( localStorage.getItem(i) !== null ) {
            city = {};
            city.id = i;
            city.name = localStorage.getItem(i);
            cities.push(city);
        }
        i++;
    }

    // we request the openweathermap API and get the needed information for each city
    for ( let city of cities ) {
        $http.get(`http://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=ee07e2bf337034f905cde0bdedae3db8`)
        .then(function(response) {
            city.description = response.data.weather[0].description;

            // the temperature is converted from K to C
            city.temperature = (response.data.main.temp - 273.15).toFixed(1);
            city.mintemp = (response.data.main.temp_min - 273.15).toFixed(1);
            city.maxtemp = (response.data.main.temp_max - 273.15).toFixed(1);

            city.pressure = response.data.main.pressure;
            city.humidity = response.data.main.humidity;
            city.windspeed = response.data.wind.speed;
            city.winddeg = response.data.wind.deg;

            city.image = getIcon(response.data.weather[0].icon);
            
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    $scope.villes = cities;
});

// controller for the 7 days forecast
app.controller('previsionsCtrl', function ($scope,$http,$routeParams) {
    let city = {};
    // we get the city id
    city.name = localStorage.getItem($routeParams.id);
    city.id = $routeParams.id;

    // we request the openweathermap API and get the needed information for each day
    $http.get(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city.name},fr&appid=ee07e2bf337034f905cde0bdedae3db8`)
    .then(function successCallback(response) {
        city.days = [];
        for (let item of response.data.list) {
            let day = {};
            day.name = weekday[(d.getDay() + response.data.list.indexOf(item) + 1) % 7];
            day.description = item.weather[0].description;
            day.image = getIcon(item.weather[0].icon);
            // the temperature is converted from K to C
            day.temperature = (item.temp.day - 273.15).toFixed();
            day.mintemp = (item.temp.min - 273.15).toFixed();
            day.maxtemp = (item.temp.max - 273.15).toFixed();

            city.days.push(day);
        }
    }, function errorCallback(response) {
        console.log(response);
    });
    // the scope variable is updated
    $scope.city = city;
})

// allows to add a new city to the local storage
function addCity() {
    i = 0;
    // we look for the 1st available id
    while ( localStorage.getItem(i) !== null ) {
        i++;
    }
    localStorage.setItem(i, document.getElementById("city").value);
}

// allows to remove a city from the local storage
function deleteCity(id) {
    localStorage.removeItem(id);
    location.reload(); // we reload the page so it is updated automatically
}

// allows to get the icon (from the openweathermap API), according to the code given in the JSON response
function getIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}