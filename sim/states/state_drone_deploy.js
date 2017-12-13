var StateDroneDeploy = {
    name: "Drone deploy",
    
    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );  
        if ( _simObject.dynamics.position.alt > 399999 ) {                              
            _simObject.stateMachine.changeState( StateDeorbit );
        }
    },
    
    execute: function( _simObject ) {        
        if ( _simObject.dynamics.position.alt === _simObject.destination.alt ) {
            _simObject.destination = null;
            _simObject.stateMachine.changeState( StateScanForResources); //refactor - should not be hardcoded
            return;
        }
        if ( _simObject.dynamics.position.alt == 0 && _simObject.destination.alt != 0) {
            //refactor -- is this the right place for creating new sector?
            var pos = new GeoLocation( _simObject.dynamics.position.lat + 5, 
                                       _simObject.dynamics.position.lon - 5 );
            Sim.createSector( pos, "Sector " + _simObject.name, 10 );
            _simObject.stateMachine.changeState( StateDive );
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