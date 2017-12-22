// implement singleton?
var Sim = {
    simObjects: new Array(),

    //refactor -- esta bien esto?? usado en tactical page para dibujar simobjects detectados
    detectedObjects: new Array(),
    
    //refactor -- no va al world?
    tacticAreas: new Array(),    

    world: null,

    update: function( _elapsed ) {   
        this.detectedObjects = [];
        this.simObjects.forEach( so => so.update( _elapsed ));
    },
    
    load: function( _scenarioName ) {
        //refactor -- load specific scenario from parameter

        this.createWorld();

        this.createObjects();

        //this.createTacticAreas();
    },

    createWorld: function() {
        this.world = Object.create( World );
        this.world.init();
    },

    createObjects: function() {
        var orbiter = Object.create( Orbiter );
        var pos = new GeoLocation( -79, 0 );        
        orbiter.build( "Orbiter", pos, "player");      
        orbiter.stateMachine.changeState( StateOrbit );
        this.simObjects.push( orbiter );
        
        var drone = Object.create( Drone);   
        var pos = new GeoLocation( -35.8669, -36.1666, 0, 0);
        drone.build( "Drone D", pos, "player" );
        drone.stateMachine.changeState( StateScanForResources);    
        this.simObjects.push( drone );            
        var ps = new GeoLocation( -33.3669, -38.6666 );
        this.createTacticArea( ps, "Area 1", 5 );

        var drone1 = Object.create( Drone);  
        var pos = new GeoLocation();
        drone1.build( "Drone 1", pos, "player" );
        drone1.stateMachine.changeState( StateInContainer );
        orbiter.hasComponent( Container ).addObject( drone1);        
        this.simObjects.push( drone1 );  

        var drone2 = Object.create( Drone);  
        var pos = new GeoLocation();
        drone2.build( "Drone 2", pos, "player" );
        drone2.stateMachine.changeState( StateInContainer );
        orbiter.hasComponent( Container ).addObject( drone2);        
        this.simObjects.push( drone2 );

        for ( var i = 0; i < 5; i++) {
            var crt = Object.create( Critter );
            var pos = new GeoLocation( Math.random() * (-37.5 +32.5) -32.5,
                                       Math.random() * (-37.5 +32.5) -32.5,
                                       Math.floor(Math.random() * (-500 +100) -100));
            crt.build( "crt" + (i+1), pos, "neutral" );
            crt.stateMachine.changeState( CritterFeed );
            this.simObjects.push( crt );                    
        };
    },

    createTacticArea: function( _corner, _name, _side ) {
        var tacticArea = Object.create( TacticArea );
        tacticArea.init( _corner, _name, _side );
        this.tacticAreas.push( tacticArea );
    }
};
