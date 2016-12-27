/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	this.playing = 'player1';

	this.difficulty = 'Dumb';
	this.difficulties = [ 'Dumb', 'Smart'];

	this.type = 'P vs P';
	this.types = ['P vs P', 'P vs CPU', 'CPU vs CPU'];

	this.gui.autoListen = false;

	var self = this;

	this.defaultControls = [];

	this.defaultControls[0] = this.gui.add(this,'startGame').name('Start Game');
	this.defaultControls[1] = this.gui.add(this, 'playing').name('Playing').listen();
	this.defaultControls[2] = this.gui.add(this, 'type', this.types).name('Type of game').listen();
	this.optionsFolder = this.gui.addFolder('Options');
	this.optionsFolder.open();

	this.defaultControls[3] = this.optionsFolder.add(this, 'difficulty', this.difficulties).name('Difficulty').listen();
	this.defaultControls[4] = this.optionsFolder.add(this,'undo').name('Undo');
	this.omnilights = this.gui.addFolder("Omnilights");
	this.omnilights.open();

	this.spotlights = this.gui.addFolder("Spotlights");
	this.spotlights.open();


	return true;
};

MyInterface.prototype.undo = function(){
	this.scene.board.undo();
}

MyInterface.prototype.startGame = function(){
	this.scene.board.history = new MyHistory(this.scene);
	this.scene.board.makeRequest('init');
	if(this.scene.board.history.type == 3){
			if(this.scene.board.history.playing == this.scene.board.history.player1)
				this.points = this.scene.board.history.p1Points;
			else
				this.points = this.scene.board.history.p2Points;

			this.scene.board.makeRequest('bot_play(' + this.scene.board.boardToList() + ',' + this.scene.board.history.playing + ',' + this.points + ',' + this.scene.board.history.difficulty + ')');
	}
}

/*
* Adds a new light to the interface
*/
MyInterface.prototype.addLight = function(type, index, name){
	if(type == "omni")
  	this.omnilights.add(this.scene.lightStatus, index, this.scene.lightStatus[index]).name(name);
	else
		this.spotlights.add(this.scene.lightStatus, index, this.scene.lightStatus[index]).name(name);
}

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
		case (77):
		case (109): // 'm' and 'M' ascii code
			//updates the material, if 'm' or 'M' is pressed
			this.scene.updateMaterial();
			break;
		case (86):
		case (118): // 'v' and 'V' ascii code
		//updates the camera, if 'v' or 'V' is presed
			this.scene.updateViews();
			break;
		default:
			break;
	};
};

MyInterface.prototype.processKeyUp = function(event)
{
	CGFinterface.prototype.processKeyUp.call(this,event);
};
