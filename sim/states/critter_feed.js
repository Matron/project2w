var CritterFeed = {
    name: "Critter feed",
    
    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );          
    },
    
    execute: function( _simObject ) {  
        var noise = Math.random();
        if ( noise > 0.95) { 
            _simObject.noise = noise;
        } else {
            _simObject.noise = 0;
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