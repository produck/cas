const preset = {
	MemoryTicketStore: require('../../preset/MemoryTicketStore'),
	ApereoResponse: require('../../preset/ApereoResponse'),
	SimpleAuthentication: require('../../preset/SimpleAuthentication'),
	SimpleServiceRegistry: require('../../preset/SimpleJsonServiceRegistry')
};

module.exports = function normalize(_options = {}) {
	const options = {
		cookie: {
			path: '/',
			tgcKey: 'CASTGC',
			httpOnly: true
		},
		response: preset.ApereoResponse(),
		ServiceRegistry: preset.SimpleServiceRegistry(),
		TicketRegistry: {
			store: preset.MemoryTicketStore(),
			tgt: {
				maxTimeToLiveInSeconds: 28800000,
				timeToKillInSeconds: 7200000
			},
			st: {
				timeToKillInSeconds: 10000
			}
		},
		authenticate: preset.SimpleAuthentication(),
	};

	const {
		cookie: _cookie = options.cookie,
		registry
	} = _options;

	return options;
};
