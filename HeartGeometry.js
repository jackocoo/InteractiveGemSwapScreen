"use strict";
const HeartGeometry = function(gl) {
  this.gl = gl;

  // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
        0.0, 0, 0,
        0.0, 0.78, 0,
        0.14, 1.4, 0, 
        0.44, 1.82, 0, 
        0.74, 1.862, 0, 
        1.1, 1.4, 0, 
        1.24, 0.82, 0,
        0.94, -0.6, 0, 
        0.26, -1.82, 0, 
        0.0, -2.2, 0, 
        -0.26, -1.82, 0, 
        -0.94, -0.6, 0, 
        -1.24, 0.82, 0, 
        -1.1, 1.4, 0, 
        -0.74, 1.862, 0,
        -0.44, 1.82, 0,
        -0.14, 1.4, 0,

      /*
        0.0, 0, 0,
        0.0, 0.039, 0,
        0.007, 0.07, 0,
        0.022, 0.091, 0, 
        0.037, 0.0913, 0, 
        0.055, 0.07, 0,
        0.062, 0.041, 0, 
        0.047, -0.03, 0, 
        0.013, -0.091, 0, 
        0.0, -0.125, 0, 
        -0.013, -0.091, 0,
        -0.047, -0.03, 0,
        -0.062, 0.041, 0,
        -0.055, 0.07, 0,
        -0.038, 0.0913, 0,
        -0.022, 0.091, 0,
        -0.007, 0.07, 0,
        */

    ]),
    gl.STATIC_DRAW);

  //create another Buffer with different values than the one above
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      8.0,  0.0, 0.0,
      0.9,  0.3, 0.9,
       0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
       0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
       0.9,  0.3, 0.9,
      0.9,  0.3, 0.9, 
     0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
       0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,
      0.9,  0.3, 0.9,  

      ]),
    gl.STATIC_DRAW);



  // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      0, 2, 3, 
      0, 3, 4, 
      0, 4, 5, 
      0, 5, 6,
      0, 6, 7, 
      0, 7, 8, 
      0, 8, 9, 
      0, 9, 10, 
      0, 10, 11, 
      0, 11, 12, 
      0, 12, 13,
      0, 13, 14, 
      0, 14, 15, 
      0, 15, 16, 
      0, 16, 1,
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






HeartGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);

  gl.drawElements(gl.TRIANGLES, 48, gl.UNSIGNED_SHORT, 0);
};
