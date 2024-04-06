var link='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(link).then(function (data) {
    function mapStyle(feature) {
        return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: mapColor(feature.geometry.coordinates[2]),
                color: "purple",
                radius: mapRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
        };
    };
    function mapColor(depth) {
        if (depth < 10) return "#D8BFD8";
        else if (depth < 30) return "#CEA2FD";
        else if (depth < 50) return "#A865B5";
        else if (depth < 70) return "#743089";
        else if (depth < 90) return "#663399";
        else return "#4B0082";
        };
    function mapRadius(mag) {
        return mag * 4;
    };
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' +mapColor(depth[i]) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap) 
});