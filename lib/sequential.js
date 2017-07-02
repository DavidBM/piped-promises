module.exports = function sequencial(callbacks = []) {
	if(!Array.isArray(callbacks)){
		throw new Error('Input must be an array');
	}

	var results = [];
	var returnPromise = Promise.resolve();

	callbacks.forEach((callback, index) => {
		returnPromise = returnPromise
		.then(callback)
		.then(result => {
			results[index] = result;
			return result;
		});
	});

	return returnPromise.then(() => results);
};
