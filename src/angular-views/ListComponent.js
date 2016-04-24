module.exports = function () {
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