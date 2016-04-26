module.exports.get = () => {
	let items = []
	for (let i = 0; i < 1000; i++) {
		items.push({
			id: i,
			text: '' + i,
			selected: false
		})
	}
	return items
}