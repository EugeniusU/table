document.body.appendChild(document.createElement('textarea'));
var textarea = document.getElementsByTagName('textarea')[0];
textarea.id = 'textarea';

document.body.appendChild(document.createElement('button'));
var button = document.getElementsByTagName('button')[0];
button.textContent = 'save state';

document.body.appendChild(document.createElement('button'));

var buttonUpload = document.getElementsByTagName('button')[1];
buttonUpload.textContent = 'upload state';

document.body.appendChild(document.createElement('button'));

var saveButton = document.getElementsByTagName('button')[2];
saveButton.textContent = 'save file';

document.body.appendChild(document.createElement('table'));

var table = document.getElementsByTagName('table');

function elt(name, className) {
	var elt = document.createElement(name);
	if (className) {
		elt.className = className;
	}
	return elt;
}

function makeNode(table, nodeType, i, row) {
	if (row) {
		table.appendChild(elt(row)).appendChild(elt(nodeType)).appendChild(elt('input'));
	} else {
		table.childNodes[i].appendChild(elt(nodeType)).appendChild(elt('input'));
	}
}
table[0].tabindex = '';
var keyCodes = {37: 'left', 38: 'up', 39: 'right', 40: 'down'};
console.log(table[0]);
addEventListener('keypress', function(event) {
	if (event.keyCode in keyCodes) {
		if (document.activeElement.tagName != ('INPUT'||'TEXTAREA')) {
			move(keyCodes[event.keyCode]);
			event.preventDefault();
		}
	}
});

var addNow = {width: 0, height: 0};

function move(keyCodes) {
	if (table[0].childNodes.length == 0) {
		var width = 0, height = 0;
	} else {
		var width = table[0].childNodes[0].childNodes.length;
		var height = table[0].childNodes.length;
	}
	
	if (keyCodes == 'right') {
		if (height == 0) {
			makeNode(table[0], 'th', 0, 'tr');
			return null;
		}
		if (height == 1) {
			makeNode(table[0], 'th', 0);
			return null;
		}
		makeNode(table[0], 'th', 0);
		for (var i = 1; i < height; i++) {
			makeNode(table[0], 'td', i);
		}
	}
	
	if (keyCodes == 'down') {
		makeNode(table[0], 'td', height, 'tr');
		console.log(width, 'width', height, 'height');
		for (var j = 1; j <= height; j++) {
			while (table[0].childNodes[j].childNodes.length < width) {
				makeNode(table[0], 'td', j);
				console.log(width, height);
			}
		}
	}
	
	if (keyCodes == 'left') {
		for (var i = height - 1; i >= 0; i--) {
			table[0].childNodes[i].removeChild(table[0].childNodes[i].lastChild);
		}
	}
	
	if (keyCodes == 'up') {
		var i = table[0].childNodes.length - 1;
		table[0].removeChild(table[0].childNodes[i]);
	}
	
	var tableLikeA = getValue(new Table(table[0]));
	var tableSize = new Table(table[0]);
	var i = 0;
	
	if (addNow.width < tableSize.width) {
		i = 0;
		while (i <= tableSize.height - 1) {
			var el = tableLikeA[i][tableSize.width - 1];
			newEl(el);
			i++;
		}
	}
	if (addNow.height < tableSize.height) {
		i = 0;
		while (i < tableSize.width) {
			var el = tableLikeA[tableSize.height - 1][i];
			newEl(el);
			i++;
		}
	}
	addNow.width = tableSize.width;
	addNow.height = tableSize.height;
}

function sTest(width, height) {			// build new table by gets size
	var i = 0, j = 0;
	if (width > 0) {
		while (i < width) {
			move('right');
			i++;
		}
	}
	if (height > 0) {
		while (j < height) {
			move('down');
			j++;
		}
	}
	if (width < 0) {
		while (i > width) {
			move('left');
			i--;
		}
	}
	if (height < 0) {
		while (j > height) {
			move('up');
			j--;
		}
	}
}

function getValue(getTable, f) {
	var realA = [];
	
	for (var i = 0; i < getTable.height; i++) {
		var preA = [];
		for (var j = 0; j < getTable.width; j++) {
			preA.push(getTable.table.childNodes[i].childNodes[j]);
		}
		realA.push(preA);
	}

	if (arguments.length == 2) {
		return f(realA);
	}
	
	return realA;
}

function Table(table) {
	if (table.childNodes[0] != undefined) {
	this.width = table.childNodes[0].childNodes.length;
	this.height = table.childNodes.length;
	} else {
		this.width = 0;
		this.height = 0;
	}
	this.table = table;
}

function Vector(x, y) {
	this.x = x;
	this.y = y;
}


