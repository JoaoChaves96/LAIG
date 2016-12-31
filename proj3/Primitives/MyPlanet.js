function MyPlanet(scene, texture){
  this.scene = scene;

  this.sphere = new MySphere(scene, 5, 30, 30);
  this.ring = new MyTorus(scene, 1, 6.5, 30, 30);

  this.matS = new CGFappearance(scene);
  this.matS.setTexture(new CGFtexture(scene, texture));

  this.matR = new CGFappearance(scene);
  this.matR.setTexture(new CGFtexture(scene, './resources/images/ring.png'));

  this.default = new CGFappearance(this);
}

MyPlanet.prototype = Object.create(CGFobject.prototype);
MyPlanet.prototype.constructor = MyPlanet;

MyPlanet.prototype.display = function(){
  this.scene.pushMatrix();
  this.matS.apply();
  this.sphere.display();
  this.scene.popMatrix();
  this.scene.pushMatrix();
  this.scene.rotate(-Math.PI/2, 1, 0, 0);
  this.scene.scale(1, 1, 0.1);
  this.matR.apply();
  this.ring.display();
  this.scene.popMatrix();
}
