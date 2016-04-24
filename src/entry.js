let angular = require('angular')
let CerebralController = require('cerebral')
let Model = require('cerebral-model-baobab')
let React = require('react')
let cerebralViewReact = require('cerebral-view-react')
let cerebralDebugger = require('cerebral-module-devtools')
require('cerebral-view-angular')

let itemsGenerator = require('itemsGenerator')

let items = itemsGenerator.get()

////////////////////////////////////
// Cerebral
////////////////////////////////////

let data = {
	counter: 1,
	items: items
}

let model = Model(data)
var controller = CerebralController(model)
controller.addModules({
	devtools: cerebralDebugger()
});

////////////////////////////////////
// ACTIONS
////////////////////////////////////

function incrementCounter({state}) {
	state.set('counter', state.get('counter') + 1)
	// debugger;
}

function getRandomId({state, output}) {
	let items = state.get('items')
	let id = Math.ceil(Math.random() * (items.length - 1))
	output({id})
}

function toggleItemSelection({input, state}) {
	let itemId = input.id
	let items = state.get('items')
	let itemIndex = items.findIndex(item => item.id === itemId)
	let item = items[itemIndex]
	let newItems = [
		...items.slice(0, itemIndex),
		{
			id: item.id,
			text: item.text,
			selected: !item.selected
		},
		...items.slice(itemIndex + 1)
	]
	state.set('items', newItems)
}

////////////////////////////////////
// SIGNALS
////////////////////////////////////

controller.addSignals({
	randomItemToggled: [getRandomId, toggleItemSelection],
	itemClicked: [toggleItemSelection],
	// counterClicked: [incrementCounter]
	counterClicked: {
		chain: [incrementCounter],
		sync: true
	}
});

////////////////////////////////////
// ANGULAR
////////////////////////////////////

angular.module('demo', ['cerebral'])
	.config(function (cerebralProvider) {
		cerebralProvider.setController(controller)
	})
	.directive('menu', require('angular-views/MenuComponent'))
	.directive('list', require('angular-views/ListComponent'))
	.directive('item', require('angular-views/ItemComponent'))

angular.bootstrap(document, ['demo']);

