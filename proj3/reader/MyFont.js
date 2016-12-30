function MyFont(scene){
  this.scene = scene;
  this.shader = new CGFshader(scene.gl, './shaders/font.vert', './shaders/font.frag');

  this.shader.setUniformsValues({'dims' : [13, 7]});

  this.mat = new CGFappearance(scene);

  this.mat.setAmbient(0.5,0.5,0.5,1);
  this.mat.setDiffuse(0.5,0.5,0.5,1);
  this.mat.setSpecular(0,0,0,1);
  this.mat.setShininess(100);

  this.text = new CGFtexture(scene, './resources/images/font.png');
  this.mat.setTexture(this.text);

  this.background = new CGFappearance(scene);
  this.background.setAmbient(0,0,0,1);
  this.background.setSpecular(0,0,0,1);
  this.background.setShininess(100);
}

MyFont.prototype.constructor = MyFont;

MyFont.prototype.getChar = function(char){

  var code = char.toLowerCase().charCodeAt(0);

  if(code >= '0'.charCodeAt(0) && code <= '<'.charCodeAt(0))
    return [code-'0'.charCodeAt(0), 1];
  else if(code >= 'a'.charCodeAt(0) && code <= 'i'.charCodeAt(0))
    return [code-'a'.charCodeAt(0)+4, 2];
  else if(code >= 'j'.charCodeAt(0) && code <= 'v'.charCodeAt(0))
    return [code-'j'.charCodeAt(0), 3];
  else if(code >= 'w'.charCodeAt(0) && code <= 'z'.charCodeAt(0))
    return [code-'w'.charCodeAt(0), 4];
}

MyFont.prototype.displayFont = function(char, object){
  var pos = this.getChar(char);
  this.shader.setUniformsValues({'charCoords' : pos});
  this.mat.apply();
  object.display();
}
