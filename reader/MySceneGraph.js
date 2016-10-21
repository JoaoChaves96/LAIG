
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
	this.nodes = {};
	this.comps = [];
	this.lights = [];
	this.primitives = {};
	this.materials = {};
	this.textures = {};

	this.degtoRad = Math.PI/180;

	// File reading
	this.reader = new CGFXMLreader();





	/*
	* Read the contents of the xml file, and refer to this class for loading and error handlers.
	* After the file is read, the reader calls onXMLReady on this object.
	* If any error occurs, the reader calls onXMLError on this object, with an error message
	*/

	this.reader.open('scenes/'+filename, this);
}

/*
* Callback to be executed after successful reading
*/
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
* Example of method that parses elements of one block and stores information in a specific data structure
*/
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var ilums =  rootElement.getElementsByTagName('illumination');

	var illumination = ilums[0];
	var background = illumination.getElementsByTagName('background');
	this.bR = this.reader.getFloat(background[0], 'r', false);

	if (ilums == null) {
		return "globals element is missing.";
	}


	//////////////////////////Lights//////////////////////////
	var lights = rootElement.getElementsByTagName('lights');

	var listlights = lights[0].getElementsByTagName('omni');

	var nlight = listlights.length;

	for(var i = 0; i < nlight; i++){
		var light1 = listlights[i];
		var id, enabled;

		var location = [];
		var ambient = [];
		var diffuse = [];
		var specular = [];

		id = this.reader.getString(light1, 'id');
		enabled = this.reader.getBoolean(light1, 'enabled');

		location[0] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'x');
		location[1] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'y');
		location[2] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'z');
		location[3] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'w');

		ambient[0] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'r');
		ambient[1] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'g');
		ambient[2] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'b');
		ambient[3] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'a');

		diffuse[0] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'r');
		diffuse[1] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'g');
		diffuse[2] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'b');
		diffuse[3] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'a');

		specular[0] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'r');
		specular[1] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'g');
		specular[2] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'b');
		specular[3] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'a');

		var light = new Light(id, enabled, location, ambient, diffuse, specular);
		this.lights[i] = light;
	}

	/////////////////////Materials///////////////////////////
	var listMaterials = rootElement.getElementsByTagName('materials');
	var materials = listMaterials[0].getElementsByTagName('material');

	var nmat = materials.length;

	for (var i = 0; i < nmat; i++){
		var mat = materials[i];
		var idMat = mat.tagName;
		var emission = [];

		emission[0] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'r');
		emission[1] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'g');
		emission[2] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'b');
		emission[3] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'a');

		var ambient = [];

		ambient[0] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'r');
		ambient[1] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'g');
		ambient[2] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'b');
		ambient[3] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'a');

		var diffuse = [];

		diffuse[0] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'r');
		diffuse[1] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'g');
		diffuse[2] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'b');
		diffuse[3] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'a');

		var specular = [];

		specular[0] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'r');
		specular[1] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'g');
		specular[2] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'b');
		specular[3] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'a');

		var shininess = this.reader.getFloat(mat.getElementsByTagName('shininess')[0], 'value');

		var material = new CGFappearance(this.scene);
		material.setEmission(emission[0], emission[1], emission[2], emission[3]);
		material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
		material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
		material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
		material.setShininess(shininess);

		this.materials[idMat] = material;
	}


	////////////////////////Textures/////////////////////////
var textures = rootElement.getElementsByTagName('textures');
var listT = textures[0].getElementsByTagName('texture');

var nlistT = listT.length;

