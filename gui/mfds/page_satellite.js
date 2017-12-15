var PageSatellite = {
    name: "Satellite view",
    displayedObjects: new Array(),
    mfd: null,
    radius: 7,
    background: new Image(),
    ready: false,

    init: function() {
        this.background.onload = () => { this.ready = true; };        
        this.background.src = "gui/mfds/satmap.jpg"; 
    },

    draw: function( _context ) {
        _context.clearRect( 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height );
        
        if (this.ready) _context.drawImage( this.background , 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height);

        _context.fillStyle = "#13cfdb";
        _context.fillText( "Time: " + Date.now(), 20, 20 );
        _context.fillText( "Page: " + this.name, 200, 20 );

        this.drawLines( _context );

        this.drawSectors( _context );

        this.drawObjects( _context );        
    },
    
    drawLines: function( _context ) {
        _context.strokeStyle = "#13cfdb";
        _context.lineWidth = 0.5;
        _context.beginPath();
        _context.moveTo( this.mfd.$canvas.width / 2, 0 );
        _context.lineTo( this.mfd.$canvas.width / 2, this.mfd.$canvas.height );
        _context.moveTo( 0, this.mfd.$canvas.height / 2 );
        _context.lineTo( this.mfd.$canvas.width, this.mfd.$canvas.height / 2 );
        _context.stroke();
        _context.lineWidth = 0.3;
        _context.moveTo( 0, this.mfd.$canvas.height / 3 );
        _context.lineTo( this.mfd.$canvas.width, this.mfd.$canvas.height / 3 );
        _context.moveTo( 0, this.mfd.$canvas.height * (4/6) );
        _context.lineTo( this.mfd.$canvas.width, this.mfd.$canvas.height * (4/6) );
        _context.stroke();
        _context.closePath();
    },
    
    //refactor: take into account different length at high latitudes
    drawSectors: function( _context ) {
        _context.fillStyle = "#aaaaaa";
        _context.strokeStyle = "#aaaaaa";
        _context.lineWidth = 1;

        this.displayedSectors = [];
        Sim.sectors.forEach( se => { 
            var tl_lon = (se.corner_tl.lon * (this.mfd.$canvas.width / 2) / 180) + this.mfd.$canvas.width / 2;
            var tl_lat = (se.corner_tl.lat * -1 * (this.mfd.$canvas.height / 2) / 90) + this.mfd.$canvas.height / 2;
            var br_lon = ((se.corner_tl.lon + se.side) * (this.mfd.$canvas.width / 2) / 180) + this.mfd.$canvas.width / 2;
            var br_lat = ((se.corner_tl.lat - se.side) * -1 * (this.mfd.$canvas.height / 2) / 90) + this.mfd.$canvas.height / 2;
            var w = Math.abs( tl_lon - br_lon );
            var l = Math.abs( tl_lat - br_lat );                       
            this.displayedSectors.push( { sector: se, rect: { x: tl_lon, y: tl_lat, width: w, height: l} } );
            
            _context.beginPath();
            _context.rect( tl_lon, tl_lat, w , l );
            _context.fillText( se.name, tl_lon - 10, tl_lat - 5);
            _context.stroke();
            _context.closePath();
        })
    },

    drawObjects: function( _context ) {
        _context.fillStyle = "#aaaaaa";
        this.displayedObjects = [];
        Sim.simObjects.forEach( so => {            
            if (so.parentObject === null && so.dynamics.position.alt > 0) {   
                
                var screen = this.worldToScreen( so.dynamics.position.lon, so.dynamics.position.lat );                     
                this.displayedObjects.push( so );                               
                _context.beginPath();
                _context.fillText( so.name, screen.x + 13, screen.y -5);
                _context.strokeStyle = "#aaaaaa";                
                _context.lineWidth = 2;
                _context.beginPath();
                _context.arc( screen.x, screen.y, this.radius, 0, (Math.PI * 2), true);
                _context.stroke();
                _context.closePath();  
                so.hasComponent( Graphics ).screenX = screen.x;
                so.hasComponent( Graphics ).screenY = screen.y;
            }            
        });
    },
    
    worldToScreen: function( _lon, _lat ) {
        var screenX = ( _lon * (this.mfd.$canvas.width / 2) / 180) + this.mfd.$canvas.width / 2;
        var screenY = ( _lat * -1 * (this.mfd.$canvas.height / 2) / 90) + this.mfd.$canvas.height / 2;        
        return { x: Math.abs(screenX), y: screenY };
    }, 

    screenToWorld: function( _x, _y ) {
        if ( _x < this.mfd.$canvas.width / 2 ) {
            var lon = (180 - (_x * 360 / this.mfd.$canvas.width)) * -1;
        } else {
            var lon = (_x * 360 / this.mfd.$canvas.width) - 180;
        }   
        var lat = 90 - (_y * 180 / this.mfd.$canvas.height);

        return { lon: lon, lat: lat };
    },

    onClick: function( _event ) {

        for (var i=0; i<this.displayedObjects.length; i++) {
            if ( utils.checkObjectClicked( this.displayedObjects[i], _event.offsetX, _event.offsetY )) {
                console.log( this.displayedObjects[i].name + " clicked" );
                Gui.objectSelected( this.displayedObjects[i] );
                return;
            }
        }
        for (var j=0; j<this.displayedSectors.length; j++) {
            if ( utils.containsPoint( this.displayedSectors[j].rect, _event.offsetX, _event.offsetY )) {
                console.log( this.displayedSectors[j].sector.name + " clicked" );
                Gui.sectorSelected( this.displayedSectors[j].sector );
                return;
            }
        }
    }
};