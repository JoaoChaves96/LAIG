/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];	

for (var i = 0; i < this.stacks; i++) {

		for (var j = 0; j < this.slices; j++) {
			this.vertices.push((Math.cos(j*2*Math.PI/this.slices)),(Math.sin(j*2*Math.PI/this.slices)), i/this.stacks);
	
			this.vertices.push((Math.cos((j+1)*2*Math.PI/this.slices)),(Math.sin((j+1)*2*Math.PI/this.slices)), i/this.stacks);
			
			this.vertices.push((Math.cos(j*2*Math.PI/this.slices)),(Math.sin(j*2*Math.PI/this.slices)), (i+1)/this.stacks);
		
			this.vertices.push((Math.cos((j+1)*2*Math.PI/this.slices)),(Math.sin((j+1)*2*Math.PI/this.slices)), (i+1)/this.stacks);
			
	}
}
var ver = this.slices * 4;
var angle = (2*Math.PI)/this.slices;
for (var i = 0; i < this.stacks; i++) {
		for (var j = 0; j < this.slices; j++) {

			this.indices.push(ver*i+4*j);
			this.indices.push(ver*i+4*j+1);
			this.indices.push(ver*i+4*j+2);
			
			this.indices.push(ver*i+4*j+3);
			this.indices.push(ver*i+4*j+2);
			this.indices.push(ver*i+4*j+1);
			
	}
	
}

for (var i = 0; i < this.stacks; i++) {
		for (var j = 0; j < this.slices; j++) {


			this.normals.push(Math.cos(angle*(j+0.5)));
			this.normals.push(Math.sin(angle*(j+0.5)));
			this.normals.push(0);

			this.normals.push(Math.cos(angle*(j+0.5)));
			this.normals.push(Math.sin(angle*(j+0.5)));
			this.normals.push(0);
		
			this.normals.push(Math.cos(angle*(j+0.5)));
			this.normals.push(Math.sin(angle*(j+0.5)));
			this.normals.push(0);

			this.normals.push(Math.cos(angle*(j+0.5)));
			this.normals.push(Math.sin(angle*(j+0.5)));
			this.normals.push(0);
	}
}


console.log(this.vertices.length);

console.log(this.indices.length);

console.log(this.normals.length);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };