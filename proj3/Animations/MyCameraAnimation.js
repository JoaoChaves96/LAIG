function MyCameraAnimation(origin, destination){
  this.origin = origin;
  this.destination = destination;

  this.span = 250000;

  var originPos = this.origin.position;
  var destPost = this.destination.position;

  this.positionDist = vec3.create();

  vec3.subtract(this.positionDist, destPost, originPos);

  this.positionVel = vec3.create();
  this.positionVel[0] = this.positionDist[0] / this.span;
  this.positionVel[1] = this.positionDist[1] / this.span;
  this.positionVel[2] = this.positionDist[2] / this.span;

  this.travelledPositionDist = vec3.create(0,0,0);

  var originDir = this.origin.direction;
  var destDir = this.destination.direction;

  this.directionDist = vec3.create();

  vec3.subtract(this.directionDist, destDir, originDir);

  this.directionVel = vec3.create();
  this.directionVel[0] = this.directionDist[0] / this.span;
  this.directionVel[1] = this.directionDist[1] / this.span;
  this.directionVel[2] = this.directionDist[2] / this.span;

  this.travelledDirectionDist = vec3.create(0,0,0);
}
