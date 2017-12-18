var Critter = Object.create( SimObject );

Critter.build = function( _name, _position, _faction ) {
    this.init( _name, _faction );
    
    var params = { max_alt: 0,
                   min_alt: -500,
                   agility: 10,
                   mass: 150,
                   hull_drag: 10,
                   max_thrust: 100
                };
    var dynamics = Object.create( Dynamics );                   
    dynamics.init( this, params, _position );
    this.dynamics = dynamics;
    
    var graphics = Object.create( Graphics );
    graphics.init( this, "#1c5a23", 5 );
    this.addComponent( graphics );

    var sensor1 = Object.create( Sensor );
    var sensorParams = { range: 15000 };
    sensor1.build( this, Sensor.types.SONAR, sensorParams );
    this.addComponent( sensor1 );

    var sm = Object.create( StateMachine );
    sm.init( this );
    this.stateMachine = sm;
};