/**
 * MyAnimatedPiece
 * @constructor
 */
 function MyAnimatedPiece(timeSpan, piece, xi, yi, xf, yf) {
   MyAnimation.apply(this, arguments);
   this.deltaX = (xi-xf)/2;
   this.deltaZ = -(yi-yf)/2;
   this.deltaY = 1;

   this.xf = xf;
   this.yf = yf;

   this.piece = piece;

   this.timeSpan = timeSpan;

   this.initialTime = this.piece.scene.time;


  // mat4.translate(this.matrix, this.matrix, [this.deltaX, 0, this.deltaZ]);
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

  var movementRatio = 1 - timePassed/this.timeSpan;

  if(timePassed >= this.timeSpan){
    this.piece.moving = false;
    this.piece.animation = null;
    return;
  }

  if(timePassed < this.timeSpan/2){
    //mat4.translate(this.matrix, this.matrix, [2*this.deltaX*movementRatio, 2*this.deltaY*movementRatio, 2*this.deltaZ*movementRatio]);
    mat4.translate(this.matrix, this.matrix, [2*this.deltaX*movementRatio, -2*movementRatio, 2*this.deltaZ*movementRatio]);
  }
  else {
  //mat4.translate(this.matrix, this.matrix, [2*this.deltaX*movementRatio, 2*movementRatio, 0]);
  mat4.translate(this.matrix, this.matrix, [2*this.deltaX*movementRatio, 2*movementRatio, 2*this.deltaZ*movementRatio]);
}

};

MyAnimatedPiece.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
