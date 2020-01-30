
exports.normalize = function normalizeOptions(options) {
	const finalOptions = {
		isSecure: false,
		server: {
			cookie: {
				path: '/cas',
				itemName: 'CASTGC'
			},
			response: {
				login: {
					requestor: {
						alreadyLoggedIn: null,
						requestCredentials: null
					},
					acceptor: {

					}
				},
				authentication: {
					success: null,
					failure: null
				},
				proxy: {
					success: null,
					failure: null
				}
			}
		},
		validate: {

		},
		Service: {
			Registry: {

			}
		},
		Ticket: {
			Registry: {

			},
			TicketGrantingTicket: {
				maxTimeToLiveInSeconds: 28800000,
				timeToKillInSeconds: 7200000
			},
			ServiceTicket: {
				timeToKillInSeconds: 10000
			}
		}
	};

	return finalOptions;
};

const DEFAULT = {
	LOGIN_RESPONSE() {

	},
	SERIVCE_RESPONSE() {

	}
};