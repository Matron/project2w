//https://en.wikipedia.org/wiki/Remote_sensing
//https://www.google.com/search?q=space+satellite+oceanography&rlz=1C1GGRV_en__752__753&oq=space+satellite+oceanography&aqs=chrome..69i57.4911j0j4&sourceid=chrome&ie=UTF-8
//https://en.wikipedia.org/wiki/Seafloor_mapping
//https://manoa.hawaii.edu/exploringourfluidearth/physical/ocean-floor/seafloor-features

//hyperspectral -> from orbit -> bio(food) in surface
//              -> underwater -> oil and minerals

//radar -> from orbit -> low res seafloor mapping

//sonar (active / passive) -> bio
//                         -> hi res seafloor mapping
var Sensor = {
    types: {
        HYPERSPECTRAL: "Spectral",
        RADAR: "Radar",
        SONAR: "Sonar"
    },

    build: function( _parentObject, _type, _params ) {
        this.parentObject = _parentObject;
        this.type = _type;   
        this.range = _params.range;
        this.operational = true;
        this.active = false;    
        this.performingSpectralMapping = false; 
    },

    performSpectralMapping: function( _lon, _lat) {
        //map fp at low res (1 deg squares)
        //refactor - add sensor range
        //- add sensor sensitivity --(color value threshold to display on satellite view)
        for (var j = _lon - 10; j < _lon + 11; j++) {
            for (var i = _lat - 10; i < _lat + 11; i++) {
                //refactor - this is a color value, should be set by gui
                Sim.world.sectors[j][i].bioLastValueMapped = Math.floor( (Sim.world.sectors[j][i].bioValue * 255) / 100 );
            }    
        }
    },

    performOrbitalRadarMapping: function( _lon, _lat) {
        //map floor at low res (1 deg squares)
        for (var j = _lon - 10; j < _lon + 11; j++) {
            for (var i = _lat - 10; i < _lat + 11; i++) {
                var radarValue = Math.floor( (Sim.world.sectors[j][i].depthValue * 255) / 15000); //refactor -- for color code, max depth is 15000 on world.js               
                Sim.world.sectors[j][i].depthLastValueMapped = radarValue;
            }    
        }
    },

    checkSonarDetection: function() {
        Sim.simObjects.forEach( _simObject => {
            if ( this.parentObject !== _simObject ) {
                var dist = this.parentObject.dynamics.position.calculateDistance( _simObject.dynamics.position );
                var altDiff = Math.abs( this.parentObject.dynamics.position.alt - _simObject.dynamics.position.alt );
                if ( dist < this.range && altDiff < 1000 ) {   
                    if ( this.active ) {
                        Sim.detectedObjects.push( _simObject );
                        this.parentObject.contacts.push( { so: _simObject, dist: dist } );            
                    } else {
                        if ( _simObject.noise > 0 ) {
                            Sim.detectedObjects.push( _simObject );
                            this.parentObject.contacts.push( { so: _simObject, dist: dist } );            
                        }
                    }            
                }
            }
        })        
    },

    toggleSensor: function() {    
        if ( this.type === this.types.SONAR && this.parentObject.dynamics.position.alt <= 0 ) {
            this.active = !this.active;
            if (this.active) {
                this.parentObject.noise += 1;
            } else {
                this.parentObject.noise -= 1;
            }
        }

        if (this.type !== this.types.SONAR) {
            this.active = !this.active;
        }
    },

    showInfo: function() {
        console.log("Ssr " + this.type + " on " + this.parentObject.name);
    }
};
