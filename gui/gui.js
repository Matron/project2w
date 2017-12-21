Gui = {     

    init: function() {
        //create html canvas elements for each mfd
        var $canvas_left = document.createElement( 'canvas' );
        $canvas_left.setAttribute( 'id', 'canvas_left' );
        $canvas_left.setAttribute( 'width', '520' );
        $canvas_left.setAttribute( 'height', '360' );

        var $canvas_center = document.createElement( 'canvas' );
        $canvas_center.setAttribute( 'id', 'canvas_center' );
        $canvas_center.setAttribute( 'width', '520' );
        $canvas_center.setAttribute( 'height', '360' );

        var $canvas_right = document.createElement( 'canvas');
        $canvas_right.setAttribute( 'id', 'canvas_right' );
        $canvas_right.setAttribute( 'width', '520' );
        $canvas_right.setAttribute( 'height', '360' );        

        var $body = document.body;
        $body.insertBefore( $canvas_right, $body.firstChild );
        $body.insertBefore( $canvas_center, $body.firstChild );
        $body.insertBefore( $canvas_left, $body.firstChild );        
        

        //craete mfd and assign its canvas
        this.mfds = new Array();
        
        var mfd_l = Object.create( MFD );
        mfd_l.init( $canvas_left );
        this.mfds.push( mfd_l );
                
        var mfd_c = Object.create( MFD );
        mfd_c.init( $canvas_center );
        this.mfds.push( mfd_c );

        var mfd_r = Object.create( MFD );
        mfd_r.init( $canvas_right );
        this.mfds.push( mfd_r );
        
        //create page and assign to the mfds
        var pageSat = Object.create( PageSatellite );
        mfd_l.setPage( pageSat );
        pageSat.init();        

        var pageTact = Object.create( PageTactical );
        pageTact.init();
        mfd_r.setPage( pageTact );

        var pageUnit = Object.create( PageUnit );
        mfd_c.setPage( pageUnit );        
    },
    
    draw: function( _fps ) {          
        this.mfds.forEach( mfd => mfd.draw() );       
    },

    objectSelected: function( _simObject ) {
        this.mfds.forEach( mfd => {
            if (PageUnit.isPrototypeOf( mfd.page )) {                
                mfd.page.init( _simObject );
            }
        })
    },

    areaSelected: function( _area ) {
        this.mfds.forEach( mfd => {
            if (PageTactical.isPrototypeOf( mfd.page )) {
                mfd.page.init( _area );
            }
        })
    },

    getSatPage: function() {
        for (var i=0; i<this.mfds.length; i++) {
            if (PageSatellite.isPrototypeOf(this.mfds[i].page )) {
                return this.mfds[i].page;
            }
        };
    }
};
