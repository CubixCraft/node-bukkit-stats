// Require the lib
var stats = require("../");

// Tests
describe("stats('cubixcraft.de')", function() {
	stats("cubixcraft.de").on("stats", function(data) {
		data.should.have.keys("motd", "onlinePlayers", "maxPlayers", "latency");
	});
});

// Quick and dirty