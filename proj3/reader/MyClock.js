/**
 * MyClock
 * @constructor
 */

 var NUM_SLICES = 12;
 var degToRad = Math.PI / 180.0;
 var HOUR_INCREMENT = 30;
 var MINUTE_INCREMENT = 6;
 var SECOND_INCREMENT = 6;
 
 function MyClock(scene) {
 	CGFobject.call(this,scene);

	this.ClockAppearance = new CGFappearance(scene);
	this.ClockAppearance.setAmbient(0.3,0.3,0.3,1);
	this.ClockAppearance.setDiffuse(1,1, 1, 1);
	this.ClockAppearance.setSpecular(0.2, 0.2, 0.2, 1);
	this.ClockAppearance.setShininess(60);
	this.ClockAppearance.loadTexture("../resources/images/clock.png");
	
	this.ClockHandAppearance = new CGFappearance(scene);
 	this.ClockHandAppearance.setAmbient(0.3,0.3,0.3,0.3);
	this.ClockHandAppearance.setDiffuse(0,0, 0, 0);
	this.ClockHandAppearance.setSpecular(0, 0,0, 0);
	this.ClockHandAppearance.setShininess(120);

	this.ClockHandAppearanceSeconds = new CGFappearance(scene);
 	this.ClockHandAppearanceSeconds.setAmbient(1,0,0,1);
	this.ClockHandAppearanceSeconds.setDiffuse(1,0, 0, 1);
	this.ClockHandAppearanceSeconds.setSpecular(1, 0,0, 1);
	this.ClockHandAppearanceSeconds.setShininess(120);

	this.materialDefault = new CGFappearance(scene);
	
	this.MyCylinder = new MyCylinder(scene, NUM_SLICES, 1);
	this.MyCircle = new MyCircle(scene, NUM_SLICES);
 	this.MyCylinder.initBuffers();
 	this.MyCircle.initBuffers();

 	this.MyClockHandHours = new MyClockHand(scene, -60, 1);
 	this.MyClockHandMinutes = new MyClockHand(scene, 60, 2);
 	this.MyClockHandSeconds = new MyClockHand(scene, 120, 3);

 };

 MyClock.prototype = Object.create(CGFobject.prototype);
 MyClock.prototype.constructor = MyClock;


 MyClock.prototype.update = function(currTime)
 {
	var hours;
	var minutes;
	var seconds;
	var secondsfluid;
	var minutesfluid;
	var hoursfluid;

	seconds = Math.trunc(currTime/1000);
	minutes = Math.trunc(seconds/60);
	minutesfluid = seconds/60;
	hours = Math.trunc(minutes/60);
	hoursfluid = minutes/60;

	seconds = seconds - (minutes * 60);
	minutes = minutes - (hours * 60);
	minutesfluid = minutesfluid - (hours * 60);


	this.MyClockHandHours.setAngle(-HOUR_INCREMENT*(hoursfluid+1)); //Este +1 corresponde à hora de verão
	this.MyClockHandMinutes.setAngle(-MINUTE_INCREMENT*minutesfluid);

	this.MyClockHandSeconds.setAngle(-SECOND_INCREMENT*seconds);

 };


 MyClock.prototype.display = function()
 {
 	
 	this.scene.pushMatrix();
 		this.scene.translate(0, 0, 0.5);
 		this.ClockAppearance.apply();
		this.MyCircle.display();
	this.scene.popMatrix();

	
	this.scene.pushMatrix();
		this.materialDefault.apply();
		this.MyCylinder.display();
	this.scene.popMatrix();
	
	//Hours
	//this.MyClockHandHours.setAngle(-90);
	this.scene.pushMatrix();
		this.scene.translate(0,0,0.5);	
		this.ClockHandAppearance.apply();
		this.MyClockHandHours.display();
		//console.log(this.MyClockHandHours.vertices);
	this.scene.popMatrix();

	//Minutes
	//this.MyClockHandMinutes.setAngle(180);
	this.scene.pushMatrix();
		this.scene.translate(0,0,0.5);	
		this.ClockHandAppearance.apply();
		this.MyClockHandMinutes.display();
	this.scene.popMatrix();

	//Seconds
	//this.MyClockHandSeconds.setAngle(-270);
	this.scene.pushMatrix();
		this.ClockHandAppearanceSeconds.apply();
		this.scene.translate(0,this.MyClockHandSeconds.scaley,0.5);
		this.MyClockHandSeconds.display();
	this.scene.popMatrix();



 }; 	