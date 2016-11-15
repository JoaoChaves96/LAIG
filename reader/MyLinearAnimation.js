function MyLinearAnimation(scene, id, type, span, points){
  MyAnimation.call(scene, id, type, span);

  this.contorlPoints = points;
}
