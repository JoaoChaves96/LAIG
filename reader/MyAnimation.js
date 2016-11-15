function MyAnimation(scene, id, type, span){
  this.scene = scene;
  this.id = id;
  this.type = type;
  this.span = span;
}

MyAnimation.prototype.apply = function(dt){}
