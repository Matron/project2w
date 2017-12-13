var StateDive = {
    name: "Dive",
    
    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );  
        _simObject.dynamics.setAltitude( _simObject.destination.alt, -3 );
    },
    
    execute: function( _simObject ) {       
        if ( _simObject.dynamics.position.alt == _simObject.dynamics.desiredAltitude ) {
            _simObject.stateMachine.revertToPreviousState();
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