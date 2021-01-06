const DEFAULT = {
	AUTHENTICATE() {

	}
};

module.exports = function normalize(_options = {}) {
	const options = {
		server: {
			http: {
				
			},
			https: {
				cert: null,
				key: null
			},
			cookie: {
				path: '/',
				tgcKey: 'CASTGC'
			},
			response: {
	
			},
		},
		registry: {
			service: {

			},
			ticket: {
				TicketGrantingTicket: {
					maxTimeToLiveInSeconds: 28800000,
					timeToKillInSeconds: 7200000
				},
				ServiceTicket: {
					timeToKillInSeconds: 10000
				}
			}
		},
		authenticate: DEFAULT.AUTHENTICATE
	};

	const {
		security: _security = options.security,
		server: _server = options.server
	} = _options;

	return options;
};
