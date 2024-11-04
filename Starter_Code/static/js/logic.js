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
      return '#85e970';
    } else if (depth <= 30) {
        return '#baf5ad';
    } else if (depth <= 50) {
        return '#d8ec6c'; 
    } else if (depth <= 70) {
        return '#e0c24a'; 
    } else if (depth <= 90) {
        return '#d89024';
    } else {
        return '#d84c24'; 
    }
  }