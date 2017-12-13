// implement singleton?
var MessageDispatcher = {
    messageQueue: new Array(),
    
    dispatch: function( _sender, _receiver, _text, _data, _delay ) {
        var msg = new Message( _sender, _receiver, _text, _data, 0 );
        
        if (_delay === 0) {
            this.discharge( msg );
        } else {
            var currentTime = Date.now();
            msg.sendTime = currentTime + _delay;
            this.messageQueue.push( msg );
        }
    },
    
    processQueue: function() {        
        //implement priority queue
        //var currentTime = Date.now();
        //if queue[msg] .date < currentTine --> dispatch
        //remove msg from queue
    },
    
    discharge: function( _message ) {
        _message.receiver.handleMessage( _message );
    }
};