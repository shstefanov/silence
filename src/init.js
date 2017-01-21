document.addEventListener("DOMContentLoaded", function(){

  var world = new World(".viewport-wrapper", {
    
    size: { width:  10000, height: 1000 },
    
    player: { 
      position: { x:     25, y:      250 }, 
      vector:   { x:     0,  y:      0   } ,
      size:     { width: 25, height: 50  }
    },

    // objects: localStorage.objects ? JSON.parse(localStorage.objects) : [
    //   { position: {x: 10,  y: 410},  size: {width: 100, height: 30} },
    //   { position: {x: 110, y: 510},  size: {width: 100, height: 30} },
    //   { position: {x: 210, y: 400},  size: {width: 100, height: 30} },
    // ],

    objects: (function(){
      var objects = [];
      for(let x = 0; x < 10000; x+=50){
        objects.push({
          prototype: BottomWaveObject,
          position: {x, y: 350},  
          size:     {width: 50, height: 300} })
      }

      for(let x = 50; x < 10000; x+=50){
        objects.push({
          prototype: UpperWaveObject,
          position: {x, y: 100},  
          size:     {width: 50, height: 100} })
      }
      return objects;
    })()
    
  });
});
