var utils = {};

utils.checkObjectClicked = function( _object, _x, _y ) {
    var dx = _x - _object.hasComponent( Graphics ).screenX;
        dy = _y - _object.hasComponent( Graphics ).screenY;
        dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < _object.hasComponent( Graphics ).radius ) return true; 
};

utils.containsPoint = function (rect, x, y) {
    return !(x < rect.x || x > rect.x + rect.width ||
             y < rect.y || y > rect.y + rect.height);
};