# piped-promises
Library with different patters for promises

## Patters

The library is structure in a sequence of static methods like `parallel` or `secuencial`.

The usage is simple, just import the library and use the methods. 

### Sequential promises - Low level method

Execute the promises one after the other, always waiting to the previous one to finish before executing the next Promise.

```javascript
	var piped = require('piped-promises');

	piped.sequential(urls.map(url => {
		return (lastCallResult) => request_external_resource(url);
	}))
	.catch(error => console.log(error))
	.then(callResults => {
		console.log(callResults); //An array with the results of the urls in the same order
	});
```

`sequential` required an array of callbacks that will execute the code that return a promise.

In case of **error** the execution will stop and the error will be available in the `sequential` catch.

### Parallel promises - Low level method

Execute all promises and return an array with the results of all the promises. Is like a Promise.all but accepts a maximum quantity of maximum executions in parallel.

```javascript
	var piped = require('piped-promises');

	piped.sequential(urls.map(url => {
		return (lastCallResult) => request_external_resource(url);
	}), 10) //Executes a maximum of 10 calls at a time. When one call ends, call the next one
	.catch(error => console.log(error))
	.then(callResults => {
		console.log(callResults); //An array with the results of the urls in the same order
	});
```

Is important to make a distinction between this method and the ones that use Promise.all internally. This one executes the next call just after one call is finish meanwhile other methods execute X callbacks with Promise.all, waiting until the last one to continue the execution, making that methods less time efficient.

