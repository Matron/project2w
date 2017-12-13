var StateMachine = {
    
    init: function( _simObject ) {
        this.simObject = _simObject;
        this.globalState = StateGlobal;
        this.currentState = null;
        this.previousState = null;
    },
    
    update: function() {
        if (this.globalState) this.globalState.execute( this.simObject );
        
        if (this.currentState) this.currentState.execute( this.simObject );    
    },

    changeState: function( _state ) {
        if (_state && this.simObject) {                   
            if (this.currentState) {
                this.previousState = this.currentState;
                this.currentState.exit( this.simObject );
            } 
            
            this.currentState = _state;
            
            this.currentState.enter( this.simObject );
        }
    },

    revertToPreviousState: function() {
        this.changeState( this.previousState );
    },

    handleMessage: function( _message ) {
        if (this.currentState && this.currentState.onMessage( _message )) {
            return true;
        }
        if (this.globalState && this.globalState.onMessage( _message )) {
            return true;
        }        
        return false;
    }
};