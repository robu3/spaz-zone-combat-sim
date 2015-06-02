var request = require("request")
	csvParse = require("csv-parse");

// # Weapons
//
// master list of all weapons
// loaded from google sheets

function Weapons() {
	this.googleSheetUrl = "https://docs.google.com/spreadsheets/d/1U67RmfuZge3FkR9oTDqnRFA6zcN7iqFipRE1MgmcuOE/export?format=csv&id=1U67RmfuZge3FkR9oTDqnRFA6zcN7iqFipRE1MgmcuOE&gid=0";
}

// ## transformCsvDataObject
//
// Turns CSV rows into a hashtable of weapons
Weapons.prototype.transformCsvDataObject = function (rows) {
	if (rows.length === 0) {
		console.log("invalid csv rows");
		return null;
	}

	var i,
		j,
		result = {},
		r,
		obj,
		keys = rows[0];

	for (i = 1; i < rows.length; i++) {
		r = rows[i];
		obj = {};

		for (j = 0; j < keys.length; j++) {
			obj[keys[j]] = r[j];
		}

		result[r[0]] = obj;
	}

	return result;
};

// ## transformCsvData
//
// Turns CSV rows into an array of weapons
Weapons.prototype.transformCsvData = function (rows) {
	if (rows.length === 0) {
		console.log("invalid csv rows");
		return null;
	}

	var i,
		j,
		result = [],
		r,
		obj,
		keys = rows[0];

	for (i = 1; i < rows.length; i++) {
		r = rows[i];
		obj = {};

		for (j = 0; j < keys.length; j++) {
			obj[keys[j]] = r[j];
		}

		result.push(obj);
	}

	return result;
};

Weapons.prototype.fetch = function (cb) {
	var me = this;

	request.get(this.googleSheetUrl, function (err, response, body) {
		if (err) {
			console.log("error fetching weapon data");
			console.log(err);
			cb(err);
		} else {
			csvParse(body, function (err, output) {
				if (err) {
					cb(err);
				} else {
					cb(null, me.transformCsvData(output));
				}
			});
		}
	});
};

// ## getSkillName
//
// Returns the name of the skill that would apply attack bonuses for the specified the weapon.
Weapons.getSkillName = function (weapon) {
	if (weapon && weapon.type && weapon.subtype) {
		var skill = Weapons.typeSkillMap[weapon.type];
		if (skill) {
			skill += (": " + weapon.subtype);
			return skill;
		}
	}

	return null;
};

Weapons.typeSkillMap = {
	gun: "gunner",
	handweapon: "specialized attack"
};

module.exports = Weapons;
