//TODO All of the things
//TODO Greyed out splash screen
//TODO Fix Score Listing (order them)
//TODO Starting Splash Screen
//TODO Refactor CSS. Make classes for shared items
//TODO Refactor some common items into the html?

//Intialise
(function init() {
	window.addEventListener("message", handleMessage.bind(game), false);
})();

//init game namespace
var game = game || {};

//get elements
game.wrapper  = util.getEl("#wrapper");
game.gridEl   = util.getEl("#content");
game.timerEl  = util.getEl("#timer");
game.scoreEl  = util.getEl("#score");
//Set defualts
game.rows  = 5;
game.cols  = 5;
game.secs  = 500;
game.defaultTime = game.secs;
game.score = 0;
game.scoreArr = [];

game.start = function () {
	var frame 	  = util.createEl("div");
	var buttonStd = util.createEl("div");
	var buttonInv = util.createEl("div");

	var text = "Hello World!";

	frame.innerHTML = text;
}

game.grid = function () {
	var grid = util.createEl("table");
	var tr;
	var td;
	var i;
	var j;

	for (i = 0; i < this.rows; i++) {
		tr = util.buildEl(grid, util.createEl("tr"));

		for (j = 0; j < this.cols; j++) {
			td = util.buildEl(tr, util.createEl("td"));
			td.addEventListener("click", game.clickLogger);
		}
	}
	grid.id = "grid";
	util.buildEl(this.gridEl, grid);
	this.button();
}

/*
* Sets up timer
*/
game.timer = function() {
	var timer = document.querySelector("#timer");

	clearInterval(this.countdown);
	this.countdown = setInterval(function() {
		if(this.secs === 0) {
			clearInterval(this.countdown);
			signalEvent("storeScore");
		} else {
			this.secs-- ;
			timer.innerHTML = (this.secs / 100).toFixed(2);
		}

	}.bind(this),10);
}

/*
* handleTimer
* drops timer based on score
* Timer doesnt drop lower than 1 second
*/
game.handleTimer = function() {
	if (this.score % 5 == 0 && this.defaultTime !== 100) {
		this.defaultTime -= 100;
	}
	//Set secs to default time
	this.secs = this.defaultTime;
}

/*
* Click Logger
* named function so that it can be removed from listeners
*/
game.clickLogger = function (event) {
	game.clickHandler(event);
}

/*
* click Handler
* Decides what to do with click event
* TODO Refactor to message system
*/
game.clickHandler = function(event) {
	if (this.secs !== 0 && event.srcElement.id === "button") {
		//Increase Score
		this.score++
		this.scoreEl.innerHTML = this.score;
		//Level Up
		this.levelUp();
		this.timer();
	} else {
		clearInterval(this.countdown);
		signalEvent("storeScore");
	}
}

/*
* level up
* self explanitory
*/
game.levelUp = function() {
	//Grow Grid Size
	if (this.score % 5 == 0) {
		this.rows ++;
		this.cols ++;
	}
	//recall grid
	util.removeEl("#grid");
	this.grid();
	//Shorten Timer
	this.handleTimer();
}

/*
* button
* creates button instance
*/
game.button = function() {
	var button = this.getRandomCell();
	button.id = "button";
}

/*
* getRandomCell
* returns a random cell element on the grid
*/
game.getRandomCell = function() {
	var gridCell = this.gridEl.getElementsByTagName("td");
	var randCell = gridCell[Math.floor(Math.random() * gridCell.length)];
	return randCell;
}

//TODO: Refactor
/*
* game over
* builds game over splash screen
*/
game.over = function() {
	var typeOfEnd = this.secs <= 0
		? "Out of time.<br/>Game Over!"
		: "That's not a button.<br/>Game Over!";
	var messageText = typeOfEnd + "<br/>" +" You scored " + this.score
		+ (this.score == 1
			? " point!"
			: " points!");
	//Elements
	var frame   = util.createEl("div"),
		button  = util.createEl("div"),
		message = util.createEl("p"),
		score   = util.createEl("ul");
	//ID"s
	frame.id   = "endSplash";
	button.id  = "retryButton";
	message.id = "messageText";
	//Content
	button.innerHTML  = "Try Again!";
	message.innerHTML = messageText;

	//Build list items
	for (var i = 0; i < this.scoreArr.length; i++) {
		//Can only list a max of 6 items on div
		if (i <= 5) {
			var scoreEl = util.createEl("li");
			scoreEl.innerHTML = this.scoreArr[i].score + "\t" + this.scoreArr[i].name;
			util.buildEl(score, scoreEl);
		}
	}
	//Build Frame
	util.buildEl(frame, message, button, score);
	//Frame Style
	frame.style.opacity = 0;
	//Append to document
	util.buildEl(this.wrapper, frame);
	//Pretty fade in
	util.fade(frame, 0);

	//Button Click Handler
	button.addEventListener("click", function() {
		util.fade(frame, 1, game.reset);
	});
}

/*
* game reset
* Resets game back to defaults
*/
game.reset = function() {
	//return to default values
	game.rows = 5;
	game.cols = 5;
	game.secs = 500;
	game.defaultTime = 500;
	game.timerEl.innerHTML = "5.00";
	game.score = 0;
	game.scoreEl.innerHTML = game.score;
	//recall grid
	util.removeEl("#grid");
	game.grid();
}

/*
* storeScore
* creates splash screen to get user input to build the store score object
*/
game.storeScore = function(score) {
	var promptScreen = util.createEl("div");
	var inputArea	 = util.createEl("input");
	var submit	     = util.createEl("button");
	var name;
	//Assign ID"s
	promptScreen.id  = "prompt";
	inputArea.id	 = "input";
	submit.id  		 = "submitButton";
	//Styling
	inputArea.placeholder = "Name";
	submit.innerHTML = "Submit!"
	promptScreen.style.opacity = 0;
	//Append
	util.buildEl(promptScreen, inputArea, submit);
	util.buildEl(this.wrapper, promptScreen);
	//Pretty FadeIn
	util.fade(promptScreen, 0);

	submit.addEventListener("click", function () {
		name = inputArea.value;
		game.scoreArr.push({
			score: score,
			name: name
		});
		util.fade(promptScreen, 1, signalEvent("gameOver"));
	})
}

function signalEvent(event) {
	window.parent.postMessage(JSON.stringify({
		message: event
	}), "*");
}

function handleMessage(e) {
	try {
		var data = JSON.parse(e.data);
	} catch (err) {
		return;
	}

	switch(data.message){
		case "load":
			game.grid();
			break;
		case "storeScore":
			util.removeListeners("td", "click", game.clickLogger);
			game.storeScore(game.score);
			break;
		case "gameOver":
			game.over();
			break;
		case "backSplash":
			break;
		default:
			break;
	}
}
