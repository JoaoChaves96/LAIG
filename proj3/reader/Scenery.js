/**
 * Scenery
 *
 * @constructor Scenery
 */
function Scenery(scene) {

	this.scene = scene;

	//this.scene.defaultMaterial = new CGFappearance(this.scene);
	//this.scene.spaceWallsMat = new CFGappearance(this.scene);
	//this.universeMat = new CGFtexture(this.scene, "resources/images/universe.jpeg");
	//this.scene.universe.setTexture(this.scene.universe);

	this.materialA = new CGFappearance(this.scene);
	this.materialA.loadTexture("./resources/images/universe4.jpg");

	//
	this.materialB = new CGFappearance(this.scene);
	this.materialB.loadTexture("./resources/images/satelite3.jpg");

	this.materialC = new CGFappearance(this.scene);
	this.materialC.loadTexture("./resources/images/satelite2.jpg");

	this.initSpace();

};

Scenery.prototype.display = function(){

	this.scene.pushMatrix();
	this.scene.multMatrix(this.spaceWallsMatrix);
	//this.scene.universeMat.apply();
	this.materialA.apply();
	//this.spaceWalls.display();
	this.spaceW.display();
	this.scene.popMatrix();


	//satelite
	this.scene.pushMatrix();
	this.scene.multMatrix(this.topCylinderMatrix);
	this.materialB.apply();
	this.topCylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.middleCylinderMatrix);
	this.materialC.apply();
	this.middleCylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.bottomCylinderMatrix);
	this.materialB.apply();
	this.bottomCylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.topConeMatrix);
	this.materialB.apply();
	this.topCone.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.bott1ConeMatrix);
	this.materialB.apply();
	this.bott1Cone.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.bottSmallCylinderMatrix);
	this.materialB.apply();
	this.bottSmallCylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.bottSmallConeMatrix);
	this.materialC.apply();
	this.bottSmallCone.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.topSmallCylinderMatrix);
	this.materialB.apply();
	this.topSmallCylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.topSmallConeMatrix);
	this.materialC.apply();
	this.topSmallCone.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.arm1Matrix);
	this.materialB.apply();
	this.arm1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.arm2Matrix);
	this.materialB.apply();
	this.arm2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.multMatrix(this.board2Matrix);
	this.materialC.apply();
	this.board2.display();
	this.scene.popMatrix();

}

Scenery.prototype.initSpace = function(){

	this.spaceW =	new MyUnitCubeQuad(this.scene);

	//
	this.topCylinder = new Cylinder(this.scene, 4, 3, 3, 20, 20);
	this.middleCylinder = new Cylinder(this.scene, 1, 3, 3, 20, 20);
	this.bottomCylinder = new Cylinder(this.scene, 4, 3, 3, 20, 20);
	this.topCone = new Cylinder(this.scene, 2, 0, 3, 20, 20);

	this.bott1Cone = new Cylinder(this.scene, 2, 3, 0, 20, 20);
	this.bottSmallCylinder = new Cylinder(this.scene, 2, 0.6, 0.6, 20, 20);
	this.bottSmallCone = new Cylinder(this.scene, 0.6, 0.6, 0, 20, 20);

	this.topSmallCylinder = new Cylinder(this.scene, 2, 0.6, 0.6, 20, 20);
	this.topSmallCone = new Cylinder(this.scene, 0.6, 0, 0.6, 20, 20);

	this.arm1 = new Cylinder(this.scene, 7, 0.2, 0.2, 20, 20);
	this.arm2 = new Cylinder(this.scene, 7, 0.2, 0.2, 20, 20);

	this.board2 = new MyUnitCubeQuad(this.scene);

	this.initSpaceMatrixes();
}

