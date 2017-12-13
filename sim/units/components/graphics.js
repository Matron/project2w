var Graphics = {
    color: "#ff0093",
    radius: 7,

    init: function( _parentObject, _color, _radius ) {
        this.parentObject = _parentObject;
        this.color = _color;
        this.radius = _radius;
    },

    draw: function( _context, _screenX, _screenY ) {
        _context.strokeStyle = this.color;
        _context.fillStyle = this.color;
        _context.lineWidth = 2;
        _context.beginPath();
        _context.fillText( this.parentObject.name, _screenX - 15, _screenY -13);
        _context.arc( _screenX, _screenY, this.radius, 0, (Math.PI * 2), true);
        _context.stroke(); 
        _context.closePath();
        _context.fill();
        this.screenX = _screenX;
        this.screenY = _screenY;
    }
}