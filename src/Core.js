function ucfirst(text) {
	return text.substr(0, 1).toUpperCase() + text.substr(1);
}

class Core {
	constructor(name) {
		this.name = name;
		this.modules = new Map();
		this.modulesLoaded = false;
	}

	addModules(...modules) {
		for (let module of modules) {
			this.addModule(module);
		}
	}

	addModule(module) {
		if (this.modulesLoaded) {
			throw new Error('Can\'t add modules after loadModules() call');
		}

		this.modules.set(module.name, module);
	}

	async loadModules() {
		if (this.modulesLoaded) {
			return;
		}

		for (let module of this.modules.values()) {
			if (!module.load) {
				continue;
			}

			let result = module.load(this);

			if (result instanceof Promise) {
				await result;
			}
		}

		this.modulesLoaded = true;
	}

	async loadObjects(name, ...args) {
		if (!this.modulesLoaded) {
			throw new Error('Modules not loaded');
		}

		let result = [];
		let getterName = 'get' + ucfirst(name);
		let propertyName = name;

		for (let module of this.modules.values()) {
			let moduleObjects = null;

			if (module[getterName]) {
				// Read from function.
				moduleObjects = module[getterName].call(module, ...args);

				if (moduleObjects instanceof Promise) {
					moduleObjects = await moduleObjects;
				}
			} else if (module.hasOwnProperty(propertyName)) {
				// Read from properties.
				moduleObjects = module[propertyName];
			} else {
				continue;
			}

			if (!moduleObjects) {
				continue;
			}

			for (let object of moduleObjects) {
				result.push(object);
			}
		}

		return result;
	}
}

module.exports = Core;
