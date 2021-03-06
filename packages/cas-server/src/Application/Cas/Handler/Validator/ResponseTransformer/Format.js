const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

function getTemplatePath(name) {
	return path.join(__dirname, `XMLTemplate/${name}.ejs`);
}

const TEMPLATE = {
	CAS20_SUCCESS: fs.readFileSync(getTemplatePath('Cas20Success'), 'utf-8'),
	CAS30_SUCCESS: fs.readFileSync(getTemplatePath('Cas30Success'), 'utf-8'),
	CAS_FAILURE: fs.readFileSync(getTemplatePath('CasFailure'), 'utf-8')
};

const RENDERER = {
	CAS20_SUCCESS: ejs.compile(TEMPLATE.CAS20_SUCCESS),
	CAS30_SUCCESS: ejs.compile(TEMPLATE.CAS30_SUCCESS),
	CAS_FAILURE: ejs.compile(TEMPLATE.CAS_FAILURE),
};

const Format = module.exports = {
	JSON: {
		Success: {
			Cas20(data) {
				return {
					serviceResponse: {
						authenticationSuccess: {
							user: data.principal.user,
							proxyGrantingTicket: data.proxyGrantingTicket
						}
					}
				};
			},
			Cas30(data) {
				const responseBody = Format.JSON.Success.Cas20(data);
				
				Object.assign(responseBody.serviceResponse.authenticationSuccess, {
					attributes: data.principal.attributes,
					proxies: data.proxies
				});
	
				return responseBody;
			},
		},
		Failure(data) {
			return {
				serviceResponse: {
					authenticationFailure: {
						code: data.error.code,
						description: data.error.description
					}
				}
			};
		}
	},
	XML: {
		Success: {
			Cas20(data) {
				return RENDERER.CAS20_SUCCESS(data);
			},
			Cas30(data) {
				return RENDERER.CAS30_SUCCESS(data);
			}
		},
		Failure(data) {
			return RENDERER.CAS_FAILURE(data);
		}
	}
};