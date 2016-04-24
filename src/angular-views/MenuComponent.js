module.exports = function () {
	return {
		restrict: 'E',
		scope: {},
		template: require('./menu.html'),
		controller: function ($scope, state, signals) {
			state.inject($scope, {
				counter: ['counter']
			})

			let intervalId

			$scope.randomTogglingEnabled = false
			$scope.startRandomToggling = () => {
				if (!$scope.randomTogglingEnabled) {
					intervalId = setInterval(() => {
						signals.randomItemToggled()
					}, 0)
				}
				$scope.randomTogglingEnabled = true
			}
			$scope.stopRandomToggling = () => {
				$scope.randomTogglingEnabled = false
				clearInterval(intervalId)
			}

			$scope.onCounterClicked = () => {
				signals.counterClicked();
				// debugger;
			}

			$scope.$watch(() => {
				// console.log('$watch')
			})
		}
	}
}