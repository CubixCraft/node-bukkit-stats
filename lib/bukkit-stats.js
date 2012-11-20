// module dependencies
var colors = require("./colors")
	, sanitize = require("sanitize-arguments")
	, events = require("events")
	, net = require("net")
	, util = require("util");

// load settings
var constants = require("./constants.js")
	, PACKETS = constants.PACKETS
	, CTRL = constants.CTRL
	, CONNECTION = constants.CONNECTION
	, ERRORS = constants.ERRORS;

// expose bukkit-stats
module.exports = Stats;

// constructor
function Stats(host, port, colorize, cb) {
	// ensure that the object is instanciated with the new operator
	if(!(this instanceof Stats)) return new Stats(host, port, colorize, cb);
	
	// parse the arguments
	this.config = sanitize(arguments, Stats, [
		[CONNECTION.defaultHost], [CONNECTION.defaultPort], [false], [function() {}]
	]);
	
	// start the event listener
	events.EventEmitter.call(this);
	
	// register the callback
	this.on("stats", this.config.cb);
	
	// fire the request
	this.request();
}

// inherit from the EventEmitter
util.inherits(Stats, events.EventEmitter);

// request the data from the given server
Stats.prototype.request = function() {
	// start ping latency measurement
	var startTime = Date.now();
	
	// create a TCP connection
	var socket = net.connect(this.config);
	
	// listen on the response
	socket.once("data", this.handleResponse.bind(this, socket, startTime));
	
	// listen on errors
	socket.once("error", this.handleError.bind(this, "error"));
	socket.once("timeout", this.handleError.bind(this, "timeout"));
	socket.once("close", this.handleError.bind(this, "close"));
	
	// send the magic packet
	socket.write(new Buffer([PACKETS.serverListPing])); // TODO: Maybe we could use a helper function for type conversion here
};

// handle a connection error
Stats.prototype.handleError = function(type, error) {
	switch(type) {
		case "timeout": this.emit("error", new Error(ERRORS.timeout)); break;
		case "close": this.emit("error", new Error(ERRORS.close)); break;
		case "format": this.emit("error", new Error(ERRORS.format)); break;
		case "error":
		default:
			error.message = ERRORS.unknown + error.message;
			this.emit("error", error);
			break;
	}
};

// handle a response
Stats.prototype.handleResponse = function(socket, startTime, buffer) {
	// close the socket
	socket.removeAllListeners();
	socket.destroy();
	
	// calculate latency
	var latency = Date.now() - startTime;
	
	// parse the response
	var stats = this.parse(buffer);
	stats.latency = latency;
	
	this.emit("stats", stats);
};

// parse a response buffer
Stats.prototype.parse = function(buffer) {
	// check for package validity
	if(buffer[0] != PACKETS.disconnect) {
		this.handleError("format");
		return false;
	}
	
	// append a 0x00 to the buffer, because Bukkit forgot it
	buffer = Buffer.concat([buffer, new Buffer([CTRL.missingByte])]);
	
	// chop of the package id and parse
	var res = buffer.toString("ucs2", 4).split(String.fromCharCode(CTRL.delimeter));
	
	// find the subparts
	var maxPlayers = parseInt(res.pop())
		, onlinePlayers = parseInt(res.pop())
		, motd = res.join(String.fromCharCode(CTRL.color));
	
	return {
		motd: colors(motd),
		onlinePlayers: onlinePlayers,
		maxPlayers: maxPlayers
	};
};