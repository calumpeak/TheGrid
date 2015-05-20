//Work In Progress...

//Load
(function init() {
	window.addEventListener('message', handleMessage.bind(game), false);
})();
//init game object
var game = {};
//get elements 
game.gridEl = document.querySelector('#content');
game.timerEl = document.querySelector('#timer');
game.scoreEl = document.querySelector('#score');
game.cells =  game.gridEl.getElementsByTagName('td');
//Set defualts
game.rows = 5;
game.cols = 5;
game.secs = 500;
game.score = 0;

game.grid = function() {
	var grid = document.createElement('table'),
		tr, td, i, j;

	for (i = 0; i < game.rows; i++) {
		tr = grid.appendChild(document.createElement('tr'));

		for (j = 0; j < game.cols; j++) {
			td = tr.appendChild(document.createElement('td'));
			td.addEventListener('click', function(event){
				//handle clicks
				game.clickHandler(event);
			})
		}
	}
	grid.id = 'grid';
	game.gridEl.appendChild(grid);
	game.button();
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
	game.handleTimer();

	clearInterval(countdown);
	var countdown = setInterval(function() {
		if(game.secs === 0) {
			game.over();
			clearInterval(countdown);
		} else {
			game.secs-- ;
			timer.innerHTML = (game.secs / 100).toFixed(2);
		}
		
	}.bind(game),10);
		
}
game.handleTimer = function() {
	//reset to default
	var defaultTime = 500;
	
	game.score % 5 == 0 ? defaultTime - 50 : defaultTime;

	//Set secs to default time
	game.secs = defaultTime;
}

game.clickHandler = function(event) {
	if (game.secs !== 0 && event.srcElement.id === 'button') {
		//Increase Score
		game.score++
		game.scoreEl.innerHTML = game.score;
		//Level Up
		game.levelUp();
		game.timer();
	} else {
		game.over();
	}
}

game.levelUp = function() {
	//Grow Grid Size
	game.rows ++;
	game.cols ++;
	//recall grid
	game.removeEl('#grid');
	game.grid();
	//Shorten timer every 5 clicks
	//game.handleTimer();
}
game.button = function() {
	var button = game.getRandomCell();
	button.style.backgroundColor = 'red';
	button.id = 'button';
}

game.getRandomCell = function() {
	var randCell = game.cells[Math.floor(Math.random() * game.cells.length)];
	return randCell;
}

game.over = function() {
	var message = game.secs <= 0 ? 'Out of time! Game Over!' : "That's not a button! Game Over!";
	alert(message + ' You scored ' + this.score + ' points!'); //fix plural
	//reset
	game.reset();
}

game.reset = function() {
	//return to default values
	game.rows = 5;
	game.cols = 5;
	game.secs = 500;
	game.score = 0;
	game.scoreEl.innerHTML = game.score;
	//recall grid
	game.removeEl('#grid');
	game.grid();

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






