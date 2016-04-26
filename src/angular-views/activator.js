let angular = require('angular')
require('cerebral-view-angular')

function MenuComponent() {
	return {
		restrict: 'E',
		scope: {},
		template: require('./menu.html'),
		controller: function ($scope, state, signals) {
			state.inject($scope, {
				counter: ['counter'],
				toggleTestRunning: ['toggleTestRunning'],
				shiftTestRunning: ['shiftTestRunning']
			})

			$scope.toggleTestStarted = signals.toggleTestStarted
			$scope.toggleTestStopped = signals.toggleTestStopped
			$scope.shiftTestStarted = signals.shiftTestStarted
			$scope.shiftTestStopped = signals.shiftTestStopped
			$scope.counterClicked = signals.counterClicked

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

