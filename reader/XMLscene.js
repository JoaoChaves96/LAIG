
function XMLscene() {
  CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.initLights();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis=new CGFaxis(this);

  this.enableTextures(true);

  this.materials = new Stack(null);
  this.textures = new Stack(null);

  /*this.materialDefault = new CGFappearance(this);

  this.floorAppearance = new CGFappearance(this);
  this.floorAppearance.setAmbient(0.3,0.3,0.3,1);
  this.floorAppearance.setDiffuse(1,1, 1, 1);
  this.floorAppearance.setSpecular(0.2, 0.2, 0.2, 1);
  this.floorAppearance.setShininess(100);
  this.floorAppearance.loadTexture("resources/images/floor.png");
  this.floorAppearance.setTextureWrap('REPEAT', 'REPEAT');

  this.materialB = new CGFappearance(this);
  this.materialB.setAmbient(0.3,0.3,0.3,1);
  this.materialB.setDiffuse(1,1,1,1);
  this.materialB.setSpecular(0,0.2,0.2,1);
  this.materialB.setShininess(100);
  this.materialB.loadTexture("resources/images/marmore.jpg");

  this.materialA = new CGFappearance(this);
  this.materialA.setAmbient(0.3,0.3,0.3,1);
  this.materialA.setDiffuse(1,1,1,1);
  this.materialA.setSpecular(0,0.2,0.2,1);
  this.materialA.setShininess(100);
  this.materialA.loadTexture("resources/images/wood.jpg");

  this.materialC = new CGFappearance(this);
  this.materialC.setAmbient(0.3,0.3,0.3,1);
  this.materialC.setDiffuse(1,1,1,1);
  this.materialC.setSpecular(0,0.2,0.2,1);
  this.materialC.setShininess(100);
  this.materialC.loadTexture("resources/images/pillow.jpg");*/
};

XMLscene.prototype.initLights = function () {

  this.setGlobalAmbientLight(0,0,0, 1.0);
};

XMLscene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
  this.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
  //this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
  this.gl.clearColor(0,0,0,1);
  this.lights[0].setVisible(true);
  this.lights[0].enable();
};

XMLscene.prototype.loadLights = function(){
  for(var i = 0; i < this.graph.lights.length; i++){
    this.lights[i].setPosition(this.graph.lights[i].location[0],this.graph.lights[i].location[1],this.graph.lights[i].location[2],this.graph.lights[i].location[3]);
    this.lights[i].setAmbient(this.graph.lights[i].ambient[0],this.graph.lights[i].ambient[1],this.graph.lights[i].ambient[2],this.graph.lights[i].ambient[3]);
    this.lights[i].setDiffuse(this.graph.lights[i].diffuse[0],this.graph.lights[i].diffuse[1],this.graph.lights[i].diffuse[2],this.graph.lights[i].diffuse[3]);
    this.lights[i].setSpecular(this.graph.lights[i].specular[0],this.graph.lights[i].specular[1],this.graph.lights[i].specular[2],this.graph.lights[i].specular[3]);
    this.lights[i].update();
  }
};

XMLscene.prototype.updateLights = function(){
  for(var i = 0; i < this.graph.lights.length; i++){
    var light = this.graph.lights[i];
    if (light.enabled)
      this.lights[i].enable();
    else {
      this.lights[i].disable();
    }
  };

  this.loadLights();
  for (var i = 0; i < this.lights.length; i++)
  this.lights[i].update();

};

XMLscene.prototype.processGraph = function(nodeName){
  var texture = new CGFappearance(this);
  var material = null;
  if(nodeName != null){
    var node = this.graph.nodes[nodeName];
    if(node.material[0] != "inherit"){
      this.materials.push(this.graph.materials[node.material[0]]);
      material = this.materials.top();
    }
    else {
      this.materials.push(this.materials.top());
    }
    if(material != null){
      material.apply();
      this.materials.pop();
    }

    if (node.texture != "none"){
      if (node.texture != "inherit"){
        this.textures.push(this.graph.textures[node.texture].file);
        texture.setTexture(this.textures.top());
        texture.apply();
      }else {
        this.textures.push(this.textures.top());
      }
    }

    this.textures.pop();

    this.multMatrix(node.mat);
    if(node.primitive != null){
      this.pushMatrix();
        node.primitive.display();
      this.popMatrix();
    }

    for (var i = 0; i < node.getSize(); i++){
      this.pushMatrix();
      this.processGraph(node.children[i]);
      this.popMatrix();
    }
  }
};

