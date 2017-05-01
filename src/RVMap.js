class RVMap {
    constructor(mapId, config, initPolygon){
        this.mapId  = mapId;
        this.config = config ? config : this.defaultConfig();
        this.markers = [];
        this.initMap();

        if (initPolygon) {
            this.setPolygon(new RVPolygon());
            this.drawPolygon();
        }
    }

    initMap() {
        this.map = new google.maps.Map(this.mapId, this.config);
    }

    defaultConfig() {
        return {
            zoom: 5,
            center: {lat: 24.886, lng: -70.268},
            mapTypeId: 'terrain'
        }
    }

    setPolygon(polygon) {
        this.polygon = polygon;
    }

    drawPolygon(){
        this.polygon.drawOnMap(this.map);
        this.addCoordinateClickListner();
    }

    addCoordinateClickListner() {
        var self = this;
        this.map.addListener('click', function(e) {
            var latLng = self.getLatLang(e);
            self.addMarker(latLng);
            self.polygon.addCoordinate(latLng);
            self.polygon.update();
        });
    }

    addMarker(latLng) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: 'Hello World!'
        });

        var self = this;
        google.maps.event.addListener(marker, 'click', function(e) {
            self.removeMarker(self, marker, e);
        })

        this.markers.push(marker)
    }

    removeMarker(self, marker, e) {
        marker.setMap(null)
        self.markers.pop(marker);
        self.polygon.removeCoordinate(self.getLatLang(e));
        self.polygon.update();
    }

    filterInZone(polygon, locations) {
        var self = this;
        return locations.filter( function(location){
            return self.inside(location, Object.values(polygon.coordinates));
        });

    }

    inside(point, vs) {
        var x = point['lat'], y = point['lng'];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i]['lat'], yi = vs[i]['lng'];
            var xj = vs[j]['lat'], yj = vs[j]['lng'];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    getLatLang(e) {
        return {"lat": e.latLng.lat(), "lng": e.latLng.lng()};
    }
}

class RVPolygon {
    constructor(coordinates, config){
        this.coordinates = {};
        this.parseCoordinates(coordinates);
        this.config = config ? config : this.defaultConfig();
        this.init()
    }

    init() {
        var config      = this.config;
        config['paths'] = Object.values(this.coordinates);
        this.poligon = new google.maps.Polygon(config);
    }

    drawOnMap(map) {
        this.map = map;
        this.update();
    }

    update(){
        this.poligon.setMap(null)        
        this.init();
        this.poligon.setMap(this.map);     
    }

    defaultConfig() {
        return {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        }
    }

    parseCoordinates(coordinates) {
        var self = this;
        coordinates = coordinates ? coordinates : [];
        coordinates.map(function(coordinate) {
            self.addCoordinate(coordinate);
        })
    }

    addCoordinate(coordinate) {
        this.coordinates[this.getCoordinateKey(coordinate)] = coordinate;
    }

    removeCoordinate(coordinate) {
        delete this.coordinates[this.getCoordinateKey(coordinate)];
    }

    getCoordinateKey(coordinate) {
        return "{lat:" + coordinate['lat'].toFixed(2) + ",lng:" + coordinate["lng"].toFixed(2) + "}";
    }
}
