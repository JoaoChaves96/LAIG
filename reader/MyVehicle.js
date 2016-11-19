/**
 * @constructor
 */
 function MyVehicle(scene) {
   CGFobject.call(this, scene);
    this.scene = scene;

    var controlPoints=
    [	// U = 0
						[ // V = 0..3;
							 [ -1.5, -1.5, 0.5, 1 ],
							 [ -2.0, -2.0, 0.5, 1 ],
							 [ -2.0,  2.0, 0.5, 1 ],
							 [ -1.5,  1.5, 0.5, 1 ]

						],
						// U = 1
						[ // V = 0..3
							 [ 0, 0, 3.0, 1 ],
							 [ 0, -2.0, 3.0, 1 ],
							 [ 0,  2.0, 3.0, 1 ],
							 [ 0,  0, 3.0, 1 ]
						],
						// U = 2
						[ // V = 0..3
							 [ 1.5, -1.5, 0.5, 1 ],
							 [ 2.0, -2.0, 0.5, 1 ],
							 [ 2.0,  2.0, 0.5, 1 ],
							 [ 1.5,  1.5, 0.5, 1 ]
						]
					];

    this.patch = new MyPatch(this.scene, 2, 3, 10, 10, controlPoints);
    this.string1 =  new MyQuad(this.scene, -0.5,-0.5,0.5,0.5);
    this.cube = new MyUnitCubeQuad(this.scene);

    this.materialDefault = new CGFappearance(this.scene);

    this.materialA = new CGFappearance(this.scene);

    this.patchAppearance =  new CGFappearance(this.scene);
    this.patchAppearance.loadTexture("./resources/images/parachute.png");

    this.cubeAppearance =  new CGFappearance(this.scene);
    this.cubeAppearance.loadTexture("../resources/images/parachutecube.png");

    this.stringAppearance =  new CGFappearance(this.scene);
    this.stringAppearance.loadTexture("../resources/images/string.png");


  };

  MyVehicle.prototype = Object.create(CGFobject.prototype);
  MyVehicle.prototype.constructor = MyVehicle;

  MyVehicle.prototype.display = function(){

    // draws the path - top of the parachute
    this.scene.pushMatrix();
    this.scene.translate(1,2,0.5);
    this.scene.scale(0.5,0.5,0.5);
    this.scene.rotate(-Math.PI/2, 1,0,0);
    this.patchAppearance.apply();
    this.patch.display();
    this.scene.popMatrix();

    // draws cube , bottom part of th parachute
    this.scene.pushMatrix();
    this.scene.translate(1,1,0.75);
    this.scene.scale(0.5,0.5,0.5);
    this.cube.display();
    this.scene.popMatrix();

    // draws parachute strings

    //1
    this.scene.pushMatrix();
    this.scene.rotate(30*Math.PI/180, 0,0,1);
    this.scene.translate(1.25,0.65,1);
    this.scene.scale(0.05,1.2,1);
    this.string1.display();
    this.ro
    this.scene.popMatrix();

    //2
    this.scene.pushMatrix();
    this.scene.rotate(30*Math.PI/180, 0,0,1);
    this.scene.translate(1.25,0.65,0.5);
    this.scene.scale(0.05,1.2,1);
    this.string1.display();
    this.scene.popMatrix();

    //3
    this.scene.pushMatrix();
    this.scene.rotate(-30*Math.PI/180, 0,0,1);
    this.scene.translate(0.45,1.65,1);
    this.scene.scale(0.05,1.2,1);
    this.string1.display();
    this.scene.popMatrix();

    //4
    this.scene.pushMatrix();
    this.scene.rotate(-30*Math.PI/180, 0,0,1);
    this.scene.translate(0.45,1.65,0.5);
    this.scene.scale(0.05,1.2,1);
    this.string1.display();
    this.scene.popMatrix();

  };
