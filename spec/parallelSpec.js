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

	it('should call in parallel a maximun of callbacks as specified in the second argument', function(done) {
		var executedPromises = [];

		var cbFactory = (time) => {
			return function cb() {
				return new Promise((resolve) => {
					setTimeout(() => {
						executedPromises.push(time);
						resolve();
					}, time);
				});
			};
		};

		var cb1 = cbFactory(220);
		var cb2 = cbFactory(100);
		var cb3 = cbFactory(50);

		var cb4 = cbFactory(1);
		var cb5 = cbFactory(60);
		var cb6 = cbFactory(20);

		Piped.parallel([cb1, cb2, cb3, cb4, cb5, cb6], 3)
		.then(() => {
			expect(executedPromises[0]).toBe(50);
			expect(executedPromises[1]).toBe(1);
			expect(executedPromises[2]).toBe(100);

			expect(executedPromises[3]).toBe(60);
			expect(executedPromises[4]).toBe(20);
			expect(executedPromises[5]).toBe(220);

			done();
		});
	});

	it('should call all in parallel if the maximum specified is undefined', function(done) {
		var executedPromises = [];

		var cbFactory = (time) => {
			return function cb() {
				return new Promise((resolve) => {
					setTimeout(() => {
						executedPromises.push(time);
						resolve();
					}, time);
				});
			};
		};

		var cb1 = cbFactory(120);
		var cb2 = cbFactory(110);
		var cb3 = cbFactory(100);

		var cb4 = cbFactory(1);
		var cb5 = cbFactory(10);
		var cb6 = cbFactory(20);

		Piped.parallel([cb1, cb2, cb3, cb4, cb5, cb6])
		.then(() => {
			expect(executedPromises[0]).toBe(1);
			expect(executedPromises[1]).toBe(10);
			expect(executedPromises[2]).toBe(20);

			expect(executedPromises[3]).toBe(100);
			expect(executedPromises[4]).toBe(110);
			expect(executedPromises[5]).toBe(120);

			done();
		});
	});

	it('should call all in parallel if the maximum specified is undefined', function(done) {
		var executedPromises = [];

		var cbFactory = (time) => {
			return function cb() {
				return new Promise((resolve) => {
					setTimeout(() => {
						executedPromises.push(time);
						resolve();
					}, time);
				});
			};
		};

		var cb1 = cbFactory(120);
		var cb2 = cbFactory(110);
		var cb3 = cbFactory(100);

		var cb4 = cbFactory(1);
		var cb5 = cbFactory(10);
		var cb6 = cbFactory(20);

		Piped.parallel([cb1, cb2, cb3, cb4, cb5, cb6])
		.then(() => {
			expect(executedPromises[0]).toBe(1);
			expect(executedPromises[1]).toBe(10);
			expect(executedPromises[2]).toBe(20);

			expect(executedPromises[3]).toBe(100);
			expect(executedPromises[4]).toBe(110);
			expect(executedPromises[5]).toBe(120);

			done();
		});
	});

	it('should stop calling callbacks if there is a rejection', function(done) {
		var executedPromises = [];

		var cbFactory = (time, rejectPromise) => {
			return function cb() {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						executedPromises.push(time);

						if(rejectPromise){
							return reject();
						}

						resolve();
					}, time);
				});
			};
		};

		var cb1 = cbFactory(10);
		var cb2 = cbFactory(20, true);
		var cb3 = cbFactory(30);

		var cb4 = cbFactory(40);
		var cb5 = cbFactory(50);
		var cb6 = cbFactory(20);

		Piped.parallel([cb1, cb2, cb3, cb4, cb5, cb6], 3)
		.then(() => {})
		.catch(() => {});

		setTimeout(() => {
			expect(executedPromises.length).toBe(4);
			done();
		}, 200);
	});

	it('should return an array with the result in order', function(done) {
		var cbFactory = (time) => {
			return function cb() {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(time);
					}, time);
				});
			};
		};

		var cb1 = cbFactory(120);
		var cb2 = cbFactory(110);
		var cb3 = cbFactory(100);

		var cb4 = cbFactory(1);
		var cb5 = cbFactory(10);
		var cb6 = cbFactory(20);

		Piped.parallel([cb1, cb2, cb3, cb4, cb5, cb6])
		.then((results) => {
			expect(results[0]).toBe(120);
			expect(results[1]).toBe(110);
			expect(results[2]).toBe(100);

			expect(results[3]).toBe(1);
			expect(results[4]).toBe(10);
			expect(results[5]).toBe(20);

			done();
		});
	});
});
