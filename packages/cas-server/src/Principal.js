module.exports = class Principal {
	constructor(user, attributes) {
		this.user = user;
		this.attributes = attributes;
	}

	set(key, value) {
		return this.attributes[key] = value;
	}
};