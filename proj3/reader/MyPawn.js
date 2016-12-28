/**
* Pawn
* @constructor
*/
function MyPawn(scene, x, y) {
  this.id= null;
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

  this.type = "pawn";

  this.x = x;
  this.y = y;

  this.transfMat = mat4.create();
  mat4.identity(this.transfMat);
  var posx = 5 + 2 * this.x;
  var posy =  -(5 + 2 * this.y);

  mat4.translate(this.transfMat, this.transfMat, [posx, 0, posy]);

	this.originalTransfMat = mat4.create();
	mat4.identity(this.originalTransfMat);
	mat4.copy(this.originalTransfMat, this.transfMat);

  this.animation = null;
};

MyPawn.prototype = Object.create(CGFobject.prototype);
MyPawn.prototype.constructor = MyPawn;

MyPawn.prototype.setId = function(id){
  this.id = id;
}

MyPawn.prototype.select = function(){
  console.log("You selected a pawn with id=" + this.id);
}

MyPawn.prototype.display = function() {
this.scene.pushMatrix();
this.scene.multMatrix(this.transfMat);
this.scene.rotate(-Math.PI/2, 1, 0, 0);
this.materialA.apply();
this.pyramid.display();
this.scene.popMatrix();
}
