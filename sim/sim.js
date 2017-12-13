// implement singleton?
var Sim = {
    simObjects: new Array(),
    //refactor -- esta bien esto??
    detectedObjects: new Array(),
    sectors: new Array(),
    
    //do we need to pass _elapsed?
    update: function( _elapsed ) {   
        this.detectedObjects = [];
        this.simObjects.forEach( so => so.update( _elapsed ));
    },
    
    load: function( _scenarioName ) {
        //refactor
        //add switch for loading different scenarios
        
        var orbiter = Object.create( Orbiter );
        var pos = new GeoLocation( 0, 0 );        
        orbiter.build( "Orbiter", pos, "player");      
        orbiter.stateMachine.changeState( StateOrbit );
        this.simObjects.push( orbiter );
        
        var drone = Object.create( Drone);   
        var pos = new GeoLocation( -35.8669, -36.1666, 0, 0);
        drone.build( "Drone D", pos, "player" );
        drone.stateMachine.changeState( StateScanForResources);
        //orbiter.hasComponent( Container ).addObject( drone);        
        this.simObjects.push( drone );            
        var ps = new GeoLocation( -30.8669, -41.1666 );
        this.createSector( ps, "Sector 1", 10 );

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
            var pos = new GeoLocation( Math.random() * (-40 +30) -30,
                                       Math.random() * (-40 +30) -30,
                                       Math.floor(Math.random() * (-500 +100) -100));
            crt.build( "crt" + (i+1), pos, "neutral" );
            crt.stateMachine.changeState( CritterFeed );
            this.simObjects.push( crt );                    
        };
    },

    createSector: function( _corner, _name, _side ) {
        var sector = Object.create( Sector );
        sector.init( _corner, _name, _side );
        this.sectors.push( sector );
    }
};
