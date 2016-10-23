
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
	this.views = [];
	this.transformations = {};
	this.background = [];
	this.ambient = [];
	this.firstID = null;
	this.axisL = null;

		this.materialIndex = 0;

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


var rootscene = rootElement.getElementsByTagName("scene");
var root = rootscene[0];
this.firstID = this.reader.getString(root, "root");
this.axisL = this.reader.getFloat(root, "axis_length");

////////////////////////////Illumination/////////////////////////
		var ilums =  rootElement.getElementsByTagName('illumination');

		var illumination = ilums[0].children;
		var nillum = illumination.length;
		if(nillum != 2)
		return "error on illumination tag..."

		this.ambient[0] = this.reader.getFloat(illumination[0], 'r');
		this.ambient[1] = this.reader.getFloat(illumination[0], 'g');
		this.ambient[2] = this.reader.getFloat(illumination[0], 'b');
		this.ambient[3] = this.reader.getFloat(illumination[0], 'a');

		this.background[0] = this.reader.getFloat(illumination[1], 'r');
		this.background[1] = this.reader.getFloat(illumination[1], 'g');
		this.background[2] = this.reader.getFloat(illumination[1], 'b');
		this.background[3] = this.reader.getFloat(illumination[0], 'a');


		/////////////////////////Views////////////////////////////
		var views = rootElement.getElementsByTagName('views');
		var listviews = views[0].getElementsByTagName('perspective');
		var nlist = listviews.length;

		for (var i = 0; i < nlist; i++){
			var view = listviews[i];
			var id, near, far, angle, fx, fy, fz, tx, ty, tz;
			id = this.reader.getString(view, "id");
			near = this.reader.getFloat(view, "near");
			far = this.reader.getFloat(view, "far");
			angle = this.reader.getFloat(view, "angle") * this.degtoRad;
			fx = this.reader.getFloat(view.children[0], "x");
			fy = this.reader.getFloat(view.children[0], "y");
			fz = this.reader.getFloat(view.children[0], "z");
			tx = this.reader.getFloat(view.children[1], "x");
			ty = this.reader.getFloat(view.children[1], "y");
			tz = this.reader.getFloat(view.children[1], "z");

			this.views.push(new CGFcamera(angle, near, far, vec3.fromValues(fx, fy, fz), vec3.fromValues(tx, ty, tz)));
		}

		//////////////////////////Lights//////////////////////////
		var lights = rootElement.getElementsByTagName('lights');

		var listomni = lights[0].getElementsByTagName('omni');
		var nomni = listomni.length;
		var index = 0;

		for(var i = 0; i < nomni; i++, index++){
			var light1 = listomni[i];
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

			var light = new Light(id, "omni", enabled, null, null, null, location, ambient, diffuse, specular);
			this.lights[index] = light;
		}

		var listspot = lights[0].getElementsByTagName('spot');
		var nspot = listspot.length;

		for(var i = 0; i < nspot; i++, index++){
			var light1 = listspot[i];
			var id, enabled, angle, exponent;

			var target = [];
			var location = [];
			var ambient = [];
			var diffuse = [];
			var specular = [];

			id = this.reader.getString(light1, 'id');
			enabled = this.reader.getBoolean(light1, 'enabled');
			angle = this.reader.getFloat(light1, 'angle');
			exponent = this.reader.getFloat(light1, 'exponent');

			target[0] = this.reader.getFloat(light1.getElementsByTagName('target')[0], 'x');
			target[1] = this.reader.getFloat(light1.getElementsByTagName('target')[0], 'y');
			target[2] = this.reader.getFloat(light1.getElementsByTagName('target')[0], 'z');

			location[0] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'x');
			location[1] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'y');
			location[2] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'z');

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

			var light = new Light(id, "spot", enabled, angle, exponent, target, location, ambient, diffuse, specular);
			this.lights[index] = light;
		}

		/////////////////////Materials///////////////////////////
		var listMaterials = rootElement.getElementsByTagName('materials');
		var materials = listMaterials[0].getElementsByTagName('material');

		var nmat = materials.length;

		for (var i = 0; i < nmat; i++){
			var mat = materials[i];
			var idMat = mat.attributes.getNamedItem("id").value;
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
			var texture = new CGFtexture(this.scene, file);
			var text = new Texture(id, texture, length_s, length_t);
			this.textures[id] = text;
		}



		////////////////////////Primitives////////////////////////

		var prim = rootElement.getElementsByTagName('primitives');

		var listprim = prim[0].getElementsByTagName('primitive');

		var nprim = listprim.length;

		for(var i = 0; i < nprim; i++){
			var prim1 = listprim[i].children[0];
			var id = listprim[i].attributes.getNamedItem("id").value;

			switch(prim1.tagName){
				case "rectangle":
				var temp = listprim[i].getElementsByTagName('rectangle');
				var x1, y1, x2, y2;
				x1 = this.reader.getFloat(temp[0], 'x1');
				x2 =this.reader.getFloat(temp[0], 'x2');
				y1 = this.reader.getFloat(temp[0], 'y1');
				y2 = this.reader.getFloat(temp[0], 'y2');

				this.primitives[id] = new MyQuad(this.scene, x1, x2, y1, y2);
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

		var transf = rootElement.getElementsByTagName('transformations');

		var listtransf = transf[0].getElementsByTagName('transformation');

		var ntransf = listtransf.length;

		for (var j = 0; j < ntransf; j++){
			var transf1 = listtransf[j];
			var id = this.reader.getString(transf1, "id");
			var matrix = mat4.create();
			for (var k = 0; k < transf1.children.length; k++){
				var child = transf1.children[k];
				switch(child.tagName){
					case "rotate":
					var angle, axis, rotation;
					axis = this.reader.getString(child, 'axis');
					angle = this.reader.getFloat(child, 'angle') * this.degtoRad;

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
					translate[0] = this.reader.getFloat(child, 'x');
					translate[1] = this.reader.getFloat(child, 'y');
					translate[2] = this.reader.getFloat(child, 'z');

					mat4.translate(matrix, matrix, translate);
					break;

					case "scale":
					var scale = [];
					scale[0] = this.reader.getFloat(child, 'x');
					scale[1] = this.reader.getFloat(child, 'y');
					scale[2] = this.reader.getFloat(child, 'z');

					mat4.scale(matrix, matrix, scale);
					break;

					default:
					break;
				}
			}
			this.transformations[id] = matrix;
		}

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

	var type = null;
	if(ntransf != 0){
	if(listT[0].tagName == "transformationref")
		type = 1;
	else
		type = 0;
	}

	for (var j = 0; j < ntransf; j++){
		switch(listT[j].tagName){
			case "rotate":
			if(type == 1)
				return "error! tagName should be 'transformationref'...";

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
			if(type == 1)
				return "error! tagName should be 'transformationref'...";

			var translate = [];
			translate[0] = this.reader.getFloat(listT[j], 'x');
			translate[1] = this.reader.getFloat(listT[j], 'y');
			translate[2] = this.reader.getFloat(listT[j], 'z');

			mat4.translate(matrix, matrix, translate);
			break;

			case "scale":
			if(type == 1)
				return "error! tagName should be 'transformationref'...";

			var scale = [];
			scale[0] = this.reader.getFloat(listT[j], 'x');
			scale[1] = this.reader.getFloat(listT[j], 'y');
			scale[2] = this.reader.getFloat(listT[j], 'z');

			mat4.scale(matrix, matrix, scale);
			break;

			case "transformationref":
			if(type == 0)
				return "error! tagName should be 'scale' 'rotate' or 'translate'...";

			var id = this.reader.getString(listT[j], "id");
			matrix = this.transformations[id];
			break;

			default:
			break;
		}
	}

	node.mat = matrix;


	///////////////////////Load node materials////////////////////////

	var nodeMaterials = node1.getElementsByTagName('materials');
	var listNm = nodeMaterials[0].children;

	var nlist = listNm.length;

	for (var x = 0; x < nlist; x++){
		if(nlist - 1 > this.materialIndex)
		this.materialIndex = nlist - 1;
		var idmaterial = listNm[x].attributes.getNamedItem("id").value;
		node.material.push(idmaterial);
	}

	//////////////////////Load node textures/////////////////////
	var nodeTexture = node1.getElementsByTagName('texture')[0];
	var textureId = this.reader.getString(nodeTexture, 'id', true);

	node.texture = textureId;

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
