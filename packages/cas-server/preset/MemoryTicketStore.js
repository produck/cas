module.exports = function MemoryTicketStore(options) {
	const cache = {
		tgt: {},
		st: {},
		pgt: {},
		pt: {},
		lt: {}
	};

	return {
		TicketGrantingTicket: {
			create() {

			},
			select() {

			},
			delete() {

			}
		},
		ProxyGrantingTicket: {
			create() {

			},
			select() {

			},
			delete() {

			}
		},
		ProxyTicket: {
			create() {

			},
			select() {
				
			}
		},
		ServiceTicket: {
			create() {

			},
			select() {
				
			}
		},
		LoginTicket: {
			create() {

			},
			select() {
				
			}
		}
	};
};
