var PageUnit = {
    name: "Unit view",
    mfd: null,
    simObject: null,
    image: new Image(),
    ready: false,    

    init: function( _simObject ) {
        this.simObject = _simObject;        
        this.sliders = new Array(); 

        if (_simObject.faction === "player" ) {
            var sliderAlt = new Slider( _simObject.dynamics.min_alt, _simObject.dynamics.max_alt, _simObject.dynamics.desiredAltitude,
                                        _simObject.dynamics.setAltitude, _simObject.dynamics );
            sliderAlt.x = 400;
            sliderAlt.y = 60;
            //refactor! - try to replace captureMouse
            sliderAlt.captureMouse( this.mfd.$canvas );
            this.sliders.push( sliderAlt );

            var sliderPower = new Slider( 0, 100, _simObject.dynamics.power,
                                        _simObject.dynamics.setPower, _simObject.dynamics );                                      
            sliderPower.x = 120;
            sliderPower.y = 60;
            sliderPower.captureMouse( this.mfd.$canvas );
            this.sliders.push ( sliderPower );
        }    

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

            for (var i=0; i < this.simObject.components.length; i++) {
                if ( Sensor.isPrototypeOf( this.simObject.components[i] )) {
                    var button = Object.create( Button );
                    var c =  this.simObject.components[i];
                    button.init( 240, 60 + (i*30),
                                 c.type, c.active ? "#00ff00" : "red", c, c.toggleSensor);
                    this.buttons.push( button );
                }
            } 

            this.sliders.forEach( sld => sld.draw( _context ) );
            this.buttons.forEach( btn => btn.draw( _context ) );

            //refactor - for test only
            for (var i=0; i<this.simObject.contacts.length; i++) {
                _context.fillText( this.simObject.contacts[i].so.name + " D:" + 
                                   Math.round(this.simObject.contacts[i].dist), 300, 200 + (i*20) );
            }
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

        _context.fillText( "Spd: " + Math.floor(this.simObject.dynamics.speed), 20, 180 );
        _context.fillText( "Acc: " + (this.simObject.dynamics.acceleration).toFixed(1), 20, 160 );
        _context.fillText( " Vs: " + Math.floor(this.simObject.dynamics.altitude_rate), 450, 160 );
        _context.fillText( "Alt: " + Math.floor(this.simObject.dynamics.position.alt), 450, 180 );
        _context.fillText( "Hdg: " + Math.floor(this.simObject.dynamics.position.hdg), 235, 340 );
    },

    drawNavigationData: function( _context ) {
        if (this.simObject.destination) {
            var dist = this.simObject.dynamics.position.calculateDistance( this.simObject.destination )
            _context.fillText( "Rng: " + ( dist / 1000).toFixed(1), 20, 340 );

            var eta = dist / this.simObject.dynamics.speed;
            _context.fillText( "ETE: " + Math.floor(eta), 450, 340 );
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

