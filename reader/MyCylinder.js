/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks, tops, topAppearance) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();

 	this.tops = tops || false;
 	if(tops == true)
 	this.top = new MyCircle(scene, slices);

 	this.topAppearance = topAppearance || false;

 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a cylinder with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a cylinder with varying number of slices and stacks?
 	*/

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

for (var i = 0; i <= this.stacks; i++) {

		for (var j = 0; j < this.slices; j++) {
			this.vertices.push((Math.cos(j*2*Math.PI/this.slices))*0.5,(Math.sin(j*2*Math.PI/this.slices))*0.5, i/this.stacks);
			this.normals.push((Math.cos(j*2*Math.PI/this.slices)),(Math.sin(j*2*Math.PI/this.slices)), i/this.stacks);			
	}
}
var ver = this.slices;
var ver2 = this.slices;
var angle = (2*Math.PI)/this.slices;
for (var i = 0; i < this.stacks; i++) {
		for (var j = 0; j < this.slices; j++) {

			this.indices.push(ver*i + j);
			this.indices.push(ver*i+j+1);
			this.indices.push(ver*(i+1)+j);
			
			if (j != this.slices - 1){
				this.indices.push(ver*(i+1)+j+1);
				this.indices.push(ver*(i+1)+j);
				this.indices.push(ver*i+j+1);
			}
			else{
				this.indices.push(ver*i);
				this.indices.push(ver*i+j+1);
				this.indices.push(ver*i+j);
			}
			
	}
	
}

	var s = 0;
	var t = 0;
	var sinc = 1/this.slices;
	var tinc = 1/this.stacks;
	for (var a = 0; a <= this.stacks; a++) {
		for (var b = 0; b < this.slices; b++) {
			this.texCoords.push(s);
			this.texCoords.push(t);
			s += sinc;
		}
		s = 0;
		t += tinc;
	}

console.log(this.vertices.length);

console.log(this.indices.length);

console.log(this.normals.length);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyCylinder.prototype.display = function()
 {
 	this.drawElements(this.primitiveType);

	if(this.tops == true)
	{
	if(this.topAppearance !== false)
		this.topAppearance.apply();

 	this.scene.pushMatrix();
 		this.scene.translate(0, 0, 1);
 		this.top.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.rotate(Math.PI, 0, 1, 0);
 		this.top.display();
 	this.scene.popMatrix();
	}
	
	this.scene.materialDefault.apply();
 }