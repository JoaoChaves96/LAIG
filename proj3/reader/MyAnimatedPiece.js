/**
 * MyAnimatedPiece
 * @constructor
 */
 function MyAnimatedPiece(timeSpan, piece, xi, yi, xf, yf) {
   MyAnimation.apply(this, arguments);
   this.deltaX = xi-xf;
   this.deltaZ = yi-yf;

   this.piece = piece;

   this.timeSpan = timeSpan;

   this.initialTime = this.piece.scene.time;

   this.matrix = mat4.create();
   mat4.translate(this.matrix, this.matrix, [this.deltaX, 0, this.deltaZ]);
 }

MyAnimatedPiece.prototype = new MyAnimation();
MyAnimatedPiece.prototype.constructor = MyAnimatedPiece;

MyAnimatedPiece.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyAnimatedPiece.prototype.update = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;
  this.matrix = mat4.create();

  if(timePassed >= this.timeSpan){
    this.piece.moving = false;
    this.piece.animation = null;
    return;
  }
  var movementRatio = 1 - timePassed/this.timeSpan;

  mat4.translate(this.matrix, this.matrix, [this.deltaX*movementRatio, 0, this.deltaZ*movementRatio]);
};

MyAnimatedPiece.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
