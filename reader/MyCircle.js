/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {
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


 	angleIncrement = (2*Math.PI)/this.slices;

 	angle = 0;

 	for(i = 0; i < this.slices; i++)
 	{
        this.vertices.push(Math.cos(angle)*0.5, Math.sin(angle)*0.5, 0);
        this.texCoords.push(Math.cos(angle)*0.5+0.5, -Math.sin(angle)*0.5+0.5);

        angle += angleIncrement;

        console.log(this.slices, i, (i+1)%this.slices);
        this.indices.push(this.slices, i, (i+1)%this.slices);
        this.normals.push(0, 0, 1);
 	}
 	
 	this.vertices.push(0, 0, 0);
 	this.texCoords.push(0.5, 0.5);
 	this.normals.push(0, 0, 1);

 	console.log(this.vertices.length);
 	console.log(this.indices.length);
 	console.log(this.normals.length);
 	console.log(this.texCoords.length);



 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
