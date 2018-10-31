"use strict"; 
const GameObject = function(mesh) { 
  this.mesh = mesh;


  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 
  this.gemType = null;

  this.modelMatrix = new Mat4(); 
};


GameObject.prototype.updateModelMatrix =
                              function(){ 

	this.modelMatrix = this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);
};


GameObject.prototype.spin = function() {

  this.orientation += 0.01;
};


GameObject.prototype.draw = function(camera){ 

  this.updateModelMatrix();
// TODO: Set the uniform modelViewProjMatrix (reflected in the material) from the modelMatrix property of GameObject (no camera yet). Operator = cannot be used. Use Mat4’s methods set() and/or mul().
  //this.mesh.material.modelMatrix.set(this.modelMatrix);
  this.mesh.material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix)

  this.mesh.draw(); 
};
