/**
 * MyUnitCubeQuad
 * @constructor
 */
 function MyUnitCubeQuad(scene) {
 	CGFobject.call(this, scene);

 	this.quad = new MyQuad(this.scene, 0 , 0 , 1 ,1);
 };

 MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
 MyUnitCubeQuad.prototype.constructor = MyUnitCubeQuad;

 MyUnitCubeQuad.prototype.display = function() {
   var degToRad = Math.PI/180;
 	// front face
 	this.scene.pushMatrix();
 	this.scene.translate(-0.5, -0.5, 0.5);
 	this.quad.display();
 	this.scene.popMatrix();

 	// back face
 	this.scene.pushMatrix();
 	this.scene.translate(-0.5, 0.5, -0.5);
  this.scene.rotate(180 * degToRad, 1, 0, 0);
 	this.quad.display();
 	this.scene.popMatrix();

 	// top face
 	this.scene.pushMatrix();
  this.scene.translate(0, 0.5, 0);
 	this.scene.rotate(-90 * degToRad, 1, 0, 0);
 	this.scene.translate(-0.5, -0.5, 0);
 	this.quad.display();
 	this.scene.popMatrix();

 	// bottom face
 	this.scene.pushMatrix();
  this.scene.translate(0, -0.5, 0);
 	this.scene.rotate(90 * degToRad, 1, 0, 0);
 	this.scene.translate(-0.5, -0.5, 0);
 	this.quad.display();
 	this.scene.popMatrix();

 	// right face
 	this.scene.pushMatrix();
 	this.scene.translate(0.5, -0.5, 0.5);
   this.scene.rotate(90 * degToRad, 0, 1, 0);
 	this.quad.display();
 	this.scene.popMatrix();

 	// left face
 	this.scene.pushMatrix();
  this.scene.translate(-0.5, -0.5, -0.5);
  this.scene.rotate(-90 * degToRad, 0, 1, 0);
 	this.quad.display();
 	this.scene.popMatrix();
 };
