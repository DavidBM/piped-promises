describe('Iterate', function() {
	var piped;
	var IterateClass = require('../lib/iterate.js');

	beforeEach(function() {
		piped = require('../lib/iterate.js');
	});

	it('should return a Iterate class', function() {
		expect(piped.iterate([]) instanceof IterateClass);
	});

	it('should have inParallel method', function() {
		expect(typeof piped.iterate([]).inParallel).toBe('function');
	});

	it('should have sequential method', function() {
		expect(typeof piped.iterate([]).sequential).toBe('function');
	});
});
