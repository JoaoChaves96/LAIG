/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBoard(scene) {
	CGFobject.call(this, scene);

  this.finished = false;

  this.initBoardMatrix();

  this.initPiecesMatrix();

  this.p1 = "Player 1";
  this.p2 = "Player 2";
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
        this.pieces[x].push(new MyQueen(this.scene));
      }

      else if((x==0 && y==2) || (x==1 && y==1) || (x==2 && y==0) || (x==7 && y==1) || (x==6 && y==2) || (x==5 && y==3)){
        this.pieces[x].push(new MyDrone(this.scene));
      }

      else if((x==1 && y==2) || (x==2 && y==2) || (x==2 && y==1) || (x==6 && y==1) || (x==5 && y==1) || (x==5 && y==2)){
        this.pieces[x].push(new MyPawn(this.scene));
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
