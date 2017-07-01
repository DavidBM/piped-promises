describe('Sequential', function() {
	var Piped;

	beforeEach(function() {
		Piped = require('../lib/lib.js');
	});

	it('is a function', function() {
		expect(typeof Piped.sequential).toBe('function');
	});

	it('should return a promise', function() {
		var promise = Piped.sequential();

		expect(Promise.resolve(promise)).toBe(promise);
	});

	it('should return a promise that resolves with an array with the same length than the entered array', function(done) {
		var promise = Piped.sequential([1, 2, 3]);

		promise.then((value) => {
			expect(value.length).toBe(3);
			done();
		});
	});

	it('should throw an error if the input is not an array', function() {
		expect(() => Piped.sequential(NaN)).toThrow(new Error('Input must be an array'));
	});

	it('should return a promise that resolves with an empty array is there is no argument suplied', function(done) {
		var promise = Piped.sequential();

		promise.then((value) => {
			expect(value.length).toBe(0);
			done();
		});
	});

	it('should resolve the promises in the same order that are suplied', function(done) {
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

		var cb1 = cbFactory(1);
		var cb2 = cbFactory(10);
		var cb3 = cbFactory(1);

		Piped.sequential([cb1, cb2, cb3])
		.then(() => {
			expect(executedPromises[0]).toBe(cb1);
			expect(executedPromises[1]).toBe(cb2);
			expect(executedPromises[2]).toBe(cb3);

			done();
		});
	});

	it('should return an array with the resolves of the promises with the correct order', function(done) {
		var cbFactory = (value) => {
			return () => Promise.resolve(value);
		};

		var cb1 = cbFactory('promise1');
		var cb2 = cbFactory('promise2');
		var cb3 = cbFactory('promise3');

		Piped.sequential([cb1, cb2, cb3])
		.then((result) => {
			expect(result[0]).toBe('promise1');
			expect(result[1]).toBe('promise2');
			expect(result[2]).toBe('promise3');

			done();
		});
	});

	it('should continue the executuion if a callback doesn\'t return a promise', function(done) {
		var cbFactory = (value) => {
			return () => value;
		};

		var cb1 = cbFactory('promise1');
		var cb2 = cbFactory('promise2');
		var cb3 = cbFactory('promise3');

		Piped.sequential([cb1, cb2, cb3])
		.then((result) => {
			expect(result[0]).toBe('promise1');
			expect(result[1]).toBe('promise2');
			expect(result[2]).toBe('promise3');

			done();
		});
	});
});
