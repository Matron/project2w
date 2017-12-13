//this component gives the parentObject the ability to move
//applies force to the simObject
var Motor = {
    build: function( _parentObject, _name, _maxSpeed, _maxForce, _maxTurnRate ) {
        this.parentObject = _parentObject;
        this.name = _name;
        this.maxSpeed = _maxSpeed;
        this.maxForce = _maxForce;
        this.maxTurnRate = _maxTurnRate;
        this.operational = true;              
    },
    
    //refactor - do we need this?
    update: function() {
        //update force applied to object
    }
    
};