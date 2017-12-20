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

    performSpectralMapping: function() {
        //map fp at low res (1 deg squares)
        //check current position in world array
        var lon = Math.floor( this.parentObject.dynamics.position.lon + 180 ),
            lat = ( Math.floor( this.parentObject.dynamics.position.lat - 90 ) * -1 );

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor( Sim.world[lon][lat].bioValue * 16)];
        }
        Sim.world[lon][lat].bioColor = color;
        console.log("Color " + Sim.world[lon][lat].bioColor);
    },

    performOrbitalRadarMapping: function() {
        //map floor at low res (1 deg squares)
        console.log( this.type + " on " + this.parentObject.name + " is performing orbital radar mapping");
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
