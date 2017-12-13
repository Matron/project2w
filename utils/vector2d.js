//https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/more-vector-math
function Vector2D( _x, _y ) {
    this.x = _x;
    this.y = _y;
};

Vector2D.prototype.add = function( _vector ) {
    this.x = this.x + _vector.x;
    this.y = this.y + _vector.y;
};

Vector2D.prototype.sub = function( _vector ) {
    this.x = this.x - _vector.x;
    this.y = this.y - _vector.y;
};

Vector2D.prototype.subVector = function( _vector ) {
    var newX = this.x - _vector.x;
    var newY = this.y - _vector.y;
    return new Vector2D( newX, newY );
};

Vector2D.prototype.mult = function( _n ) {
    this.x = this.x * _n;
    this.y = this.y * _n;
};

Vector2D.prototype.div = function( _n ) {
    this.x = this.x / _n;
    this.y = this.y / _n;
};

Vector2D.prototype.mag = function() {
    return Math.sqrt( this.x * this.x + this.y * this.y );
};

Vector2D.prototype.normalize = function() {
    var m = this.mag();
    if (m > 0) this.div( m );
};

/*Vector2D.protoype.perp = function() {
    var x = this.x;
    var y = this.y;
    this.x = -y;
    this.y = x;
};*/

Vector2D.prototype.toString = function() {
    return "X: " + this.x + " Y: " + this.y;
};