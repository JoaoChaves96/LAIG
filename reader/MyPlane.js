/**
 * @constructor
 */
 function MyPlane(scene, divX, divY) {
    this.scene = scene;

    this.dX = divX;
    this.dY = divY;

    var knots1 = this.getKnotsVector(1);
  	var knots2 = this.getKnotsVector(1);

    this.controlPoints = [
                            [
                              [-this.dX/2, -this.dY/2, 0, 1],
                              [-this.dX/2, this.dY/2, 0, 1]
                            ],

                            [
                              [this.dX/2, -this.dY/2, 0, 1],
                              [this.dX/2, this.dY/2, 0, 1]
                            ]
    ];

    var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, this.controlPoints);
    getSurfacePoint = function(u, v){
      return nurbsSurface.getPoint(u,v);
    };

    this.plane = new CGFnurbsObject(this.scene, getSurfacePoint, this.dX, this.dY);

  };

  MyPlane.prototype = Object.create(CGFobject.prototype);
  MyPlane.prototype.constructor = MyPlane;

  MyPlane.prototype.getKnotsVector = function(degree){
    var v = new Array();
    for (var i=0; i<=degree; i++) {
      v.push(0);
    }
    for (var i=0; i<=degree; i++) {
      v.push(1);
    }
    return v;
  }

  MyPlane.prototype.display = function(){
    this.plane.display();
  };
