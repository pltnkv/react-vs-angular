let React = require('react')
let ReactDOM = require('react-dom')
let {Decorator, Container} = require('cerebral-view-react')
// let Perf = require('react-addons-perf')

@Decorator({
	counter: ['counter'],
	toggleTestRunning: ['toggleTestRunning']
})
class Menu extends React.Component {
	render() {
		const signals = this.props.signals;

		return (
			<menu>
				React:
				{ this.props.toggleTestRunning
					? <button onClick={() => signals.toggleTestStopped()}>Stop test</button>
					: <button onClick={() => signals.toggleTestStarted()}>Start test</button> }
				<button onClick={() => signals.counterClicked()}>Counter = { this.props.counter } </button>
			</menu>
		)
	}
}
@Decorator()
class Item extends React.Component {
	render() {
		const signals = this.props.signals;
		return (
			<div className={`item ${this.props.item.selected ? 'selected' : ''}`}
				 onClick={() => signals.itemClicked({id: this.props.item.id}) }>
				{ this.props.item.text }
			</div>
		)
	}
}

@Decorator({
	items: ['items']
})
class List extends React.Component {
	render() {
		return (
			<div>
				{ this.props.items.map((item) => <Item key={item.id} item={item}></Item>) }
			</div>
		)
	}
}

module.exports.start = function start(controller) {
	ReactDOM.render(
		<Container controller={controller}>
			<Menu></Menu>
			<List></List>
		</Container>, document.getElementById('app'))
}