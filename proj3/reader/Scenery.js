/**
 * Scenery
 *
 * @constructor Scenery
 */
function Scenery(scene) {

	this.scene = scene;

	//this.scene.defaultMaterial = new CGFappearance(this.scene);
	//this.scene.spaceWallsMat = new CFGappearance(this.scene);
	this.scene.universe = new CFGtexture(this.scene, "resources/images/universe.jpeg");
	this.scene.universeMat.setTexture(this.scene.universe);

	this.initSpace();

};

Scenery.prototype.display = function(){

	console.log("O CENARIO APARECE");

	this.scene.pushMatrix();
	this.scene.multMatrix(this.spaceWalls);
	this.scene.universeMat.apply();
	this.spaceWalls.display();
	this.scene.popMatrix();
}

Scenery.prototype.initSpace = function(){

	this.spaceWalls = new MyCube(this.scene, 5, 5,1);
	this.initSpaceMatrixes();
}

Scenery.prototype.initSpaceMatrixes = function(){
	this.spaceWallsMatrix = mat4.create();
	mat4.identity(this.spaceWallsMatrix);
	mat4.translate(this.spaceWallsMatrix, this.spaceWallsMatrix, [1, 1,1]);
}
