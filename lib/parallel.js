module.exports = function sequencial(callbacks = [], maxParallel = 0) {

	if(!Array.isArray(callbacks)){
		throw new Error('Input must be an array');
	}

	if(!isNumeric(maxParallel)) {
		throw new Error('Second argument is a number: The maximum parallel execution');
	}

	return Promise.all(callbacks.map(callback => {
		if(typeof callback === 'function') {
			return callback();
		}

		return callback;
	}));
};

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
