var Orbiter = Object.create( SimObject );

Orbiter.build = function( _name, _position, _faction ) {
    this.init( _name, _faction );
    
/*     var steering = Object.create( Steering );
    steering.init( this );
    this.steering = steering; */
    
    var dynamics = Object.create( Dynamics );
    var params = { max_alt: 410000, min_alt: 400000, max_speed: 0, max_turn_rate: 0, max_alt_rate: 10 }
    dynamics.init( this, params, _position );    
    this.dynamics = dynamics;
    
    var graphics = Object.create( Graphics );
    graphics.init( this, "#0027ff", 7 );
    this.addComponent( graphics );

    var sm = Object.create( StateMachine );
    sm.init( this );
    this.stateMachine = sm;    
    
    var container = Object.create( Container );
    container.build( this, "Drone Hangar" );
    this.addComponent( container );
    
    var sensor1 = Object.create( Sensor );
    var sensorParams = { range: 600 };
    sensor1.build( this, Sensor.types.RADAR, sensorParams );
    this.addComponent( sensor1 );

    var sensor2 = Object.create( Sensor );
    var sensorParams = { max_depth: 20 };
    sensor2.build( this, Sensor.types.HYPERSPECTRAL, sensorParams );
    this.addComponent( sensor2 );
    //hyperspectral imaging -> surface bio and atm.
    //radar -> seafloor mapping, low res

/*    var motor = Object.create( Motor );
    motor.build( this, "RKT", 7639, 100, 10 );
    this.addComponent( motor ); */   
};
