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

	describe("#calculateStatBonus()", function () {
		it("should return +/- 1 for each point outside of range 7 - 14", function () {
			var character = new Character();
			
			assert.equal(character.calculateStatBonus(15), 1);
			assert.equal(character.calculateStatBonus(6), -1);
			assert.equal(character.calculateStatBonus(7), 0);
			assert.equal(character.calculateStatBonus(14), 0);
			assert.equal(character.calculateStatBonus(1), -6);
			assert.equal(character.calculateStatBonus(20), 6);
			assert.equal(character.calculateStatBonus(40), 26);
		});
	});

	describe("#getAttackBonus()", function () {
		it("should calculate the appropriate attack bonuses", function () {
			var character = new Character();
			character.stats.power = 40;

			var bonus = character.getAttackBonus({
				name: "Baz",
				damage: "1d6",
				rof: 1,
				type: "handweapon"
			});

			assert.equal(bonus.hit, 0);
			assert.equal(bonus.damage, 26);
		});
	});
});


