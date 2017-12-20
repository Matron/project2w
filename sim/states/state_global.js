var StateGlobal = {
    name: "global state",
    
    enter: function( _simObject ) {
    },
    
    execute: function( _simObject ) {
        
        //update sensors
        _simObject.contacts = new Array();       
        for (var i=0; i<_simObject.components.length; i++) {
            if ( Sensor.isPrototypeOf( _simObject.components[i] )) {
                var ssr = _simObject.components[i];
                if (ssr.operational) {
                    switch (ssr.type) {
                        case ssr.types.HYPERSPECTRAL:
            
                        break;
            
                        case ssr.types.RADAR:
                        
                        break;
            
                        case ssr.types.SONAR:
                            ssr.checkSonarDetection();
                        break;
                    }
                }
            }
        }
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