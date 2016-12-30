function MyScoreBoard(scene){
  this.scene = scene;
  this.font = new MyFont(this.scene);

  this.backBoard = new MyUnitCubeQuad(this.scene);

  this.gameInfo = new MyPanel(this.scene, this.font);
  this.p1Info = new MyPanel(this.scene, this.font);
  this.p2Info = new MyPanel(this.scene, this.font);
  this.p1Score = new MyPanel(this.scene, this.font);
  this.p2Score = new MyPanel(this.scene, this.font);

  this.mat = new CGFappearance(scene);
  this.mat.setAmbient(0.2,0.2,0.2,1);
  this.mat.setDiffuse(0.2,0.2,0.2,1);
  this.mat.setSpecular(0.2,0.2,0.2,1);

  this.text = new CGFtexture(scene, './resources/images/scoreboardwhite.jpg');
  this.mat.setTexture(this.text);

  this.initTextFields();
}

MyScoreBoard.prototype = Object.create(CGFobject.prototype);
MyScoreBoard.prototype.constructor=MyScoreBoard;

MyScoreBoard.prototype.initTextFields = function(){
  switch(this.scene.board.history.type){
    case 1:
      this.gameInfo.setText("Player vs Player");
      break;
    case 2:
      this.gameInfo.setText(" Player vs CPU ");
      break;
    case 3:
      this.gameInfo.setText("   CPU vs CPU  ");
      break;
    default:
      break;
  }
  this.p1Info.setText(this.scene.board.history.player1);
  this.p2Info.setText(this.scene.board.history.player2);
}

MyScoreBoard.prototype.setScoreString = function(){
  var pref = "0";

  var score1 = this.scene.board.history.p1Points;
  var f_score1;
  if(score1 < 10)
    f_score1 = pref + score1.toString();
  else {
    f_score1 = score1.toString();
  }

  this.p1Score.setText(f_score1);

  var score2 = this.scene.board.history.p2Points;
  var f_score2;
  if(score2 < 10)
    f_score2 = pref + score2.toString();
  else {
    f_score2 = score2.toString();
  }

  this.p2Score.setText(f_score2);
}

MyScoreBoard.prototype.display = function(){
  this.setScoreString();

  this.scene.setActiveShader(this.font.shader);
  this.scene.pushMatrix();
  this.mat.apply();

      this.scene.pushMatrix();
      this.scene.translate(7, 6, 0);
      this.gameInfo.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(6.5, 3, 0);
      this.p1Info.display();
      this.scene.translate(10, 0, 0);
      this.p2Info.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(9, 1, 0);
      this.p1Score.display();
      this.scene.translate(10, 0, 0);
      this.p2Score.display();
      this.scene.popMatrix();

  this.scene.setActiveShader(this.scene.defaultShader);
  this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(5, 0, 0);
      this.scene.scale(20, 8, 1);
      this.scene.translate(0.5, 0.5, -0.6);
      this.mat.apply();
      this.backBoard.display();
      this.scene.popMatrix();
}
