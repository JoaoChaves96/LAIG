/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBoard(scene) {
	CGFobject.call(this, scene);

  this.finished = false;

	this.scene = scene;

	this.history = null;

  this.initBoardMatrix();

  this.initPiecesMatrix();
};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor=MyBoard;

MyBoard.prototype.initBoardMatrix = function(){
  this.matrix = [];
  var prevColor;
  for(var x=0; x<8; x++){
    this.matrix.push([]);
    for(var y=0; y<4; y++){
      if((x+y) % 2 == 0){
        prevColor = "white";
      }
      else {
        prevColor = "yellow";
      }
      this.matrix[x].push(new MyBoardCell(this.scene, x, y, new Cube(this.scene, 2, 0.2, 2), prevColor));
    }
  }
}

MyBoard.prototype.initPiecesMatrix = function(){
  this.pieces = [];

  for(var x=0; x<8; x++){
    this.pieces.push([]);
    for(var y=0; y<4; y++){
      if((x==0 && y==0) || (x==0 && y==1) || (x==1 && y==0) || (x==7 && y==3) || (x==7 && y==2) || (x==6 && y==3)){
        this.pieces[x].push(new MyQueen(this.scene, x, y));
      }

      else if((x==0 && y==2) || (x==1 && y==1) || (x==2 && y==0) || (x==7 && y==1) || (x==6 && y==2) || (x==5 && y==3)){
        this.pieces[x].push(new MyDrone(this.scene, x, y));
      }

      else if((x==1 && y==2) || (x==2 && y==2) || (x==2 && y==1) || (x==6 && y==1) || (x==5 && y==1) || (x==5 && y==2)){
        this.pieces[x].push(new MyPawn(this.scene, x, y));
      }

      else
        this.pieces[x].push("");
    }
  }
}

MyBoard.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.translate(0, 0, 15);
	var i = 0;
  for(var x=0; x<this.matrix.length; x++){
    for (var y=0; y<4; y++){
      this.scene.pushMatrix();
			this.scene.registerForPick(i, this.matrix[x][y]);
			i++;
			this.matrix[x][y].setId(i-1);
      this.matrix[x][y].display();
      this.scene.popMatrix();
      if(this.pieces[x][y] != ""){
        this.scene.pushMatrix();
				this.scene.registerForPick(i, this.pieces[x][y]);
				i++;
				this.pieces[x][y].setId(i-1);
        this.scene.multMatrix(this.matrix[x][y].transfMat);
        this.pieces[x][y].display();
        this.scene.popMatrix();
      }
    }
  }
}

MyBoard.prototype.make_move = function(xi, yi, xf, yf, playing, points){
	this.history.insertMove(new MyMove(this.scene, xi, yi, xf, yf, this.pieces[xi][yi], this.pieces[xf][yf], playing, points));
	this.pieces[xf][yf] = this.pieces[xi][yi];
	this.pieces[xi][yi] = "";

	this.pieces[xf][yf].x = xf;
	this.pieces[xf][yf].y = yf;
}

MyBoard.prototype.get_bot_move = function(msg){
	var yi = parseFloat(msg.substring(1,2));
	var xi = parseFloat(msg.substring(3,4));
	var yf = parseFloat(msg.substring(5,6));
	var xf = parseFloat(msg.substring(7,8));
	var np = parseFloat(msg.substring(9,10));

	this.make_move(xi, yi, xf, yf, this.history.playing, np);
}

MyBoard.prototype.showWinner = function(){
	if(this.history.p1Points > this.history.p2Points){
		this.winnerP = this.history.p1Points;
		this.winner = this.history.player1;
	} else{
		this.winner = this.history.player2;
		this.winnerP = this.history.p2Points;
	}
	console.log("The winner is " + this.winner + " with " + this.winnerP + " points!!");
	console.log(this.history.moves);
}

MyBoard.prototype.undo = function(){
	if(this.history.type == 1){
		var lastMove = this.history.moves[this.history.moves.length - 1];
		this.history.moves.pop();

		var xi = lastMove.xi;
		var yi = lastMove.yi;
		var xf = lastMove.xf;
		var yf = lastMove.yf;

		this.pieces[xf][yf] = lastMove.finalElement.type;
		this.pieces[xi][yi] = lastMove.initialElement.type;

		this.history.playing == lastMove.playing;
		this.scene.interface.playing = lastMove.playing;
		console.log(lastMove.playing);
	}
	else if(this.history.type == 2){
		var penultimateMove = this.history.moves[this.history.moves.length - 1];
		var lastMove = this.history.moves[this.history.moves.length - 1];

		this.history.moves.pop();
		this.history.moves.pop();

		var xi = lastMove.xi;
		var yi = lastMove.yi;
		var xf = lastMove.xf;
		var yf = lastMove.yf;

		this.pieces[xf][yf] = lastMove.finalElement.type;
		this.pieces[xi][yi] = lastMove.initialElement.type;

		var xi1 = penultimateMove.xi;
		var yi1 = penultimateMove.yi;
		var xf1 = penultimateMove.xf;
		var yf1 = penultimateMove.yf;

		this.pieces[xf1][yf1] = penultimateMove.finalElement.type;
		this.pieces[xi1][yi1] = penultimateMove.initialElement.type;
	}
}
