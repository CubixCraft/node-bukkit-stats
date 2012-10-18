// stopwatch
module.exports.stopwatch = function() {
	var start = Date.now();
	return function stop() {
		return Date.now() - start;
	};
};

// wrapper
module.exports.wrap = function(fn, thisRef, args) {
	return function() {
		fn.apply(thisRef, (args || []).concat(Array.prototype.slice.call(arguments)));
	};
}

// byte(s) to string
module.exports.byteToString = function(bytes) {
	if(bytes instanceof Array) {
		var string = "";
		bytes.forEach(function(byte) {
			string += String.fromCharCode(byte);
		});
	} else {
		return String.fromCharCode(bytes);
	}
};

// byte(s) to buffer
module.exports.byteToBuffer = function(bytes) {
	return bytes instanceof Array ? new Buffer(bytes) : new Buffer([bytes]);
};

// concat two buffers
module.exports.concatBuffers = function(bufs) {
	if (!Array.isArray(bufs)) {
		bufs = Array.prototype.slice.call(arguments);
	}

	var bufsToConcat = [], length = 0;
	bufs.forEach(function (buf) {
		if (buf) {
			if (!Buffer.isBuffer(buf)) {
				buf = new Buffer(buf);
			}
			length += buf.length;
			bufsToConcat.push(buf);
		}
	});

	var concatBuf = new Buffer(length), index = 0;
	bufsToConcat.forEach(function (buf) {
		buf.copy(concatBuf, index, 0, buf.length);
		index += buf.length;
	});

	return concatBuf;
};