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
		router: {
			path: ''
		},
		response: preset.ApereoResponse(),
		ServiceRegistry: preset.SimpleServiceRegistry(),
		TicketRegistry: {
			store: preset.MemoryTicketStore(),
			tgt: {
				maxTimeToLiveInSeconds: 28800,
				timeToKillInSeconds: 7200
			},
			st: {
				timeToKillInSeconds: 10
			}
		},
		authenticate: preset.SimpleAuthentication(),
	};

	const {
		cookie: _cookie = options.cookie,
		router: _router = options.router,
		response: _response = options.response,
		ServiceRegistry: _ServiceRegistry = options.ServiceRegistry,
		TicketRegistry: _TicketRegistry = options.TicketRegistry,
		authenticate: _authenticate = options.authenticate
	} = _options;

	return options;
};
