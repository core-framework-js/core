let assert = require('chai').assert;
let coreFramework = require('../src');

describe('src/index.js', () => {
	describe('Core', () => {
		it('is defined', () => {
			assert.property(coreFramework, 'Core');
		});
	});

	describe('Module', () => {
		it('is defined', () => {
			assert.property(coreFramework, 'Module');
		});
	});
});
