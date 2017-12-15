//https://www.grc.nasa.gov/www/k-12/airplane/short.html
var Dynamics = {
    init: function( _parentObject, _params, _position, _speed ) {
        this.parentObject = _parentObject;     
                
        //defined by hull
        this.MAX_ALT = _params.max_alt;
        this.MIN_ALT = _params.min_alt;
        //this.max_speed = _params.max_speed; ????
        this.MAX_TURN_RATE = _params.max_turn_rate;
        this.HULL_DRAG = _params.hull_drag; 
        this.MASS = _params.mass;

        //defined by motor
        this.MAX_THRUST = _params.max_thrust;                

        //set by autocontrol
        this.desiredSpeed = 0;
        this.desiredAltitude = 0;
        this.desiredHeading = 0;        

        //dynamics (calculated on update:)   
        this.power = 0;
        this.thrust = 0;   
        this.acceleration = 0;  
        this.verticalSpeed = 0;
        this.turnRate = 0;                  

        //wanted updated values ----------------------
        this.position = _position;       
        _speed ? this.speed = _speed : this.speed = 0;                     
        //-------------------------------------------- 
    },
    
    update: function( _elapsed ) {

        this.acceleration = ( this.thrust - (this.HULL_DRAG * this.speed * this.speed )) / this.MASS;                        
        if (this.acceleration !== 0) {
            // => gives this.speed 
            this.speed += this.acceleration * (_elapsed / 1000);
        }

        if (this.verticalSpeed !== 0) {
            // => gives this.position.alt
        }

        if (this.turnRate !== 0) {
            // => gives this.position.hdg
            this.position.hdg += this.turnRate * (_elapsed / 1000);
            this.position.hdg = Math.round((this.position.hdg + 360 ) % 360);
            console.log("heading " + this.position.hdg);
        }

        //final output ---------------
        if (this.speed > 0) this.position = this.position.addDistance( this.speed *_elapsed / 1000 );
        // => this.position.alt = alt;
        // => this.position.hdg = hdg; 
    },
    

    //autocontrol commands-----------------------------------------------------

    setSpeed: function( _speed ) {        
        this.desiredSpeed = _speed;
        // => this.setPower( power );
    },
    
    setAltitude: function( _altitude ) {
        this.desiredAltitude = _altitude;        
        // => this.setPitch( pitch );
    },
        
    setHeading: function( _heading ) {
        this.desiredHeading = _heading;
        // => this.setTurn( turn );
    },


    //manual input commands----------------------------------------------------

    // 0 to 100%
    // acceleration must depend on engine power, hull drag and environment
    setPower: function( _power ) { 
        this.power = _power;
        this.thrust = this.MAX_THRUST * _power / 100;        
    },

    // -90 to 90
    setPitch: function( _pitch ) {
        // => this.verticalSpeed = 
    },

    // 0 to 100% of max_turn_rate
    // velocity of change depends on applied control force, hull specs and environment    
    setTurn: function( _turnRate ) {
        this.turnRate = this.MAX_TURN_RATE * _turnRate / 100;
        console.log( this.parentObject.name + " turn at " + this.turnRate );
    },    
}
