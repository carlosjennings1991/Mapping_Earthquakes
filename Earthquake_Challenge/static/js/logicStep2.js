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
    center: [39.5, -98.5],
    zoom: 6,
    // note that the variable in the array is simply the default layer
    layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Accessing the Earthquake data
var earthQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// grab the geoJSON data
// d3.json(earthQuakes).then(function(data) {
//     console.log(data.features[0].properties.place);
//     // create the geoJSON object
//     L.geoJSON(data).addTo(map);
// });

// d3.json(earthQuakes).then(function(data) {
//     // WHY IS THIS NOT WORKING!?!?!??!!? WHY HATH THOU FORSAKEN ME GOD, WHY!?!?!?!?
//     for (var i = 0; i < data.length; i++) {
//         console.log(data.features[i].properites.place);
//     };
//     // create the geoJSON object
//     L.geoJSON(data).addTo(map);
// });

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: "#ffae42",
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
      //magnitude: feature.properties.mag
    };
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
}

d3.json(earthQuakes).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
            },
            style: styleInfo
        }).addTo(map);
});