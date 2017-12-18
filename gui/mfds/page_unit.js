var PageUnit = {
    name: "Unit view",
    mfd: null,
    simObject: null,
    image: new Image(),
    //ready: false,    
    state: null,

    init: function( _simObject ) {
        this.simObject = _simObject;  
        this.sliders = new Array();         
        this.state = _simObject.stateMachine.currentState;
        this.drawControls();
        /* this.image.onload = () => { this.ready = true; };        
        this.image.src = _simObject.graphics.unitDiagram; */
    },

    draw: function( _context ) {      

        _context.clearRect( 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height );        
        _context.fillStyle = "#13cfdb";
        _context.fillText( "Time: " + Date.now(), 20, 20 );
        _context.fillText( "Page: " + this.name, 240, 20 );      

        this.buttons = new Array();       

        if (this.simObject) {
            if ( this.simObject.stateMachine.currentState !== this.state ) this.init( this.simObject );
            
            _context.fillText( "Unit: " + this.simObject.name, 420, 20 );
            if (this.simObject.stateMachine.currentState) 
                _context.fillText( this.simObject.stateMachine.currentState.name, 420, 40 );
            
/*             if (this.ready){
                _context.drawImage( this.image , 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height);
            } */

            this.drawDynamicData( _context );
            
            this.drawNavigationData( _context );

            if ( this.simObject.hasComponent( Container ) ) {
                this.drawContainer( _context );                
            }           

            this.drawSensors( _context );                       

            //refactor - for test only
            for (var i=0; i<this.simObject.contacts.length; i++) {
                _context.fillText( this.simObject.contacts[i].so.name + " D:" + 
                                   Math.round(this.simObject.contacts[i].dist), 300, 200 + (i*20) );
            }
            
            this.buttons.forEach( btn => btn.draw( _context ) );            
            this.sliders.forEach( sld => sld.draw( _context ) );  
        }
    },
    
    drawDynamicData: function( _context ) {
        _context.beginPath();
        _context.strokeStyle = "#13cfdb";
        _context.lineWidth = 1;
        _context.rect( 17, 60, 60, 250);
        _context.rect( 446, 60, 60, 250);
        _context.stroke();
        _context.closePath();

        _context.fillText( "Spd: " + Math.round(this.simObject.dynamics.speed), 20, 180 );
        _context.fillText( " HS: " + Math.round(this.simObject.dynamics.horizontalSpeed), 20, 200 );
        _context.fillText( "Acc: " + (this.simObject.dynamics.acceleration).toFixed(1), 20, 160 );
        _context.fillText( " Vs: " + Math.round(this.simObject.dynamics.verticalSpeed), 450, 160 );
        _context.fillText( "Pth: " + Math.round(this.simObject.dynamics.pitch), 450, 200 );
        _context.fillText( "Alt: " + Math.round(this.simObject.dynamics.position.alt), 450, 180 );
        _context.fillText( "Hdg: " + Math.round(this.simObject.dynamics.position.hdg), 230, 340 );
        _context.fillText( "Thrust: " + Math.round(this.simObject.dynamics.thrust), 275, 340 );
    },

    drawNavigationData: function( _context ) {
        if (this.simObject.destination) {
            var dist = this.simObject.dynamics.position.calculateDistance( this.simObject.destination )
            _context.fillText( "Rng: " + ( dist / 1000).toFixed(1), 20, 340 );

            var eta = dist / this.simObject.dynamics.speed;            
            _context.fillText( "ETE: " + Math.round(eta), 450, 340 );
        }

        _context.fillText( "Lon: " + this.simObject.dynamics.position.lon.toFixed(4) +
                          " Lat: " + this.simObject.dynamics.position.lat.toFixed(4),
                          20, 40);
    },

    drawContainer: function( _context ) {
        _context.beginPath();
        _context.strokeStyle = "#13cfdb";
        _context.lineWidth = 1;
        _context.rect( 120, 210, 300, 100);
        _context.stroke();
        _context.closePath();

        var cntr = this.simObject.hasComponent( Container )
        for (var i=0; i < cntr.simObjects.length; i++) {            
            var so = cntr.simObjects[i];
            var button = Object.create( Button );
            button.init( 135, 220 + (i*30),
                         so.name, so.destination ? "#00ff00" : "red",
                         cntr, cntr.launch( so ) );
            if (so.destination) 
                _context.fillText( so.destination.lon.toFixed(4) + " : " + so.destination.lat.toFixed(4), 210, 233+(i*30));
            this.buttons.push( button );
        }        
    },

    drawSensors: function( _context ) {
        for (var i=0; i < this.simObject.components.length; i++) {
            if ( Sensor.isPrototypeOf( this.simObject.components[i] )) {
                var button = Object.create( Button );
                var c =  this.simObject.components[i];
                button.init( 240, 60 + (i*30),
                             c.type, c.active ? "#00ff00" : "red", c, c.toggleSensor);
                this.buttons.push( button );
            }
        }
    },

    drawControls: function() {
        if (this.simObject.faction === "player" && 
            this.simObject.stateMachine.currentState !== StateOrbit &&
            this.simObject.stateMachine.currentState !== StateDeorbit ) {

            var sliderPower = new Slider( 0, 100,
                                          this.simObject.dynamics.thrust * 100 / this.simObject.dynamics.MAX_THRUST,
                                          this.simObject.dynamics.setPower, this.simObject.dynamics );                                      
            sliderPower.x = 120;
            sliderPower.y = 60;
            sliderPower.captureMouse( this.mfd.$canvas );
            this.sliders.push ( sliderPower );
            
            var sliderTurn = new Slider( -100, 100,
                                         this.simObject.dynamics.turnRate * 100 / this.simObject.dynamics.AGILITY,
                                         this.simObject.dynamics.setTurn, this.simObject.dynamics );                                      
            sliderTurn.x = 160;
            sliderTurn.y = 60;
            sliderTurn.captureMouse( this.mfd.$canvas );
            this.sliders.push ( sliderTurn );

            //refactor - change for pitchControlInput instead of setting pitch directly
            var sliderPitch = new Slider( -90, 90,
                                        this.simObject.dynamics.pitch,
                                        this.simObject.dynamics.setPitch, this.simObject.dynamics );      
            sliderPitch.x = 400;
            sliderPitch.y = 60;
            sliderPitch.captureMouse( this.mfd.$canvas );
            this.sliders.push( sliderPitch );            
        }
    },

    onClick: function( _event ) {
        if ( this.simObject ) {
            for (var i=0; i<this.buttons.length; i++) {
                if ( utils.containsPoint( this.buttons[i], _event.offsetX, _event.offsetY )) {
                    this.buttons[i].activate();
                    break;
                };
            }
        }        
    }
};

