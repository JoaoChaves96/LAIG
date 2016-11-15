function MyCircularAnimaton(scene, id, type, span, centerx, centery, centerz, radius, startang, rotang){
  MyAnimation.call(scene, id, type , span);

  this.centerx = centerx;
  this.centery = centery;
  this.centerz = centerz;
  this.radius = radius;
  this.startang = startang * Math.PI / 180;
  this.rotang = rotang = Math.PI / 180;
}
