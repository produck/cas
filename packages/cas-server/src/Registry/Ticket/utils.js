const Randexp = require('randexp');
const generator = new Randexp(/[a-z0-9A-Z]{24}/);

exports.TicketBody = function TicketBody() {
	return generator.gen();
};