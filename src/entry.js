let CerebralController = require('cerebral')
let Model = require('cerebral-model-baobab')
let cerebralDebugger = require('cerebral-module-devtools')

let itemsGenerator = require('itemsGenerator')

let items = itemsGenerator.get()

////////////////////////////////////
// Cerebral
////////////////////////////////////

let data = {
	nextId: 0,
	counter: 1,
	items: items
}

let model = Model(data)
var controller = CerebralController(model)
controller.addModules({
	// devtools: cerebralDebugger()
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

function getNextItemId({state, output}) {
	let nextId = state.get('nextId')
	let items = state.get('items')
	state.set('nextId', nextId + 1 === items.length ? 0 : nextId + 1)
	output({id: nextId})
}

function toggleItem({input, state}) {
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
	randomItemToggled: [getRandomId, toggleItem],
	nextItemToggled: [getNextItemId, toggleItem],
	itemClicked: [toggleItem],
	counterClicked: {
		chain: [incrementCounter],
		sync: true
	}
});

////////////////////////////////////
// VIEWS
////////////////////////////////////

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search)
	return results == null ? "" : decodeURIComponent(results[1])
}

let angularActivator = require('angular-views/activator')
let reactActivator = require('react-views/activator')
let renderName = getParameterByName('render')

switch (renderName) {
	case 'angular':
		angularActivator.start(controller)
		break
	case 'react':
		reactActivator.start(controller)
		break
	default:
		alert("Please set GET-parameter 'render' to 'angular' or 'react'")
		break
}

