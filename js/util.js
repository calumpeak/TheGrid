//Intialise util namespace
var util = util || {};

/*
* Create Element
*/
util.createEl = function (tag) {
	return document.createElement(tag);
}

/*
* build element
* baseEl is the element that needs to be appended to
* accepts any number of following arguments to append to baseEl
*/
util.buildEl = function (baseEl) {
    var builtElement;
    var len = arguments.length;
    var i;

    for (i = 1; i < len; i++) {
        builtElement = baseEl.appendChild(arguments[i]);
    }

    return builtElement;
}

/*
* Get Elements
*/
util.getEl = function (element) {
	var type = element.substring(0,1);

	if (type === "." || type === "#") {
		return document.querySelector(element);
	} else {
		return document.getElementsByTagName(element);
	}
}

/*
* Remove Element from DOM
*/
util.removeEl = function(elem) {
	var el;
	if (typeof(elem) === "object") {
		el = elem;
	} else {
		el = util.getEl(elem);
	}

	el.parentNode.removeChild(el);
}

/*
* Remove event listeners
* Removes event listeners from elements with same tag name
*/
util.removeListeners = function (elem, event, func) {
	var elements = util.getEl(elem);
	//Loop through elements remove listeners
	for (var i = 0; i < elements.length; i++) {
		elements[i].removeEventListener(event, func);
	}
}

//TODO Custom Fade levels
/*
* Fade DOM elements in and out
* Executes callback on complete
* startOpacity 0 --> Fade In
* startOpacity 1 --> Fade Out
*/
util.fade = function (element, startOpacity, cb) {
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
			util.removeEl(element);
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
