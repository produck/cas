const { Normalizer, Validator } = require('@produck/duck');

const preset = {
	MemoryTicketStore: require('./preset/MemoryTicketStore'),
	Apereo: require('./preset/ApereoResponse'),
	SimpleAuthentication: require('./preset/SimpleAuthentication'),
	SimpleServiceRegistry: require('./preset/SimpleJsonServiceRegistry')
};

module.exports = Normalizer({
	validate: Validator(require('./Schema/CasOptions.json')),
	default() {
		return {};
	},
	handler(_options) {
		const options = {
			cookie: {
				path: '/',
				tgcKey: 'CASTGC',
				httpOnly: true
			},
			router: {
				path: ''
			},
			preset: preset.Apereo(),
			service: preset.SimpleServiceRegistry(),
			ticket: {
				store: preset.MemoryTicketStore(),
				expiration: {
					tgt: {
						maxTimeToLiveInSeconds: 28800,
						timeToKillInSeconds: 7200,
						timeout: {
							maxTimeToLiveInSeconds: 28800
						},
						hardTimeout: {
							timeToKillInSeconds: 28800
						}
					},
					st: {
						timeToKillInSeconds: 10
					}
				}
			},
			authenticate: preset.SimpleAuthentication(),
		};
	
		const {
			cookie: _cookie = options.cookie,
			router: _router = options.router,
			preset: _preset = options.preset,
			ServiceRegistry: _service = options.service,
			TicketRegistry: _ticket = options.ticket,
			authenticate: _authenticate = options.authenticate
		} = _options;

		if (_cookie) {
			const {
				path: _path = options.cookie.path,
				tgcKey: _tgcKey = options.cookie.tgcKey,
				httpOnly: _httpOnly = options.cookie.httpOnly
			} = _cookie;

			options.cookie.path = _path;
			options.cookie.tgcKey = _tgcKey;
			options.cookie.httpOnly = _httpOnly;
		}

		if (_router) {
			const {
				path: _path = options.router.path
			} = _router;

			options.router.path = _path;
		}

		if (_ticket) {
			const {
				store: _store = options.ticket.store,
				expiration: _expiration = options.ticket.store
			} = _ticket;

			if (_expiration) {

			}

			options.ticket.store = _store;
		}
		
		options.preset = _preset;
		options.service = _service;
		options.authenticate = _authenticate;		
	
		return options;

	}
});
