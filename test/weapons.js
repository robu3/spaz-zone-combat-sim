var Weapons = require("../lib/weapons"),
	assert = require("assert");

describe("Weapons", function () {
	describe("#transformCsvData()", function () {
		it("should transform csv rows into a hashtable, keyed by the first column", function () {
			var weapons = new Weapons();
			var transformed = weapons.transformCsvData([
				["name", "val1", "val2"],
				["a", 1, 10],
				["b", 2, 20],
				["c", 3, 30]
			]);

			assert.equal(transformed.a.name, "a");
			assert.equal(transformed.a.val1, 1);
			assert.equal(transformed.a.val2, 10);

			assert.ok(transformed.b);
			assert.ok(transformed.c);
		});
	});

	describe("#fetch()", function () {
		it("should fetch weapon data from google sheets", function (done) {
			var weapons = new Weapons();
			weapons.fetch(function (err, results) {
				console.log(results.Knife);
				assert.ok(results["Knife"]);
				assert.equal(results.Knife.damage, "1d4");
				assert.equal(results.Knife.rof, 1);

				done();
			});
		});
	});
});


