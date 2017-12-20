var World = {
    sectors: new Array(),
    layerBio: null,

    init: function() {
        
        for ( var lon = 0; lon < 360; lon++ ) {
            this.sectors[lon] = new Array();
            for ( var lat = 0; lat < 180; lat++ ) {                
                this.sectors[lon][lat] = { bioValue: Math.random(), bioColor: null}                                         
            }                                               
        }
    }
}