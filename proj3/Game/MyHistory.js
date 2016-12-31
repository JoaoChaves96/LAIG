function MyHistory(scene){
  this.scene = scene;
  this.player1 = 'player1';
  this.player2 = 'player2';
  this.playing = this.player1;
  this.p1Points = 0;
  this.p2Points = 0;

  switch(this.scene.interface.type){
    case 'P vs P':
      this.type = 1;
      break;
    case 'P vs CPU':
      this.type = 2;
      break;
    case 'CPU vs CPU':
      this.type = 3;
      break;
    default:
      break;
  }

  if (this.scene.interface.difficulty == 'Dumb')
    this.difficulty = 1;
  else
    this.difficulty = 2;

  this.moves = [];

  this.p1Captured = [];
  this.p1CapturedX = 0;

  this.p2Captured = [];
  this.p2CapturedX = 7;
}

MyHistory.prototype.insertMove = function(move){
  this.moves.push(move);
  if(this.playing == this.player1){
    this.playing = this.player2;
    this.p1Points = move.points;
  } else {
    this.playing = this.player1;
    this.p2Points = move.points;
  }

  this.scene.interface.p1Points = this.p1Points;
  this.scene.interface.p2Points = this.p2Points;
  this.scene.interface.playing = this.playing;
}

MyHistory.prototype.capture = function(piece, x, y, player){
  if(player == this.player1){
    var xPos = this.p1CapturedX + (this.p1Captured.length % 8);
    if(Math.floor(this.p1Captured.length/8) >= 1)
      var zPos = -2.5;
    else {
      zPos = -1.5;
    }
    piece.animation = new MyAnimatedPiece(1, piece, x, y, xPos, zPos);
    piece.moving = true;
    piece.x = xPos;
    piece.y = zPos;
    console.log(xPos);
    this.p1Captured.push(piece);
  }
  else {
    var xPos = this.p2CapturedX - (this.p2Captured.length % 8);
    if(Math.floor(this.p2Captured.length/8) >= 1)
      var zPos = 5.5;
    else {
      zPos = 4.5;
    }
    piece.animation = new MyAnimatedPiece(1, piece, x, y, xPos, zPos);
    piece.moving = true;
    piece.x = xPos;
    piece.y = zPos;
    this.p2Captured.push(piece);
  }
}
