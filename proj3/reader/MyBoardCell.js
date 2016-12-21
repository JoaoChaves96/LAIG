/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBoardCell(scene, x, y, object, prevColor) {
	CGFobject.call(this, scene);

  this.scene = scene;
  this.cell = object;
  this.x = x;
  this.y = y;

  this.transfMat = mat4.create();
  mat4.identity(this.transfMat);
  var posx = 5 + 2 * this.x;
  var posy =  -(5 + 2 * this.y);

  this.appearance = new CGFappearance(this.scene);

  if(prevColor == "white"){
    this.appearance.setAmbient(1, 1, 0, 1);
    this.appearance.setDiffuse(1, 1, 0, 1);
    this.appearance.setSpecular(1, 1, 0, 1);
  }

  mat4.translate(this.transfMat, this.transfMat, [posx, 0, posy]);

	this.originalTransfMat = mat4.create();
	mat4.identity(this.originalTransfMat);
	mat4.copy(this.originalTransfMat, this.transfMat);
};

MyBoardCell.prototype = Object.create(CGFobject.prototype);
MyBoardCell.prototype.constructor=MyBoardCell;

MyBoardCell.prototype.display = function(){
  this.scene.pushMatrix();
  this.appearance.apply();
	this.scene.multMatrix(this.transfMat);
	this.cell.display();
	this.scene.popMatrix();
}
