// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([34.0575, -118.2826], 6);

let cityData = cities;

// Loop through the cities array and create one marker for each city.
cityData.forEach(function(city) {
    console.log(city),
    L.circleMarker(city.location, {radius: city.population / 100000, color: 'orange', stroke: true, weight: 4})
    .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + (city.population - 200000).toLocaleString() + "</h3>").addTo(map)
    //L.circle(city.location, {radius: 100000, color: 'blue', fillcolor: 'white', opacity: 0.7}).addTo(map)
});

// add a circle to our marker
//let circle = L.circle([34.0575, -118.2826], {radius: 300, color: 'yellow', fillcolor: 'white', opacity: 0.7}).addTo(map);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);