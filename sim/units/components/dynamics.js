//https://www.grc.nasa.gov/www/k-12/airplane/short.html
var Dynamics = {
    init: function( _parentObject, _params, _position ) {
        this.parentObject = _parentObject;     
                
        //constants defined by hull
        this.MAX_ALT = _params.max_alt;
        this.MIN_ALT = _params.min_alt;
        this.AGILITY = _params.agility;
        this.HULL_DRAG = _params.hull_drag; 
        this.MASS = _params.mass;

        //constants defined by motor
        this.MAX_THRUST = _params.max_thrust;                

        //target values set by autocontrol
        this.desiredSpeed = 0;
        this.desiredAltitude = 0;
        this.desiredHeading = -1;        

        //dynamics (calculated on update:)  
        this.thrust = 0;   
        this.acceleration = 0;
        this.speed = 0;           
        this.verticalSpeed = 0;
        this.horizontalSpeed = 0;
        this.turnRate = 0;  
        this.pitch = 0;                
        this.position = _position;
    },
    
    update: function( _elapsed ) {

        // => gives this.speed
        if (this.parentObject.stateMachine.currentState !== StateDeorbit) {            
            this.acceleration = ( this.thrust - (this.HULL_DRAG * this.speed * this.speed )) / this.MASS;                    
        }
        if (this.acceleration !== 0) {             
            this.speed += this.acceleration * (_elapsed / 1000);
            if (this.speed < 0) {
                this.speed = 0;
                this.acceleration = 0;
            }
        }

        // => gives this.position.alt
        this.verticalSpeed  = this.speed * Math.sin( this.pitch * Math.PI/180 );
        if (this.verticalSpeed !== 0) {  
            this.horizontalSpeed = this.speed * Math.cos( this.pitch * Math.PI/180 );      
            
            this.position.alt += this.verticalSpeed + (_elapsed / 1000);
            if (this.position.alt > this.MAX_ALT && this.parentObject.stateMachine.currentState !== StateDeorbit) {
                this.position.alt = this.MAX_ALT;
                this.verticalSpeed = 0;
                this.pitch = 0;
            }
            if (this.position.alt < this.MIN_ALT) {
                this.position.alt = this.MIN_ALT;
                this.verticalSpeed = 0;
                this.pitch = 0;
            }
        } else {
            this.horizontalSpeed = this.speed;
        }
    
        // => gives this.position.hdg
        if (this.turnRate !== 0) {            
            this.position.hdg += this.turnRate * (_elapsed / 1000);
            this.position.hdg = Math.round((this.position.hdg + 360 ) % 360);
            if (this.desiredHeading > 0 && Math.abs( this.desiredHeading - this.position.hdg ) < Math.abs(this.turnRate * (_elapsed / 1000)) ) {
                this.position.hdg = this.desiredHeading;
                this.turnRate = 0;
                this.desiredHeading = -1;
            }        
        }

        // => gives this.position.lat and lon
        if (this.horizontalSpeed > 0) this.position = this.position.addDistance( this.horizontalSpeed *_elapsed / 1000 );
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
        
    setHeading: function( _heading, _turnControlInput ) {
        this.desiredHeading = _heading;
        if (this.desiredHeading > (this.position.hdg + 180) || this.desiredHeading < this.position.hdg) {
            this.setTurn( _turnControlInput * -1);
        } else {
            this.setTurn( _turnControlInput );
        }        
    },


    //manual input commands----------------------------------------------------
    
    // 0 to 100%
    // acceleration must depend on engine power, hull drag and environment
    setPower: function( _powerControlInput ) { 
        this.thrust = _powerControlInput * this.MAX_THRUST / 100;        
    },

    // -90 to 90
    //refactor - change for pitchControlInput and agility instead of setting pitch directly
    setPitch: function( _pitch ) {
        this.pitch = _pitch;        
    },

    // 0 to 100% of agility
    // velocity of change depends on applied control force, hull specs and environment    
    setTurn: function( _turnControlInput ) {        
        this.turnRate = _turnControlInput * this.AGILITY / 100;
    },    
}
