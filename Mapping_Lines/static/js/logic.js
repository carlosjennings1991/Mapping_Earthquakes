// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with center at the San Francisco airport.
let map = L.map('mapid').setView([37.6213, -122.3790], 5);

// Coordinates for each point to be used in the line.
let lines = [
    [33.9416, -118.4085],
    [29.9902, -95.3368],
    [43.6777, -79.6248],
    [40.6413, -73.7781]
];

var locations = [
    ['Los Angeles'],
    ['Houston'],
    ['Toronto'],
    ['New York']
];



// Create a polyline using the line coordinates and make the line red.
L.polyline(lines, {
    color: "blue",
    weight: 4,
    opacity: 0.5,
    dashArray: '5,10'
}).addTo(map);

// loop through the line array and add markers
lines.forEach(function(line) {
    L.marker(line).addTo(map);
})

// Create a polygon
let polyg = [
    [41.000, -109.050],
    [36.999, -109.045],
    [36.993, -102.042],
    [41.002, -102.051]
];

// create the polygon
L.polygon(polyg, {
    color: 'red',
    opacity: 0.3
}).addTo(map);


// add a circle to our marker
//let circle = L.circle([34.0575, -118.2826], {radius: 300, color: 'yellow', fillcolor: 'white', opacity: 0.7}).addTo(map);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);
line.addTo(map);