var random = require("./lib/random");

var results = [];
for (var i = 0; i < 100; i++) {
	results.push(random.roll("2d6+1"));
}

results.sort(function (a, b) {
	if (a < b) {
		return -1;
	}

	if (a > b) {
		return 1;
	}

	return 0;
});

console.log(results);
