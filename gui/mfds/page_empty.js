var PageEmpty = {
    name: "[ empty page ]",
    mfd: null,
    draw: function( _context ) {
        _context.fillText( "Page: " + this.name, 200, 20 );
    }
};
