var random = require("./random");

function Character(name, stats) {
	this.name = name;
	this.stats = {};

	var me = this,
		i;

	if (stats) {
		Object.keys(stats).forEach(function (k) {
			i = parseInt(stats[k]);

			if (i >= 0) {
				me.stats[k] = {
					value: i,
					bonus: me.calculateStatBonus(i)
				};
			} else if (typeof(stats[k] === "object")) {
				// assume correct format
				me.stats[k] = stats[k];
			}
		});

		this.recalculateDerivedStats();
	}

	this.equip({
		name: "Fists",
		damage: "0d0",
		type: "handweapon",
		subtype: "none",
		rof: 1
	});

	this.skills = {};
}

// ## calculateStatBonus
//
// +/- 1 for each point outside of range 7 - 14
Character.prototype.calculateStatBonus = function (v) {
	var bonus = v >= 14 ? v - 14 : (v < 7 ? v - 7 : 0);
	return bonus;
};

// ## recalculateStatBonus
Character.prototype.recalculateStatBonus = function (v) {
	var me = this,
		stats = Object.keys(me.stats),
		i, s;

	for (i = 0; i < stats.length; i++) {
		s = stats[i];
		// check if integer
		if (parseInt(me.stats[s]) >= 0) {
			me.stats[s] = {
				value: me.stats[s],
				bonus: me.calculateStatBonus(me.stats[s].bonus)
			}
		} else {
			// assume object
			me.stats[s].bonus = me.calculateStatBonus(me.stats[s].bonus);
		}
	}
};

// ## rerollStats
//
// Regenerate stats using the standard 4d6, drop 1 method
Character.prototype.rerollStats = function () {
	var me = this,
		roll,
		newStats = {};

	this.Stats.forEach(function (s) {
		roll = random.roll("4d6drop1");
		newStats[s] = {
			value: roll,
			bonus: me.calculateStatBonus(roll)
		};
	});

	this.stats = newStats;
	this.recalculateDerivedStats();
};

Character.prototype.flattenStats = function () {
	var me = this,
		roll,
		newStats = {};

	this.Stats.forEach(function (s) {
		roll = 10
		newStats[s] = {
			value: roll,
			bonus: me.calculateStatBonus(roll)
		};
	});

	this.stats = newStats;
	this.recalculateDerivedStats();
};

// ## recalculateDerivedStats
Character.prototype.recalculateDerivedStats = function () {
	var derived = {
		ar: 0,
		er: this.stats.agility.bonus,
		topple: 5 + this.stats.power.bonus + this.stats.brawn.bonus + this.stats.agility.bonus,
		currentBrawn: this.stats.brawn.value
	};

	this.statsDerived = derived;
};

// ## equip
//
// Equips a weapon for the character. Weapons require the following properties:
//
// - damage (dice string, e.g., 1d6)
// - ROF / attacks per round
// - type
// - subtype
Character.prototype.equip = function (weapon) {
	this.weapon = weapon;
};

Character.prototype.getAttackBonus = function (weapon) {
	var b,
		bonus = {
			hit: 0,
			damage: 0
		};

	weapon = weapon || this.weapon;


	if (weapon) {
		// add power to handweapon attacks
		if (weapon.type === "handweapon") {
			bonus.damage = this.stats.power.bonus;
		}

		// find relevant skills
		if (weapon.type === "gun") {
			bonus.hit += this.getSkillBonus("gunner", weapon.subtype);
		}

		if (weapon.type === "handweapon") {
			b = this.getSkillBonus("specialized attack", weapon.subtype);
			bonus.hit += b;
			bonus.damage += b;
		}
	}

	return bonus;
};

Character.prototype.getSkillBonus = function (skill, specialty) {
	var skill = this.skills[skill + ": " + specialty];
	return skill || 0;
};

// ## rollAttack
//
// Makes an attack (number of rolls based upon equipped weapon and skills).
// Returns an array of rolls.
// { roll: N, rollModified: N + M, damage: D, success: true/false }
Character.prototype.rollAttack = function (enemy) {
	var i,
		r,
		v,
		modifiers = this.getAttackBonus(this.weapon),
		rolls = [];

	for (i = 0; i < this.weapon.rof; i++) {	
		v = random.roll("1d20");
		r = {
			roll: v,
			rollModified: v + modifiers.hit,
			damage: 0
		};

		r.success = r.rollModified > (10 + enemy.statsDerived.er);
		if (r.success) {
			r.damage = random.roll(this.weapon.damage) + modifiers.damage - enemy.statsDerived.ar;
		}

		rolls.push(r);
	};

	return rolls;
};

// ## applyAttackRolls
Character.prototype.applyAttackRolls = function (rolls) {
	var me = this;

	rolls.forEach(function (r) {
		if (r.success) {
			me.statsDerived.currentBrawn -= r.damage;

			if (r.damage > me.statsDerived.topple) {
				me.isToppled = true;
			}
		}
	});
};

// ## combatRoundTick
//
// Called at the end of a combat round.
Character.prototype.combatRoundTick = function () {
	if (this.isToppled) {
		this.isToppled = false;
	}
};


// ## isDead
//
// True if the character is dead.
Character.prototype.isDead = function () {
	return this.statsDerived.currentBrawn <- 0;
};

// ## Stats
//
// Enum of character statistics
Character.prototype.Stats = [
	"power",
	"brawn",
	"agility",
	"brains",
	"wits",
	"control",
	"looks"
];

Character.prototype.isToppled = false;

module.exports = Character;
