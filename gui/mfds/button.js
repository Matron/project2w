Button = {
    init: function( _x, _y, _text, _color, _object, _action ) {        
        this.width = 60;
        this.height = 20;
        this.text = _text;
        this.object = _object;
        this.action = _action;
        this.x = _x;
        this.y = _y;      
        this.color = _color;  
    },
    
    draw: function( _context ) {
        _context.save();
        _context.strokeStyle = this.color;
        _context.lineWidth = 1;
        _context.beginPath();
        _context.rect( this.x, this.y, this.width, this.height );
        _context.fillText( this.text, this.x + 5, this.y + 13 );
        _context.closePath();
        _context.stroke();
        _context.restore();
    },
    
    activate: function() {
        this.action.call( this.object );
    }
}