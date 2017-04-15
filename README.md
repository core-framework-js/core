Core Framework / Core module
============================

[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]

[travis-image]: https://img.shields.io/travis/core-framework-js/core.svg?style=flat-square
[travis-url]: https://travis-ci.org/core-framework-js/core
[coveralls-image]: https://img.shields.io/coveralls/core-framework-js/core.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/core-framework-js/core?branch=master


About
-----

This module is responsible for initializing modules as well as
delivering objects exported by them.


Install
-------

**NOTE** This framework is work-in-progress, please don't use it in production yet!

```js
npm install --save @core-framework/core
```


Core class
----------

Core contains basic functions for module management.


### Adding modules

Modules can only be added before call to loadModules().

Example:

```js
core.addModule(require('./myModule'));
core.addModules(module1, module2, ...);
```


### Loading modules

Once all modules are added to the core, you can initialize them.

Currently the initialization is sequential and in order the modules
were added. It is planned the modules will have dependencies and they
will decide about loading order.

Example:

```js
await core.loadModules();
```

Modules can only be loaded once.


### Loading objects.

Modules can expose objects to the application in an unified way.
See Modules object for details. To load those objects, call
loadObjects(objectsName) function.

This function can also accept additional parameters that can be used
by the modules to configure or filter the objects returned.

Example:

```js
let objects = await core.loadObjects('templatePaths');
let objects = await core.loadObjects('templatePaths', 'en');
```


Module object
-------------

Module objects should contain the following:

- name property holding module name,
- version property holding module version.

Modules may contain a load function that will be called by
Core.loadModules(). Load function should be either a synchronous
function or return a Promise if it is asynchronous.

Calls to load() on modules is sequential.


### Exposing objects

Modules may expose objects or properties in 3 different ways:

- as an array of objects,
- as a synchronous function returning an array,
- as an asynchronous function returning a Promise for an array.

The advantage of using functions is that they can accept extra arguments
from loadObjects() call.

Example of simple property:

```js
class MyModule extends Module {
    constructor() {
        super('MyModule', '1.0');

        this.templatePaths = ['./templates/'];
    }
}
```

Example of synchronous function:

```js
class MyModule extends Module {
    ...

    getTemplatePaths(lang) {
        return ['./templates/' + lang];
    }
}
```

Example of asynchronous function:

```js
class MyModule extends Module {
    ...

    async getTemplatePaths(lang) {
        let templates = await db.getConfig('TEMPLATES_PATHS', lang);
        return templates;
    }
}
```


Licences
--------

[MIT](LICENSE)
