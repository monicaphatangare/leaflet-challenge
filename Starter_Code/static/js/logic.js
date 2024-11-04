// // Store our API endpoint inside queryUrl
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL
// d3.json(queryUrl, function(data){
//      // Once we get a response, send the data.features object to the createFeatures function
//     createFeatures(data.features);

// });

// function createFeatures(earthquakeData) {
//     // Give each feature a popup describing the place and time of the earthquake
//     function onEachFeature(feature, layer){
//         layer.Popup("<h3>" + feature.properties.place +
//             "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag +"</h4>");   
//     }
// // Function for Circle Color Base on Criteria.
// function earthQuakeColor(Qcolor){
//     switch(true){
//         case (0 <= Qcolor && Qcolor <= 1.0):
//             return "Red";
//         case (1.0 <= Qcolor && Qcolor <= 2.0):
//             return "Orange";
//         case (2.0 <= Qcolor && Qcolor <= 3.0):
//             return "Yellow";
//         case (3.0 <= Qcolor && Qcolor<= 4.0):
//             return "Green";
//         case (4.0 <= Qcolor && Qcolor<= 5.0):
//             return "Blue";
//         case (5.0 <= Qcolor && Qcolor <= 6.0):
//             return "Indigo";
//         default:
//             return "Violet";
//     }
// }  
// //   Create a circle function
// function CircleMaker(features, latlng){
//     let CircleOptions = {
//         radius: features.properties.mag * 8,
//         fillcolor: earthQuakeColor(features.properties.mag),
//         color: earthQuakeColor(features.properties.mag),
//         opacity: 1.0,
//         fillOpacity: .5
//     }
//     return L.CircleMaker(latlng, CircleOptions)
// } 

// // Create a GeoJSON layer containing the features array on the earthquakeData object
// // Run the onEachFeature function once for each piece of data in the array
// let earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature,
//     pointToLayer: CircleMaker
// });
// // Sending our earthquakes layer to the createMap function
// createImageBitmap(earthquakes);
// }

// function createMap(earthquakes){
//      // Define streetmap and Satellite layers
//     let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: "mapbox/streets-v11",
//         accessToken: API_KEY
//       });

//     let Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "satellite-v9",
//         accessToken: API_KEY
//       });

//     let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: "mapbox/light-v10",
//         accessToken: API_KEY
//       });

//       // Define a baseMaps object to hold our base layers
//     let baseMaps = {
//         "Street Map": streetmap,
//         "Light Map": lightmap,
//         "Satellite Map": Satellite
//       };

//       // Create overlay object to hold our overlay layer
//     let overlayMaps = {
//         Earthquakes: earthquakes
//     };

//     // Create our map, giving it the streetmap and earthquakes layers to display on load
//     let myMap = L.map("mapid", {
//         center: [
//         37.09, -95.71
//         ],
//         zoom: 5,
//         layers: [streetmap, earthquakes]
//     });

//     // Create a legend to display information about our map
//     let info = L.control({
//         position: "bottomright"
//     });
//     // Add the info legend to the map
//     info.addTo(myMap);

//     // Create a layer control
//     // Pass in our baseMaps and overlayMaps
//     // Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(myMap);
//     }

// Create map
let map = L.map("map", {
    center: [39.6566, -97.6998],
    zoom: 4
  });
  
  // Add base tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Fetch earthquake data for last 7 days from USGS using d3.json
  d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
    console.log(data.features[0]);
    // Process the earthquake data
    data.features.forEach(feature => {
      let lat = feature.geometry.coordinates[1];
      let lon = feature.geometry.coordinates[0];
      let mag = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      let place = feature.properties.place;
      let type = feature.properties.type;
  
      // Circle size based on magnitude
      let radius = Math.pow(2, mag) * 10000;
  
      // colour based on depth
      let color = getColor(depth);
  
      // Circle marker for each earthquake
      let circle = L.circle([lat, lon], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.4
      }).bindPopup("<h2>" + type + "<h3> " + place + "<h3>Lat: " + lat + "<h3>Lon: " + lon + "<h3>Magnitude: " + mag).addTo(map);
    });
  
    // Add legend
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'legend');
  
      // Legend title
      let legendTitle = L.DomUtil.create('div', 'legend-title');
      legendTitle.innerHTML = 'Earthquake Depth';
      div.appendChild(legendTitle);
  
      // Legend rows
      let depthValues = [10, 30, 50, 70, 90];
      depthValues.forEach(function (depth, index) {
        let legendRow = L.DomUtil.create('div', 'legend-row');
  
        // Circle colour
        let legendColor = L.DomUtil.create('div', 'legend-color');
        legendColor.style.backgroundColor = getColor(depth);
        legendRow.appendChild(legendColor);
  
        // Depth in legend
        let legendLabel = L.DomUtil.create('div', 'legend-label');
        legendLabel.innerHTML = (index === depthValues.length - 1) ? '> ' + depth + ' km' : depth + ' - ' + (depthValues[index + 1] - 1) + ' km';
        legendRow.appendChild(legendLabel);
  
        div.appendChild(legendRow);
      });
  
      return div;
    };
    legend.addTo(map);
  });
  
  // Colour based on depth
  function getColor(depth) {
    if (depth <= 10) {
      return '#85e970'; // Cyan
    } else if (depth <= 30) {
      return '#baf5ad'; // Deep Sky Blue
    } else if (depth <= 50) {
      return '#d8ec6c'; // Blue
    } else if (depth <= 70) {
      return '#e0c24a'; // Light Red
    } else if (depth <= 70) {
        return '#d89024';
    } else {
      return '#d84c24'; // Red
    }
  }