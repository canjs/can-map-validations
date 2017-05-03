# can-map-validations

[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-map-validations.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/canjs/can-map-validations.png?branch=master)](https://travis-ci.org/canjs/can-map-validations)

Validate Observe attributes

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-map-validations';
```

### CommonJS use

Use `require` to load `can-map-validations` and everything else
needed to create a template that uses `can-map-validations`:

```js
var plugin = require("can-map-validations");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-map-validations` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-map-validations',
		    	location: 'node_modules/can-map-validations/dist/amd',
		    	main: 'lib/can-map-validations'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-map-validations/dist/global/can-map-validations.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
