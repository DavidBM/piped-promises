module.exports = function sequencial(callbacks = [], maxParallel = 0) {

	if(!Array.isArray(callbacks)){
		throw new Error('Input must be an array');
	}

	if(!isNumeric(maxParallel)) {
		throw new Error('Second argument is a number: The maximum parallel execution');
	}

	if(!maxParallel){
		return executeAll(callbacks);
	}

	callbacks = callbacks.slice(0);
	var finalResults = [];
	var length = callbacks.length;
	var globals = {
		executedCounter: 0,
		stopFlag: false
	};

	return new Promise((resolve, reject) => {
		
		for(let i = 0; i < maxParallel; i++){
			callPromise(callbacks, finalResults, length, globals, resolve, reject);
		}
	});

};

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function executeAll(callbacks) {
	return Promise.all(callbacks.map(callback => {
		if(typeof callback === 'function') {
			return callback();
		}

		return callback;
	}));
}

function callPromise(callbacks, finalResults, originalLength, globals, resolve, reject) {
	var originalIndex = originalLength - callbacks.length;
	
	callbacks.shift()()
	.then(result => {
		if(globals.stopFlag){
			return;
		}

		finalResults[originalIndex] = result;
		globals.executedCounter++;

		if(globals.executedCounter === originalLength){
			resolve(finalResults);
		}

		if(callbacks.length > 0){
			callPromise(callbacks, finalResults, originalLength, globals, resolve, reject);
		}
	})
	.catch(error => {
		globals.stopFlag = true;
		reject(error);
	});
}
