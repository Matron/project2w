var StateOrbit = {
    name: "Orbit",
    
    enter: function( _simObject ) {
        console.log( _simObject.name +  " enter state " + this.name + " at " + Date.now() );
        
        _simObject.dynamics.speed = 7639;
        //refactor - should i use setAltitude?
        _simObject.dynamics.position.alt = 406400;
        _simObject.dynamics.desiredAltitude = 406400;
        _simObject.dynamics.position.hdg = 90;
 
    },
    
    execute: function( _simObject ) {        

    },
    
    exit: function( _simObject ) {
        console.log( _simObject.name + " exit state " + this.name );
    },
    
    onMessage: function( _message ) {
        return false;
    }
};