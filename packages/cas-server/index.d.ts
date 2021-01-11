namespace CAS {
	interface response {
		BadLoginTicket(): void
		CredentialRequired(): void
		AuthenticationSuccess(): void
		AuthenticationFailure(): void
	}

	namespace TicketRegistry {
		namespace Ticket {
			interface LoginTicket {}
			interface TicketGrantingTicket {}
			interface ProxyGrantingTicket extends TicketGrantingTicket {}
			interface ServiceTicket {}
			interface ProxyTicket extends ServiceTicket {}
		}

		namespace Store {
			namespace TicketOptions {
				interface LoginTicket {}
				interface TicketGrantingTicket {}
				interface ProxyGrantingTicket {}
				interface ServiceTicket {}
				interface ProxyTicket {}
			}

			interface TicketGrantingTicket {
				create(ticket: Ticket.TicketGrantingTicket): void
				select(id: string): TicketOptions.TicketGrantingTicket
				delete(id: string): void
			}
	
			interface ProxyGrantingTicket {
				create(ticket: Ticket.ProxyGrantingTicket): void
				select(id: string): TicketOptions.ProxyGrantingTicket
				delete(id: string): void
			}

			interface ProxyTicket {
				create(ticket: Ticket.ProxyTicket): void
				select(id: string): TicketOptions.ProxyTicket
			}

			interface ServiceTicket {
				create(ticket: Ticket.ServiceTicket): void
				select(id: string): TicketOptions.ServiceTicket
			}

			interface LoginTicket {
				create(ticket: Ticket.LoginTicket): void
				select(id: string): TicketOptions.LoginTicket
			}

			namespace Options {
				namespace Expiration {
					interface TicketGrantingTicket {}
					interface ServiceTicket {}
					interface ProxyGrantingTicket {}
					interface ProxyTicket {}
					interface TransientSessionTicket {}
				}

				interface Expiration {
					tgt: Options.Expiration.TicketGrantingTicket
					st: Options.Expiration.ServiceTicket
					pgt: Options.Expiration.ProxyGrantingTicket
					pt: Options.Expiration.ProxyTicket
					tst: Options.Expiration.TransientSessionTicket
				}
			}

			interface Options {
				expiration: Options.Expiration
			}
		}

		class Store {
			constructor(options: Store.Options)

			TicketGrantingTicket: Store.TicketGrantingTicket
			ServiceTicket: Store.ServiceTicket
			ProxyGrantingTicket: Store.ProxyGrantingTicket
			ProxyTicket: Store.ProxyTicket
			LoginTicket: Store.LoginTicket
		}
	}
}