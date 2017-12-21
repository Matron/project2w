var World = {
    sectors: new Array(),    

    init: function() {
        //refactor -- add algorithm for generating bio and other properties of each sector
        for ( var lon = 0; lon < 360; lon++ ) {
            this.sectors[lon] = new Array();
            for ( var lat = 0; lat < 180; lat++ ) {                
                this.sectors[lon][lat] = { bioValue: Math.floor( Math.random() * 100 ),
                                           bioLastValueMapped: -1,
                                           depth: Math.floor( Math.random() * 15000 ) + 1000 * -1
                                          };
            }                                           
        }
    }
}