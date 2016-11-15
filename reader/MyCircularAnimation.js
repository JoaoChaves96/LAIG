function MyCircularAnimation(scene, id, type, span, centerx, centery, centerz, radius, startang, rotang){

  MyAnimation.call(this, scene, id, type , span);

  this.centerx = centerx;
  this.centery = centery;
  this.centerz = centerz;
  this.radius = radius;
  this.startang = startang * Math.PI / 180;
  this.rotang = rotang * Math.PI / 180;

  this.velocity = this.rotang/this.span;
};

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.apply = function(span){

  if(span > this.span)
    span = this.span;

  this.scene.translate(this.centerx, this.centery, this.centerz);

  var angle = this.startang + this.velocity * span;
  this.scene.rotate(angle, 0, 1, 0);

  this.scene.translate(this.radius, 0, 0);
};
