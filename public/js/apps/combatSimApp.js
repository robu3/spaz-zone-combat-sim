var combatSimApp = angular.module("combatSimApp", []);

combatSimApp.controller("CombatSimController", function ($scope) {
	console.log("angular loaded and running");

	function buildDefaultCombatant() {
		return {
			name: "Sludgehead",
			power: 10,
			brawn: 10,
			agility: 10,
			brains: 10,
			cunning: 10,
			control: 10,
			looks: 10
		}
	}

	$scope.combatant1 = buildDefaultCombatant();
	$scope.combatant1.name += " #1";

	$scope.combatant2 = buildDefaultCombatant();
	$scope.combatant2.name += " #2";
});


