/**
* MyCylinder
* @constructor
*/
function MyCylinder(scene, base, top, height, slices, stacks) {
  CGFobject.call(this,scene);

  this.slices = slices;
  this.stacks = stacks;

  this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
  /*
  * TODO:
  * Replace the following lines in order to build a cylinder with a **single mesh**.
  *
  * How can the vertices, indices and normals arrays be defined to
  * build a cylinder with varying number of slices and stacks?
  */

  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  var s = 1;
  var t = 0;
  for (var i = 0; i <= this.stacks; i++) {
    t = 1 - i/this.stacks;
    for (var j = 0; j <= this.slices; j++) {
      s = j*(1/this.slices);
      this.vertices.push((Math.cos(j*2*Math.PI/this.slices)),(Math.sin(j*2*Math.PI/this.slices)), i/this.stacks-0.5);
      this.normals.push((Math.cos(j*2*Math.PI/this.slices)),(Math.sin(j*2*Math.PI/this.slices)), i/this.stacks);
      this.texCoords.push(s, t);
    }
  }
  var ver = this.slices;
  var ver2 = this.slices;
  var angle = (2*Math.PI)/this.slices;
  for (var i = 0; i < this.stacks; i++) {
    for (var j = 0; j < this.slices; j++) {

      this.indices.push((ver+1)*i + j);
      this.indices.push((ver+1)*i+j+1);
      this.indices.push((ver+1)*(i+1)+j);

      this.indices.push((ver+1)*(i+1)+j+1);
      this.indices.push((ver+1)*(i+1)+j);
      this.indices.push((ver+1)*i+j+1);
      /*
      if (j != this.slices - 1){
      this.indices.push((ver+1)*(i+1)+j+1);
      this.indices.push((ver+1)*(i+1)+j);
      this.indices.push((ver+1)*i+j+1);
    }
    else{
    this.indices.push((ver+1)*i);
    this.indices.push((ver+1)*i+j+1);
    this.indices.push((ver+1)*i+j);
  }
  */
}

}

this.primitiveType = this.scene.gl.TRIANGLES;
this.initGLBuffers();
};
