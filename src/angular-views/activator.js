let angular = require('angular')
require('cerebral-view-angular')

function MenuComponent() {
	return {
		restrict: 'E',
		scope: {},
		template: require('./menu.html'),
		controller: function ($scope, state, signals) {
			state.inject($scope, {
				counter: ['counter']
			})

			let intervalId

			$scope.testStarted = false
			$scope.startTest = () => {
				if (!$scope.testStarted) {
					intervalId = setInterval(() => {
						signals.nextItemToggled()
					}, 0)
				}
				$scope.testStarted = true
			}
			$scope.stopTest = () => {
				$scope.testStarted = false
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

function ListComponent() {
	return {
		restrict: 'E',
		scope: {},
		template: require('./list.html'),
		controller: function ($scope, state) {
			state.inject($scope, {
				items: ['items']
			})
		}
	}
}

function ItemComponent() {
	return {
		restrict: 'E',
		scope: {
			item: '='
		},
		template: require('./item.html'),
		controller: function ($scope, state, signals) {
			$scope.onClicked = function (id) {
				signals.itemClicked({id})
			}
		}
	}
}

module.exports.start = function start(controller) {
	angular.module('demo', ['cerebral'])
		.config(function (cerebralProvider) {
			cerebralProvider.setController(controller)
		})
		.directive('menu', MenuComponent)
		.directive('list', ListComponent)
		.directive('item', ItemComponent)

	angular.bootstrap(document, ['demo'])
}

