module.exports = function PrincipalProvider(userAttribute, store) {
	return class Principal {
		constructor(user, attributes) {
			this.user = user;
			this.attributes = attributes;
		}

		extendAttributes(object) {
			return Object.assign(this.attributes, object);
		}
		
		static async get(ticketGrantingTicket) {
			const principal = await store.get(ticketGrantingTicket);
	
			return new Principal(principal[userAttribute], principal);
		}
		
		static async create(ticketGrantingTicket, attributes) {
			const principal = await store.create(ticketGrantingTicket, attributes);
	
			return new Principal(principal[userAttribute], principal);
		}

		static async put(serviceTicket) {
			
		}
	};
};