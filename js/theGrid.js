//TODO All of the things
//TODO fix width/height so it constrains dimensions
//TODO Fix timer issues
//TODO DON'T FUCKING USE SET INTERVAL. Get recursive all up in here
//TODO Get rid of the GOD AWFUL colour scheme

//Load
(function init() {
	window.addEventListener('message', handleMessage.bind(game), false);
})();
//init game object
var game = {};
//get elements
game.wrapper  = document.querySelector('#wrapper');
game.gridEl   = document.querySelector('#content');
game.timerEl  = document.querySelector('#timer');
game.scoreEl  = document.querySelector('#score');
//Set defualts
game.rows  = 5;
game.cols  = 5;
game.secs  = 500;
game.score = 0;
game.scoreArr = [];

game.grid = function() {
	var grid = document.createElement('table'),
		tr, td, i, j;

	for (i = 0; i < this.rows; i++) {
		tr = grid.appendChild(document.createElement('tr'));

		for (j = 0; j < this.cols; j++) {
			td = tr.appendChild(document.createElement('td'));
			td.addEventListener('click', game.clickLogger);
		}
	}
	grid.id = 'grid';
	this.gridEl.appendChild(grid);
	this.button();
}

/*
* Remove Element from DOM
*/
game.removeEl = function(elem) {
	var el;
	if (typeof(elem) === 'object') {
		el = elem;
	} else {
		el = document.querySelector(elem);
	}

	el.parentNode.removeChild(el);
}

/*
* Remove event listeners
*/
game.removeListeners = function (elem, event, func) {
	var elements = document.getElementsByTagName(elem);
	//Loop through elements remove listeners
	for (var i = 0; i < elements.length; i++) {
		elements[i].removeEventListener(event, func);
	}
}

/*
* Sets up timer
*/
game.timer = function() {
	var timer = document.querySelector('#timer');

	clearInterval(this.countdown);
	this.countdown = setInterval(function() {
		if(this.secs === 0) {
			clearInterval(this.countdown);
			signalEvent('storeScore');
		} else {
			this.secs-- ;
			timer.innerHTML = (this.secs / 100).toFixed(2);
		}

	}.bind(this),10);
}

//TODO: Fix where time is overiding back to 5secs
game.handleTimer = function() {
	//reset to default
	this.defaultTime = 500;

	if (this.score % 5 == 0) {
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
	if (this.secs !== 0 && event.srcElement.id === 'button') {
		//Increase Score
		this.score++
		this.scoreEl.innerHTML = this.score;
		//Level Up
		this.levelUp();
		this.timer();
	} else {
		clearInterval(this.countdown);
		//this.over();
		signalEvent('storeScore');
	}
}

/*
* level up
* self explanitory
*/
game.levelUp = function() {
	//Grow Grid Size
	this.rows ++;
	this.cols ++;
	//recall grid
	this.removeEl('#grid');
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
	button.id = 'button';
}

/*
* getRandomCell
* returns a random cell element on the grid
*/
game.getRandomCell = function() {
	var gridCell = this.gridEl.getElementsByTagName('td');
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
		? 'Out of time. Game Over!'
		: "That's not a button. Game Over!";
	var messageText = typeOfEnd + ' You scored ' + this.score
		+ (this.score == 1
			? ' point!'
			: ' points!');
	//Elements
	var frame   = document.createElement('div'),
		button  = document.createElement('div'),
		message = document.createElement('p');
		score   = document.createElement('ul');
	//Id's
	frame.id   = 'endSplash';
	button.id  = 'retryButton';
	message.id = 'messageText';
	//Content
	button.innerHTML  = 'Try Again!';
	message.innerHTML = messageText;

	//Build list items
	for (var i = 0; i < this.scoreArr.length; i++) {
		//Can only list a max of 8 items on div
		if (i <= 8) {
			var scoreEl = document.createElement('li');
			scoreEl.innerHTML = this.scoreArr[i].score + "\t"+ this.scoreArr[i].name;
			score.appendChild(scoreEl);
		}
	}
	//Build Frame
	frame.appendChild(message);
	frame.appendChild(button);
	frame.appendChild(score);
	//Frame Style
	frame.style.opacity = 0;
	//Append to document
	this.wrapper.appendChild(frame);
	//Pretty fade in
	game.fade(frame, 0);

	//Button Click Handler
	button.addEventListener('click', function() {
		game.fade(frame, 1, game.reset);
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
	game.removeEl('#grid');
	game.grid();
}

/*
* storeScore
* creates splash screen to get user input to build the store score object
*/
game.storeScore = function(score) {
	var promptScreen = document.createElement('div');
	var inputArea	 = document.createElement('input');
	var submit	     = document.createElement('button');
	var name;
	promptScreen.id  = 'prompt';
	inputArea.id	 = 'input';
	submit.id  		 = 'submitButton';

	inputArea.placeholder = 'Name';
	submit.innerHTML = 'Submit!'
	promptScreen.style.opacity = 0;

	promptScreen.appendChild(inputArea);
	promptScreen.appendChild(submit);
	this.wrapper.appendChild(promptScreen);
	//Pretty FadeIn
	this.fade(promptScreen, 0);

	submit.addEventListener('click', function () {
		name = inputArea.value;
		game.scoreArr.push({
			score: score,
			name: name
		});
		game.fade(promptScreen, 1, signalEvent('gameOver'));
	})
}

//TODO Custom Fade levels
/*
*Fade DOM elements in and out
*Executes callback on complete
*/
game.fade = function (element, startOpacity, cb) {
	var count = startOpacity;
	var faderIn;
	var faderOut;

	//Fade element in
	function fadeIn () {
		if (element.style.opacity >= 1) {
			element.style.opacity = 1;
			window.clearTimeout(faderIn);
			cb ? cb() : false;
		} else {
			count += 0.05;
			element.style.opacity = count;
			faderIn = window.setTimeout(fadeIn, 20);
		}
	}
	//Fade element out
	//Remove element once faded out
	function fadeOut () {
		if (element.style.opacity <= 0) {
			window.clearTimeout(faderOut);
			game.removeEl(element);
			cb ? cb() : false;
		} else {
			count -= 0.05;
			element.style.opacity = count;
			faderOut = window.setTimeout(fadeOut, 20);
		}
	}
	// Fade type selector
	if (startOpacity === 0) {
		faderIn = window.setTimeout(fadeIn, 20);
	} else if (startOpacity === 1) {
		faderOut = window.setTimeout(fadeOut, 20);
	}
}

function signalEvent(event) {
	window.parent.postMessage(JSON.stringify({
		message: event
	}), '*');
}

function handleMessage(e) {
	try {
		var data = JSON.parse(e.data);
	} catch (err) {
		return;
	}

	switch(data.message){
		case 'load':
			game.grid();
			break;
		case 'storeScore':
			game.removeListeners('td', 'click', game.clickLogger);
			game.storeScore(game.score);
			break;
		case 'gameOver':
			game.over();
			break;
		case 'backSplash':
			break;
		default:
			break;
	}
}
