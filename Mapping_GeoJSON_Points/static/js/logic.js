// Add console.log to check to see if our code is working.
console.log("working");

// Change the default view and zoom.
//let map = L.map('mapid').setView([40, -1], 4);


// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'navigation-preview-night-v2' tile layer to the map.
//streets.addTo(map);

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// add the second tile layer
//dark.addTo(map);

// Create a base layer that holds both maps.
let baseMaps = {
    Street: streets,
    Dark: dark
};

//Use the alternative way to create the map object
let map = L.map('mapid', {
    center: [40, -1],
    zoom: 5,
    // note that the variable in the array is simply the default layer
    layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);


// Accessing the airport GeoJSON URL
let airportData = "https://raw.githubusercontent.com/carlosjennings1991/Mapping_Earthquakes/main/majorAirports.json";

// Grabbing our GeoJSON data.
// d3.json(airportData).then(function(data) {
//     console.log(data);
//     // Creating a GeoJSON layer with the retrieved data.
//     L.geoJson(data, {
//         onEachFeature: function(feature, layer) {
//             layer.bindPopup("<h2" + feature.properties.city + "</h2>");
//         }
//     }).addTo(map);
// });

d3.json(airportData).then(function(data) {
    console.log(data);
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        pointToLayer: function(feature, ltlng) {
            console.log(feature);
            return L.marker(ltlng)
            .bindPopup("<h2>" + "Airport Code: " + feature.properties.faa + "<hr></h2><h3>" + feature.properties.name + "</h3>");
        }
    }).addTo(map);
});


