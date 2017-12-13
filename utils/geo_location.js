 //https://www.movable-type.co.uk/scripts/latlong.html
function GeoLocation( _lat, _lon, _alt, _hdg) {
    this.lat = (_lat === undefined) ? 0 : _lat;
    this.lon = (_lon === undefined) ? 0 : _lon;
    this.alt = (_alt === undefined) ? 0 : _alt;
    this.hdg = (_hdg === undefined) ? 0 : _hdg;
};

/**
 * Returns the destination point having travelled along a rhumb line from ‘this’ point the given
 * distance on the  given bearing.
 *
 * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
 * @param   {number} bearing - Bearing in degrees from north.
 * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
 * @returns {LatLon} Destination point.
 *
 * @example
 *     var p1 = new LatLon(51.127, 1.338);
 *     var p2 = p1.rhumbDestinationPoint(40300, 116.7); // 50.9642°N, 001.8530°E
 */
GeoLocation.prototype.addDistance = function( _distance ) {   
    var radius = 6371e3;
    var δ = _distance / radius; // angular distance in radians
    var φ1 = this.lat * Math.PI / 180;
        λ1 = this.lon * Math.PI / 180;
    var θ = this.hdg * Math.PI / 180;

    var Δφ = δ * Math.cos(θ);
    var φ2 = φ1 + Δφ;

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2;

    var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));
    var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

    var Δλ = δ*Math.sin(θ)/q;
    var λ2 = λ1 + Δλ;

    var dest = new GeoLocation();
    dest.lat = φ2 * 180 / Math.PI;
    dest.lon = ((λ2 * 180 / Math.PI) + 540) % 360 - 180;
    dest.alt = this.alt;
    dest.hdg = this.hdg
    return dest;
};

GeoLocation.prototype.calculateBearing =  function( _destination ) {
    
    var φ1 = this.lat * Math.PI / 180,
        φ2 = _destination.lat * Math.PI / 180;
    
    var Δλ = ( _destination.lon - this.lon ) * Math.PI / 180;   

    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Δλ >  Math.PI) Δλ -= 2*Math.PI;
    if (Δλ < -Math.PI) Δλ += 2*Math.PI;

    var Δψ = Math.log( Math.tan( φ2/2 + Math.PI/4 ) / Math.tan( φ1/2 + Math.PI/4 ));
    var θ = Math.atan2(Δλ, Δψ);

    return Math.round(((θ * (180 / Math.PI)) + 360 ) % 360);
};

GeoLocation.prototype.calculateDistance = function( _destination ) {
    
    var lat1 = this.lat;
    var lat2 = _destination.lat;
    var lon1 = this.lon;
    var lon2 = _destination.lon;

    var R = 6371e3; // metres --> this value is the radius of the geoid, affecting all calculations
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = φ2 - φ1;
    var Δλ = Math.abs( lon2 - lon1) * Math.PI / 180;

    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Δλ > Math.PI) Δλ -= 2*Math.PI;

    // on Mercator projection, longitude distances shrink by latitude; q is the 'stretch factor'
    // q becomes ill-conditioned along E-W line (0/0); use empirical tolerance to avoid it
    var Δψ = Math.log (Math.tan ( φ2/2 + Math.PI/4 ) / Math.tan( φ1/2 + Math.PI/4 ));
    var q = Math.abs( Δψ ) > 10e-12 ? Δφ/Δψ : Math.cos( φ1 );

    // distance is pythagoras on 'stretched' Mercator projection
    var δ = Math.sqrt( Δφ*Δφ + q*q*Δλ*Δλ ); // angular distance in radians
    var dist = δ * R;

    return dist; //meters
};