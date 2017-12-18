var SimObject = {

    init: function( _name, _faction ) {
        this.name = _name;      
        this.faction = _faction;  
        this.components = new Array();
        this.parentObject = null;
        this.stateMachine = null;
        this.dynamics = null;
        this.destination = null;
        this.noise = 0;
    }, 
    
    update: function( _elapsed ) {
        //update sensors
        if (this.hasComponent( Sensor )) {
            this.hasComponent( Sensor ).update();
        }

        //update state
        if (this.stateMachine) this.stateMachine.update();
        
        //update dynamics     
        if (this.dynamics && this.parentObject === null) this.dynamics.update( _elapsed );
    },

    handleMessage: function( _message ) {
        if (this.stateMachine) {
            return this.stateMachine.handleMessage( _message );
        }
        return false;
    },
            
    addComponent: function( _component ) {
        this.components.push( _component );
    },  
    
    hasComponent: function( _type ) {
        for (var i=0; i < this.components.length; i++) {
            if (_type.isPrototypeOf( this.components[i] )) {
                return this.components[i];
            }
        }
    }
};
