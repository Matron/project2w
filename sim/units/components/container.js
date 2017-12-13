//this component enables the parentObject to contain other simObjects
var Container = {
    build: function( _parentObject, _name ) {
        this.parentObject = _parentObject;
        this.name = _name;        
        this.simObjects = new Array();        
    },
    
    addObject: function( _simObject ) {
        this.simObjects.push( _simObject );
        _simObject.parentObject = this.parentObject;
    },
    
    removeObject: function( _simObject ) {
        for (var i = 0; i < this.simObjects.length; i++) {
            if (this.simObjects[i] === _simObject ) {
                this.simObjects.splice(i, 1);
                _simObject.parentObject = null;
                return;
            }
        }
    }, 

    launch: function( _simObject ) {
        return function() {            
            if (_simObject.destination) {
                MessageDispatcher.dispatch( this.parentObject, _simObject, "Launch", "", 0);
            } else {                
                Gui.getSatPage().mfd.$canvas.addEventListener( 'click', waitForCoordinates, false);
            }
        }

        function waitForCoordinates( event ) {
            console.log("wait for coordinates");
            var pos = Gui.getSatPage().screenToWorld( event.offsetX, event.offsetY );
            _simObject.destination = new GeoLocation( pos.lat, pos.lon, -250 );
            Gui.getSatPage().mfd.$canvas.removeEventListener('click', waitForCoordinates, false);
        }
    }
}
