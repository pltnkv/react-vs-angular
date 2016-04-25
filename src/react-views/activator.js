let React = require('react')
let ReactDOM = require('react-dom')
let {Decorator, Container} = require('cerebral-view-react')
// let Perf = require('react-addons-perf')

@Decorator({
	counter: ['counter']
})
class Menu extends React.Component {

	intervalId

	constructor(props, context) {
		super(props, context);

		this.state = {
			randomTogglingEnabled: false
		};
	};

	startTest() {
		this.setState({randomTogglingEnabled: true})
		if (!this.state.randomTogglingEnabled) {
			this.intervalId = setInterval(() => {
				this.props.signals.nextItemToggled()
			}, 0)
		}
	}

	stopTest() {
		this.setState({randomTogglingEnabled: false})
		clearInterval(this.intervalId)
	}

	onCounterClick() {
		this.props.signals.counterClicked()
	}

	render() {
		return (
			<menu>
				React:
				{ this.state.randomTogglingEnabled
					? <button onClick={() => this.stopTest()}>Stop test</button>
					: <button onClick={() => this.startTest()}>Start test</button> }
				<button onClick={() =>  this.onCounterClick()}>Counter = { this.props.counter } </button>
			</menu>
		);
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
		const signals = this.props.signals;
		return (
			<div>
				{ this.props.items.map((item) => <Item key={item.id} item={item}></Item>) }
			</div>
		);
	}
}

module.exports.start = function start(controller) {
	ReactDOM.render(
		<Container controller={controller}>
			<Menu></Menu>
			<List></List>
		</Container>, document.getElementById('app'))
}