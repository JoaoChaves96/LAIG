/**
 * MyClock
 * @constructor
 */
 function MyClock(scene, topAppearance) {
 	CGFobject.call(this,scene);

 	this.scene = scene;
	this.cylinder = new MyCylinder(scene, 12, 1, true, topAppearance);
	
	this.hours = new MyClockHand(scene,0.5);
	this.minutes = new MyClockHand(scene, 0.75);
	this.seconds = new MyClockHand(scene, 1);
	
	this.seconds.setAngle(360/60*45);
	this.minutes.setAngle(360/60*30 + this.seconds.angle/60);
	this.hours.setAngle(360/12*3 + this.minutes.angle/60);
	
	this.lastTime;
 };

 MyClock.prototype = Object.create(CGFobject.prototype);
 MyClock.prototype.constructor = MyClock;

 MyClock.prototype.display = function()
 {
	 this.scene.pushMatrix();
	 	this.scene.scale(1, 1, 0.1);
	 	this.cylinder.display();
	 this.scene.popMatrix();
	 
	 this.scene.pushMatrix();
	 	this.scene.translate(0, 0, 0.1);
	 	this.hours.display();
	 this.scene.popMatrix();
	 
	 this.scene.pushMatrix();
	 	this.scene.translate(0, 0, 0.1);
	 	this.minutes.display();
	 this.scene.popMatrix();
	 
	 this.scene.pushMatrix();
	 	this.scene.translate(0, 0, 0.1);
	 	this.seconds.display();
	 this.scene.popMatrix();
 };
 
 MyClock.prototype.update = function(currTime)
 {
	 lastTime = this.lastTime || currTime;
	 this.lastTime = currTime;
	 
	 deltaTime = currTime - lastTime;
	 
	 var deltaAngle;
	 
	 deltaAngle = (deltaTime * 360 / 60 / 1000)
	 this.seconds.setAngle(this.seconds.angle + deltaAngle);
	 
	 deltaAngle = deltaAngle / 60;
	 this.minutes.setAngle(this.minutes.angle + deltaAngle);
	 
	 deltaAngle = deltaAngle / 24;
	 this.hours.setAngle(this.hours.angle + deltaAngle);
 }
