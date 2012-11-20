// module dependencies
var colors = require("colors");

// load settings
var constants = require("./constants.js")
	, CTRL = constants.CTRL
	, ESCAPE = String.fromCharCode(CTRL.color)
	, COLORS = constants.COLORS;

// expose color parsing function
module.exports = parse;

// import the Minecraft color codes as a theme
colors.setTheme(COLORS);

// Parse the Minecraft color codes to ANSI color codes
function parse(str) {
	var parsed = [""];
	
	// return if no color codes are used
	if(!~str.indexOf(ESCAPE)) return str;
	
	str = str.split(String.fromCharCode(CTRL.color));
	str.shift();
	str.reverse();
	
	var code, index = 0;
	str.forEach(function(str) {
		code = str.charAt(0);
		
		if(code == COLORS.reset) {
			parsed.push(str.substr(1));
			parsed.push("");
			index += 2;
		} else {
			parsed[index] = str.substr(1) + parsed[index];
			parsed[index] = parsed[index][code];
		}
	});
	
	return parsed.reverse().join("");
}