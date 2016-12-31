/**
* Cylinder
* @constructor
*/
function MyCylinder(scene, base, top, height, slices, stacks) {
	CGFobject.call(this,scene);
	this.heigth=height;
	this.surface = new CylinderSurface(scene, base, top, height, slices, stacks);
	this.base = new CylinderBase(scene, base, slices);
	this.top = new CylinderBase(scene, top, slices);
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;


MyCylinder.prototype.display = function() {

	this.surface.display();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, this.heigth);
		this.top.display();
	this.scene.popMatrix();
}
