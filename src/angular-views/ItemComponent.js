module.exports = function () {
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