var StateInContainer = {
    name: "In Container",
    
    enter: function( _simObject ) {
        console.log(  _simObject.name +  " enter state " + this.name );
    },
    
    execute: function( _simObject ) {
        
    },
    
    exit: function( _simObject ) {
        console.log( _simObject.name + " exit state: " + this.name );    
        _simObject.dynamics.speed = _simObject.parentObject.dynamics.speed;
        _simObject.dynamics.position = _simObject.parentObject.dynamics.position;
        _simObject.parentObject.hasComponent( Container ).removeObject( _simObject );   
    },
        
    onMessage: function( _message ) {
        switch( _message.text ) {
            case "Launch":
                console.log("Message received by " + _message.receiver.name + " from " + _message.sender.name + ": " + _message.text );
                
                //refactor - check if enough distance to decelerate
                _message.receiver.stateMachine.changeState( StateDroneDeploy );                                            
                return true;
                break;
               
        }
        
        return false;
    }
};