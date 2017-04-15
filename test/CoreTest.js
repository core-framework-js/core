let assert = require('chai').assert;
let Module = require('../src/Module');
let Core = require('../src/Core');

class ModuleSyncLoad extends Module {
	load() {
		this.loaded = true;
		this.strings = ['syncLoad1', 'syncLoad2'];
	}

	getNumbers() {
		return [1, 2, 3];
	}

	async getNumbers2() {
		return [1, 2];
	}

	getArg(test) {
		this.argValue = test;
	}

	getManyArgs(test1, test2) {
		this.argValues = [test1, test2];
	}

}

class ModuleAsyncLoad extends Module {
	async load() {
		this.loaded = true;
		this.strings = ['asyncLoad1', 'asyncLoad2'];
	}

	getNumbers() {
		return [4, 5, 6];
	}

	async getNumbers2() {
		return [3, 4];
	}

	getArg(test) {
		this.argValue = test;
	}

	getManyArgs(test1, test2) {
		this.argValues = [test1, test2];
	}
}

describe('src/Core.js', () => {
	it('exports object', () => {
		assert.isFunction(Core);
	});

	describe('constructor', () => {
		it('accepts name', () => {
			let core = new Core('name');

			assert.property(core, 'name');

			assert.equal(core.name, 'name');
		});
	});

	describe('addModule()', () => {
		it('exists', () => {
			let core = new Core('name');

			assert.isFunction(core.addModule);
		});

		it('accepts single module', () => {
			let core = new Core('name');
			let module = new Module('module', '1.0');

			core.addModule(module);

			assert.equal(core.modules.size, 1);
			assert.equal(core.modules.has('module'), true);
			assert.equal(core.modules.get('module'), module);
		});
	});

	describe('addModules()', () => {
		it('exists', () => {
			let core = new Core('name');

			assert.isFunction(core.addModules);
		});

		it('accepts single module', () => {
			let core = new Core('name');
			let module = new Module('module', '1.0');

			core.addModules(module);

			assert.equal(core.modules.size, 1);
			assert.equal(core.modules.has('module'), true);
			assert.equal(core.modules.get('module'), module);
		});

		it('accepts multiple modules', () => {
			let core = new Core('name');
			let module = new Module('module', '1.0');
			let module2 = new Module('module2', '1.0');

			core.addModules(module, module2);

			assert.equal(core.modules.size, 2);
			assert.equal(core.modules.has('module'), true);
			assert.equal(core.modules.get('module'), module);
			assert.equal(core.modules.has('module2'), true);
			assert.equal(core.modules.get('module2'), module2);
		});

		it('throws error when adding module after loadModules() was called', async () => {
			let core = new Core('name');
			let module = new Module('module', '1.0');

			await core.loadModules();

			try {
				core.addModules(module);
			} catch (e) {
				return;
			}

			throw new Error('Added module after loadModules() was called');
		});
	});

	describe('loadModules()', () => {
		it('exists', () => {
			let core = new Core('name');

			assert.isFunction(core.loadModules);
		});

		describe('with no modules', () => {
			it('works when no modules are added', async () => {
				let core = new Core('name');

				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);
			});

			it('works second time it is run', async () => {
				let core = new Core('name');

				await core.loadModules();
				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);
			});
		});

		describe('with no load() modules', () => {
			it('works with a two modules (sync load)', async () => {
				let core = new Core('name');
				let mod1 = new Module('mod1', '1');
				let mod2 = new Module('mod2', '1');

				core.addModules(mod1, mod2);

				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);
			});
		});

		describe('with sync load() modules', () => {
			it('works with a single module (sync load)', async () => {
				let core = new Core('name');
				let syncMod = new ModuleSyncLoad('sync1', '1');

				core.addModule(syncMod);

				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);

				assert.property(syncMod, 'loaded');
				assert.equal(syncMod.loaded, true);
			});

			it('works with a two modules (sync load)', async () => {
				let core = new Core('name');
				let syncMod = new ModuleSyncLoad('sync1', '1');
				let syncMod2 = new ModuleSyncLoad('sync2', '1');

				core.addModules(syncMod, syncMod2);

				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);

				assert.property(syncMod, 'loaded');
				assert.equal(syncMod.loaded, true);

				assert.property(syncMod2, 'loaded');
				assert.equal(syncMod2.loaded, true);
			});
		});

		describe('with async load() modules', () => {
			it('works with a two modules (async load)', async () => {
				let core = new Core('name');
				let asyncMod = new ModuleAsyncLoad('async1', '1');
				let asyncMod2 = new ModuleAsyncLoad('async2', '1');

				core.addModules(asyncMod, asyncMod2);

				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);

				assert.property(asyncMod, 'loaded');
				assert.equal(asyncMod.loaded, true);

				assert.property(asyncMod2, 'loaded');
				assert.equal(asyncMod2.loaded, true);
			});
		});

		describe('with mixed load() modules', () => {
			it('works with a two modules (async load)', async () => {
				let core = new Core('name');
				let asyncMod = new ModuleAsyncLoad('async', '1');
				let syncMod = new ModuleSyncLoad('sync', '1');
				let mod = new Module('mod', 1);

				core.addModules(asyncMod, mod, syncMod);

				await core.loadModules();

				assert.property(core, 'modulesLoaded');
				assert.equal(core.modulesLoaded, true);

				assert.property(asyncMod, 'loaded');
				assert.equal(asyncMod.loaded, true);

				assert.property(syncMod, 'loaded');
				assert.equal(syncMod.loaded, true);
			});
		});
	});

	describe('loadObjects()', () => {
		describe('loads non existing objects', () => {
			it('should throw error if modules not loaded', async () => {
				let core = new Core('core');

				try {
					await core.loadObjects('missing');
				} catch (e) {
					return;
				}

				throw new Error('loadObjects() succeeded without loadModules()');
			});

			it('should return empty array with no modules', async () => {
				let core = new Core('core');

				await core.loadModules();

				let objects = await core.loadObjects('missing');

				assert.isArray(objects);
				assert.equal(objects.length, 0);
			});

			it('should return empty array with modules', async () => {
				let core = new Core('core');
				let mod = new Module('mod', 1);

				core.addModule(mod);
				await core.loadModules();

				let objects = await core.loadObjects('missing');

				assert.isArray(objects);
				assert.equal(objects.length, 0);
			});
		});

		describe('loads existing objects', () => {
			let core;

			beforeEach(async () => {
				let syncMod = new ModuleSyncLoad('syncMod', 1);
				let asyncMod = new ModuleAsyncLoad('asyncMod', 1);

				core = new Core('core');
				core.addModules(syncMod, asyncMod);

				await core.loadModules();
			});

			it('from properties', async () => {
				let strings = await core.loadObjects('strings');

				assert.isArray(strings);
				assert.equal(strings.length, 4);
				assert.ok(strings.indexOf('syncLoad1') >= 0);
				assert.ok(strings.indexOf('syncLoad2') >= 0);
				assert.ok(strings.indexOf('asyncLoad1') >= 0);
				assert.ok(strings.indexOf('asyncLoad2') >= 0);
			});


			it('from sync function', async () => {
				let strings = await core.loadObjects('numbers');

				assert.isArray(strings);
				assert.equal(strings.length, 6);
				for (let i = 1; i < 7; i++) {
					assert.ok(strings.indexOf(i) >= 0);
				}
			});


			it('from async function', async () => {
				let strings = await core.loadObjects('numbers2');

				assert.isArray(strings);
				assert.equal(strings.length, 4);
				for (let i = 1; i < 5; i++) {
					assert.ok(strings.indexOf(i) >= 0);
				}
			});
		});

		describe('argument passing', () => {
			let core;
			let mod1, mod2;

			beforeEach(async () => {
				mod1 = new ModuleSyncLoad('syncMod', 1);
				mod2 = new ModuleAsyncLoad('asyncMod', 1);

				core = new Core('core');
				core.addModules(mod1, mod2);

				await core.loadModules();
			});

			it('with single argument', async () => {
				let objects = await core.loadObjects('arg', 'WWW');

				assert.equal(objects.length, 0);
				assert.equal(mod1.argValue, 'WWW');
				assert.equal(mod2.argValue, 'WWW');
			});

			it('with many arguments', async () => {
				let objects = await core.loadObjects('manyArgs', 'WWW', 'XXX');

				assert.equal(objects.length, 0);
				assert.deepEqual(mod1.argValues, ['WWW', 'XXX']);
				assert.deepEqual(mod2.argValues, ['WWW', 'XXX']);
			});
		});

	});
});
