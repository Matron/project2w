//refactor - do we need more than one? if not, TacticArea = World
var TacticArea = {
    //objects
    //environment   --> resources, conditions affecting sensors
    //map           --> depth
    corner_tl: new GeoLocation(), //size is 5 * 5 degrees
    name: "",
    side: 5, //size of the area side in degrees
    //mapData: {x: 0, y: 0, width: 0, height: 0 },

    init: function( _pos, _name, _side ) {
        //create objects and environment (variable)
        //map comes from...
        this.corner_tl = _pos;
        this.name = _name;
        this.side = _side;
    }
}