module.exports.createTest = function createTest(testSignal, finishSignal, iterationsCount) {
	return {
		startTime: 0,
		started: false,
		currentTick: 0,
		tick() {
			testSignal()
			this.currentTick++;
			if (this.started) {
				if (this.currentTick < iterationsCount) {
					setTimeout(() => {
						this.tick()
					}, 0)
				} else {
					finishSignal()
					this.stop()
				}
			}
		},
		start() {
			console.log('s')
			this.startTime = Date.now()
			this.started = true
			setTimeout(() => this.tick(), 0)
		},

		stop() {
			alert((Date.now() - this.startTime) / 1000)
			this.started = false
		}
	}
}