var crypto = require("crypto");

// # random
//
// Random number generation
var random = {};

random.MIN_INT_32 = -(Math.pow(2, 31));
random.MAX_INT_32 = Math.pow(2, 31) - 1;
random.INTEGER_RANGE = random.MAX_INT_32 - random.MIN_INT_32;
random.DICE_REGEX = /(\d+)d(\d+)(([\+-]|drop)(\d+))?/;

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
			roll,
			total = 0,
			rolls = [],
			num = parseInt(matches[1]),
			size = parseInt(matches[2]),
			modifier = matches[5] ? parseInt(matches[5]) : 0;

		for (i = 0; i < num; i++) {
			roll = this.intRange(1, size);
			rolls.push(roll);
			total += roll;
		}

		// handle drop N dice
		if (matches[4] === "drop") {
			var dropCount = parseInt(matches[5]);
			rolls.sort(random.sorters.numericLowHigh);		

			for (i = 0; i < dropCount; i++) {
				total -= rolls[i];
			}
		// add modifier
		} else {
			total += modifier;
		}

		return total;

	} else {
		// error
		return null;
	}
};

random.sorters = {
	numericLowHigh: function (a, b) {
		if (a < b) {
			return -1;
		}

		if (a > b) {
			return 1;
		}

		return 0;
	}
};

random.isValidDiceString = function (ds) {
	return this.DICE_REGEX.test(ds);
};

module.exports = random;


