const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const loginPage = fs.readFileSync(path.join(__dirname, 'assets/login.html'), 'utf-8');
const loginTemplate = ejs.compile(loginPage);

module.exports = function ApereoPreset() {
	return {
		getLoginTicket(ctx) {
			return ctx.request.body.execution;
		},
		Response: {
			BadLoginTicket(ctx) {
				ctx.body = 'BadLoginTicket';
			},
			CredentialRequired(ctx) {
				ctx.body = loginTemplate({ lt: ctx.state.lt.id });
				ctx.type = 'text/html';
			},
			AuthenticationSuccess(ctx) {
				ctx.body = 'AuthenticationSuccess';
			},
			AuthenticationFailure(ctx) {
				ctx.body = 'AuthenticationFailure';
			}
		}
	};
};
