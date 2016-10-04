/**
 * MyCylinder
 * @constructor
 */
 function MyCylinderWithTops(scene, slices, stacks, height, topAppearance) {
 	CGFobject.call(this,scene);

 	this.topAppearance = topAppearance;
	
	this.slices = slices || 8;
	this.stacks = stacks || 20;
	this.height = height || 1;

	this.cylinder = new MyCylinder(scene, slices, stacks);
	this.top = new Circle(scene, slices);
 };

 MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
 MyCylinderWithTops.prototype.constructor = MyCylinderWithTops;

 MyCylinderWithTops.prototype.display = function()
 {
 	this.scene.pushMatrix();
 		this.scene.scale(0, 0, CYLINDER_HEIGHT);
 		this.cylinder.display();
 	this.scene.popMatrix();

	if(typeof topAppearance !== "undefined")
	this.topAppearance.apply();

 	this.scene.pushMatrix();
 		this.scene.translate(0, 0, CYLINDER_HEIGHT/2);
 		this.top.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.translate(0, 0, -CYLINDER_HEIGHT/2);
 		this.scene.rotate(0, Math.PI, 0);
 		this.top.display();
 	this.scene.popMatrix();
 		
 }