function setValue2(value, vector, vector2) {

	makeForValues(value, vector, vector2);
	var getTable = new Table(table[0]);
	
	if (arguments[1] == undefined) {
		if (value.length == 1) {
			getTable = new Table(table[0]);
			getTable.table.childNodes[0].childNodes[0].lastChild.value = value;
		} else {
			for (var i = 0; i < value.length; i++) {
				getTable.table.childNodes[i].childNodes[0].lastChild.value = value[i];
			}
		}
	} else if (arguments[2] == undefined) {
		var x = vector.x - 1, y = vector.y - 1;

		for (var i = 0; i < value.length; i++) {
			getTable.table.childNodes[y + i].childNodes[x].lastChild.value = value[i];
		}
	} else if (arguments[2] != undefined) {
		var x = vector.x - 1, y = vector.y - 1;
		var x2 = vector2.x - 1, y2 = vector2.y - 1;
		var j = 0;

		if (vector.x == vector2.x) {
			for (var i = y; i <= y2; i++) {
				getTable.table.childNodes[i].childNodes[x].lastChild.value = value[j];				
				j++;
			}
		}
		if (vector.y == vector2.y) {
			for (var i = x; i <= x2; i++) {
				getTable.table.childNodes[y].childNodes[i].lastChild.value = value[j];				
				j++;
			}
		}
	}
}


function makeForValues(values, vector, vector2) {
	var tableNow = new Table(table[0]);
	
	if (tableNow.width == 0) {
		move('right');
	}

	if (arguments[0] != undefined) {
		if (tableNow.height < values.length - 1) {
			while (tableNow.height < values.length) {
				move('down');
				tableNow = new Table(table[0]);
			}
		}
	}
	
	if (arguments[1] != undefined && arguments[2] == undefined) {
		if (tableNow.height - vector.y < values.length - 1) {
			while (tableNow.height - vector.y < values.length - 1) {
				move('down');
				tableNow = new Table(table[0]);
			}
		}
		if (tableNow.width < vector.x) {
			while (tableNow.width < vector.x) {
				move('right');
				tableNow = new Table(table[0]);
			}
		}
	}
	
	if (arguments[2] != undefined) {
		if (vector.x == vector2.x) {
			while (tableNow.height < vector2.y) {
				move('down');
				tableNow = new Table(table[0]);
			}
			while (tableNow.width < vector.x) {
				move('right');
				tableNow = new Table(table[0]);
			}
		}
		if (vector.y == vector2.y) {
			while (tableNow.height < vector2.y) {
				move('down');
				tableNow = new Table(table[0]);
			}
			while (tableNow.width < vector2.x) {
				move('right');
				tableNow = new Table(table[0]);
			}
		}
	}
}


var stringFromTextarea = '';

textarea.addEventListener('keypress', function(event) {
	if (event.keyCode == 13) {
		stringFromTextarea = textarea.value;
		testKeys(stringFromTextarea);
	}	
});

//var functionKeys = {set: setValue2, value: someValue3, storage: showStorage};
var functionKeys = {set: setValue2, value: someValue3};
var f2;


var operatorsState = [];

var state = false;		


var find = 0;
var althabet = 'abcdefghigklmnopqrstuvwxyz';

function findN(el) {
	var preF = 0;
	var str = el.lastChild.value;

	var groupFind = /['(']/;

	var strWithoutWhiteSpace = '';
	var preV = [];
	var preVN = [];
	var v = '';
	var exp = '';
	str.split('').forEach(function(a) {
		if (a != ' ') {
			strWithoutWhiteSpace += a;
		}
		if (Number(a)) {
			preV.push(a);
			preVN.push(Number(a));
		}
	});
	
	for (var i = 0; i < preV.length; i++) {
		preV[i] = althabet[i];
	}
	v = preV.join(', ');

	exp = strWithoutWhiteSpace.slice(strWithoutWhiteSpace, strWithoutWhiteSpace.length - 1);
	exp = 'return ' + exp;
	console.log(exp);

	var testFunc = new Function(v, exp);

	find = testFunc();
	console.log(find);
	return find;
}


function State(getValue) {
	this.width = getValue[0].length;
	this.height = getValue.length;
	this.date = Date.now();
	
	this.values = values = [];
	
	getValue.forEach(function(a) {
		var row = [];
		a.forEach(function(b) {
			if (b.lastChild.value != undefined) {
			row.push(b.lastChild.value);
			} else {
				row.push(b.textContent);
			}
		});
		values.push(row);
	});
}


var storage = [];


button.addEventListener('click', function(event) {
	if (event) {
		storage.push(new State(getValue(new Table(table[0]))));
		button.style.background = 'green';
		setTimeout(function() {
			button.style.background = '';
		}, 300);
		console.log(storage);
	}
});