XMLscene.prototype.display = function () {
  // ---- BEGIN Background, camera and axis setup

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  // Draw axis
  this.axis.display();

/*  this.quad = new MyUnitCubeQuad(this);
  this.cylinder = new MyCylinder(this, 10, 10);

  this.floor = new MyQuad(this, 0, 7, 0, 7);

  this.pushMatrix();
  this.translate(2.5,0,2.5);
  this.scale(5, 0.2, 5);
  this.rotate(-Math.PI/2, 1, 0, 0);
  this.floorAppearance.apply();
  this.floor.display();
  this.popMatrix();
  this.materialDefault.apply();

  this.pushMatrix();

  this.translate(3, 1, 3);
  this.rotate(Math.PI/2, 0, 1, 0);
  this.scale(0.75,0.75,0.75);

  this.materialA.apply();

  this.pushMatrix();
  this.translate(0, 1, 0);
  this.scale(0.25,2,0.25);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.translate(0, 1, 1);
  this.scale(0.25,2,0.25);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.scale(0.25, 0.75, 1);
  this.translate(0, 1.35, 0.5);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.scale(1.25,0.25,1.25);
  this.translate(0.4,-0.5,0.4);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.translate(0, -0.8, 0);
  this.scale(0.25,1.2,0.25);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.translate(0, -0.8, 1);
  this.scale(0.25,1.2,0.25);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.translate(1, -0.8, 0);
  this.scale(0.25,1.2,0.25);
  this.quad.display();
  this.popMatrix();

  this.pushMatrix();
  this.translate(1, -0.8, 1);
  this.scale(0.25,1.2,0.25);
  this.quad.display();
  this.popMatrix();

  this.popMatrix();

  this.materialDefault.apply();

  this.pushMatrix();

  this.translate(3.5, 1, 2);

  this.materialB.apply();
  this.pushMatrix();
  this.translate(0,1,0);
  this.scale(3, 0.125, 1.5);
  this.quad.display();
  this.popMatrix();


  this.pushMatrix();
  this.rotate(Math.PI/2, 1,0,0);
  this.translate(1.2,0.5,0);
  this.scale(0.1,0.1,2);
  this.cylinder.display();
  this.popMatrix();

  this.pushMatrix();
  this.rotate(Math.PI/2, 1,0,0);
  this.translate(1.2,-0.5,0);
  this.scale(0.1,0.1,2);
  this.cylinder.display();
  this.popMatrix();

  this.pushMatrix();
  this.rotate(Math.PI/2, 1,0,0);
  this.translate(-1.2,0.5,0);
  this.scale(0.1,0.1,2);
  this.cylinder.display();
  this.popMatrix();

  this.pushMatrix();
  this.rotate(Math.PI/2, 1,0,0);
  this.translate(-1.2,-0.5,0);
  this.scale(0.1,0.1,2);
  this.cylinder.display();
  this.popMatrix();

  this.popMatrix();

  this.materialDefault.apply();

  this.pillow=new MyTorus(this, 0.5, 1, 20, 20);

  this.pushMatrix();
  this.scale(0.25, 0.15, 0.25);
  this.translate(-0.25,0.5,2.5);
  this.rotate(-Math.PI/2,1, 0, 0);
  this.materialC.apply();
  this.pillow.display();
  this.popMatrix();

  this.materialDefault.apply();


  this.setDefaultAppearance();*/


  /*  for(var i = 0; i < Object.keys(this.graph.primitives).length; i++){
  console.log(this.graph.primitives["cylinder1"].slices);
}*/

// ---- END Background, camera and axis setup

// it is important that things depending on the proper loading of the graph
// only get executed after the graph has loaded correctly.
// This is one possible way to do it
if (this.graph.loadedOk)
{
  this.processGraph("root");
  this.loadLights();
  this.updateLights();
};
};
