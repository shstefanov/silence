
document.addEventListener("DOMContentLoaded", function(){

  var world = new World(".viewport-wrapper", {
    
    size: { width:  2000, height: 1000 }, 
    
    player: { 
      position: { x:     50, y:      405 }, 
      vector:   { x:     0,  y:      0   } ,
      size:     { width: 25, height: 50  }
    },

    objects: [
      { position: {x: 10,  y: 410},  size: {width: 100, height: 30} },
      { position: {x: 110, y: 510},  size: {width: 100, height: 30} },
    ],
    
    
  });
});

// document.addEventListener("DOMContentLoaded", initKeyboard );
// document.addEventListener("DOMContentLoaded", initWorld    );
// document.addEventListener("DOMContentLoaded", render       );


const max_speed = 600;
const max_down_speed = 100;
const jump_speed = 100;
const move_scale = 1 / 122;
const gravity = 9;

function correct_x(move){
  return move < 0 ? move + (  move * delta / 20 ) : move  (  move * delta / 10 );
}

function correct_y(move){
  console.log("correct_y", move, move  + gravity, max_down_speed)
  return Math.min( move  + gravity, max_down_speed );
}

var world, player, objects;
var move_x = 0, move_y = 0;
var can_jump = false;
var delta = 0, now = Date.now();


function initKeyboard(){

  var down_keys = {
    "87": /* "w" */function(){
      if(can_jump) { 
        move_y = -jump_speed; can_jump = false; 
        console.log("move_y ? ", move_y);
      } 
    },
    // "83": /* "s" */function(){ Math.max(move_y++, max_speed); },
    "65": /* "a" */function(){ Math.max(move_x-=5, max_speed); },
    "68": /* "d" */function(){ Math.max(move_x+=5, max_speed); },
  };

  var up_keys = {
    "87": /* "w" */function(){ move_y++; },
    // "83": /* "s" */function(){ move_y--; },
    "65": /* "a" */function(){ move_x++; },
    "68": /* "d" */function(){ move_x--; },
  };


  document.body.addEventListener("keydown", function(e){
    var handler = down_keys[e.keyCode];
    if(handler) {
      handler();
      // console.log(move_x, move_y);
    }
  });

  document.body.addEventListener("keyup", function(e){
    var handler = up_keys[e.keyCode];
    if(handler) {
      handler();
      // console.log(move_x, move_y);
    }
  });
}

function initWorld(){




  var world_container = document.querySelector(".viewport-wrapper");
  world_container.style.width  = world_data.size.width  + "px";
  world_container.style.height = world_data.size.height + "px";

  world = document.querySelector(".viewport");
  world_data.objects.forEach(function(obj){
    var block = document.createElement("div");
    block.classList.add("block");
    Object.assign(block.style, {
      width:  obj.width  + "px",
      height: obj.height + "px",
      top:    obj.y      + "px",
      left:   obj.x      + "px",
    });
    world.appendChild(block);
    
  });
  
  player = document.createElement("div");
  player.classList.add("player");
  world.appendChild(player);
  Object.assign(player.style, {
    top:    world_data.player.y + "px",
    left:   world_data.player.x + "px",
  });
  
}

function render(){
  const new_now = Date.now();
  delta         = new_now - now;
  now           = new_now;
  move_player();
  requestAnimationFrame(render);
}

function move_player(){
  const { x, y } = world_data.player;
  

  console.log("move_x", move_x);
  console.log("move_y", move_y);


  move_x = correct_x(move_x);
  world_data.player.move.x = move_x * delta * move_scale;
  world_data.player.position.x += world_data.player.move.x;

  move_y = correct_y(move_y);
  world_data.player.move.y = move_y * delta * move_scale;
  world_data.player.position.y += world_data.player.move.y;

  check_collisions();

  player.style.left = world_data.player.position.x + "px";
  player.style.top  = world_data.player.position.y + "px";

}

function check_collisions(){
  const { x, y } = world_data.player.position;
  for(let object of world_data.objects){
    if(object.x < x && (object.x + object.width) > x ){
      if(object.y < y && (object.y + object.height) > y ){
        console.log("collision");
        world_data.player.position.y = object.y;
        move_y = 0;
        can_jump = true;
        return;
      }
    }
  }
}