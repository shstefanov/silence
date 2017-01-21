document.addEventListener("DOMContentLoaded", function(){

  var world = new World(".viewport-wrapper", {
    
    size: { width:  2000, height: 1000 }, 
    
    player: { 
      position: { x:     50, y:      405 }, 
      vector:   { x:     0,  y:      0   } ,
      size:     { width: 25, height: 50  }
    },

    objects: localStorage.objects ? JSON.parse(localStorage.objects) : [
      { position: {x: 10,  y: 410},  size: {width: 100, height: 30} },
      { position: {x: 110, y: 510},  size: {width: 100, height: 30} },
      { position: {x: 210, y: 400},  size: {width: 100, height: 30} },
    ],
    
  });
});
