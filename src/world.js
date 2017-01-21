
class World{

  constructor(container, data){

    this.size = data.size;
    this.player_initials = JSON.stringify(data.player);

    this.scene_position = 0;

    this.edit_mode = true;

    this.abs_now = Date.now();

    this.setupKeyboard();
    this.wrapper = document.querySelector(container).parentNode;
    this.viewport_width = parseInt(getComputedStyle(this.wrapper).width.replace("px", ""));
    this.container = this.wrapper.querySelector(".viewport");
    this.container.style.width  = data.size.width  + "px";
    this.container.style.height = data.size.height + "px";
    

    this.objects = [];
    data.objects.forEach((obj_data)=>this.addObject(obj_data));
    
    this.setupPlayer();
    
    if(this.edit_mode) {
      this.setupEditor();
      this.editObject(this.player);
    }

    this.now = Date.now();
    this.render();
  }

  setupPlayer(){
    this.player = new Player(JSON.parse(this.player_initials));
    this.container.appendChild(this.player.element);
  }

  removePlayer(){
    this.player.element.remove();
    this.player = null;
  }

  addObject(object_data){
    let Prototype = object_data.prototype || GameObject;
    const object = new Prototype(object_data);
    this.container.appendChild(object.element);
    this.objects.push(object);
    if(this.edit_mode) this.editObject(object);
    return object;
  }

  editObject(object){
    const self = this;
    object.element.addEventListener("dblclick", (e)=>{
      this.removeObjectByDOMElement(e.target);
      this.flushStorage();
    });

    object.element.addEventListener("mousedown", (e)=>{
      self.skip_update = true;
      if(e.button !== 0) return;
      const x = e.pageX, y = e.pageY;
      const base_x = object.position.x, base_y = object.position.y;

      e.stopPropagation();

      function mouse_move(e){
        const diff_x = e.pageX - x;
        const diff_y = e.pageY - y;

        object.position.x = base_x + diff_x;
        object.position.y = base_y + diff_y;

        object.update();
      }

      function mouse_up(e){
        document.body.removeEventListener("mousemove", mouse_move );
        document.body.removeEventListener("mouseup",   mouse_up   );
        self.flushStorage();
        self.skip_update = false;
      }

      document.body.addEventListener("mousemove", mouse_move );
      document.body.addEventListener("mouseup",   mouse_up   );


    });
  }

  removeObject(object){
    for(let obj of this.objects){
      if(obj === object){
        this.objects.splice(this.objects.indexOf(obj), 1);
        obj.element.remove();
        return;
      }
    }
  }

  removeObjectByDOMElement(element){
    for(let obj of this.objects){
      if(obj.element === element){
        this.objects.splice(this.objects.indexOf(obj), 1);
        obj.element.remove();
        return;
      }
    }
  }

  flushStorage(){
    if(this.edit_mode){
      localStorage.objects = JSON.stringify(this.toJSON().objects);
    }
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
    let abs_delta = new_now - this.abs_now;
    this.now    = new_now;

    if(!this.skip_update){
      
      this.player.move(delta, abs_delta);
      for(let obj of this.objects) obj.move(delta, abs_delta);

      if(this.player.position.y > this.size.height){
        this.removePlayer();
        this.setupPlayer();
      }
      
      let collides = [];
      for(let obj of this.objects) {
        let coll = obj.collides(this.player);
        if(coll) collides.push(coll);
      }

      if(!collides.length){
        this.player.can_jump = false;
      }
      else if(
        collides.some((obj)=>{ return obj instanceof BottomWaveObject }) && 
        collides.some((obj)=>{ return obj instanceof UpperWaveObject })
      ){
        this.removePlayer();
        this.setupPlayer();
      }

      this.player.update();
      for(let obj of this.objects) obj.update();

      this.scene_position = Math.max(0,this.player.position.x - 200 );
      this.scene_position = Math.min(this.size.width - this.viewport_width, this.scene_position);
      this.wrapper.scrollLeft = this.scene_position;      
    }


    requestAnimationFrame(()=>this.render());
  }

  setupEditor(){
    this.container.addEventListener("mousedown", (e)=>{
      if(e.button !== 0) return;
      const x = e.pageX, y = e.pageY;


      const object = this.addObject({
        size:     { x: 0, y: 0 },
        position: { x: this.scene_position + x, y: y },
      });

      function mouse_move(e){
        const width  = e.pageX - x;
        const height = e.pageY - y;
        object.size  = { width, height };
        object.update();
      }

      const self = this;
      function mouse_up(){
        self.flushStorage();
        self.container.removeEventListener("mousemove", mouse_move );
        self.container.removeEventListener("mouseup",   mouse_up   );
      }

      this.container.addEventListener("mousemove", mouse_move );
      this.container.addEventListener("mouseup",   mouse_up   );
    });
  }

  toJSON(){
    return {
      size: this.size,
      objects: this.objects.map((obj)=>obj.toJSON()),
      player:  this.player.toJSON(),
    }
  }
}