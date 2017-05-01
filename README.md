# RVMap js class #

## Description ##
RVMap is a js class used to draw areas on a map and check if groups of coordinates are inside those areas.

## Usage ##
As we can see on the index.html example it's only needed to:
1. Define a div to display the map
    1.1 Set map height
        `<style>#RVmap{height:100%}</style>`
    1.2 Define where to display the map
        `<div id="RVMap"></div>`

2. Import scripts
    2.1 Import RV class
    `<script type="text/javascript" src="src/RVMap.js"></script>`

    2.2 Define a callback function to be called after googlemaps is loaded
`function initMap() { new RVMap(document.getElementById('RVMap'), null, true); }`

    2.3 Import googleapis script, with an aproppiate key (google api key with geocode on javascript permissions enabled) in an asyn defered script with the callback needed.
`<script async defer src="https://maps.googleapis.com/maps/api/js?key=<YOUR-GOOGLE-MAPS-API-KEY>&callback=initMap"></script>`

## Extras ##
When we have a polygon, drawn by the user, or instantiated after RVMap is created, we can filter an array of coordinates checking if they are inside the polygon or not.

```
var rvMap = new RVMap(document.getElementById('RVMap'));

// Define a triangle
var zoneCoords = [
  {lat: 25.774, lng: -80.190},
  {lat: 18.466, lng: -66.118},
  {lat: 32.321, lng: -64.757},
];
var rvPolygon = new RVPolygon(zoneCoords);

rvMap.setPolygon(rvPolygon);
rvMap.drawPolygon();

var locations = [
  {lat: 28.920, lng: -69.741},     // In
  {lat: 25.958, lng: -78.222},     // In
  {lat: 26.784, lng: -57.700},     // Out
];

// Get an array of locations inside our rvPoylgon
var filteredLocations = rvMap.filterInZone(rvPolygon, locations);
```

If we check filteredLocations array, we should only have the first to locations specified on var locations, because they are inside the area defined by the polygon.

## Author ##
@paubenetprat. Thanks to @badchoice.
