var StateDroneDeploy = {
    name: "Drone deploy",
    
    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );  
        if ( _simObject.dynamics.position.alt > 100000 ) {  //refactor - should not be hardcoded               
            _simObject.stateMachine.changeState( StateDeorbit );
        } else if ( _simObject.dynamics.position.alt > _simObject.destination.alt ) {
            _simObject.stateMachine.changeState( StateDive );
        } else if ( _simObject.dynamics.position.alt === _simObject.destination.alt ) {
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
    }
};