function someValue3(from, to, step, randomQ) {
	var array = [];
	var max = Math.max(from, to);
	var min = Math.min(from, to);
	
	if (arguments[2] == undefined) {
		for (var i = min; i <= max; i++) {
			array.push(i);
		}
		if (from > to) {
			array = array.reverse();
		}
	} else if (arguments[3] == undefined) {
		if ((from < to && step <= 0) || (from > to && step >= 0)) {
			return null;
		}
		if (from > to) {
			for (var i = min; i <= max; i = i - step) {
				array.push(i);
			}
			array = array.reverse();
		} else {
			for (var i = min; i <= max; i = i + step) {
				array.push(i);
			}
		}
	} else if (arguments[3] != undefined) {
		function random2() {
			var n = Math.floor(Math.random() * (to - from) + from);
			array.push(n);
		}
		var q = arguments[3];
		for (var i = 0; i < q; i++) {
			random2();
		}
	}
	console.log(array);
	return array;
}


var eventAdd = [];

function newEl(el) {
//	el.lastChild.addEventListener('keypress', function(event) {
	el.lastChild.addEventListener('keydown', function(event) {
		var x = String.fromCharCode(event.charCode);
		var tKey = event.key;
/*		if ((x == '=' && !state) || (tKey == '=')) {
			setTimeout(function() {
				var solution = findN(el);
				el.lastChild.value = el.lastChild.value + ' ' + solution;
			}, 100);
		}*/
//		if ((x == '=' && state) || (tKey == '=')) {
/*		setTimeout(function() {
//			var lastChar = el.lastChild.value[el.lastChild.value.length - 1];
//			if (lastChar == '=') {
//				var solution = findN(el);
//				el.lastChild.value = el.lastChild.value + ' ' + solution;
//			}
			var allValues = event.target.value;
			var lastChar = allValues[allValues.length - 1];
			if (lastChar == '=') {
				var solution = findN(el);
				el.lastChild.value = el.lastChild.value + ' ' + solution;
			}
		}, 100);*/
		if (x == '=' || tKey == '=') {
			setTimeout(function() {
				var solution = findN(el);
				el.lastChild.value = el.lastChild.value + ' ' + solution;
			}, 100);
		}
		setTimeout(function() {
			var allValues = event.target.value;
			var lastChar = allValues[allValues.length - 1];
			if (lastChar == '=') {
				var solution = findN(el);
				el.lastChild.value = el.lastChild.value + ' ' + solution;
			}
		}, 100);
	});
}
sTest(4, 4);

function copy(inOrOut, vector, vector2) {
	var array = [];

	tableValues = new State(getValue(new Table(table[0]))).values;
	
	if (arguments[0] == undefined) {
		var vector = new Vector(1, 1);
		for (var i = 0; i < tableValues.length; i++) {
			array.push(tableValues[i][0]);
		}
		setValue2(array, new Vector(2, 1));
	}

	if (inOrOut == 'out') {
		copyA = [];
		var x = vector.x - 1, y = vector.y - 1;
		if (vector2 == undefined) {
			for (var i = y; i < tableValues.length; i++) {
				copyA.push(tableValues[i][x]);
				console.log(tableValues[i][x]);
			}
		} else if (vector2 != undefined) {
			var x2 = vector2.x - 1, y2 = vector2.y - 1;
				for (var i = y; i < y2; i++) {
					var preA = [];
					for (var j = x; j < x2; j++) {
						preA.push(tableValues[i][j]);
					}
					copyA.push(preA);
				}
		}
	}
		
	if (inOrOut == 'in') {
		var x = vector.x - 1, y = vector.y - 1;
		if (vector2 == undefined) {
			setValue2(copyA, vector);
		} else if (vector2 != undefined) {
			var x2 = vector2.x - 1, y2 = vector2.y - 1;
			var sequence = vector.x - 1;
			for (var i = 0; i < copyA.length; i++) {
				setValue2(copyA[i], new Vector(sequence + 1, vector.y));
			}
		}
	}
}


var valueNow;			// save array values from someValue3

var callingValue = false;

