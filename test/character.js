var Character = require("../lib/character"),
	assert = require("assert");

describe("Character", function () {
	describe("#rerollStats()", function () {
		it("should generate new stats object and assign to `stats` property", function () {
			var character = new Character();
			character.rerollStats();

			var k;
			for (k in character.stats) {
				assert.ok(character.stats[k]);
			}
		});
	});
});


