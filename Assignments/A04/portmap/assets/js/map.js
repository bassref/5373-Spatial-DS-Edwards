mapboxgl.accessToken = 'pk.eyJ1IjoicmVwaGllZCIsImEiOiJja2ZkMWoydnEwMXdmMnpudnF2Y3lkZmpnIn0.zdRxU3vwQy0QI2haoiTBzA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-69.0297, 7.61],
    zoom: 2,
    attributionControl: true,
    preserveDrawingBuffer: true,
});

// handles click/touch event across devices 
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

// navigation controls
map.addControl(new mapboxgl.NavigationControl()); // zoom controls

// scale bar
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 90,
    unit: 'imperial',
    position: 'bottom-right'
}));

// geolocate control
map.addControl(new mapboxgl.GeolocateControl());

//This overides the Bootstrap modal "enforceFocus" to allow user interaction with main map
$.fn.modal.Constructor.prototype.enforceFocus = function() {};

// print function
var printBtn = document.getElementById('mapboxgl-ctrl-print');
var exportView = document.getElementById('export-map');

var printOptions = {
    disclaimer: "print output disclaimer",
    northArrow: 'assets/plugins/print-export/north_arrow.svg'
}

printBtn.onclick = function(e) {
    PrintControl.prototype.initialize(map, printOptions)
}

exportView.onclick = function(e) {
    PrintControl.prototype.exportMap();
    e.preventDefault();
}

//Check a text box to see if the information entered is in json format
//
$("#submitFile").click(function(event) {
    var textData = getElementById.val();
    //uploadJson();
    // convert it to json format
    textData = JSON.parse(textData);
    if (/^[\],:{}\s]*$/.test(textData.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        //plot the file
        map.addSource('point', {
            'type': 'geojson',
            'data': json
        });
        map.addLayer({
            'id': 'points',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-radius': 6,
                'circle-color': '#B42222'
            }
        });

    } else {

        //give message
        jsonInput.getElementById.value = '';
        jsonInput.getElementById("Not a valid Json file");

    }

});

// Layer Search Event Handlers
$('#search_general').on('click', function(e) {

    var criteria = $('#general_search').val();
    var prop = $('#property-descr').text();
    var layer_mapfile = $('#json_layer').val();

    addJsonLayerFilter(layer_mapfile, prop, criteria);

});

$('#clear_general').on('click', function(e) {

    $("#general_search").val("");
    $("#property-descr").html("<br />");
    clearFilterLayer();

});

// Geocoder API
// Geocoder API
// Geocoder API
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

var addressTool = document.getElementById('addressAppend');
addressTool.appendChild(geocoder.onAdd(map))

