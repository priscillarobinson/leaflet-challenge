// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 3,
});

// Define streetmap layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// load in data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// grab data with d3
d3.json(queryUrl, function (data) {
  var features = data.features
  console.log("features")
  console.log(features)

  for (var i = 0; i < features.length; i++) {
    var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
    var depth = features[i].geometry.coordinates[2];
    var magnitude = features[i].properties.mag;

    var color = "";

    if (depth > 90) {
      color = "#EA2C2C";
    }
    else if (depth > 70) {
      color = "#EA822C";
    }
    else if (depth > 50) {
      color = "#EE9C00";
    }
    else if (depth > 30) {
      color = "#EECC00";
    }
    else if (depth > 10) {
      color = "#D4EE00";
    }
    else {
      color = "#98EE00";
    }

    // Add circles to the map.
    L.circle(location, {
      fillOpacity: 1,
      color: "white",
      fillColor: color,
      // Adjust the radius.
      radius: magnitude * 20000
    }).bindPopup("<h1>" + features[i].properties.place + "</h2> <hr> <h3>Points: " + features[i].properties.mag + "</h3>").addTo(myMap);

  }

  // legend at bottom right corner
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98EE00",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#EA2C2C"
    ];
    // generate a legend with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // legend to the map.
  legend.addTo(myMap);

});













