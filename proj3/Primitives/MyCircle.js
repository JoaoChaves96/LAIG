/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCircle(scene, slices) {
	CGFobject.call(this, scene);

	this.slices = slices;

	this.initBuffers();
};


MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function() {
	this.vertices = [];
	this.indices = [];

	this.normals = [];
	this.texCoords = [];


	var angle = 2*Math.PI/this.slices;

	for(var i = 0; i < this.slices; i++)
	{
		this.vertices.push(Math.cos(angle*i), Math.sin(angle*i), 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(Math.cos(angle*i)/2+0.5, 0.5 - Math.sin(angle*i)/2);
	}
	this.texCoords.push(0.5,0.5);

	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);

	for(var i = 0; i < this.slices-1; i++)
	{
		this.indices.push(i);
		this.indices.push(i+1);
		this.indices.push(this.slices);
	}
		this.indices.push(this.slices-1);
		this.indices.push(0);
		this.indices.push(this.slices);

	this.primitiveType=this.scene.gl.TRIANGLES;
	
	this.initGLBuffers();

	
};