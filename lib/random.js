var crypto = require("crypto");

// # random
//
// Random number generation
var random = {};

random.MIN_INT_32 = -(Math.pow(2, 31));
random.MAX_INT_32 = Math.pow(2, 31) - 1;
random.INTEGER_RANGE = random.MAX_INT_32 - random.MIN_INT_32;
random.DICE_REGEX = /(\d+)d(\d+)([\+-]\d+)?/;

// ## int
//
// Generates a random 32-bit integer (> 0)
random.int = function () {
	var hex = crypto.randomBytes(4).toString("hex");
	return parseInt(hex, 16);
};

// ## intRange
//
// Generates a random 32-bit integer in the specified range (inclusive)
random.intRange = function (min, max) {
	var r = this.int();
	r = Math.round(r / this.INTEGER_RANGE * (max - min)) + min
	return r;
};

// ## roll
//
// Generates a random number from the specified dice string, e.g., "2d6+1"
random.roll = function (str) {
	var matches = this.DICE_REGEX.exec(str);

	if (matches) {
		var i,
			total = 0,
			num = parseInt(matches[1]),
			size = parseInt(matches[2]),
			modifier = matches[3] ? parseInt(matches[3]) : 0;

		for (i = 0; i < num; i++) {
			total += this.intRange(1, size);
		}

		total += modifier;
		return total;

	} else {
		// error
		return null;
	}
};

module.exports = random;