Scenery.prototype.initSpaceMatrixes = function(){

	this.spaceWallsMatrix = mat4.create();
	mat4.identity(this.spaceWallsMatrix);
	//mat4.translate(this.spaceWallsMatrix, this.spaceWallsMatrix, [-250, 0,-250]);
	mat4.scale(this.spaceWallsMatrix, this.spaceWallsMatrix, [400, 400, 400]);

	this.topCylinderMatrix = mat4.create();
	mat4.identity(this.topCylinderMatrix);
	mat4.translate(this.topCylinderMatrix, this.topCylinderMatrix, [23, -3,8]);
	mat4.rotate(this.topCylinderMatrix, this.topCylinderMatrix, Math.PI/2, [1,0,0]);

	this.middleCylinderMatrix = mat4.create();
	mat4.identity(this.middleCylinderMatrix);
	mat4.translate(this.middleCylinderMatrix, this.middleCylinderMatrix, [23, -7,8]);
	mat4.rotate(this.middleCylinderMatrix, this.middleCylinderMatrix, Math.PI/2, [1,0,0]);

	this.bottomCylinderMatrix = mat4.create();
	mat4.identity(this.bottomCylinderMatrix);
	mat4.translate(this.bottomCylinderMatrix, this.bottomCylinderMatrix, [23, -8,8]);
	mat4.rotate(this.bottomCylinderMatrix, this.bottomCylinderMatrix, Math.PI/2, [1,0,0]);

	this.topConeMatrix = mat4.create();
	mat4.identity(this.topConeMatrix);
	mat4.translate(this.topConeMatrix, this.topConeMatrix, [23, -1,8]);
	mat4.rotate(this.topConeMatrix, this.topConeMatrix, Math.PI/2, [1,0,0]);

	this.bott1ConeMatrix = mat4.create();
	mat4.identity(this.bott1ConeMatrix);
	mat4.translate(this.bott1ConeMatrix, this.bott1ConeMatrix, [23, -12,8]);
	mat4.rotate(this.bott1ConeMatrix, this.bott1ConeMatrix, Math.PI/2, [1,0,0]);

	this.bottSmallCylinderMatrix = mat4.create();
	mat4.identity(this.bottSmallCylinderMatrix);
	mat4.translate(this.bottSmallCylinderMatrix, this.bottSmallCylinderMatrix, [23, -13,8]);
	mat4.rotate(this.bottSmallCylinderMatrix, this.bottSmallCylinderMatrix, Math.PI/2, [1,0,0]);

	this.bottSmallConeMatrix = mat4.create();
	mat4.identity(this.bottSmallConeMatrix);
	mat4.translate(this.bottSmallConeMatrix, this.bottSmallConeMatrix, [23, -15,8]);
	mat4.rotate(this.bottSmallConeMatrix, this.bottSmallConeMatrix, Math.PI/2, [1,0,0]);

	this.topSmallCylinderMatrix = mat4.create();
	mat4.identity(this.topSmallCylinderMatrix);
	mat4.translate(this.topSmallCylinderMatrix, this.topSmallCylinderMatrix, [23, 0,8]);
	mat4.rotate(this.topSmallCylinderMatrix, this.topSmallCylinderMatrix, Math.PI/2, [1,0,0]);

	this.topSmallConeMatrix = mat4.create();
	mat4.identity(this.topSmallConeMatrix);
	mat4.translate(this.topSmallConeMatrix, this.topSmallConeMatrix, [23, 0.4,8]);
	mat4.rotate(this.topSmallConeMatrix, this.topSmallConeMatrix, Math.PI/2, [1,0,0]);

	this.arm1Matrix = mat4.create();
	mat4.identity(this.arm1Matrix);
	mat4.translate(this.arm1Matrix, this.arm1Matrix, [18.5, 0, 8]);
	mat4.rotate(this.arm1Matrix, this.arm1Matrix, Math.PI/2, [1,0,0]);
	mat4.rotate(this.arm1Matrix, this.arm1Matrix, Math.PI/4, [0,1,0]);

	this.arm2Matrix = mat4.create();
	mat4.identity(this.arm2Matrix);
	mat4.translate(this.arm2Matrix, this.arm2Matrix, [27.5, 0, 8]);
	mat4.rotate(this.arm2Matrix, this.arm2Matrix, Math.PI/2, [1,0,0]);
	mat4.rotate(this.arm2Matrix, this.arm2Matrix, -Math.PI/4, [0,1,0]);

	this.board2Matrix = mat4.create();
	mat4.identity(this.board2Matrix);
	mat4.translate(this.board2Matrix, this.board2Matrix, [33,0,7.5]);
	mat4.scale(this.board2Matrix, this.board2Matrix, [16, 0.2, 8]);

}
