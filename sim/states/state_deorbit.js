var StateDeorbit = {
    name: "Deorbit",
    dist: 0,
    acceleration: 0,
    time: 0,
    descentRate: 0,
    braking: false,
    landing: false,

    enter: function( _simObject ) {
        console.log( _simObject.name + " enter state: " + this.name );  
        
        //initial descent
        this.dist = _simObject.dynamics.position.calculateDistance( _simObject.destination );
        this.acceleration = (50 - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
        this.time = ( 50 - _simObject.dynamics.speed ) / Math.abs(this.acceleration);                
        this.descentRate = _simObject.dynamics.position.alt / this.time;                      
        _simObject.dynamics.setAltitude( 50, this.descentRate);
    },
    
    execute: function( _simObject ) {       
        
        this.dist = _simObject.dynamics.position.calculateDistance( _simObject.destination );       
        var hdg = _simObject.dynamics.position.calculateBearing( _simObject.destination );
        _simObject.dynamics.setHeading( hdg );                   

        if (!this.landing) {      
            this.time = ( 50 - _simObject.dynamics.speed ) / Math.abs(this.acceleration);
            this.acceleration = (50 - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
            
            //start braking
            if ( !this.braking ) {                
                if ( Math.abs(this.acceleration) > _simObject.dynamics.max_acceleration ) {
                    _simObject.dynamics.setSpeed( 50, this.acceleration );  
                    this.descentRate = _simObject.dynamics.position.alt / this.time;                          
                    _simObject.dynamics.setAltitude( 50, this.descentRate);
                    this.braking = true;
                    console.log("braking");
                }
            }       
        }

        //landing phase
        if (this.dist < 1000) {                                    
            if (!this.landing) {
                this.acceleration = (10 - (_simObject.dynamics.speed * _simObject.dynamics.speed)) / (2 * this.dist);
                if (this.acceleration > -0.5) this.acceleration = -0.5            
                _simObject.dynamics.setSpeed( 10, this.acceleration );      
                console.log("landing");                
                this.landing = true;            
            }
        }

        if ( this.dist < 5){
            _simObject.dynamics.setAltitude( 0, -5 ); 
            _simObject.dynamics.setSpeed( 0, -0.5);
        } 
        
        if ( _simObject.dynamics.position.alt == 0) _simObject.stateMachine.revertToPreviousState();
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