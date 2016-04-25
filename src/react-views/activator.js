let React = require('react')
let ReactDOM = require('react-dom')
let {Decorator, Container} = require('cerebral-view-react')

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

	startRandomToggling() {
		this.setState({randomTogglingEnabled: true})
		if (!this.state.randomTogglingEnabled) {
			this.intervalId = setInterval(() => {
				this.props.signals.randomItemToggled()
			}, 0)
		}
	}

	stopRandomToggling() {
		this.setState({randomTogglingEnabled: false})
		clearInterval(this.intervalId)
	}

	render() {
		const signals = this.props.signals;
		return (
			<menu>
				{ this.state.randomTogglingEnabled
					? <button onClick={() => this.stopRandomToggling()}>Stop random toggling</button>
					: <button onClick={() => this.startRandomToggling()}>Start random toggling</button> }
				<button onClick={() => signals.counterClicked()}>Counter = {this.props.counter} </button>
			</menu>
		);
	}
}

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
				{ this.props.items.map((item) => <Item key={ item.id } item={item} signals={ signals }></Item>) }
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