/**
* Pawn
* @constructor
*/
function MyPawn(scene) {
  this.scene = scene;
  this.scene.pushMatrix();
	CGFobject.call(this,scene);
  this.pyramid = new CGFquadPyramid(scene, 1, 0.625);

  this.materialA = new CGFappearance(scene);
  this.materialA.setAmbient(0, 1, 0, 1.0);
  /*this.materialA.setDiffuse(0, 0, 1, 1.0);
  this.materialA.setSpecular(0, 0, 1, 1.0);
  this.materialA.setShininess(10);*/

  this.primitiveType = scene.gl.TRIANGLES;
};

MyPawn.prototype = Object.create(CGFobject.prototype);
MyPawn.prototype.constructor = MyPawn;


MyPawn.prototype.display = function() {
this.scene.pushMatrix();
this.scene.rotate(-Math.PI/2, 1, 0, 0);
this.materialA.apply();
this.pyramid.display();
this.scene.popMatrix();
}
