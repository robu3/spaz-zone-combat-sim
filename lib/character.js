var random = require("./random");

function Character(name, stats) {
	this.name = name;
	this.stats = stats;

	if (stats) {
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
Character.prototype.calculateStatBonus = function (v) {
	var diff = (v - 10) / 2;
	if (diff > 0) {
		return Math.floor(diff);
	}
	else if (diff < 0){
		return Math.ceil(diff);
	}
	else {
		return 0;
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

// ## recalculateDerivedStats
Character.prototype.recalculateDerivedStats = function () {
	var derived = {
		ar: 0,
		er: this.stats.agility.bonus,
		topple: 5 + this.stats.power.bonus + this.stats.durability.bonus + this.stats.agility.bonus
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

// ## Stats
//
// Enum of character statistics
Character.prototype.Stats = [
	"power",
	"durability",
	"agility",
	"brains",
	"wits",
	"control",
	"looks"
];

module.exports = Character;
