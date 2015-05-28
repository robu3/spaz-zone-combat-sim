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
	var combatant1 = new Character(
		request.body.combatant1.name,
		request.body.combatant1.stats
	);
	combatant1.recalculateDerivedStats();
	combatant1.equip(request.body.combatant1.weapon);

	console.log(combatant1);

	var combatant2 = new Character(
		request.body.combatant2.name,
		request.body.combatant2.stats
	);
	combatant2.recalculateDerivedStats();
	combatant2.equip(request.body.combatant2.weapon);


	// execute battles
	var battleCount = request.body.battleCount - 1,
		battleResults = [{ battle: "Battle", victor: "Victor" }],
		conf = {
			timestamp: Date.now().toString(),
			resultsFolder: "./results/"
		};

	Battle.executeMultiple(combatant1, combatant2, battleCount, battleResults, conf, function (roundsPath, battlesPath) {

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

var server = app.listen(config.server.port, function () {
	console.log("Server running on: " + server.address().port);
});
