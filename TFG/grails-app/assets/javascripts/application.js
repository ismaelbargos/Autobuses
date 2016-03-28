// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//

//= require jquery-2.2.0.min
//= require bootstrap
//= require_tree .
//= require_self

//var madrid = ol.proj.fromLonLat([-3.683333, 40.4]);

function encontrarPosicion(){
    var geolocation = new ol.Geolocation({
        projection: view.getProjection(),
        tracking: true
    });
    // handle geolocation error.
    geolocation.on('error', function(error) {
        alert(error.message);
    });

    return geolocation;
}

function dibujarMapa() {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: view
    });
    zoomslider = new ol.control.ZoomSlider();
    map.addControl(zoomslider);
    return map;
}

function dibujarMarker(geolocation, map) {
    var accuracyFeature = new ol.Feature({
        geometry: geolocation.getAccuracyGeometry()
    });

    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    var positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    geolocation.on('change:position', function () {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
    });

    geolocation.on('error', function(error) {
        alert(error.message);
    });

    new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature]
        })
    });
}
var view = new ol.View({
    center: ol.proj.fromLonLat([-3.683333, 40.4]),
    zoom: 10
});

var posicion = encontrarPosicion();
var map = dibujarMapa();
dibujarMarker(posicion, map);
