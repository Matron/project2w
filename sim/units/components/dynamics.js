var Dynamics = {
    init: function( _parentObject, _params, _position ) {
        this.parentObject = _parentObject;     
        
        this.max_alt = _params.max_alt;
        this.min_alt = _params.min_alt;
        this.max_speed = _params.max_speed;
        this.max_acceleration = _params.max_acceleration;
        this.max_alt_rate = _params.max_alt_rate;                                
        this.position = _position;

        this.power = 0; //0 - 100%
        this.speed = 0;        
        this.acceleration = 0;
        this.altitude_rate = 0;
        this.desiredAltitude = this.position.alt;

    },
    
    update: function( _elapsed ) {
        
        //refactor -- take engine into account
        if (this.acceleration != 0) {
            this.speed = this.speed + ( this.acceleration * (_elapsed / 1000) );
            if ( Math.abs( this.desiredSpeed - this.speed ) < Math.abs(this.acceleration * 10) ) {              
                this.acceleration = this.acceleration * 0.6;                     
                console.log("set acceleration " + this.acceleration.toFixed(2) + " speed " + this.speed);                
            }   
            if ( Math.abs(this.acceleration) < 0.5 || this.speed < 0) {
                this.acceleration = 0;
                this.speed = 0;
                console.log("stopped");
            }             
        }

        if (this.speed > 0) this.position = this.position.addDistance( _elapsed / 1000 * this.speed );  

        if (this.altitude_rate != 0) {    
            this.position.alt = this.position.alt + ( this.altitude_rate * (_elapsed / 1000) );
            //refactor: add gradual change in altitude rate
            if ( Math.abs(this.desiredAltitude - this.position.alt) < Math.abs(this.altitude_rate)) {                                
                console.log( "---set desired altitude of " + this.desiredAltitude + " from " + this.position.alt );
                this.position.alt = this.desiredAltitude;
                this.altitude_rate = 0;                
            }
        }
    },
    
    setHeading: function( _heading ) {
        //refactor - use max_turn_rate to move to new heading
        this.position.hdg = _heading;
    },
    
    setPower: function( _power ) {
        
    },
    
    setSpeed: function( _speed, _acceleration ) {
        this.desiredSpeed = _speed;
        if (_acceleration > this.max_acceleration) {
            this.acceleration = this.max_acceleration;
        } else {
            this.acceleration = _acceleration;
        }
    },
    
    setAltitude: function( _altitude, _rate ) {
        this.desiredAltitude = _altitude;
        if (this.desiredAltitude < this.min_alt) this.desiredAltitude = this.min_alt;
        if ( _rate ) {
            this.altitude_rate = _rate;
        } else {
            if ( _altitude > this.position.alt ) {
                this.altitude_rate = this.max_alt_rate;
            } else {
                this.altitude_rate = this.max_alt_rate * -1;
            }
        }
    }
}