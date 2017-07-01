module.exports = {
	sequential: require('./sequential'),
	parallel: require('./parallel'),
	map: {
		sequential: require('./sequential'),
		parallel: require('./parallel')
	}
};
