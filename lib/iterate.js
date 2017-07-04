var inParallel = require('./parallel');
var sequential = require('./sequential');

module.exports = class Iterate {
	constructor(items) {
		this.items = items;
	}

	static iterate(items) {
		if(!Array.isArray(items)) {
			throw new TypeError('first argument if iterate must be and array');
		}

		return new Iterate(items);
	}

	inParallel() {
		var maxInParallel = 0;
		var callback = [];

		//all in parallel
		if(arguments.length === 1){
			callback = arguments[0];
		}
		//With a max in parallel
		else if(arguments.length >= 2){
			maxInParallel = arguments[0];
			callback = arguments[1];
		}

		var callbacks = items.map(item => {
			return () => {
				callback(item);
			};
		});

		return inParallel(callbacks, maxInParallel);
		
	}

	sequential() {

	}
};
