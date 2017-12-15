//refactor - do we need more than one? if not, Sector = World
var Sector = {
    //objects
    //environment   --> resources, conditions affecting sensors
    //map           --> depth
    corner_tl: new GeoLocation(), //size is 5 * 5 degrees
    name: "",
    side: 5, //size of the sector side in degrees

    init: function( _pos, _name, _side ) {
        //create objects and environment (variable)
        //map comes from...
        this.corner_tl = _pos;
        this.name = _name;
        this.side = _side;
    }
}