map.on('load', function() {
    map.addSource('geocode-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });
    //adds the point on the map where the user clicked
    map.addLayer({
        "id": "geocode-point",
        "source": "geocode-point",
        "type": "circle",
        "paint": {
            "circle-radius": 20,
            "circle-color": "dodgerblue",
            'circle-opacity': 0.5,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 3,
        }
    });

    geocoder.on('result', function(ev) {
        map.getSource('geocode-point').setData(ev.result.geometry);
    });

});

//Enter Lat Long
//Enter Lat Long
//Enter Lat Long

map.on('load', function() {

    $(document).ready(function() {


        //clear
        $('#findLLButtonClear').click(function() {

            map.removeLayer("enterLL");
            map.removeSource("enterLL");

            if (map.getLayer("enterLL")) {
                map.removeLayer("enterLL");
                map.removeSource("enterLL");
            }

        });

        //create
        $('#findLLButton').click(function() {

            var enterLng = +document.getElementById('lngInput').value
            var enterLat = +document.getElementById('latInput').value

            var enterLL = turf.point([enterLng, enterLat]);

            map.addSource('enterLL', {
                type: 'geojson',
                data: enterLL
            });

            map.addLayer({
                id: 'enterLL',
                type: 'circle',
                source: 'enterLL',
                layout: {

                },
                paint: {
                    "circle-color": 'red',
                    "circle-radius": 8,
                },
            });

            map.flyTo({
                center: [enterLng, enterLat]
            });

        });
    });
});
//enter Lat Long
//enter Lat Long
//enter Lat Long
map.on('load', function() {
    $(document).ready(function() {
        //clear
        $('#findClearNearest').click(function() {
            map.removeLayer("points");
            map.removeSource("point");
            if (map.getLayer("points")) {
                map.removeLayer("points");
                map.removeSource("point");
            }
            $("#lngInputs").val('')
            $("#latInputs").val('')
        });
        //create
        $('#findNearest').click(function() {
            console.log("works")
            var enterLng = $("#lngInputs").val()
            var enterLat = $("#latInputs").val()
            var enterLL = turf.point([enterLng, enterLat]);
            console.log(enterLat)

            $.getJSON("http://localhost:8080/click/?lngLat=" + enterLng + "," + enterLat)
                .done(function(json) {
                    console.log(json.features)
                    map.addSource('point', {
                        'type': 'geojson',
                        'data': json
                    });
                    map.addLayer({
                        'id': 'points',
                        'source': 'point',
                        'type': 'circle',
                        'paint': {
                            'circle-radius': 6,
                            'circle-color': '#B42222'
                        },

                    });
                    addPolygonLayer(addPolygon(json));
                })
            map.flyTo({
                center: [enterLng, enterLat]
            });
        });
    });
});

function addPolygon(json) {
    var enveloped = turf.envelope(json);
    return enveloped;
}

function addPolygonLayer(data) {
    map.addSource('national-park', {
        'type': 'geojson',
        'data': data
    });
    map.addLayer({
        'id': 'park-boundary',
        'type': 'fill',
        'source': 'national-park',
        'paint': {
            'fill-color': '#1d431b',
            'fill-opacity': 0.4
        },
        'filter': ['==', '$type', 'Polygon']
    });
}

var draws = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
});
map.addControl(draws);
var drawing = document.getElementById('drawAppend2');
drawing.appendChild(draws.onAdd(map)).setAttribute("style", "display: inline-flex;", "border: 0;");
map.on('draw.create', updateArea);

function updateArea(e) {
    var data = draws.getAll();
    var coords = turf.meta.coordAll(data);
    var line = turf.lineString(coords);
    var bbox = turf.bbox(line);
    $.getJSON("http://localhost:8080/intersections?lnglat=" + bbox)
        .done(function(json) {

            map.addSource('pointed', {
                'type': 'geojson',
                'data': json
            });
            map.addLayer({
                'id': 'pointed',
                'source': 'pointed',
                'type': 'circle',
                'paint': {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                },

            });
        })
}

// Coordinates Tool
// Coordinates Tool
// Coordinates Tool
map.on(touchEvent, function(e) {
    document.getElementById('info').innerHTML =
        JSON.stringify(e.lngLat, function(key, val) { return val.toFixed ? Number(val.toFixed(4)) : val; }).replace('{"lng":', '').replace('"lat":', ' ').replace('}', '')
});



//BOOKMARKS
//BOOKMARKS
//BOOKMARKS

document.getElementById('icelandBookmark').addEventListener('click', function() {

    map.flyTo({
        center: [-18.7457, 65.0662],
        zoom: 5,
    });
});

document.getElementById('safricaBookmark').addEventListener('click', function() {

    map.flyTo({
        center: [23.9417, -29.5353],
        zoom: 5,
    });
});

document.getElementById('japanBookmark').addEventListener('click', function() {

    map.flyTo({
        center: [138.6098, 36.3223],
        zoom: 4,
    });
});

document.getElementById('australiaBookmark').addEventListener('click', function() {

    map.flyTo({
        center: [134.1673, -25.6855],
        zoom: 3

    });
});