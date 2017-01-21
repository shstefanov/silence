
class GameObject{
  constructor(object_data){
    Object.assign(this, object_data);
    this.element = document.createElement("div");
    Object.assign(this.element.style, {
      left:   this.position.x  + "px",
      top:    this.position.y  + "px",
      width:  this.size.width  + "px",
      height: this.size.height + "px",
    });
    this.setupObject();
  }

  setupObject(){
    this.element.classList.add("block");
  }

  update(){
    this.element.style.left = this.position.x + "px";
    this.element.style.top  = this.position.y + "px";
  }

  collides(obj){
    const vs = [
      [ obj.position.x,                  obj.position.y                   ],
      [ obj.position.x + obj.size.width, obj.position.y                   ],
      [ obj.position.x,                  obj.position.y + obj.size.height ],
      [ obj.position.x + obj.size.width, obj.position.y + obj.size.height ],
    ];
    const point = [this.position.x, this.position.y];

    // Compute point in polygon
    // From http://stackoverflow.com/questions/22521982/js-check-if-point-inside-a-polygon

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
  }
}