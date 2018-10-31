"use strict"; 
const Material = function(gl, program) { 
  this.gl = gl; 
  this.program = program;  
  Object.keys(program.uniforms).forEach( (uniformName) => { 
    const uniform = program.uniforms[uniformName]; 
    const reflectionVariable = 
        UniformReflectionFactories.makeVar(gl,
                                uniform.type, uniform.size); 
    Object.defineProperty(this, uniformName,
				{value: reflectionVariable} ); 
  }); 

}; 

Object.defineProperty(Material,
 "modelViewProjMatrix", {value: new Mat4()} );


Material.prototype.commit = function() { 
  const gl = this.gl; 
  this.program.commit(); 
  Object.keys(this.program.uniforms).forEach( (uniformName) => { 
    const uniform = this.program.uniforms[uniformName]; 
    this[uniformName].commit(gl, uniform.location); 
  }); 
}; 


