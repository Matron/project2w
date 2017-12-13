var StateDeorbit = {
    name: "Deorbit",
    dist: 0,
    acceleration: 0,
    //time: 0,
    descentRate: 0,
    desiredSpeed: 0,
    braking: false,
    landing: false,

    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );  
        this.desiredSpeed = 0;
        this.braking = false;
        this.landing = false;

        //initial descent
        //this.dist = _simObject.dynamics.position.calculateDistance( _simObject.destination );
        //this.acceleration = (50 - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
        //this.time = ( 50 - _simObject.dynamics.speed ) / Math.abs(this.acceleration);                
        //this.descentRate = _simObject.dynamics.position.alt / this.time;                      
        //_simObject.dynamics.setAltitude( 50, this.descentRate);
    },
    
    execute: function( _simObject ) {       
        
        this.dist = _simObject.dynamics.position.calculateDistance( _simObject.destination );               
        
        //check for start of deceleration
        if ( !this.braking ) {                
            this.acceleration = (this.desiredSpeed - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
            if ( Math.abs(this.acceleration) > _simObject.dynamics.max_acceleration ) {
                _simObject.dynamics.setSpeed( this.desiredSpeed, this.acceleration );  
                this.braking = true;
                console.log("braking to " + this.desiredSpeed + "m/s " + this.acceleration);
            }
        }               

/*         //landing phase
        if (this.dist < 1000) {                                    
            if (!this.landing) {
                this.acceleration = (10 - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
                if (this.acceleration > -0.5) this.acceleration = -0.5            
                _simObject.dynamics.setSpeed( 10, this.acceleration );      
                console.log("landing");                
                this.landing = true;            
            }
        }*/
        
        //if ( _simObject.dynamics.position.alt == 0) _simObject.stateMachine.revertToPreviousState();
        
        if ( this.dist < 5 ) {            
            _simObject.dynamics.setSpeed( 0, -0.4 );
            _simObject.dynamics.position.alt = 0;
            console.log("ended at " + (_simObject.dynamics.position.lon - _simObject.destination.lon).toFixed(4) +
                        " : " + (_simObject.dynamics.position.lat - _simObject.destination.lat).toFixed(4) + " dist " + this.dist );
            _simObject.stateMachine.revertToPreviousState();
        }

        //var eta = ( this._simObject.dynamics.desiredSpeed - _simObject.dynamics.speed ) / Math.abs(_simObject.dynamics.acceleration);
        _simObject.dynamics.setHeading( _simObject.dynamics.position.calculateBearing( _simObject.destination ) );                   
    },
        
    exit: function( _simObject ) {
        console.log( _simObject.name + " exit state: " + this.name );        
    },
        
    onMessage: function( _message ) {
        switch( _message.text ) {

        }         
        return false;       
    }
};