for (var i = 0; i < nlistT; i++){
	var id = listT[i].attributes.getNamedItem("id").value;
	var file = listT[i].attributes.getNamedItem("file").value;
	var length_s = this.reader.getFloat(listT[i], 'length_s');
	var length_t = this.reader.getFloat(listT[i], 'length_t');
	var text = new Texture(id, file, length_s, length_t);
	this.textures[id] = text;
}



	////////////////////////Primitives////////////////////////
	console.log("");
	console.log("Primitives:");
	var prim = rootElement.getElementsByTagName('primitives');

	var listprim = prim[0].getElementsByTagName('primitive');

	var nprim = listprim.length;
	console.log(nprim);

	for(var i = 0; i < nprim; i++){
		var prim1 = listprim[i].children[0];
		var id = listprim[i].attributes.getNamedItem("id").value;
		console.log(prim1.tagName);

		switch(prim1.tagName){
			case "rectangle":
			var temp = listprim[i].getElementsByTagName('rectangle');
			var x1, y1, x2, y2;
			x1 = this.reader.getFloat(temp[0], 'x1');
			x2 =this.reader.getFloat(temp[0], 'x2');
			y1 = this.reader.getFloat(temp[0], 'y1');
			y2 = this.reader.getFloat(temp[0], 'y2');

			this.primitives[id] = new MyQuad(this.scene, x1, y1, x2, y2);
			break;

			case "triangle":
			var temp = listprim[i].getElementsByTagName('triangle');
			var x1, y1, z1, x2, y2, z2, x3, y3, z3;
			x1 = this.reader.getFloat(temp[0], 'x1');
			x2 =this.reader.getFloat(temp[0], 'x2');
			x3 = this.reader.getFloat(temp[0], 'x3');
			y1 = this.reader.getFloat(temp[0], 'y1');
			y2 = this.reader.getFloat(temp[0], 'y2');
			y3 = this.reader.getFloat(temp[0], 'y3');
			z1 = this.reader.getFloat(temp[0], 'z1');
			z2 = this.reader.getFloat(temp[0], 'z2');
			z3 = this.reader.getFloat(temp[0], 'z3');

			this.primitives[id] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
			break;

			case "sphere":
			var temp = listprim[i].getElementsByTagName('sphere');
			var radius, slices, stacks;
			radius = this.reader.getFloat(temp[0], 'radius');
			slices = this.reader.getFloat(temp[0], 'slices');
			stacks = this.reader.getFloat(temp[0], 'stacks');

			this.primitives[id] = new MySphere(this.scene, radius, slices, stacks);
			break;

			case "cylinder":
			var temp = listprim[i].getElementsByTagName('cylinder');
			var base, top, height, slices, stacks;
			base = this.reader.getFloat(temp[0], 'base');
			top = this.reader.getFloat(temp[0], 'top');
			height = this.reader.getFloat(temp[0], 'height');
			slices = this.reader.getFloat(temp[0], 'slices');
			stacks = this.reader.getFloat(temp[0], 'stacks');

			this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
			break;

			case "torus":
			var temp = listprim[i].getElementsByTagName('torus');
			var inner, outer, slices, loops;
			inner = this.reader.getFloat(temp[0], 'inner');
			outer = this.reader.getFloat(temp[0], 'outer');
			slices = this.reader.getFloat(temp[0], 'slices');
			loops = this.reader.getFloat(temp[0], 'loops');

			this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
			break;

			default:
			return "Uknown primitive...";
		}

		//	console.log(this.primitives);
	}

	////////////////////////Transformations////////////////////////

	/*console.log("");
	console.log("Transformations:");
	var transf = rootElement.getElementsByTagName('transformations');

	var listtransf = transf[0].getElementsByTagName('transformation');

	var ntransf = listtransf.length;

	for (var j = 0; j < ntransf; j++){
	var transf1 = listtransf[j];
	var nchild = transf1.children.length;
	console.log(transf1.attributes.getNamedItem("id").value);
	for (var k = 0; k < nchild; k++){
	var child = transf1.children[k];
	console.log(child.tagName);

	if (child.tagName == "rotate"){
	console.log(child.attributes.getNamedItem("axis").value);
	console.log(child.attributes.getNamedItem("angle").value);
}
else{
console.log(child.attributes.getNamedItem("x").value);
console.log(child.attributes.getNamedItem("y").value);
console.log(child.attributes.getNamedItem("z").value);
}
console.log("");
}
}
*/

////////////////////////Globals////////////////////////
/*var elems =  rootElement.getElementsByTagName('globals');
if (elems == null) {
return "globals element is missing.";
}

if (elems.length != 1) {
return "either zero or more than one 'globals' element found.";
}

var globals = elems[0];
this.background = this.reader.getRGBA(globals, 'background');
this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");*/

////////////////////////Nodes////////////////////////

console.log("");

var nodes = rootElement.getElementsByTagName('components');
var listNodes = nodes[0].getElementsByTagName('component');

var nnodes = listNodes.length;

for (var i = 0; i < nnodes; i++){
	var node1 = listNodes[i];
	var ncomps = node1.children.length;

	///////////////////Load node and children////////////////////////////////

	var childs = node1.getElementsByTagName('children');
	var listchilds = childs[0].children;
	var nchilds = listchilds.length;
	//console.log(nchilds);

	var idNode = node1.attributes.getNamedItem("id").value;
	var node = new MyNode();

	for (var k = 0; k < nchilds; k++){
		if(listchilds[k].tagName == "componentref")
		node.push(listchilds[k].attributes.getNamedItem("id").value);
		else if(listchilds[k].tagName == "primitiveref"){
			node.primitive = this.primitives[listchilds[k].attributes.getNamedItem("id").value];
		}
		else {
			return "Uknown child...";
		}
	}

	///////////////////////Load node transformations///////////////////////////////

	var transf = node1.getElementsByTagName('transformation');
	var listT = transf[0].children;

	var ntransf = listT.length;

	var matrix = mat4.create();

	for (var j = 0; j < ntransf; j++){
		switch(listT[j].tagName){
			case "rotate":
			var angle, axis, rotation;
			axis = this.reader.getString(listT[j], 'axis');
			angle = this.reader.getFloat(listT[j], 'angle') * this.degtoRad;

			switch(axis){
				case "x":
				rotation = [1, 0, 0];
				break;
				case "y":
				rotation = [0, 1, 0];
				break;
				case "z":
				rotation = [0, 0, 1];
				break;
				default:
				break;
			}

			mat4.rotate(matrix, matrix, angle, rotation);
			break;

			case "translate":
			var translate = [];
			translate[0] = this.reader.getFloat(listT[j], 'x');
			translate[1] = this.reader.getFloat(listT[j], 'y');
			translate[2] = this.reader.getFloat(listT[j], 'z');

			mat4.translate(matrix, matrix, translate);
			break;

			case "scale":
			var scale = [];
			scale[0] = this.reader.getFloat(listT[j], 'x');
			scale[1] = this.reader.getFloat(listT[j], 'y');
			scale[2] = this.reader.getFloat(listT[j], 'z');

			mat4.scale(matrix, matrix, scale);
			break;

			default:
			break;
		}
	}

	node.mat = matrix;


///////////////////////Load node material////////////////////////

var nodeMaterials = node1.getElementsByTagName('materials');
var listNm = nodeMaterials[0].children;

var nlist = listNm.length;

for (var x = 0; x < nlist; x++){
	var idmaterial = listNm[x].attributes.getNamedItem("id").value;
	if(idmaterial != "inherit")
		node.material.push(this.materials[idmaterial]);
}

	this.nodes[idNode] = node;

}
};

/*
* Callback to be executed on any read error
*/
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
