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
        var pitch = (Math.atan( _simObject.dynamics.position.alt / dist ) * 180 / Math.PI) * -1;
        console.log( "pitch: " + pitch);
        _simObject.dynamics.setPitch( pitch );
        _simObject.dynamics.setHeading( _simObject.dynamics.position.calculateBearing( _simObject.destination ), 50 );   
        
        if ( dist < 5 && _simObject.dynamics.position.alt < 5) {
            console.log("landed");
            _simObject.dynamics.setPitch( 0 );
            _simObject.dynamics.position.alt = 0;
            _simObject.dynamics.acceleration = 0;
            _simObject.dynamics.speed = 0;
            _simObject.stateMachine.revertToPreviousState();

            console.log("ended at " + (_simObject.dynamics.position.lon - _simObject.destination.lon).toFixed(4) +
            " : " + (_simObject.dynamics.position.lat - _simObject.destination.lat).toFixed(4) + " dist " + dist );
        }
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
