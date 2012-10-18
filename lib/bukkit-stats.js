// module dependencies
var events = require("events")
	, net = require("net")
	, util = require("util")
	, helpers = require("./helpers");

// constants
var SPLIT = String.fromCharCode(0xA7);
var PACKETS = { ping: 0xFE, kick: 0xFF };

// populate bukkit-stats
module.exports = exports = Stats;

// bukkit-stats
function Stats(host, port) {
	// ensure that the object is instanciated with new
	if(!(this instanceof Stats)) return new Stats(host, port);
	
	// start the event listener
	events.EventEmitter.call(this);
	
	// save the connection data
	if(~host.indexOf(":")) {
		host = host.split(":");
		this.config = { host: host[0], port: host[1] };
	} else {
		this.config = { host: host, port: port };
	}
	
	// fire the request
	this.connect();
}

// inherit from the EventEmitter
util.inherits(Stats, events.EventEmitter);

Stats.prototype.connect = function() {
	// start ping measurement
	var stopwatch = helpers.stopwatch();
	
	// create a TCP connection
	this._socket = net.connect(this.config);
	
	// listen on the response
	this._socket.once("data", helpers.wrap(function(data) {
		this._socket.destroy();
		
		var data = this.parse(data);
		if(!data) {
			this.emit("error", new Error("Server responded with invalid package"));
		} else {
			data.ping = stopwatch();
			this.emit("data", data);
		}
	}, this));
	
	// pipe the errors
	this._socket.on("error", console.log);
	
	// send the magic packet
	this._socket.write(helpers.byteToBuffer(PACKETS.ping));
};

Stats.prototype.parse = function(buffer) {
	// check for package validity
	if(buffer[0] != PACKETS.kick) {
		return false;
	}
	
	// append 0x00 to the buffer, because fucking Bukkit doesn't do it
	buffer = helpers.concatBuffers(buffer, helpers.byteToBuffer(0x00));
	// chop of the package id and parse
	var res = buffer.toString("ucs2", 4).split(SPLIT);
	
	// here we go
	return { motd: res[0], onlinePlayers: parseInt(res[1]), maxPlayers: parseInt(res[2]) };
};