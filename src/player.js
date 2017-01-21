
class Player extends GameObject{
  
  setupObject(){

    this.gravity    = 0.001;
    this.can_jump   = false;
    this.jump_speed = 0.5;
    this.walk_speed = .1;

    this.element.classList.add("player");
  }

  jump(){
    if(!this.can_jump) return;
    this.can_jump = false;
    this.vector.y = -this.jump_speed;
  }

  setMove(n){
    this.vector.x = n * this.walk_speed;
  }

  move(delta){
    this.vector.y += this.gravity * delta;

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
    this.position.y = obj.position.y;
    this.vector.y   = 0;
    this.can_jump   = true;
  }

}