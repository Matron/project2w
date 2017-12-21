var StateDroneDeploy = {
    name: "Drone deploy",
    
    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );  
        if ( _simObject.dynamics.position.alt > 100000 ) {  //refactor - should not be hardcoded               
            _simObject.stateMachine.changeState( StateDeorbit );
        } else if ( _simObject.dynamics.position.alt > _simObject.destination.alt ) {
            //refactor -- improve this
            if (_simObject.dynamics.position.alt === 0) this.createArea( _simObject );
            _simObject.stateMachine.changeState( StateDive );
        } else if ( _simObject.dynamics.position.alt === _simObject.destination.alt ) {
            _simObject.destination = null;
            _simObject.stateMachine.changeState( StateScanForResources );
        }
    },
    
    execute: function( _simObject ) {     

    },
        
    exit: function( _simObject ) {
        console.log( _simObject.name + " exit state: " + this.name );
    },
        
    onMessage: function( _message ) {
        switch( _message.text ) {

        }         
        return false;       
    },

    createArea: function( _simObject ) {
        var pos = new GeoLocation( _simObject.dynamics.position.lat + 2.5,
                                   _simObject.dynamics.position.lon - 2.5 );
        Sim.createTacticArea( pos, "Area " + _simObject.name, 5 );        
    }
};