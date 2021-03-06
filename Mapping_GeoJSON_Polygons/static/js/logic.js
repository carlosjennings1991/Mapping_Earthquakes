// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satellitestreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    'Streets': streets,
    'Satellite Streets': satellitestreets
};

//Use the alternative way to create the map object
let map = L.map('mapid', {
    center: [43.7, -79.3],
    zoom: 11,
    // note that the variable in the array is simply the default layer
    layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Accessing the Toronto neighborhoods GeoJSON URL.
let torontoHoods = "https://raw.githubusercontent.com/carlosjennings1991/Mapping_Earthquakes/main/torontoNeighborhoods.json";

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// Grab the geoJSON data from our 'torontoHoods' variable
d3.json(torontoHoods).then(function(data) {
    console.log(data);
    L.geoJSON(data, {
        fillColor: '#ffffa1',
        color: '#026093',
        opacity: 0.5,
        weight: 2,
        fillOpacity: 0.3,
        onEachFeature: function(feature,layer) {
            layer.bindPopup("<h2>Neighborhood: " + feature.properties.AREA_NAME + "</h2>")
        }
    }).addTo(map);
});