/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBoard(scene) {
	CGFobject.call(this, scene);

  this.finished = false;

	this.scene = scene;

  this.initBoardMatrix();

  this.initPiecesMatrix();

  this.p1 = "player1";
	this.p1Points = 0;
  this.p2 = "player2";
	this.p2Points = 0;

	this.playing = this.p1;
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
	this.pieces[xf][yf] = this.pieces[xi][yi];
	this.pieces[xi][yi] = "";

	this.pieces[xf][yf].x = xf;
	this.pieces[xf][yf].y = yf;

	this.history.insertMove(xi, yi, xf, yf, playing, points);
}

MyBoard.prototype.get_bot_move = function(msg){
	xi = parseFloat(msg.substring(1,2));
	yi = parseFloat(msg.substring(3,4));
	xf = parseFloat(msg.substring(5,6));
	yf = parseFloat(msg.substring(7,8));

	this.make_move(xi, yi, xf, yf);
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
}
