
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.quad = new MyUnitCubeQuad(this);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {
    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setAmbient(0, 0, 0, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setVisible(true);
    this.lights[0].enable();
    this.lights[0].update();
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
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
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
  for(var i = 0; i < this.lights.length; i++){
    this.lights[i].setVisible(true);
    if (this.graph.lights[i].enabled)
      this.lights[i].enable();
    else {
      this.lights[i].disable();
    }
  }

  for (var i = 0; i < this.lights.length; i++)
    this.lights[i].update();

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

  this.quad.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};
};
