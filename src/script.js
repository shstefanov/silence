var world_data = {
  size: {
    width:  2000,
    height: 1000,
  },
  
  objects: [
    { x: 10,  y: 410,  width: 100, height: 30 },
    { x: 110, y: 510,  width: 100, height: 30 },
  ],
  
  player: {
    x: 20,
    y: 405,
  }
  
};

var world, player, objects;

document.addEventListener("DOMContentLoaded", init );
function init(){
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