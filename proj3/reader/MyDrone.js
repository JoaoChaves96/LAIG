/**
* Drone
* @constructor
*/
function MyDrone(scene) {
  this.id = null;
  this.scene = scene;
  this.scene.pushMatrix();
	CGFobject.call(this,scene);
  this.pyramid = new CGFquadPyramid(scene, 2, 1.25);

  this.materialA = new CGFappearance(scene);
  this.materialA.setAmbient(1, 0, 0, 1.0);
  /*this.materialA.setDiffuse(0, 0, 1, 1.0);
  this.materialA.setSpecular(0, 0, 1, 1.0);
  this.materialA.setShininess(10);*/

  this.primitiveType = scene.gl.TRIANGLES;
};

MyDrone.prototype = Object.create(CGFobject.prototype);
MyDrone.prototype.constructor = MyDrone;

MyDrone.prototype.setId = function(id){
  this.id = id;
}

MyDrone.prototype.select = function(){
  console.log("You selected a drone with id=" + this.id);
}

MyDrone.prototype.display = function() {
this.scene.pushMatrix();
this.scene.rotate(-Math.PI/2, 1, 0, 0);
this.materialA.apply();
this.pyramid.display();
this.scene.popMatrix();
}
