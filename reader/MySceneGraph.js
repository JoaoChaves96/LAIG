
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
	this.nodes = {};
	this.lights = [];
	this.primitives = {};
	this.materials = {};
	this.animations ={};
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

	//checks for errors while loading all elements of the parser
	var error = this.checkDSXorder(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}


	error = this.loadScene(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadViews(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadIllumination(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadLights(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadTextures(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadMaterials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadTransformations(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadAnimations(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadPrimitives(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.loadNodes(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
* Checks if the dsx file has the right order:
*	scene-views-illumination-lights-textures-materials-transformations-primitives-components
* Returns an error if the dsx file doesn't check this order
*/
MySceneGraph.prototype.checkDSXorder = function(rootElement){
	if(rootElement.children[0].tagName != "scene"){
		return "Incorrect order of dsx file. First tag should be 'scene'...";
	}
	else if(rootElement.children[1].tagName != "views"){
		return "Incorrect order of dsx file. Second tag should be 'views'...";
	}
	else if(rootElement.children[2].tagName != "illumination"){
		return "Incorrect order of dsx file. Third tag should be 'illumination'...";
	}
	else if(rootElement.children[3].tagName != "lights"){
		return "Incorrect order of dsx file. Fourth tag should be 'lights'...";
	}
	else if(rootElement.children[4].tagName != "textures"){
		return "Incorrect order of dsx file. Fifth tag should be 'textures'...";
	}
	else if(rootElement.children[5].tagName != "materials"){
		return "Incorrect order of dsx file. Sixth tag should be 'materials'...";
	}
	else if(rootElement.children[6].tagName != "transformations"){
		return "Incorrect order of dsx file. Seventh tag should be 'transformations'...";
	}
	else if(rootElement.children[7].tagName != "animations"){
		return "Incorrect order of dsx file. Eighth tag should be 'transformations'...";
	}
	else if(rootElement.children[8].tagName != "primitives"){
		return "Incorrect order of dsx file. Ninth tag should be 'primitives'...";
	}
	else if(rootElement.children[9].tagName != "components"){
		return "Incorrect order of dsx file. Tenth tag should be 'components'...";
	}
};

/*
*	Loads the elements with the 'scene' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadScene = function(rootElement){
	var rootscene = rootElement.getElementsByTagName("scene");

	//checks if the tag exist on the file
	if(rootscene == null){
		return "'scene' element is missing";
	}

	this.firstID = this.reader.getString(rootscene[0], "root", true);
	this.axisL = this.reader.getFloat(rootscene[0], "axis_length", true);
};

/*
*	Loads the elements with the 'illumination' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadIllumination = function(rootElement){
	var ilums =  rootElement.getElementsByTagName('illumination');

	//checks if the tag exist on the file
	if(ilums[0] == null)
		return "either 'illumination' element is missing...";

	var illumination = ilums[0].children;
	var nillum = illumination.length;
	if(nillum != 2)
	return "error on illumination tag..."

	this.ambient[0] = this.reader.getFloat(illumination[0], 'r', true);
	this.ambient[1] = this.reader.getFloat(illumination[0], 'g', true);
	this.ambient[2] = this.reader.getFloat(illumination[0], 'b', true);
	this.ambient[3] = this.reader.getFloat(illumination[0], 'a', true);

	this.background[0] = this.reader.getFloat(illumination[1], 'r', true);
	this.background[1] = this.reader.getFloat(illumination[1], 'g', true);
	this.background[2] = this.reader.getFloat(illumination[1], 'b', true);
	this.background[3] = this.reader.getFloat(illumination[0], 'a', true);
};


/*
*	Loads the elements with the 'views' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadViews = function(rootElement){
	var views = rootElement.getElementsByTagName('views');

	//checks if the tag exist on the file
	if(views[0] == null)
		return "'views' element is missing...";

	var listviews = views[0].getElementsByTagName('perspective');
	var nlist = listviews.length;

	for (var i = 0; i < nlist; i++){
		var view = listviews[i];
		var id, near, far, angle, fx, fy, fz, tx, ty, tz;
		id = this.reader.getString(view, "id", true);
		near = this.reader.getFloat(view, "near", true);
		far = this.reader.getFloat(view, "far", true);
		angle = this.reader.getFloat(view, "angle", true) * this.degtoRad;
		fx = this.reader.getFloat(view.children[0], "x", true);
		fy = this.reader.getFloat(view.children[0], "y", true);
		fz = this.reader.getFloat(view.children[0], "z", true);
		tx = this.reader.getFloat(view.children[1], "x", true);
		ty = this.reader.getFloat(view.children[1], "y", true);
		tz = this.reader.getFloat(view.children[1], "z", true);

		this.views.push(new CGFcamera(angle, near, far, vec3.fromValues(fx, fy, fz), vec3.fromValues(tx, ty, tz)));
	}

};

/*
*	Loads the elements with the 'lights' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadLights = function(rootElement){
	var lights = rootElement.getElementsByTagName('lights');

	//checks if the tag exist on the file
	if(lights[0] == null)
		return "'lights' element is missing...";

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

		id = this.reader.getString(light1, 'id', true);
		enabled = this.reader.getBoolean(light1, 'enabled');

		location[0] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'x', true);
		location[1] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'y', true);
		location[2] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'z', true);
		location[3] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'w', true);

		ambient[0] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'r', true);
		ambient[1] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'g', true);
		ambient[2] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'b', true);
		ambient[3] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'a', true);

		diffuse[0] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'r', true);
		diffuse[1] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'g', true);
		diffuse[2] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'b', true);
		diffuse[3] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'a', true);

		specular[0] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'r', true);
		specular[1] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'g', true);
		specular[2] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'b', true);
		specular[3] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'a', true);

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

		id = this.reader.getString(light1, 'id', true);
		enabled = this.reader.getBoolean(light1, 'enabled');
		angle = this.reader.getFloat(light1, 'angle', true);
		exponent = this.reader.getFloat(light1, 'exponent', true);

		target[0] = this.reader.getFloat(light1.getElementsByTagName('target')[0], 'x', true);
		target[1] = this.reader.getFloat(light1.getElementsByTagName('target')[0], 'y', true);
		target[2] = this.reader.getFloat(light1.getElementsByTagName('target')[0], 'z', true);

		location[0] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'x', true);
		location[1] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'y', true);
		location[2] = this.reader.getFloat(light1.getElementsByTagName('location')[0], 'z', true);

		ambient[0] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'r', true);
		ambient[1] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'g', true);
		ambient[2] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'b', true);
		ambient[3] = this.reader.getFloat(light1.getElementsByTagName('ambient')[0], 'a', true);

		diffuse[0] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'r', true);
		diffuse[1] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'g', true);
		diffuse[2] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'b', true);
		diffuse[3] = this.reader.getFloat(light1.getElementsByTagName('diffuse')[0], 'a', true);

		specular[0] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'r', true);
		specular[1] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'g', true);
		specular[2] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'b', true);
		specular[3] = this.reader.getFloat(light1.getElementsByTagName('specular')[0], 'a', true);

		var light = new Light(id, "spot", enabled, angle, exponent, target, location, ambient, diffuse, specular);
		this.lights[index] = light;
	}
};

/*
*	Loads the elements with the 'materials' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadMaterials = function(rootElement){
	var listMaterials = rootElement.getElementsByTagName('materials');

	//checks if the tag exist on the file
	if(listMaterials[0] == null)
		return "'materials' element is missing...";

	var materials = listMaterials[0].getElementsByTagName('material');

	var nmat = materials.length;

	for (var i = 0; i < nmat; i++){
		var mat = materials[i];
		var idMat = mat.attributes.getNamedItem("id").value;

		if(idMat in this.materials)
			return "id already exists in materials array...";

		var emission = [];

		emission[0] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'r', true);
		emission[1] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'g', true);
		emission[2] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'b', true);
		emission[3] = this.reader.getFloat(mat.getElementsByTagName('emission')[0], 'a', true);

		var ambient = [];

		ambient[0] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'r', true);
		ambient[1] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'g', true);
		ambient[2] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'b', true);
		ambient[3] = this.reader.getFloat(mat.getElementsByTagName('ambient')[0], 'a', true);

		var diffuse = [];

		diffuse[0] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'r', true);
		diffuse[1] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'g', true);
		diffuse[2] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'b', true);
		diffuse[3] = this.reader.getFloat(mat.getElementsByTagName('diffuse')[0], 'a', true);

		var specular = [];

		specular[0] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'r', true);
		specular[1] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'g', true);
		specular[2] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'b', true);
		specular[3] = this.reader.getFloat(mat.getElementsByTagName('specular')[0], 'a', true);

		var shininess = this.reader.getFloat(mat.getElementsByTagName('shininess')[0], 'value', true);

		var material = new CGFappearance(this.scene);
		material.setEmission(emission[0], emission[1], emission[2], emission[3]);
		material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
		material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
		material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
		material.setShininess(shininess);

		this.materials[idMat] = material;
	}
};

/*
*	Loads the elements with the 'textures' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadTextures = function(rootElement){
	var textures = rootElement.getElementsByTagName('textures');

	//checks if the tag exists on the file
	if(textures[0] == null)
		return "'textures' element is missing";

	var listT = textures[0].getElementsByTagName('texture');

	var nlistT = listT.length;

	for (var i = 0; i < nlistT; i++){
		var id = listT[i].attributes.getNamedItem("id").value;

		if(id in this.textures)
			return "id already exists in textures array...";

		var file = listT[i].attributes.getNamedItem("file").value;
		var length_s = this.reader.getFloat(listT[i], 'length_s', true);
		var length_t = this.reader.getFloat(listT[i], 'length_t', true);
		var texture = new CGFtexture(this.scene, file);
		var text = new Texture(id, texture, length_s, length_t);
		this.textures[id] = text;
	}
};

MySceneGraph.prototype.loadAnimations = function(rootElement){
	var animations = rootElement.getElementsByTagName('animations');

	//checks if the tag exists on the file
	if(animations[0] == null)
		return "'animations' element is missing";

	var listA = animations[0].getElementsByTagName('animation');

	var nlistA = listA.length;

	for (var i = 0; i < nlistA; i++){
		var id = listA[i].attributes.getNamedItem("id").value;

		if(id in this.animations)
			return "id already exists in animations array...";


			var span, type;
			span = this.reader.getFloat(listA[i], 'span', true);
			type = this.reader.getString(listA[i], 'type', true);

			var control = [];
			console.log(type);

			if (type == "linear"){
				var points = listA[i].getElementsByTagName('controlpoint');
				for (var j = 0; j < points.length; j++){
					var point = points[j];
					var c = [];
					var x, y, z;
					x = this.reader.getFloat(point, 'xx', true);
					y = this.reader.getFloat(point, 'yy', true);
					z = this.reader.getFloat(point, 'zz', true);
					c.push(x, y, z);
					control.push(c);
				}

				this.animations[id] = new MyLinearAnimation(this.scene, id, type, span, control);
			}
			else if(type == "circular"){
				var centerx, centery, centerz, radius, startang, rotang;
				centerx = this.reader.getFloat(listA[i], 'centerx', true);
				centery = this.reader.getFloat(listA[i], 'centery', true);
				centerz = this.reader.getFloat(listA[i], 'centerz', true);
				radius = this.reader.getFloat(listA[i], 'radius', true);
				startang = this.reader.getFloat(listA[i], 'startang', true);
				rotang = this.reader.getFloat(listA[i], 'rotang', true);

				this.animations[id] = new MyCircularAnimation(this.scene, id, type, span, centerx, centery, centerz, radius, startang, rotang);
			}
			else {
				return "Uknown type of animation...";
			}
	}
};

/*
*	Loads the elements with the 'primitives' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadPrimitives = function(rootElement){
	var prim = rootElement.getElementsByTagName('primitives');

	//checks if the tag wxists on the file
	if(prim[0] == null)
		return "'primitives' element is missing...";

	var listprim = prim[0].getElementsByTagName('primitive');

	var nprim = listprim.length;

	for(var i = 0; i < nprim; i++){
		var prim1 = listprim[i].children[0];
		var id = listprim[i].attributes.getNamedItem("id").value;

		if(id in this.primitives)
			return "id already exists in primitives array...";

		switch(prim1.tagName){
			case "rectangle":
			var temp = listprim[i].getElementsByTagName('rectangle');
			var x1, y1, x2, y2;
			x1 = this.reader.getFloat(temp[0], 'x1', true);
			x2 =this.reader.getFloat(temp[0], 'x2', true);
			y1 = this.reader.getFloat(temp[0], 'y1', true);
			y2 = this.reader.getFloat(temp[0], 'y2', true);

			this.primitives[id] = new MyQuad(this.scene, x1, y1, x2, y2);
			break;

			case "triangle":
			var temp = listprim[i].getElementsByTagName('triangle');
			var x1, y1, z1, x2, y2, z2, x3, y3, z3;
			x1 = this.reader.getFloat(temp[0], 'x1', true);
			x2 =this.reader.getFloat(temp[0], 'x2', true);
			x3 = this.reader.getFloat(temp[0], 'x3', true);
			y1 = this.reader.getFloat(temp[0], 'y1', true);
			y2 = this.reader.getFloat(temp[0], 'y2', true);
			y3 = this.reader.getFloat(temp[0], 'y3', true);
			z1 = this.reader.getFloat(temp[0], 'z1', true);
			z2 = this.reader.getFloat(temp[0], 'z2', true);
			z3 = this.reader.getFloat(temp[0], 'z3', true);

			this.primitives[id] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
			break;

			case "sphere":
			var temp = listprim[i].getElementsByTagName('sphere');
			var radius, slices, stacks;
			radius = this.reader.getFloat(temp[0], 'radius', true);
			slices = this.reader.getFloat(temp[0], 'slices', true);
			stacks = this.reader.getFloat(temp[0], 'stacks', true);

			this.primitives[id] = new MySphere(this.scene, radius, slices, stacks);
			break;

			case "cylinder":
			var temp = listprim[i].getElementsByTagName('cylinder');
			var base, top, height, slices, stacks;
			base = this.reader.getFloat(temp[0], 'base', true);
			top = this.reader.getFloat(temp[0], 'top', true);
			height = this.reader.getFloat(temp[0], 'height', true);
			slices = this.reader.getFloat(temp[0], 'slices', true);
			stacks = this.reader.getFloat(temp[0], 'stacks', true);

			this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
			break;

			case "torus":
			var temp = listprim[i].getElementsByTagName('torus');
			var inner, outer, slices, loops;
			inner = this.reader.getFloat(temp[0], 'inner', true);
			outer = this.reader.getFloat(temp[0], 'outer', true);
			slices = this.reader.getFloat(temp[0], 'slices', true);
			loops = this.reader.getFloat(temp[0], 'loops', true);

			this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
			break;

			case "plane":
			var temp = listprim[i].getElementsByTagName('plane');
			var dimX, dimY, partsX, partsY;
			dimX = this.reader.getFloat(temp[0],'dimX', true);
			dimY = this.reader.getFloat(temp[0],'dimY', true);
			partsX = this.reader.getFloat(temp[0],'partsX', true);
			partsY = this.reader.getFloat(temp[0],'partsY', true);

			this.primitives[id] = new MyPlane(this.scene, dimX, dimY, partsX, partsY);
			break;

			case "patch":
			var temp = listprim[i].getElementsByTagName('patch');
			var orderU, orderV, partsU, partsV;
			orderU = this.reader.getFloat(temp[0], 'orderU', true);
			orderV = this.reader.getFloat(temp[0], 'orderV', true);
			partsU = this.reader.getFloat(temp[0], 'partsU', true);
			partsV = this.reader.getFloat(temp[0], 'partsV', true);

			var control = [];
			var l = 0;
			for(var u = 0; u <= orderU; u++){
				var tempU = [];
				for(var v = 0; v <= orderV; v++){
					var point = temp[0].children[l];
					var tempV = [];
					var x, y, z, a;
					x = this.reader.getFloat(point, 'x', true);
					y = this.reader.getFloat(point, 'y', true);
					z = this.reader.getFloat(point, 'z', true);
					a = 1;
					tempV.push(x, y, z, a);
					tempU.push(tempV);
					l++;
				}
				control.push(tempU);
			}

			this.primitives[id] = new MyPatch(this.scene, orderU, orderV, partsU, partsV, control);

			break;

			case "chessboard":
			var temp = listprim[i].getElementsByTagName('chessboard');
			var du, dv, texturef, su, sv, c1, c2, cs;
			du = this.reader.getFloat(temp[0], 'du', true);
			dv = this.reader.getFloat(temp[0], 'dv', true);
			su = this.reader.getFloat(temp[0], 'su', true);
			sv = this.reader.getFloat(temp[0], 'sv', true);
			texturef = this.reader.getString(temp[0], 'textureref', true);
			var texture = this.textures[texturef].file;
			var color1 = temp[0].children[0];
			var color2 = temp[0].children[1];
			var colors = temp[0].children[2];
			var c1 = [];
			var c2 = [];
			var cs = [];

			c1[0] = this.reader.getFloat(color1, 'r', true);
			c1[1] = this.reader.getFloat(color1, 'g', true);
			c1[2] = this.reader.getFloat(color1, 'b', true);
			c1[3] = this.reader.getFloat(color1, 'a', true);
			console.log(c1);
			c2[0] = this.reader.getFloat(color2, 'r', true);
			c2[1] = this.reader.getFloat(color2, 'g', true);
			c2[2] = this.reader.getFloat(color2, 'b', true);
			c2[3] = this.reader.getFloat(color2, 'a', true);
			console.log(c2);
			cs[0] = this.reader.getFloat(colors, 'r', true);
			cs[1] = this.reader.getFloat(colors, 'g', true);
			cs[2] = this.reader.getFloat(colors, 'b', true);
			cs[3] = this.reader.getFloat(colors, 'a', true);
			console.log(cs);

			this.primitives[id] = new MyChessBoard(this.scene, du, dv, texture, su, sv, c1, c2, cs);

			break;

			default:
			return "Uknown primitive...";
		}
	}
};

/*
*	Loads the elements with the 'transformations' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadTransformations = function(rootElement){
	var transf = rootElement.getElementsByTagName('transformations');

	//checks if the tag exists on the file
	if(transf[0] == null)
		return "'transformations' element is missing...";

	var listtransf = transf[0].getElementsByTagName('transformation');

	var ntransf = listtransf.length;

	for (var j = 0; j < ntransf; j++){
		var transf1 = listtransf[j];
		var id = this.reader.getString(transf1, "id", true);

		if(id in this.transformations)
			return "id already exists in transformations array...";

		var matrix = mat4.create();
		for (var k = 0; k < transf1.children.length; k++){
			var child = transf1.children[k];
			switch(child.tagName){
				case "rotate":
				var angle, axis, rotation;
				axis = this.reader.getString(child, 'axis', true);
				angle = this.reader.getFloat(child, 'angle', true) * this.degtoRad;

				if(axis == 'x')
							rotation= [1,0,0];
				else if(axis == 'y')
							rotation = [0,1,0];
				else if(axis == 'z')
							rotation = [0,0,1];

				mat4.rotate(matrix, matrix, angle, rotation);
				break;

				case "translate":
				var translate, x, y, z;
				x = this.reader.getFloat(child, 'x', true);
				y = this.reader.getFloat(child, 'y', true);
				z = this.reader.getFloat(child, 'z', true);

				translate = [x, y, z];

				mat4.translate(matrix, matrix, translate);
				break;

				case "scale":
				var scale, x, y, z;
				x = this.reader.getFloat(child, 'x', true);
				y = this.reader.getFloat(child, 'y', true);
				z = this.reader.getFloat(child, 'z', true);

				scale = [x, y, z];

				mat4.scale(matrix, matrix, scale);
				break;

				default:
				break;
			}
		}
		this.transformations[id] = matrix;
	}
};

/*
*	Loads the elements with the 'components' tag
*	Returns null or an error
*/
MySceneGraph.prototype.loadNodes = function(rootElement){
	var nodes = rootElement.getElementsByTagName('components');

	//checks if the tag exists on the file
	if(nodes[0] == null)
		return "'components' element is missing...";

	var listNodes = nodes[0].getElementsByTagName('component');

	var nnodes = listNodes.length;

	for (var i = 0; i < nnodes; i++){
		var node1 = listNodes[i];
		var ncomps = node1.children.length;

		//Load children
		var childs = node1.getElementsByTagName('children');
		var listchilds = childs[0].children;
		var nchilds = listchilds.length;

		var idNode = node1.attributes.getNamedItem("id").value;
		if(idNode in this.nodes)
			return "error! id already exists in nodes array...";
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

		//Load transformations
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
				axis = this.reader.getString(listT[j], 'axis', true);
				angle = this.reader.getFloat(listT[j], 'angle', true) * this.degtoRad;

				if(axis == 'x')
						rotation= [1,0,0];
					if(axis == 'y')
						rotation = [0,1,0];
					if(axis == 'z')
						rotation = [0,0,1];

				mat4.rotate(matrix, matrix, angle, rotation);
				break;

				case "translate":
				if(type == 1)
				return "error! tagName should be 'transformationref'...";

				var x, y, z;
				x = this.reader.getFloat(listT[j], 'x', true);
				y = this.reader.getFloat(listT[j], 'y', true);
				z = this.reader.getFloat(listT[j], 'z', true);

				var translate = [x, y, z];

				mat4.translate(matrix, matrix, translate);
				break;

				case "scale":
				if(type == 1)
				return "error! tagName should be 'transformationref'...";

				var scale, x, y, z;
				x = this.reader.getFloat(listT[j], 'x', true);
				y = this.reader.getFloat(listT[j], 'y', true);
				z = this.reader.getFloat(listT[j], 'z', true);

				scale = [x, y, z];

				mat4.scale(matrix, matrix, scale);
				break;

				case "transformationref":
				if(type == 0)
				return "error! tagName should be 'scale' 'rotate' or 'translate'...";

				var id = this.reader.getString(listT[j], "id", true);
				matrix = this.transformations[id];
				break;

				default:
				break;
			}
		}

		node.mat = matrix;

		//Load animations
		var nodeAnimations = node1.getElementsByTagName('animation');
		if(nodeAnimations.length != 0){
			console.log(nodeAnimations[0]);
		var listA = nodeAnimations[0].children;

		var nlistA = listA.length;

		for(var x = 0; x < nlistA; x++){
			var idAnim = listA[x].attributes.getNamedItem("id").value;
			node.animations.push(idAnim);
		}
		}
		//Load materials
		var nodeMaterials = node1.getElementsByTagName('materials');

		var listNm = nodeMaterials[0].children;

		var nlist = listNm.length;

		for (var x = 0; x < nlist; x++){
			if(nlist - 1 > this.materialIndex)
			this.materialIndex = nlist - 1;
			var idmaterial = listNm[x].attributes.getNamedItem("id").value;
			node.material.push(idmaterial);
		}

		//Load texture
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
