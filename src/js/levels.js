define(function(require) {
	var st1 = require('src/js/stages/stage1.js');
	var st2 = require('src/js/stages/stage2.js');
	var st3 = require('src/js/stages/stage3.js');
	var levels = [];

	levels.push(st1);
	levels.push(st2);
	levels.push(st3);
	
	return levels;
});