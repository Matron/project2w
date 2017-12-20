MFD = {    
    init: function( _canvas ) {          
        this.$canvas = _canvas;
        this.context = this.$canvas.getContext( '2d' );
        this.page = Object.create( PageEmpty );

        var page = this.page;
        this.$canvas.addEventListener('mousedown', (event) => {
            this.page.onClick( event );
        }, false);
    },
    
    setPage: function( _page ) {        
        if (_page) this.page = _page;
        _page.mfd = this;
        _page.context = this.context;        
    },
    
    draw: function() {        
/*         this.context.clearRect( 0, 0, this.$canvas.width, this.$canvas.height );
        this.context.fillStyle = "#13cfdb";
        this.context.fillText( "Time: " + Date.now(), 20, 20 ); */   
        this.page.draw( );
    }
}