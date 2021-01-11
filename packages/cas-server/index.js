const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const http = require('http');
const https = require('https');
const os = require('os');

const meta = require('./package.json');
const CAS = require('./src/CAS');

const normalize = {
	cas: require('./src/normalize/cas'),
	server: require('./src/normalize/server'),
};

const TicketRegistry = require('./src/Registry/Ticket');
const ServiceRegistry = require('./src/Registry/Service');
const PrincipalProvider = require('./src/Principal');
const ExtensionManager = require('./src/ExtensionManager');

module.exports = Duck({
	id: 'org.produck.cas.server',
	namespace: 'cas',
	name: meta.name,
	version: meta.version,
	description: meta.description,
	components: [
		DuckWeb([
			{ id: 'cas', Application: require('./src/Application/Cas') },
			{ id: 'gateway', Application: require('./src/Application/Gateway') }
		]),
		DuckLog({
			cas: {
				format: DuckLog.Format.ApacheCLF(),
				AppenderList: [
					DuckLog.Appender.Console(),
					// DuckLog.Appender.File(),
				]
			},
			gateway: {
				format: DuckLog.Format.ApacheCLF(),
				AppenderList: [
					DuckLog.Appender.Console(),
					// DuckLog.Appender.File(),
				]
			}
		})
	]
}, function ProduckCasServer({
	Web, Log, injection
}, options) {
	const finalOptions = normalize.cas(options);
	const extensionManager = new ExtensionManager();

	injection.Extension = extensionManager;
	injection.options = finalOptions;
	injection.CAS = {
		Ticket: new TicketRegistry({
			store: finalOptions.TicketRegistry.store,
			expiration: () => {},
			suffix: os.hostname()
		}),
		Response: {
			Type: CAS.Response.Type
		},
		Service: new ServiceRegistry(finalOptions.ServiceRegistry),
		Principal: new PrincipalProvider()
	};
	
	const { Adapter } = DuckLog;
	const application = {
		cas: Adapter.HttpServer(Web.Application('cas'), msg => Log.cas(msg)),
		gateway: Adapter.HttpServer(Web.Application('gateway'), msg => Log.gateway(msg))
	};

	Log();

	return {
		start(options) {
			const finalOptions = normalize.server(options);
			const { host } = finalOptions;

			if (finalOptions.http.enabled) {
				const { port, gateway } = finalOptions.http;
				const name = gateway ? 'gateway' : 'cas';
				const server = http.createServer(application[name]);

				server.listen(port, host);
			}

			if (finalOptions.https.enabled) {
				const { port, cert, key } = finalOptions.http;
				const server = https.createServer({ key, cert }, application.cas);

				server.listen(port, host);
			}
		}
	};
});