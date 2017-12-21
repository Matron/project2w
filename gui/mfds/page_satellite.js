var PageSatellite = {
    name: "Satellite view",
    displayedObjects: new Array(),
    mfd: null,
    radius: 7,
    background: new Image(),
    imageReady: false,
    layerBio: null,
    context: null,

    init: function() {
        this.background.onload = () => { this.imageReady = true; };        
        this.background.src = "gui/mfds/satmap.jpg"; 
        
        //layer bio
        this.imageData = this.context.createImageData( this.mfd.$canvas.width, this.mfd.$canvas.height );
        var pixels = this.imageData.data;
 
        // Number of sector tiles        
        var numSectorCols = 360;
        var numSectorRows = 180;
        // Dimensions of each tile
        var sectorWidth = this.imageData.width / numSectorCols;
        var sectorHeight = this.imageData.height / numSectorRows;
        
        for (var r = 0; r < numSectorRows; r++) {
            for (var c = 0; c < numSectorCols; c++) {
                // Set the pixel values for each tile
                var red = Math.floor(Math.random()*255);
                var green = Math.floor(Math.random()*255);
                var blue = Math.floor(Math.random()*255);
            };
        };
    },

    draw: function( ) {
        this.context.clearRect( 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height );
        
        if (this.imageReady) this.context.drawImage( this.background , 0, 0, this.mfd.$canvas.width, this.mfd.$canvas.height);

        this.context.fillStyle = "#13cfdb";
        this.context.fillText( "Time: " + Date.now(), 20, 20 );
        this.context.fillText( "Page: " + this.name, 200, 20 );

        this.drawLines();

        this.drawAreas();

        this.drawObjects();        

        this.context.putImageData( this.imageData, 0, 0 );
    },
    
    drawLines: function() {
        this.context.strokeStyle = "#13cfdb";
        this.context.lineWidth = 0.5;
        this.context.beginPath();
        this.context.moveTo( this.mfd.$canvas.width / 2, 0 );
        this.context.lineTo( this.mfd.$canvas.width / 2, this.mfd.$canvas.height );
        this.context.moveTo( 0, this.mfd.$canvas.height / 2 );
        this.context.lineTo( this.mfd.$canvas.width, this.mfd.$canvas.height / 2 );
        this.context.stroke();
        this.context.lineWidth = 0.3;
        this.context.moveTo( 0, this.mfd.$canvas.height / 3 );
        this.context.lineTo( this.mfd.$canvas.width, this.mfd.$canvas.height / 3 );
        this.context.moveTo( 0, this.mfd.$canvas.height * (4/6) );
        this.context.lineTo( this.mfd.$canvas.width, this.mfd.$canvas.height * (4/6) );
        this.context.stroke();
        this.context.closePath();
    },
    
    //refactor: take into account different length at high latitudes
    drawAreas: function() {
        this.context.fillStyle = "#aaaaaa";
        this.context.strokeStyle = "#aaaaaa";
        this.context.lineWidth = 1;

        this.displayedAreas = [];
        Sim.tacticAreas.forEach( se => { 
            var tl_lon = (se.corner_tl.lon * (this.mfd.$canvas.width / 2) / 180) + this.mfd.$canvas.width / 2;
            var tl_lat = (se.corner_tl.lat * -1 * (this.mfd.$canvas.height / 2) / 90) + this.mfd.$canvas.height / 2;
            var br_lon = ((se.corner_tl.lon + se.side) * (this.mfd.$canvas.width / 2) / 180) + this.mfd.$canvas.width / 2;
            var br_lat = ((se.corner_tl.lat - se.side) * -1 * (this.mfd.$canvas.height / 2) / 90) + this.mfd.$canvas.height / 2;
            var w = Math.abs( tl_lon - br_lon );
            var l = Math.abs( tl_lat - br_lat );                       
            this.displayedAreas.push( { area: se, rect: { x: tl_lon, y: tl_lat, width: w, height: l} } );
            
            this.context.beginPath();
            this.context.rect( tl_lon, tl_lat, w , l );
            this.context.fillText( se.name, tl_lon - 10, tl_lat - 5);
            this.context.stroke();
            this.context.closePath();
        })
    },

    drawObjects: function() {
        this.context.fillStyle = "#aaaaaa";
        this.displayedObjects = [];
        Sim.simObjects.forEach( so => {            
            if (so.parentObject === null && so.dynamics.position.alt > 0) {   
                
                var screen = this.worldToScreen( so.dynamics.position.lon, so.dynamics.position.lat );                     
                this.displayedObjects.push( so );                               
                this.context.beginPath();
                this.context.fillText( so.name, screen.x + 13, screen.y -5);
                this.context.strokeStyle = "#aaaaaa";                
                this.context.lineWidth = 2;
                this.context.beginPath();
                this.context.arc( screen.x, screen.y, this.radius, 0, (Math.PI * 2), true);
                this.context.stroke();
                this.context.closePath();  
                so.hasComponent( Graphics ).screenX = screen.x;
                so.hasComponent( Graphics ).screenY = screen.y;
            }
        });
    },
    
    getSpecValue: function() {

        var lon = Math.floor( this.parentObject.dynamics.position.lon + 180 ),
            lat = ( Math.floor( this.parentObject.dynamics.position.lat - 90 ) * -  1 );
        
        console.log("Pos: " + lon + " " + lat + " " + Sim.world[lon][lat].color );        
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
        for (var j=0; j<this.displayedAreas.length; j++) {
            if ( utils.containsPoint( this.displayedAreas[j].rect, _event.offsetX, _event.offsetY )) {
                console.log( this.displayedAreas[j].area.name + " clicked" );
                Gui.areaSelected( this.displayedAreas[j].area );
                return;
            }
        }
    }
};