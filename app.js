var express = require("express"),
	config = require("./config/config.js"),
	Weapons = require("./lib/weapons"),
	app = express(),
	bodyParser = require("body-parser"),

	Character = require("./lib/character"),
	Battle = require("./lib/battle"),
	config = require("./config/config.js");

app.set("view engine", "jade");
app.use("/public", express.static("public"));
app.use(bodyParser.json());

// "virtual" folders
app.use("/public/jquery", express.static("node_modules/jquery"));
app.use("/public/bootstrap", express.static("node_modules/bootstrap"));
app.use("/public/angular", express.static("node_modules/angular"));
app.use("/public/angular-resource", express.static("node_modules/angular-resource"));
app.use("/public/results", express.static("results"));

// GET /
// return the main page
app.get("/", function (request, response) {
	//response.send("Hello, World!");
	response.render("index", { title: "Spaz Zone Combat Sim" });
});

// POST /
// run the simulation, generating some results
app.post("/api/simulation", function (request, response) {
	// build combatants from request
	var combatant1 = buildCombatant(request, "combatant1"),
		combatant2 = buildCombatant(request, "combatant2");


	// execute battles
	var battleCount = request.body.battleCount - 1,
		battleResults = [{ battle: "Battle", victor: "Victor" }],
		battleTotal = {},
		conf = {
			timestamp: Date.now().toString(),
			resultsFolder: "./results/"
		};

	Battle.executeMultiple(combatant1, combatant2, battleCount, battleResults, battleTotal, conf, function (roundsPath, battlesPath) {

		// send file URLs back to client
		response.send({
			roundsUrl: "/public" + roundsPath.substring(1, roundsPath.length),
			battlesUrl: "/public" + battlesPath.substring(1, battlesPath.length)
		});
	}, true);
});

app.get("/api/weapons", function (request, response) {
	//response.send("Hello, World!");
	var weapons = new Weapons();
	weapons.fetch(function (err, data) {
		response.send(data);
	});
});


// build a combant from the request body data at `k`
function buildCombatant(request, k) {
	// build combatants from request
	var combatant = new Character(
		request.body[k].name,
		request.body[k].stats
	);
	combatant.recalculateDerivedStats();
	combatant.equip(request.body[k].weapon);

	var bonus = parseInt(request.body[k].skillBonus)
	if (bonus > 0) {
		var s = Weapons.getSkillName(request.body[k].weapon);
		combatant.skills = {};
		combatant.skills[s] = bonus;
	}

	return combatant;
}

var server = app.listen(config.server.port, function () {
	console.log("Server running on: " + server.address().port);
});
