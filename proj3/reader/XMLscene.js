
function XMLscene(myInterface) {
  CGFscene.call(this);
  this.interface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();
  this.setUpdatePeriod(100/6);

  this.startTime = 0;

  this.c = new MyVehicle(this);

  this.initLights();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.materials = new Stack(null); //stack with the different materials of a component
  this.textures = new Stack(null); //stack with the different textures of a component
  this.viewsIndex = 0;
  this.materialIndex = 0;
  this.rootID =null;

  this.board = new MyBoard(this);

  this.axis=new CGFaxis(this);

  this.objects = [];

  this.loadObjects();

  this.setPickEnabled(true);
};

XMLscene.prototype.loadObjects = function(){
  for(var x=0; x<this.board.matrix.length;x++){
    for(var y=0; y<this.board.matrix[x].length; y++){
      this.objects.push(this.board.matrix[x][y]);
      if(this.board.pieces[x][y] != "")
        this.objects.push(this.board.pieces[x][y]);
    }
  }
}

XMLscene.prototype.initLights = function () {

  this.setGlobalAmbientLight(0,0,0, 1.0);
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
  this.interface.setActiveCamera(this.camera);
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
  this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
  this.lights[0].setVisible(true);
  this.lights[0].enable;
  this.loadLights();

  this.axis=new CGFaxis(this, this.graph.axisL, 0.1);
  this.rootID = this.graph.firstID;
};

/*
* Loads the graph lights to the scene
*/
XMLscene.prototype.loadLights = function(){

  //Array that contains the state of each light(enabled or disabled)
  this.lightStatus = new Array(this.graph.lights.length);

  for(var i = 0; i < this.graph.lights.length; i++){
    var light = this.graph.lights[i];

    this.lights[i].setPosition(light.location[0],light.location[1],light.location[2],light.location[3]);
    this.lights[i].setAmbient(light.ambient[0],light.ambient[1],light.ambient[2],light.ambient[3]);
    this.lights[i].setDiffuse(light.diffuse[0],light.diffuse[1],light.diffuse[2],light.diffuse[3]);
    this.lights[i].setSpecular(light.specular[0],light.specular[1],light.specular[2],light.specular[3]);

    if(light.type == "spot"){
      this.lights[i].setSpotExponent(light.exponent);
      this.lights[i].setSpotDirection(light.target[0], light.target[1], light.target[2],light.target[3]);
    }


    this.lightStatus[i] = light.enabled;
    this.interface.addLight(light.type, i, light.id);

    if(light.enabled)
    this.lights[i].enable();
    else {
      this.lights[i].disable();
    }

    this.lights[i].setVisible(true);
    this.lights[i].update();
  }
};

/*
* Updates all lights depending on their state on the interface
*/
XMLscene.prototype.updateLights = function(){
  for(var i = 0; i < this.lightStatus.length; i++){
    if (this.lightStatus[i])
      this.lights[i].enable();
    else {
      this.lights[i].disable();
    }
  };
  for (var i = 0; i < this.lights.length; i++)
  this.lights[i].update();

};

/*
* Processes all the information of the graph and displays the components on the scene
* Starts with the rootNode
*/
XMLscene.prototype.processGraph = function(nodeName, textureID){
  var texture = new CGFappearance(this);
  var material = null;

  if(nodeName != null){
    var node = this.graph.nodes[nodeName];

    if(node.material[this.materialIndex] != "inherit"){
      this.materials.push(this.graph.materials[node.material[this.materialIndex]]);
      material = this.materials.top();
      this.materials.pop();
    }
    else {
      this.materials.push(this.materials.top());
    }

    if(material != null){
      texture.setEmission(material.emission[0], material.emission[1],material.emission[2], material.emission[3]);
      texture.setAmbient(material.ambient[0], material.ambient[1],material.ambient[2], material.ambient[3]);
      texture.setDiffuse(material.diffuse[0], material.diffuse[1],material.diffuse[2], material.diffuse[3]);
      texture.setSpecular(material.specular[0], material.specular[1],material.specular[2], material.specular[3]);
      texture.setShininess(material.shininess);
    }


    if (node.texture != "none"){
      if (node.texture != "inherit"){
        //this.textures.push(this.graph.textures[textureID].file);
        texture.setTexture(this.graph.textures[node.texture].file);
      }else if (node.texture == "inherit"){
        if(textureID != null)
            texture.setTexture(this.graph.textures[textureID].file);
      }
    }

      texture.apply();


    //Applies the transformation matrix of each component
    this.multMatrix(node.mat);


  //Applies the animations to the node
   for(var x = 0; x < node.animations.length; x++){
   var anim = this.graph.animations[node.animations[x]];
   anim.apply(this.elapsedTime, node);
   if(anim.complete == false)
     break;
   }

  if(node.primitive != null){
    this.pushMatrix();
    node.primitive.display(); //displays the primitive on the scene
    this.popMatrix();
  }


    for (var i = 0; i < node.getSize(); i++){
      this.pushMatrix();
      if(node.texture != "inherit")
      this.processGraph(node.children[i], node.texture); //calls the fucntion with the childrens of the rootNode
      else{
        this.processGraph(node.children[i], textureID);
      }
      this.popMatrix();
    }
  }
};

/*
* Updates the camera index to the current camera
*/
XMLscene.prototype.updateViews = function(){
  this.camera = this.graph.views[this.viewsIndex];
  this.interface.setActiveCamera(this.camera);

  this.viewsIndex++;
  if (this.viewsIndex >= this.graph.views.length)
    this.viewsIndex = 0;
}

/*
* Updates the material index to the current material
*/
XMLscene.prototype.updateMaterial = function(){
  if (this.materialIndex < this.graph.materialIndex)
    this.materialIndex++;
  else {
    this.materialIndex = 0;
  }
  console.log(this.materialIndex);
}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
					obj.select();
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

XMLscene.prototype.display = function () {
  // ---- BEGIN Background, camera and axis setup

  this.logPicking();
  this.clearPickRegistration();

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  this.gl.enable(this.gl.DEPTH_TEST);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  this.enableTextures(true);

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  // Draw axis
  this.axis.display();

  this.board.display();

if (this.graph.loadedOk)
{

  this.updateLights();
  //this.processGraph(this.rootID, null); //processes the graph starting on the rootNode
};
};

XMLscene.prototype.update = function(currTime) {
  this.elapsedTime = currTime / 1000;
}
