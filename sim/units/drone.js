var Drone = Object.create( SimObject );

Drone.build = function( _name, _position, _faction ) {
    this.init( _name, _faction );
        
    var params = { max_alt: 0,
                   min_alt: -300,
                   agility: 5,
                   mass: 2000,
                   hull_drag: 10,
                   max_thrust: 3800 }; //https://en.wikipedia.org/wiki/Power_Jets_W.1

    var dynamics = Object.create( Dynamics );                   
    dynamics.init( this, params, _position );
    this.dynamics = dynamics;
    
    var graphics = Object.create( Graphics );
    graphics.init( this, "#0027ff", 10 );
    this.addComponent( graphics );

    var sensor1 = Object.create( Sensor );
    var sensorParams = { range: 350000 };
    sensor1.build( this, Sensor.types.SONAR, sensorParams );
    this.addComponent( sensor1 );

    var sm = Object.create( StateMachine );
    sm.init( this );
    this.stateMachine = sm;
};