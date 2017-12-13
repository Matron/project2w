var StateScanForResources = {
    name: "Scan for resources",
    
    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );          
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