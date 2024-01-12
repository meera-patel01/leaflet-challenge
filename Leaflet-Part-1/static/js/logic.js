d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  createMarkers(data.features);
});

function color(depth) {
      switch(true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "#FF9248";
        case depth > 50:
          return "#FFB38A";
        case depth > 30:
          return "gold";
        case depth > 10:
          return "#D1E231";
        default:
          return "green";
      }
    }

function createMap(earthquakes) {

  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  let baseMaps = {
    "Street Map": streetmap
  };
  
  let overlayMaps = {
    "Earthquakes": earthquakes
  };
  
  let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  let legend = L.control({position: "bottomright"});
  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend"),
    labels = ['<strong>Depth</strong>'],
    depth = [-10, 10, 30, 50, 70, 90];

    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
      labels.push(
        '<i class="legend" style="background:' + color(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+'));
    } 
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(map)

}

function createMarkers(earthquake) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Location: " + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "<h3><h3>Date: " + Date(feature.properties.time) + "</h3>");
  }

  var earthquakes = L.geoJSON(earthquake, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      let markers = {
        radius: feature.properties.mag * 15000,
        fillColor: color(feature.geometry.coordinates[2]),
        color: color(feature.geometry.coordinates[2])
      }
      return L.circle(latlng,markers);
    }
  });

  createMap(earthquakes);
}