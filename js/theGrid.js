//Work In Progress...

//Load
(function init() {
	window.addEventListener('message', handleMessage.bind(game), false);
})();
//init game object
var game = {};
//get elements 
game.wrapper  = document.querySelector('#wrapper');
game.gridEl = document.querySelector('#content');
game.timerEl = document.querySelector('#timer');
game.scoreEl = document.querySelector('#score');
//Set defualts
game.rows = 5;
game.cols = 5;
game.secs = 500;
game.score = 0;

game.grid = function() {
	var grid = document.createElement('table'),
		tr, td, i, j;

	for (i = 0; i < this.rows; i++) {
		tr = grid.appendChild(document.createElement('tr'));

		for (j = 0; j < this.cols; j++) {
			td = tr.appendChild(document.createElement('td'));
			td.addEventListener('click', function(event){
				//handle clicks
				game.clickHandler(event);
			});
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
	var el = document.querySelector(elem);
	el.parentNode.removeChild(el);
}

/*
* Sets up timer
*/
game.timer = function() {
	var timer = document.querySelector('#timer');
	//Check if default or reduced
	//game.handleTimer();

	clearInterval(this.countdown);
	this.countdown = setInterval(function() {
		if(this.secs === 0) {
			clearInterval(this.countdown);
			this.over();
		} else {
			this.secs-- ;
			timer.innerHTML = (this.secs / 100).toFixed(2);
		}
		
	}.bind(this),10);
		
}
game.handleTimer = function() {
	//reset to default
	this.defaultTime = 500;
	console.log('!!!');
	if (this.score % 5 == 0) {
		console.log('fired');
		this.defaultTime - 50;
	} 

	//Set secs to default time
	this.secs = this.defaultTime;
	console.log(this.score, this.secs);

}

game.clickHandler = function(event) {
	if (this.secs !== 0 && event.srcElement.id === 'button') {
		//Increase Score
		this.score++
		this.scoreEl.innerHTML = this.score;
		//Level Up
		this.levelUp();
		this.timer();
	} else {
		this.over();
	}
}

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
game.button = function() {
	var button = this.getRandomCell();
	button.style.backgroundColor = 'red';
	button.id = 'button';
}

game.getRandomCell = function() {
	var gridCell = this.gridEl.getElementsByTagName('td');
	var randCell = gridCell[Math.floor(Math.random() * gridCell.length)];
	return randCell;
}

game.over = function() {
	var typeOfEnd = this.secs <= 0 ? 'Out of time! Game Over!' : "That's not a button! Game Over!";
	var messageText = typeOfEnd + ' You scored ' + this.score + (this.score == 1 ? ' point!' : ' points!'); 
	//reset
	//game.reset();

	//Elements
	var frame = document.createElement('div'),
		button = document.createElement('div'),
		message = document.createElement('p');
	//Id's
	frame.id = 'endSplash';
	button.id = 'retryButton';
	message.id = 'messageText';
	//Content
	button.innerHTML = 'Try Again!';
	message.innerHTML = messageText;
	//Append
	frame.appendChild(message);
	frame.appendChild(button);

	this.wrapper.appendChild(frame);

	//Button Click Handler
	button.addEventListener('click', function() {
		game.reset();
	});
	//Facebook API?
	//Save Scores

}

game.reset = function() {
	//return to default values
	this.rows = 5;
	this.cols = 5;
	this.secs = 500;
	this.defaultTime = 500;
	this.score = 0;
	this.scoreEl.innerHTML = this.score;
	this.removeEl('#endSplash');
	//recall grid
	this.removeEl('#grid');
	this.grid();

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
		default: 
			break;
	}
}






