const { Normalizer, Validator } = require('@produck/duck');

module.exports = Normalizer({
	defaults: () => {},
	validate: Validator(require('./ServerOptionsSchema.json')),
	handler(_options) {
		const options = {
			host: '0.0.0.0',
			http: {
				port: 80,
				enabled: true,
				gateway: false
			},
			https: {
				port: 443,
				enabled: false,
				cert: undefined,
				key: undefined
			}
		};

		const {
			host: _host = options.host,
			http: _http = options.http,
			https: _https = options.https
		} = _options;

		options.host = _host;

		if (_http) {
			const {
				port: _port = options.http.port,
				enabled: _enabled = options.http.enabled,
				gateway: _gateway = options.http.gateway
			} = _http;

			options.http.port = _port;
			options.http.enabled = _enabled;
			options.http.gateway = _gateway;
		}

		if (_https) {
			const {
				port: _port = options.https.port,
				enabled: _enabled = options.https.enabled,
				cert: _cert = options.https.cert,
				key: _key = options.https.key
			} = _https;

			options.https.port = _port;
			options.https.enabled = _enabled;
			options.https.cert = _cert;
			options.https.key = _key;
		}

		return options;
	}
});