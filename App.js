"use strict";
// App constructor
const App = function(canvas, overlay) {
  this.canvas = canvas;
  this.overlay = overlay;
  this.keysPressed = {} //first defined as an empty object
  this.downGem = new Vec2(0,0);
  this.upGem = new Vec2(0, 0);

  // obtain WebGL context
  this.gl = canvas.getContext("webgl2");
  if (this.gl === null) {
    throw new Error("Browser does not support WebGL2");
  }

  // serves as a registry for textures or models being loaded
  this.gl.pendingResources = {};
  // create a simple scene
  this.scene = new Scene(this.gl);
  
  this.resize();
};




// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  this.scene.camera.setAspectRatio(this.canvas.clientWidth /this.canvas.clientHeight ); //added this for ortho camera

};

App.prototype.registerEventHandlers = function() {
  document.onkeydown = (event) => {
    this.keysPressed[keyboardMap[event.keyCode]] = true 

    //jshint unused:false
  };
  document.onkeyup = (event) => {
    this.keysPressed[keyboardMap[event.keyCode]] = false

    //jshint unused:false
  };
  this.canvas.onmousedown = (event) => {
    var xCoordOrig = event.clientX;
    var yCoordOrig = event.clientY;

    var xCoord = ((event.clientX / this.canvas.width) - 0.5 ) * 2;
    var yCoord = ((event.clientY / this.canvas.height) - 0.5 ) * - 2;

    var coordinates = new Vec4(xCoord, yCoord, 0, 1);
    var worldSpaceCoords = this.scene.ndcToWorldSpace(coordinates);// calls method in scene

    var coordinateTuple = this.scene.gemIndex(worldSpaceCoords.x, worldSpaceCoords.y);

    this.downGem = new Vec2( coordinateTuple.x, coordinateTuple.y);


  };
  this.canvas.onmousemove = (event) => {
    //jshint unused:false
    event.stopPropagation();
  };
  this.canvas.onmouseout = (event) => {
    //jshint unused:false
  };
  this.canvas.onmouseup = (event) => {
    var xCoordOrig = event.clientX;
    var yCoordOrig = event.clientY;

    var xCoord = ((event.clientX / this.canvas.width) - 0.5 ) * 2;
    var yCoord = ((event.clientY / this.canvas.height) - 0.5 ) * - 2;

    var coordinates = new Vec4(xCoord, yCoord, 0, 1);
    var worldSpaceCoords = this.scene.ndcToWorldSpace(coordinates); //calls method in scene

    var coordinateTuple = this.scene.gemIndex(worldSpaceCoords.x, worldSpaceCoords.y);

    this.upGem = new Vec2(coordinateTuple.x, coordinateTuple.y);

    if (this.downGem.x == this.upGem.x && this.downGem.y == this.upGem.y) {
      if(this.keysPressed.B) {
        this.scene.dramaticExit(this.upGem);
      }
    } else {
      this.scene.swapGems(this.downGem, this.upGem);
    }

  };
  window.addEventListener('resize', () => this.resize() );
  window.requestAnimationFrame( () => this.update() );
};

// animation frame update
App.prototype.update = function() {

  const pendingResourceNames = Object.keys(this.gl.pendingResources);
  if (pendingResourceNames.length === 0) {
    // animate and draw scene
    this.scene.update(this.gl, this.keysPressed);
    this.overlay.innerHTML = "Ready.";
  } else {s
    this.overlay.innerHTML = "Loading: " + pendingResourceNames;
  }

  // refresh
  window.requestAnimationFrame( () => this.update() );
};

// entry point from HTML
window.addEventListener('load', function() {
  const canvas = document.getElementById("canvas");
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "WebGL";

  const app = new App(canvas, overlay);
  app.registerEventHandlers();
});