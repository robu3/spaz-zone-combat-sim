var crypto = require("crypto");

var random = {};

random.MIN_INT_32 = -(Math.pow(2, 31));
random.MAX_INT_32 = Math.pow(2, 31) - 1;
random.INTEGER_RANGE = random.MAX_INT_32 - random.MIN_INT_32;
random.DICE_REGEX = /(\d+)d(\d+)([\+-]\d+)?/;

random.int = function () {
	var hex = crypto.randomBytes(4).toString("hex");
	return parseInt(hex, 16);
};

random.intRange = function (min, max) {
	var r = this.int();
	//console.log(r);
	r = Math.round(r / this.INTEGER_RANGE * (max - min)) + min
	return r;
};

random.dice = function (str) {
	var matches = this.DICE_REGEX.exec(str);
	//console.log("dice", matches);

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


