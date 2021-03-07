// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We now create a third tile layer
let night_navigation = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-preview-night-v2/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// You want a 4th tile layer? Well here you go you cheeky bastard you. 
let day_navigation = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [night_navigation]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Night Navigation": night_navigation,
  "Day Navigation" : day_navigation
};

// 1. Add a 2nd layer group for the tectonic plate data and a 3rd layer group for the Major Quakes.
let allEarthquakes = new L.LayerGroup();
let allTectonicPlates = new L.LayerGroup();
let allMajorQuakes = new L.LayerGroup();

// 2. Add a reference to the tectonic plates group to the overlays object.
let overlays = {
  "Earthquakes": allEarthquakes,
  "Tectonic Plates": allTectonicPlates,
  "Major Quakes": allMajorQuakes
};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// put the tectonic plate data into a var
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// put the earthquake data into a var
var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// put the major earthquakes data into a var
var majorQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Retrieve the earthquake GeoJSON data.
d3.json(quakes).then(function(data) {
  

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    	// We turn each feature into a circleMarker on the map.
    	pointToLayer: function(feature, latlng) {
      		console.log(data);
      		return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
     // We create a popup for each circleMarker to display the magnitude and location of the earthquake
     //  after the marker has been created and styled.
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(allEarthquakes);

  // Then we add the earthquake layer to our map.
  allEarthquakes.addTo(map);

  // Here we create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);

  // 3. Use d3.json to make a call to get our Tectonic Plate geoJSON data.
  d3.json(plates).then(function(data) {
      console.log('wombats wombats wombats');
      L.geoJSON(data, {
        color: '#ed7f2e',
        weight: 2,
        onEachFeature: function(feature,layer) {
          console.log(feature);
        }
      }).addTo(allTectonicPlates);  
  });
  // Then we add the earthquake layer to our map.
  allTectonicPlates.addTo(map);

  /// ADD MAJOR QUAKE DATA HERE

  d3.json(majorQuakes).then(function(data) {
  

  //   // This function returns the style data for each of the earthquakes we plot on
  //   // the map. We pass the magnitude of the earthquake into two separate functions
  //   // to calculate the color and radius.
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: getColor(feature.properties.mag),
        color: "#ffffff",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 1
      };
    }
  
  //   // This function determines the color of the marker based on the magnitude of the earthquake.
    function getColor(magnitude) {
      if (magnitude > 5) {
        return "#ea2c2c";
      }
      if (magnitude > 4) {
        return "#ea822c";
      }
      if (magnitude < 4) {
        return "#ee9c00";
      }
    }
  
  //   // This function determines the radius of the earthquake marker based on its magnitude.
  //   // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * magnitude;
    }
  
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            console.log('wam bam thank you ma\'am');
            return L.circleMarker(latlng);
          },
        // We set the style for each circleMarker using our styleInfo function.
       style: styleInfo,
       // We create a popup for each circleMarker to display the magnitude and location of the earthquake
       //  after the marker has been created and styled.
       onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(allMajorQuakes);
  
    // Then we add the earthquake layer to our map.
    allMajorQuakes.addTo(map);
  
    // Here we create a legend control object.
    let legend = L.control({
      position: "bottomright"
    });
  
  // // Then add all the details for the legend
  // legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
  
  //   const magnitudes = [0, 1, 2, 3, 4, 5];
  //   const colors = [
  //     "#98ee00",
  //     "#d4ee00",
  //     "#eecc00",
  //     "#ee9c00",
  //     "#ea822c",
  //     "#ea2c2c"
  //   ];
  
  // // Looping through our intervals to generate a label with a colored square for each interval.
  //   for (var i = 0; i < magnitudes.length; i++) {
  //     console.log(colors[i]);
  //     div.innerHTML +=
  //       "<i style='background: " + colors[i] + "'></i> " +
  //       magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  //     }
  //     return div;
  //   };
  
  //   // Finally, we our legend to the map.
  // legend.addTo(map);
  });
  /// END OF MAJOR QUAKE SEGMENT
});