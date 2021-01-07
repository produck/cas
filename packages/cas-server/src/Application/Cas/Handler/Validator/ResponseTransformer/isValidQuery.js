const schemas = {
	ticket: [required],
	service: [required, isURL],
	pgtUrl: [isURL],
	format: [isValidFormat],
	renew: [isValidRenew]
};

const FORMAT_REG = /^(XML|JSON)$/;
const RENEW_REG = /^(true|false)$/;

function isValidRenew(value) {
	return RENEW_REG.test(value);
}

function required(value) {
	return typeof value !== 'undefined';
}

function isValidFormat(value) {
	return FORMAT_REG.test(value);
}

function isURL(urlString) {
	try {
		new URL(urlString);

		return true;
	} catch (err) {
		return false;
	}
}

const keys = Object.keys(schemas);

module.exports = function isValidURLQuery(object) {
	return keys.every(key => schemas[key].every(assert => assert(object[key])));
};