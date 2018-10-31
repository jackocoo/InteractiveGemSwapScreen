"use strict";
const QuadGeometry = function(gl) {
  this.gl = gl;

  // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      
      -1.2,  2.0,  0.0,
      -1.2, -2.0, 0.0,
      1.2,  2.0, 0.0,
      1.2, -2.0, 0.0, 

    ]),
    gl.STATIC_DRAW);

  //create another Buffer with different values than the one above
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      0.6,  0.8, 0.6,
      0.2,  0.8, 0.2,
      0.2,  0.8, 0.2,
     0.6,  0.8, 0.6,

      ]),
    gl.STATIC_DRAW);



  // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      1, 2, 3,
    ]),
    gl.STATIC_DRAW);

  // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
  this.inputLayout = gl.createVertexArray();
  gl.bindVertexArray(this.inputLayout);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  




gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer); //color buffer information
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );
  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

  gl.bindVertexArray(null);

};


QuadGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};