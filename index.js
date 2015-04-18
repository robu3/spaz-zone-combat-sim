var random = require("./lib/random"),
	fs = require("fs"),
	csv = require("csv"),
	async = require("async"),
	commander = require("commander"),
	GoogleSpreadsheet = require("google-spreadsheet"),
	Character = require("./lib/character"),
	Battle = require("./lib/battle"),
	config = require("./config/config.js");

/*
var results = [];
for (var i = 0; i < 7; i++) {
	results.push(random.roll("3d6+10"));
}

console.log(results);
*/

var timestamp = Date.now().toString(),//(new Date(Date.now())).toISOString(),
	resultsFolder = "./results/";

//fs.truncateSync(filePath);

// Combatant A
var characterA = new Character("Sludgehead #1");
characterA.flattenStats();

characterA.equip({
	name: "sword, long",
	damage: "1d8",
	type: "handweapon",
	subtype: "sword",
	rof: 1
});

characterA.skills = {
	"specialized attack: sword": 4
};

console.log(characterA);

// Combatant B
var characterB = new Character("Sludgehead #2");
characterB.flattenStats();

characterB.equip({
	name: "sword, long",
	damage: "1d8",
	type: "handweapon",
	subtype: "sword",
	rof: 1
});

characterB.skills = {
	"specialized attack: sword": 4
};

console.log(characterB);

// init rounds CSV file with headers
csv.stringify([Battle.outputColumns], function (err, output) {
	fs.appendFileSync(
		resultsFolder + timestamp + "_rounds.csv",
		output
	);
});

var funcBattle = function (characterA, characterB, battleCount, battleResults) {
	characterA.recalculateDerivedStats();
	characterB.recalculateDerivedStats();

	var battle = new Battle(characterA, characterB, battleCount),
		doContinue = true;

	while (doContinue) {
		doContinue = battle.executeRound();
	}

	battleResults.push({ battle: battleCount, victor: battle.getVictor().name });

	//console.log(battle.rows);
	console.log("BATTLE DONE");
	
	// write round results at the end of combat
	csv.stringify(battle.rows, function (err, output) {
		fs.appendFileSync(
			resultsFolder + timestamp + "_rounds.csv",
			output
		);

		if (battleCount > 0) {
			funcBattle(characterA, characterB, battleCount - 1, battleResults);
		} else {
			// done!
			csv.stringify(battleResults, function (err, output) {
				fs.appendFileSync(
					resultsFolder + timestamp + "_battles.csv",
					output
				);

				process.exit();
			});
		}
	});
};


// execute 100 battles
var battleCount = 99,
	battleResults = [{ battle: "Battle", victor: "Victor" }];

funcBattle(characterA, characterB, battleCount, battleResults);

