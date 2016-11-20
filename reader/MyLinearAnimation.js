function MyLinearAnimation(scene, id, type, span, points){
  MyAnimation.call(this, scene, id, type, span);

  this.controlPoints = points;
  this.distance = 0;
  this.segmentDistances = [];
  this.angle = 0;

  for(var i = 0; i < points.length - 1; i++){
    this.distance += vec3.dist(vec3.fromValues(points[i+1][0], points[i+1][1], points[i+1][2]), vec3.fromValues(points[i][0], points[i][1], points[i][2]));
    this.segmentDistances.push(this.distance);
  }

  this.velocity = this.distance / this.span;
  this.complete = false;
  this.elapsedTime = 0;
};

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.apply = function(currTime, node){
  if(this.elapsedTime == 0) this.elapsedTime = currTime;
     var span = currTime-this.elapsedTime;
     if(span > this.span){
       span = this.span;

       this.complete = true;
     }

      /* if(node.animationIndex < node.animations.length)
         node.animationIndex++;*/

  this.currDist = this.velocity * span;

  //finds current segment index - i
  var i = 0;
  while(this.currDist > this.segmentDistances[i] && i < this.segmentDistances.length - 1)
    i++;

  //control points of the current segment
  var p1 = this.controlPoints[i];
  var p2 = this.controlPoints[i+1];

  var distPoint1 = p2[0] - p1[0];
  var distPoint2 = p2[1] - p1[1];
  var distPoint3 = p2[2] - p1[2];

  var lastDist;
  if(i == 0)
    lastDist = 0;
  else
    lastDist = this.segmentDistances[i - 1];

  var displacement = (this.currDist - lastDist) / (this.segmentDistances[i] - lastDist);

  var rotAngle = Math.atan((p2[0] - p1[0]) / (p2[2] - p1[2]));

  if ((p2[2] - p1[2]) < 0){
    rotAngle += Math.PI;
  }

  if (p2[0] - p1[0] == 0 && p2[2] - p1[2] == 0){
    rotAngle = this.angle;
  }

  this.angle = rotAngle;

  this.scene.translate(distPoint1 * displacement + p1[0], distPoint2 * displacement + p1[1], distPoint3 * displacement + p1[2]);
  this.scene.rotate(rotAngle, 0, 1, 0);
};
