
class Player extends GameObject{
  
  setupObject(){

    this.gravity    = 0.001;
    this.can_jump   = false;
    this.jump_speed = 0.5;
    this.walk_speed = .3;
    this.max_fall_speed = 10;

    this.element.classList.add("player");
  }

  toJSON(){
    const { position, size, vector } = this;
    return { position, size, vector };
  }

  jump(){
    if(!this.can_jump) return;
    this.can_jump = false;
    this.vector.y = -this.jump_speed;
  }

  setMove(n){
    console.log(n);
    this.vector.x = n * this.walk_speed;
    if(n === -1) this.element.classList.add("left");
    else if(n === 1) this.element.classList.remove("left");

    if(n === 0) this.element.classList.remove("walking");
    else        this.element.classList.add("walking");
  }

  move(delta){
    this.vector.y += Math.min(this.max_fall_speed, this.gravity * delta);

    let diff_x = delta * this.vector.x;
    let diff_y = delta * this.vector.y;

    this.position.x += diff_x;
    this.position.y += diff_y;
  }

  update(){
    this.element.style.left = this.position.x + "px";
    this.element.style.top  = this.position.y + "px";
  }

  resolveCollision(obj){

    if(obj instanceof BottomWaveObject){
      if(Math.abs(obj.position.y - this.position.y) < 15){
        // Place on top and allow jump
        this.position.y = obj.position.y;
        this.vector.y   = 0;
        this.can_jump   = true;
      }
      else{
        var diff_begin = Math.abs(this.position.x - obj.position.x);
        var diff_end   = Math .abs(this.position.x - ( obj.position.x + obj.size.width ));
        if(diff_begin < diff_end){
          this.position.x = obj.position.x - 13;
        }
        else{
          this.position.x = obj.position.x + obj.size.width + 13;
        }
      }

    }
    else if(obj instanceof UpperWaveObject){
      this.position.y = obj.position.y + obj.size.height + this.size.height;
      this.vector.y   = 0;
      this.can_jump   = false;
    }

  }

}