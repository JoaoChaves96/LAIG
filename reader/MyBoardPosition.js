/**
* BoardPosition
* @constructor
*/
function MyBoardPosition(scene, x, y, z, color) {
  this.scene = scene;
	CGFobject.call(this,scene);
  this.quad = new MyQuad(scene, 0, 0, 5, 5);

  this.x = x;
  this.y = y;
  this.z = z;
  this.color = color;

  this.black = new CGFappearance(scene);
  this.black.setAmbient(0, 0, 0, 1.0);
  this.black.setDiffuse(0, 0, 0, 1.0);
  this.black.setSpecular(0, 0, 0, 1.0);
  this.black.setShininess(10);

  this.white = new CGFappearance(scene);
  this.white.setAmbient(1, 1, 1, 0);
  this.white.setDiffuse(1, 1, 1, 1.0);
  this.white.setSpecular(1, 1, 1, 1.0);
  this.white.setShininess(10);

  if(color == 0){
    this.mat = this.white;
  }
  else {
    this.mat = this.black;
  }
};

MyBoardPosition.prototype = Object.create(CGFobject.prototype);
MyBoardPosition.prototype.constructor = MyBoardPosition;

MyBoardPosition.prototype.select = function(){
  this.mat = new CGFappearance(this.scene);
  this.mat.setAmbient(1, 0, 0, 1);
  this.mat.setDiffuse(1, 0, 0, 1);
  this.mat.setSpecular(1, 0, 0, 1);
  this.mat.setShininess(10);
}

MyBoardPosition.prototype.unselect = function(){
  console.log("object unselected");
  this.mat = new CGFappearance(this.scene);
  if(this.color == 0){
    this.mat = this.white;
  }
  else {
    this.mat = this.black;
  }
}

MyBoardPosition.prototype.display = function() {
this.scene.pushMatrix();
this.scene.translate(this.x, this.y, this.z);
this.mat.apply();
this.quad.display();
this.scene.popMatrix();
}
