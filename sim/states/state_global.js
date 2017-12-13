var StateGlobal = {
    name: "global state",
    
    enter: function( _simObject ) {
    },
    
    execute: function( _simObject ) {
    },
        
    exit: function( _simObject ) {
    },
        
    onMessage: function( _message ) {
        switch( _message.text ) {
            case "Set Destination":
                console.log( "Message received by " + _message.receiver.name + 
                            " from " + _message.sender.name + ": " +
                            _message.text + " " + _message.data.toString());
                
                _message.receiver.destination = _message.data;
                return true;
                break; 
        }
         
        return false;       
    }
};