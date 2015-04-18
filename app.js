var express = require("express"),
	config = require("./config/config.js"),
	Weapons = require("./lib/weapons"),
	app = express();

app.set("view engine", "jade");
app.use("/public", express.static("public"));
app.use("/public/jquery", express.static("node_modules/jquery"));
app.use("/public/bootstrap", express.static("node_modules/bootstrap"));
app.use("/public/angular", express.static("node_modules/angular"));

app.get("/", function (request, response) {
	//response.send("Hello, World!");
	response.render("index", { title: "Spaz Zone Combat Sim" });
});

app.get("/weapons", function (request, response) {
	//response.send("Hello, World!");
	var weapons = new Weapons();
	weapons.fetch(function (err, data) {
		response.send(data);
	});
});

var server = app.listen(config.server.port, function () {
	console.log("Server running on: " + server.address().port);
});
