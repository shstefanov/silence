
class World{

  constructor(container, data){
    this.setupKeyboard();
    this.container = document.querySelector(container);
    this.container.style.width  = data.size.width  + "px";
    this.container.style.height = data.size.height + "px";
    this.player = new Player(data.player);
    this.container.appendChild(this.player.element);
    this.objects = data.objects.map((object_data)=>{
      const object = new GameObject(object_data);
      this.container.appendChild(object.element);
      return object;
    });
    this.now = Date.now();
    this.render();
  }

  setupKeyboard(){
    var down_keys = {
      "87": ()=>{  this.player.jump();  } ,         //W
      // "83": () => { Math.max(move_y++, max_speed); }, //S
      "65": () => { this.player.setMove(-1); }, // A
      "68": () => { this.player.setMove( 1); }, // D
    };

    var up_keys = {
      // "87": /* "w" */() => { move_y++; },
      // "83": /* "s" */() => { move_y--; },
      "65": () => { this.player.setMove(0); }, // A
      "68": () => { this.player.setMove(0); }, // D
    };


    document.body.addEventListener("keydown", function(e){
      var handler = down_keys[e.keyCode];
      if(handler) handler();
    });

    document.body.addEventListener("keyup", function(e){
      var handler = up_keys[e.keyCode];
      if(handler) handler();
    });
  }

  render(){
    let new_now = Date.now();
    let delta   = new_now - this.now;
    this.now    = new_now;

    this.player.move(delta);
    
    for(let obj of this.objects){
      if(this.player.collides(obj)){
        this.player.position.y = obj.position.y;
        this.player.vector.y   = 0;
        this.player.can_jump   = true;
      }
    }

    this.player.update();

    requestAnimationFrame(()=>this.render());
  }
}