function MyChessBoard(scene, du, dv, textureid, su, sv, c1, c2, cs){
  CGFobject.call(this, scene);
  this.scene = scene;
  this.du = du;
  this.dv = dv;
  this.text = textureid;
  this.su = su;
  this.sv = sv;
  this.c1 = vec4.fromValues(c1[0], c1[1], c1[2], c1[3]);
  this.c2 = vec4.fromValues(c2[0], c2[1], c2[2], c2[3]);
  this.cs = vec4.fromValues(cs[0], cs[1], cs[2], cs[3]);

  this.plane = new MyPlane(this.scene, 1.0, 1.0, this.du * 4, this.dv * 4);

  this.texture = new CGFappearance(this.scene);
  this.texture.loadTexture(this.text);

  this.shader = new CGFshader(this.scene.gl, "shaders/board.vert", "shaders/board.frag");
  this.shader.setUniformsValues({du : this.du});
  this.shader.setUniformsValues({dv : this.dv});
  this.shader.setUniformsValues({su : this.su});
  this.shader.setUniformsValues({sv : this.sv});
  this.shader.setUniformsValues({c1 : this.c1});
  this.shader.setUniformsValues({c2 : this.c2});
  this.shader.setUniformsValues({cs : this.cs});

  this.initBuffers();
};

MyChessBoard.prototype = Object.create(CGFobject.prototype);
MyChessBoard.prototype.constructor = MyChessBoard;

MyChessBoard.prototype.display = function(){
  this.texture.apply();
  this.scene.setActiveShader(this.shader);
    this.plane.display();
  this.scene.setActiveShader(this.scene.defaultShader);
}
