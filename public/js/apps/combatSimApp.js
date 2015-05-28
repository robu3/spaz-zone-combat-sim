var combatSimApp = angular.module("combatSimApp", ["ngResource"]);

// simulation model
//
// properties should include:
//
// - combatant1: combatant 1
// - combatant2: combatant 2
// - battleCount: # of battles
combatSimApp.factory("Simulation", function ($resource) {
	return $resource(
		"/api/simulation/:id",
		null,
		{
			"update": "PUT"
		}
	);
});

// weapons list
combatSimApp.factory("Weapon", function ($resource) {
	return $resource("/api/weapons");
});


combatSimApp.controller("CombatSimController", function ($scope, Simulation, Weapon) {
	console.log("angular loaded and running");

	function buildDefaultCombatant() {
		return {
			name: "Sludgehead",
			stats: {
				power: 10,
				brawn: 10,
				agility: 10,
				brains: 10,
				cunning: 10,
				control: 10,
				looks: 10
			}
		}
	}

	// build default combatants
	$scope.combatant1 = buildDefaultCombatant();
	$scope.combatant1.name += " #1";

	$scope.combatant2 = buildDefaultCombatant();
	$scope.combatant2.name += " #2";

	// populate weapons lists
	Weapon.query(function (weapons) {
		console.log("HERE");
		$scope.weapons = weapons;
	});


	// submit click
	$scope.onSubmitClick = function () {
		// clear existing
		$scope.downloadUrlRounds = null;
		$scope.downloadUrlBattles = null;

		var sim = new Simulation();

		sim.combatant1 = $scope.combatant1;
		sim.combatant2 = $scope.combatant2;
		sim.battleCount = 100;

		sim.$save(function (data) {
			console.log("sim complete", data);

			$scope.downloadUrlRounds = data.roundsUrl;
			$scope.downloadUrlBattles = data.battlesUrl;
		});
	};
});


