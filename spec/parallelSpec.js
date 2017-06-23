describe('Parallel', function() {
	var Piped;

	beforeEach(function() {
		Piped = require('../lib/lib.js');
	});

	it('is a function', function() {
		expect(typeof Piped.parallel).toBe('function');
	});

	it('should return a promise', function() {
		var promise = Piped.parallel();

		expect(Promise.resolve(promise)).toBe(promise);
	});

	it('should return a promise that resolves with an array with the same length than the entered array', function(done) {
		var promise = Piped.parallel([1, 2, 3]);

		promise.then((value) => {
			expect(value.length).toBe(3);
			done();
		});
	});

	it('should throw an error if the input is not an array', function() {
		expect(() => Piped.parallel(NaN)).toThrow(new Error('Input must be an array'));
	});

	it('should return a promise that resolves with an empty array is there is no argument suplied', function(done) {
		var promise = Piped.parallel();

		promise.then((value) => {
			expect(value.length).toBe(0);
			done();
		});
	});

	it('should expect a number as a second argument', function() {
		expect(() => Piped.parallel([], NaN)).toThrow(new Error('Second argument is a number: The maximum parallel execution'));
	});

	it('should call all the callbacks of the array immediately', function(done) {
		var executedPromises = [];

		var cbFactory = (time) => {
			return function cb() {
				return new Promise((resolve) => {
					setTimeout(() => {
						executedPromises.push(cb);
						resolve();
					}, time);
				});
			};
		};

		var cb1 = cbFactory(50);
		var cb2 = cbFactory(10);
		var cb3 = cbFactory(1);

		Piped.parallel([cb1, cb2, cb3])
		.then(() => {
			expect(executedPromises[0]).toBe(cb3);
			expect(executedPromises[1]).toBe(cb2);
			expect(executedPromises[2]).toBe(cb1);

			done();
		});
	});
});
