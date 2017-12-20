var PageTactical = {
    name: "Tactical view",
    mfd: null,
    seaFloor: new Image(),
    ready: false,
    area: null,    

    init: function( _area ) {
        this.area = _area;
        this.seaFloor.onload = () => { this.ready = true; };        
        this.seaFloor.src = "sim/areas/seafloor_small.jpg"; 
    },

    draw: function( _context ) {   
        _context.clearRect( 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height );                  
        _context.fillStyle = "#13cfdb";
        _context.fillText( "Page: " + this.name, 200, 20 );
        _context.fillText( "Time: " + Date.now(), 20, 20 );

        if (this.area) {
            if (this.ready) _context.drawImage( this.seaFloor , 0, 30, this.mfd.$canvas.width, this.mfd.$canvas.height);
            _context.fillText( "Area: " + this.area.name, 420, 20 );
            this.drawObjects( _context );
        }
    },

    drawObjects: function( _context ) {
        this.displayedObjects = []; //used to check for click on object

        Sim.simObjects.forEach( so => {            
            if ( so.faction === "player" &&
                 so.parentObject === null &&
                 so.dynamics.position.alt <= 0 &&
                 so.hasComponent( Graphics )
            ) {
                var screen = this.worldToScreen( so.dynamics.position.lon, so.dynamics.position.lat );
                so.hasComponent( Graphics ).draw( _context, screen.x, screen.y );

                for (var i=0; i<so.components.length; i++) {
                    if ( Sensor.isPrototypeOf( so.components[i]) ) {
                        _context.beginPath();
                        _context.arc( screen.x, screen.y, this.metersToPixels( so.components[i].range ), 0, (Math.PI * 2), true);
                        _context.stroke();
                        _context.closePath();
                    }
                }

                this.displayedObjects.push( so );     
            }
        });        
        
        Sim.detectedObjects.forEach( so => {
            var screen = this.worldToScreen( so.dynamics.position.lon, so.dynamics.position.lat );
            so.hasComponent( Graphics ).draw( _context, screen.x, screen.y);
            this.displayedObjects.push( so );
        })
    },


    onClick: function( _event ) {
        if (this.area) {
            console.log("Clicked at " + _event.offsetX + " " + _event.offsetY );
            var pos = this.screenToWorld(_event.offsetX, _event.offsetY)
            console.log("Lon: " + pos.lon.toFixed(4) + " Lat: " + pos.lat.toFixed(4));
            
            for (var i=0; i<this.displayedObjects.length; i++) {
                if ( utils.checkObjectClicked( this.displayedObjects[i], _event.offsetX, _event.offsetY )) {
                    console.log( this.displayedObjects[i].name + " clicked" );
                    Gui.objectSelected( this.displayedObjects[i] );
                    return;
                }
            }
        }
    }, 

    worldToScreen: function( _lon, _lat ) {
        var screenX = (this.area.corner_tl.lon - _lon) * this.mfd.$canvas.width / this.area.side;
        var screenY = (this.area.corner_tl.lat - _lat) * this.mfd.$canvas.height / this.area.side;        
        return { x: Math.abs(screenX), y: screenY };
    }, 

    screenToWorld: function( _x, _y ) {
        var lon = this.area.corner_tl.lon + (_x * this.area.side / this.mfd.$canvas.width);
        var lat = this.area.corner_tl.lat - (_y * this.area.side / this.mfd.$canvas.height);
        return { lon: lon, lat: lat };
    },

    metersToPixels: function( _distMts ) {
        var degrees =  _distMts / 110955;
        var pixels = degrees * this.mfd.$canvas.height / this.area.side;
        return pixels;
    }
}
