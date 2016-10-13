/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene) {
	CGFobject.call(this,scene);

	this.initBuffers();
};

function MyQuad(scene, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.initBuffers2(minS, maxS, minT, maxT);
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers2 = function (minS, maxS, minT, maxT) {
	this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0

			];

	this.indices = [
            0, 1, 2,
			3, 2, 1
        ];

	this.primitiveType=this.scene.gl.TRIANGLES;

	this.normals = [
	0,0,1,
	0,0,1,
	0,0,1,
	0,0,1
	];

	this.texCoords = [
minS, maxT ,
maxS, maxT ,
minS, minT ,
maxS, minT
];

	this.initGLBuffers();


};

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0

			];

	this.indices = [
            0, 1, 2,
			3, 2, 1
        ];

	this.primitiveType=this.scene.gl.TRIANGLES;

	this.normals = [
	0,0,1,
	0,0,1,
	0,0,1,
	0,0,1
	];

	this.texCoords = [
0, 1 ,
1, 1 ,
0, 0 ,
1, 0
];

	this.initGLBuffers();
};
