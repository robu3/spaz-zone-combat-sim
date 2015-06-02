var Weapons = require("../lib/weapons"),
	assert = require("assert");

describe("Weapons", function () {
	describe("#transformCsvDataObject()", function () {
		it("should transform csv rows into a hashtable, keyed by the first column", function () {
			var weapons = new Weapons();
			var transformed = weapons.transformCsvDataObject([
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
				var i,
					w;

				for (i = 0; i < results.length; i++) {
					w = results[i];
					if (w.name === "Knife") {
						break;
					}
				}

				assert.ok(w);
				assert.equal(w.damage, "1d4");
				assert.equal(w.rof, 1);

				done();
			});
		});
	});

	describe("#getSkillName()", function () {
		it("return a properly formatted skill name for the specified weapon", function (done) {
			var weapon = {
				type: "handweapon",
				subtype: "axe"
			};
		
			assert.equal(Weapons.getSkillName(weapon), "specialized attack: axe");	
			done();
		});
	});
});


