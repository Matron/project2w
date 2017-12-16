var StateDeorbit = {
    name: "Deorbit",

    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );          
        _simObject.dynamics.setSpeed( 0 );        
        _simObject.dynamics.setAltitude( 0 );        
    },
    
    execute: function( _simObject ) {       
        var dist = _simObject.dynamics.position.calculateDistance( _simObject.destination ); 
        _simObject.dynamics.acceleration = (_simObject.dynamics.desiredSpeed - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * dist);
        _simObject.dynamics.setHeading( _simObject.dynamics.position.calculateBearing( _simObject.destination ), 50 );

        /* this.dist = _simObject.dynamics.position.calculateDistance( _simObject.destination );               
        this.time = this.dist / _simObject.dynamics.speed;
        this.descentRate = _simObject.dynamics.position.alt / this.time * -1 ;
        
        _simObject.dynamics.setAltitude( this.desiredAltitude, this.descentRate );        
        
        //check for start of deceleration        
        if ( _simObject.dynamics.acceleration === 0 ) {
            this.acceleration = (this.desiredSpeed - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
            if ( Math.abs(this.acceleration) > _simObject.dynamics.max_acceleration ) {
                _simObject.dynamics.setSpeed( this.desiredSpeed, this.acceleration );  
                console.log(_simObject.name + " started braking at " + this.acceleration );
            }                       
        }
        
        if ( this.dist < 5 ) {            
            _simObject.dynamics.setSpeed( this.desiredSpeed, -0.4 );
            _simObject.dynamics.position.alt = 0;
            console.log("ended at " + (_simObject.dynamics.position.lon - _simObject.destination.lon).toFixed(4) +
                        " : " + (_simObject.dynamics.position.lat - _simObject.destination.lat).toFixed(4) + " dist " + this.dist );
            _simObject.stateMachine.revertToPreviousState();
        }
        
        _simObject.dynamics.setHeading( _simObject.dynamics.position.calculateBearing( _simObject.destination ) );                    */
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
