var random = require("./lib/random");

for (var i = 0; i < 100; i++) {
	console.log(random.dice("2d6+1"));
}
