var fs = require("fs"),
	csv = require("csv"),
	random = require("./random");

// # Battle
//
// A sim battle.
function Battle(characterA, characterB, id) {
	this.characterA = characterA;
	this.characterB = characterB;
	this.round = 0;
	this.id = id;


	this.rows = [];
}

Battle.outputColumns = {
	battle: "Battle",
	round: "Round",
	attacker: "Combatant",
	madeAttack: "Made Attack",
	attack: "Attack",
	roll: "Roll",
	rollModified: "Roll Modified",
	success: "Hit",
	damage: "Damage",
	toppled: "Toppled",
	brawn: "Brawn"
};

// ## executeRound
// 
// Executes a single round of combat.
// Returns true if combat is ongoing, false if someone died.
Battle.prototype.executeRound = function () {
	var combatants = [this.characterA, this.characterB],
		me = this,
		i;

	for (i = 0; i < combatants.length; i++) {
		var rolls, 
			rows,
			r,
			combatant = combatants[i],
			nextCombatant = (i === 1 ? combatants[0] : combatants[1]);

		//console.log("foo" + i, nextCombatant);

		// exit if I'm dead
		if (combatant.isDead()) {
			return false;
		}

		if (!combatant.isToppled) {
			rolls = combatant.rollAttack(nextCombatant);
			nextCombatant.applyAttackRolls(rolls);

			rows = this.formatCsvRows(combatant, nextCombatant, rolls);
			rows.forEach(function (r) {
				me.rows.push(r);
			});
		} else {
			me.rows.push(me.formatCsvRows(combatant, nextCombatant, [{}])[0]);
			combatant.isToppled = false;
		}
	}

	this.round++;
	return true;
};

// ## formatCsvRows
//
// Formats a CSV data row(s)
Battle.prototype.formatCsvRows = function (attacker, target, rolls) {
	var i,
		r,
		rows = [];

	for (i = 0; i < rolls.length; i++) {
		r = rolls[i];

		rows.push({
			battle: this.id,
			round: this.round,
			attacker: attacker.name,
			madeAttack: r.roll > 1 ? 1 : 0,
			attack: i,
			roll: r.roll || null,
			rollModified: r.rollModified || null,
			success: r.success ? 1 : 0,
			damage: r.damage || 0,
			toppled: attacker.isToppled ? 1 : 0,
			brawn: attacker.statsDerived.currentBrawn
		});
	}

	return rows;
};

// ## getVictor
//
// Returns the victorious combatant (last one standing),
// null if both combatants are alive.
Battle.prototype.getVictor = function () {
	if (this.characterA.statsDerived.currentBrawn <= 0) {
		return this.characterB;
	}
	else if (this.characterB.statsDerived.currentBrawn <= 0) {
		return this.characterA;
	}
	else {
		return null;
	}
};

// ## executeMultiple
// 
// Executes multiple rounds, writing to csv files in the process
Battle.executeMultiple = function (characterA, characterB, battleCount, battleResults, battleTotal, config, cb, isInit) {
	console.log("HERE", characterA);
	console.log("HERE", characterB);

	characterA.recalculateDerivedStats();
	characterB.recalculateDerivedStats();

	var battle = new Battle(characterA, characterB, battleCount),
		doContinue = true,
		roundsPath = config.resultsFolder + config.timestamp + "_rounds.csv",
		battlesPath = config.resultsFolder + config.timestamp + "_battles.csv";

	// initialize rounds file on first pass
	if (isInit) {
		csv.stringify([Battle.outputColumns], function (err, output) {
			fs.appendFileSync(
				roundsPath,
				output
			);
		});
	}

	while (doContinue) {
		doContinue = battle.executeRound();
	}

	// track the wins
	var victor = battle.getVictor().name;
	battleResults.push({ battle: battleCount, victor: victor });
	battleTotal[victor] = (battleTotal[victor] || 0) + 1;

	//console.log(battle.rows);
	console.log("BATTLE DONE");
	
	// write round results at the end of combat
	csv.stringify(battle.rows, function (err, output) {
		fs.appendFileSync(
			roundsPath,
			output
		);

		if (battleCount > 0) {
			Battle.executeMultiple(characterA, characterB, battleCount - 1, battleResults, battleTotal, config, cb);
		} else {
			// done!
			// append total counts
			battleResults.push({});
			var k;
			for (k in battleTotal) {
				battleResults.push({ battle: k, victor: battleTotal[k] });
			}

			// generate csv
			csv.stringify(battleResults, function (err, output) {
				fs.appendFileSync(
					battlesPath,
					output
				);

				cb(roundsPath, battlesPath);
			});
		}
	});
};

module.exports = Battle;
