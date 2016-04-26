let CerebralController = require('cerebral')
let Model = require('cerebral-model-baobab')
let cerebralDebugger = require('cerebral-module-devtools')
let itemsGenerator = require('itemsGenerator')
let tests = require('tests')

////////////////////////////////////
// Cerebral
////////////////////////////////////

let data = {
	nextId: 0,
	counter: 1,
	items: itemsGenerator.get(),
	toggleTestRunning: false,
	shiftTestRunning: false
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

function shiftItem({input, state}) {
	let itemPos = input.id
	let items = state.get('items')
	let newItems = [
		...items.slice(0, itemPos),
		items[itemPos + 1],
		items[itemPos],
		...items.slice(itemPos + 2)
	]
	state.set('items', newItems)
}

// tests
let toggleTest

function startToggleTest({state}) {
	state.set('toggleTestRunning', true)
	let signals = controller.getSignals()
	let itemsCount = state.get('items').length
	toggleTest = tests.createTest(signals.nextItemToggled, signals.toggleTestStopped, itemsCount)
	toggleTest.start()
}

function stopToggleTest({state}) {
	state.set('toggleTestRunning', false)
	toggleTest.stop()
}

let shiftTest
function startShiftTest({state}) {
	state.set('shiftTestRunning', true)
	let signals = controller.getSignals()
	let itemsCount = state.get('items').length
	shiftTest = tests.createTest(signals.nextItemShifted, signals.shiftTestStopped, itemsCount - 1)
	shiftTest.start()
}

function stopShiftTest({state}) {
	state.set('shiftTestRunning', false)
	shiftTest.stop()
}

////////////////////////////////////
// SIGNALS
////////////////////////////////////

controller.addSignals({
	randomItemToggled: [getRandomId, toggleItem],
	nextItemToggled: [getNextItemId, toggleItem],
	nextItemShifted: [getNextItemId, shiftItem],
	toggleTestStarted: [startToggleTest],
	toggleTestStopped: [stopToggleTest],
	shiftTestStarted: [startShiftTest],
	shiftTestStopped: [stopShiftTest],
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

