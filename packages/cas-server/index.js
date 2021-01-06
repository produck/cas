const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const http = require('http');
const https = require('https');

const meta = require('./package.json');
const normalize = require('./src/normalize');

const TicketRegistry = require('./src/TicketRegistry');
const ServiceRegistry = require('./src/ServiceRegistry');
const PrincipalProvider = require('./src/Principal');

module.exports = Duck({
	id: 'org.produck.cas.server',
	namespace: 'cas',
	name: meta.name,
	version: meta.version,
	description: meta.description,
	components: [
		DuckWeb([
			{
				id: 'cas',
				Application: require('./src/CasApplication')
			}
		]),
		DuckLog({
			access: {
				format: DuckLog.Format.ApacheCLF(),
				AppenderList: [
					DuckLog.Appender.Console()
				]
			}
		})
	]
}, function ProduckCasServer({
	Web, Log, injection
}, options) {
	const finalOptions = normalize(options);

	injection.Ticket = TicketRegistry();
	injection.Service = ServiceRegistry();
	injection.Principal = PrincipalProvider();

	const app = Web.Application('cas');
	const appWithLog = DuckLog.Adapter.HttpServer(app, _ => Log.access(_));
	
	Log();

	return {
		start(options) {
			

		}
	};
});