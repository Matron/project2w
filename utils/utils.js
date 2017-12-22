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


utils.pickHex = function (color1, color2, weight) {
    
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}