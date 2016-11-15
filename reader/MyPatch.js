/**
 * @constructor
 */
 function MyPatch(scene, orderU, orderV, divX, divY, controlP) {
    this.scene = scene;

    var knots1 = this.getKnotsVector(orderU);
  	var knots2 = this.getKnotsVector(orderV);

    this.orderU = orderU;
    this.orderV = orderV;

    this.dX = divX;
    this.dY = divY;

    this.controlPoints = controlP;

    var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knots1, knots2, this.controlPoints);
    getSurfacePoint = function(u, v){
      return nurbsSurface.getPoint(u,v);
    };

    this.patch = new CGFnurbsObject(this.scene, getSurfacePoint, this.dX, this.dY);

    var p = [[0, 0, 0], [10, 0, 0], [10, 10, 0]];
    this.animation = new MyCircularAnimation(scene, "0", "circular", 10, 0, 0, 0, 0, 0, 90);

  };

  MyPatch.prototype = Object.create(CGFobject.prototype);
  MyPatch.prototype.constructor = MyPatch;

  MyPatch.prototype.getKnotsVector = function(degree){
    var v = new Array();
    for (var i=0; i<=degree; i++) {
      v.push(0);
    }
    for (var i=0; i<=degree; i++) {
      v.push(1);
    }
    return v;
  }

  MyPatch.prototype.display = function(time){
    this.animation.apply(time);
    this.patch.display();
  };
