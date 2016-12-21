/**
 * MyClockHand
 * @constructor
 */
 var degToRad = Math.PI / 180.0;

 var NUMSLICES = 8;
 var NUMSTACKS = 1;
 function MyClockHand(scene, angle, type) {
 	CGFobject.call(this,scene);
 	
 	this.angle = angle;
 	this.scalex = 0;
    this.scaley = 0;
    this.scalez = 0;
    if(type == 1)/* Hours*/
    {
      this.scalex = 1/16;
      this.scaley = 1/16;
      this.scalez =0.4;
    }
 	else if(type == 2)/*Minutes*/
 	{
 	  this.scalex = 1/24;
      this.scaley =1/24;
      this.scalez = 0.6;
 	}
 	else if(type == 3)/*Seconds*/
 	{
 	  this.scalex = 1/32;
      this.scaley = 1/32;
      this.scalez = 0.7;
 	}
 	else
 	{
 	  this.scalex = 1;
      this.scaley = 1;
      this.scalez = 1;
 	}
    this.MyCylinder = new MyCylinder(scene, NUMSLICES, NUMSTACKS);
 	this.initBuffers();
 };

 MyClockHand.prototype = Object.create(CGFobject.prototype);
 MyClockHand.prototype.constructor = MyClockHand;


 MyClockHand.prototype.setAngle = function(angulo)
 {
   this.angle = angulo; //In degrees
 };

 MyClockHand.prototype.display = function()
 {
    this.scene.pushMatrix();
       this.scene.rotate(this.angle*1*degToRad, 0, 0,1);
       this.scene.translate(0, this.scalez/2, 0);//Coloca uma extremidade do ponteiro na origem
       this.scene.rotate(-90*degToRad, 1,0,0);
       this.scene.scale(this.scalex, this.scaley, this.scalez);
       this.MyCylinder.display();
      // console.log(this.MyCylinder.vertices);
    this.scene.popMatrix();
 };