function testKeys(stringFromTextarea) {
	
	var arrayValues = stringFromTextarea.split('\n');
	var lastValue = arrayValues[arrayValues.length - 1];
	
	lastValue = lastValue.toLowerCase();

///	var findWord = /\w+/;
	var findWord = /(\w+)\s?(\w+)*/;
	var findNumber = /(-?\d+,?\s?)+/;
	var findSymbol = /(,|\s|,\s)/;
	
	var preS = findWord.exec(lastValue);
	var preN = findNumber.exec(lastValue);
	var preSy = findSymbol.exec(preN);
	
	var numArg = [];
	
	if (preN) {
	var num = preN[0].split(preSy[0]);
	console.log(num);
	num.forEach(function(a) {
		numArg.push(Number(a));
	});
	console.log(numArg);
	
	if (preS[1] == 'value') {
	valueNow = functionKeys[preS[1]].apply(null, numArg);
	}
	}
	if (preS[1] == 'set') {
	if (numArg.length > 0 && valueNow) {
		if (numArg.length == 2) {
		functionKeys[preS[1]](valueNow, new Vector(numArg[0], numArg[1]));
		} else if (numArg.length == 4) {
		functionKeys[preS[1]](valueNow, new Vector(numArg[0], numArg[1]),
										new Vector(numArg[2], numArg[3]));
		}
	}
	if (numArg.length == 0 && valueNow) {
		functionKeys[preS[1]](valueNow);
	}
	}
	if (preS[1] == 'copy' && preS[2] == undefined) {
			copy();
	}
	if (preS[1] == 'copy' && preS[2] == 'in') {
		if (numArg.length == 2) {
			copy('in', new Vector(numArg[0], numArg[1]));
		} else if (numArg.length == 4) {
			copy('in', new Vector(numArg[0], numArg[1]), new Vector(numArg[2], numArg[3]));
		}
	}
	if (preS[1] == 'copy' && preS[2] == 'out') {
		if (numArg.length == 2) {
			copy('out', new Vector(numArg[0], numArg[1]));
		} else if (numArg.length == 4) {
			copy('out', new Vector(numArg[0], numArg[1]), new Vector(numArg[2], numArg[3]));
		}
	}
	
	if (preS[1] == 'sort') {
		if (preS[2] == 'min') {
			sortByHeight('min', new Vector(numArg[0], numArg[1]));
		} else if (preS[2] == 'max') {
			sortByHeight('max', new Vector(numArg[0], numArg[1]));
		}
	}
	
	if (preS[1] == 'size') {
		sTest(numArg[0], numArg[1]);
	}
}


function uploadValues(state) {
	state = state[state.length - 1]
	var width = state.width;
	var height = state.height;
	var values = state.values;
	
	for (var i = 0; i < values.length; i++) {
		setValue2(values[i], new Vector(1, i + 1), new Vector(width, i + 1));
	}
}


buttonUpload.addEventListener('click', function(event) {
	if (event) {
		uploadValues(storage);
		buttonUpload.style.background = 'magenta';
		setTimeout(function() {
			buttonUpload.style.background = '';
		}, 300);
	}
});


function sortByHeight(minOrMax, vector) {
	var array = [];
	var x = vector.x - 1;
	var y = vector.y - 1;
	var tableValues = new State(getValue(new Table(table[0]))).values;
	
	for (var i = y; i < tableValues.length; i++) {
			array.push(tableValues[i][x]);
	}
	
	if (minOrMax == 'min') {
		const sortMin = array => array.sort((a, b) => a - b);
		array = sortMin(array);
	} else if (minOrMax == 'max') {
		const sortMax = array => array.sort((a, b) => b - a);
		array = sortMax(array);
	}
	setValue2(array, vector);
}

saveButton.addEventListener('click', function(event) {
	if (event) {
		var json = JSON.stringify(storage[storage.length - 1]);
		const url = URL.createObjectURL(new Blob([json], {type: "application/json;charset=utf-8;"}));
		document.body.appendChild(document.createElement('a'));
		var a = document.getElementsByTagName('a')[0];
		a.download='sample.json';
		a.href=url;
		a.click();
	}
});


var f1 = false;

addEventListener('keydown', function(event) {
	if (event.keyCode == 112 && !f1) {
		event.preventDefault();
		document.body.appendChild(document.createElement('p'));
		var el = document.getElementsByTagName('p')[0];
		var note = JSON.parse(noteTable);
		var noteKeys = Object.keys(note);

		for (var i = 0; i < noteKeys.length; i++) {
			el.appendChild(document.createElement('p')).textContent = noteKeys[i] + ': ';
			var p = document.getElementsByTagName('p')[i + 1];
			p.id = 'a123';
			var lines = note[noteKeys[i]];
			if (typeof lines == 'object') {
			for (var j = 0; j < lines.length; j++) {
				el.appendChild(document.createElement('pre')).textContent = lines[j];
			}
			} else {
				el.appendChild(document.createElement('pre')).textContent = note[noteKeys[i]];
			}
		}
		f1 = true;
	} else if (event.keyCode == 112 && f1) {
		document.body.removeChild(document.getElementsByTagName('p')[0]);
    f1 = false;
	}
});
