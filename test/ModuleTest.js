let assert = require('chai').assert;
let Module = require('../src/Module');

describe('src/Module.js', () => {
	it('exports object', () => {
		assert.isFunction(Module);
	});

	describe('constructor', () => {
		it('accepts name and version', () => {
			let module = new Module('name', '1.0');

			assert.property(module, 'name');
			assert.property(module, 'version');

			assert.equal(module.name, 'name');
			assert.equal(module.version, '1.0');
		});
	});
});
