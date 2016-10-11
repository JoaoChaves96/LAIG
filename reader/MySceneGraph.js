
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
	this.nodes = [];
	this.nodes[0] = new MyNode("node1", [],[],"prim1");

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


////////////////////////Primitives////////////////////////
console.log("");
console.log("Primitives:");
	var prim = rootElement.getElementsByTagName('primitives');

	var listprim = prim[0].getElementsByTagName('primitive');

	var nprim = listprim.length;

	for(var i = 0; i < nprim; i++){
		var prim1 = listprim[i].children[0];
		console.log(prim1.tagName);
		console.log(prim1.attributes.getNamedItem("x1").value);
		console.log(prim1.attributes.getNamedItem("x2").value);
		console.log(prim1.attributes.getNamedItem("y1").value);
		console.log(prim1.attributes.getNamedItem("y2").value);
	}

////////////////////////Transformations////////////////////////

	console.log("");
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


////////////////////////Globals////////////////////////
	var elems =  rootElement.getElementsByTagName('globals');
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

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

////////////////////////Nodes////////////////////////

		console.log("");

var nodes = rootElement.getElementsByTagName('components');
var listNodes = nodes[0].getElementsByTagName('component');

var nnodes = listNodes.length;

for (var i = 0; i < nnodes; i++){
	var node1 = listNodes[i];
	var nchild = node1.children.length;
	console.log(node1.tagName + ": " + node1.attributes.getNamedItem("id").value);

	for (var j = 0; j < nchild; j++){
		var temp = node1.children[j];
		//console.log(temp.attributes.getNamedItem("id").value);
		console.log("	" + temp.children[0].tagName + ": " + temp.children[0].attributes.getNamedItem("id").value);
	}

		console.log("");

}


////////////////////////List////////////////////////
	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}

	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
