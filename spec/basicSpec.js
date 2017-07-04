describe('Basic', function() {
	var piped;

	beforeEach(function() {
		piped = require('../lib/iterate.js');
	});

	it('should have a method called "iterate"', function() {
		expect(typeof piped.iterate).toBe('function');
	});
});
