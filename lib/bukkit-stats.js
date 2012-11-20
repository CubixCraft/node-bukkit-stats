// module dependencies
var events = require("events")
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
function Stats(host, port, cb) {
	// ensure that the object is instanciated with the new operator
	if(!(this instanceof Stats)) return new Stats(host, port, cb);
	
	// parse the arguments
	if(typeof host == "string" && ~host.indexOf(":")) {
		host = host.split(":");
		this.config = { host: host[0], port: host[1] };
	} else {
		this.config = {
			host: typeof host == "string" ? host : CONNECTION.defaultHost,
			port: typeof port == "number" ? port : CONNECTION.defaultPort
		};
	}
	
	if(typeof host == "function") cb = host;
	else if(typeof port == "function") cb = port;
	else if(typeof cb != "function") cb = function() {};
	
	// start the event listener
	events.EventEmitter.call(this);
	
	// register the callback
	this.on("stats", cb);
	
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
	socket.once("data", wrap(this.handleResponse, this, socket, startTime));
	
	// listen on errors
	socket.once("error", wrap(this.handleError, this, "error"));
	socket.once("timeout", wrap(this.handleError, this, "timeout"));
	socket.once("close", wrap(this.handleError, this, "close"));
	
	// send the magic packet
	socket.write(new Buffer([PACKETS.serverListPing])); // TODO: Maybe we could use a helper function for type conversion here
};

// handle a connection error
Stats.prototype.handleError = function(type, error) {
	switch(type) {
		case "error":
			error.message = ERRORS.unknown + error.message;
			this.emit("error", error);
			break;
		case "timeout": this.emit("error", new Error(ERRORS.timeout)); break;
		case "close": this.emit("error", new Error(ERRORS.close)); break;
		case "format": this.emit("error", new Error(ERRORS.format)); break;
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
		motd: motd,
		onlinePlayers: onlinePlayers,
		maxPlayers: maxPlayers
	};
};

// helper function
function wrap(fn, ref) {
	var args = Array.prototype.slice.call(arguments, 2);
	return function() {
		fn.apply(ref, args.concat(Array.prototype.slice.call(arguments)));
	};
}