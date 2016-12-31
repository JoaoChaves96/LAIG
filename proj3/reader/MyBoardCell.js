/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBoardCell(scene, x, y, object, prevColor) {
	CGFobject.call(this, scene);

	this.id = null;
  this.scene = scene;
  this.cell = object;
  this.x = x;
  this.y = y;
	this.prevColor = prevColor;

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

	this.type = "empty";
};

MyBoardCell.prototype = Object.create(CGFobject.prototype);
MyBoardCell.prototype.constructor=MyBoardCell;

MyBoardCell.prototype.setId = function(id){
	this.id = id;
}

MyBoardCell.prototype.select = function(){
	console.log("You selected a board cell with id= " + this.id + "in the position x=" + this.x + " y=" + this.y);
}

MyBoardCell.prototype.display = function(){
  this.scene.pushMatrix();
	if(this.scene.interface.environment == "Space"){
		if(this.prevColor == "white"){
			this.appearance.setAmbient(0, 1, 1, 1);
			this.appearance.setDiffuse(0, 1, 1, 1);
			this.appearance.setSpecular(0.8, 0.8, 0.8, 1);
		}else {
			this.appearance.setAmbient(0.31, 0.31, 0.31, 1);
			this.appearance.setDiffuse(0.31, 0.31, 0.31, 1);
			this.appearance.setSpecular(0.8, 0.8, 0.8, 1);
		}
	}
	else{
		this.appearance = new CGFappearance(this.scene);

	  if(this.prevColor == "white"){
	    this.appearance.setAmbient(1, 1, 0, 1);
	    this.appearance.setDiffuse(1, 1, 0, 1);
	    this.appearance.setSpecular(0.8, 0.8, 0.8, 1);
	  }
	}
  this.appearance.apply();
	this.scene.multMatrix(this.transfMat);
	this.cell.display();
	this.scene.popMatrix();
}
