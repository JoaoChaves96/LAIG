function MyPanel(scene, font){
  this.scene = scene;
  this.font = font;

  this.quad = new MyUnitCubeQuad(this.scene);
  this.rect = new MyQuad(this.scene, 0, 0, 1, 1);

  this.mat = new CGFappearance(scene);
  this.mat.setAmbient(0.2,0.2,0.2,1);
  this.mat.setDiffuse(0.2,0.2,0.2,1);
  this.mat.setSpecular(0.2,0.2,0.2,1);

  this.text = "";
}

MyPanel.prototype = Object.create(CGFobject.prototype);
MyPanel.prototype.constructor=MyPanel;

MyPanel.prototype.setText = function(string){
  this.text = string;
}

MyPanel.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.setActiveShader(this.font.shader);
    this.scene.pushMatrix();
    for(var i = 0;  i< this.text.length; i++){
      var letter = this.text.charAt(i);
      if(letter != ' ')
        this.font.displayFont(letter, this.rect);
      this.scene.translate(1, 0, 0);
    }
    this.scene.popMatrix();

    this.scene.scale(this.text.length, 1, -0.16);
    this.scene.translate(0.5, 0.5, 0.6);
    this.mat.apply();
    this.quad.display();
  this.scene.setActiveShader(this.scene.defaultShader);
  this.scene.popMatrix();
}
