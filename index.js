var random = require("./lib/random"),
	Character = require("./lib/character");

/*
var results = [];
for (var i = 0; i < 7; i++) {
	results.push(random.roll("3d6+10"));
}

console.log(results);
*/

var character = new Character("Sludgehead #1");
character.rerollStats();

character.equip({
	name: "sword, long",
	damage: "1d8",
	type: "handweapon",
	subtype: "sword",
	rof: 1
});

character.skills = {
	"specialized attack: sword, long": 4
};

console.log(character);

var hits = character.rollAttack(character);

console.log(hits);
