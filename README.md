# piped-promises

**Library with different patters for promises** like sequencial & parallel with maximum parallel execution arguments execution.

[![Build Status](https://travis-ci.org/DavidBM/piped-promises.svg?branch=master)](https://travis-ci.org/DavidBM/piped-promises)
[![Coverage Status](https://coveralls.io/repos/DavidBM/piped-promises/badge.svg?branch=master)](https://coveralls.io/r/DavidBM/piped-promises?branch=master)

<img src="resources/pipe.png">

<!-- MarkdownTOC autolink=true autoanchor=true bracket=round depth=0 -->

- [Patters](#patters)
	- [Sequential promises](#sequential-promises)
	- [Parallel promises](#parallel-promises)
- [TODO](#todo)

<!-- /MarkdownTOC -->

<a name="patters"></a>
## Patters

The library is structured in a sequence of static methods like `parallel` or `secuencial`.

The usage is simple, just import the library and use the methods. 

<a name="sequential-promises"></a>
### Sequential promises

Execute the promises one after the other, always waiting to the previous one to finish before executing the next Promise.

```javascript
	var piped = require('piped-promises');

	piped.sequential(urls.map(url => (lastCallResult) => request(url)))
	.catch(error => console.log(error))
	.then(callResults => {
		console.log(callResults); //An array with the results of the urls in the same order
	});
```

`sequential` required an array of callbacks that will execute the code that return a promise.

In case of **error** the execution will stop and the error will be available in the `sequential` catch.

<a name="parallel-promises"></a>
### Parallel promises

Execute all promises and return an array with the results of all the promises. Is like a Promise.all but accepts a maximum quantity of maximum executions in parallel.

```javascript
	var piped = require('piped-promises');

	piped.parallel(urls.map(url => () => request(url)), 10) //Executes a maximum of 10 calls at a time. When one call ends, call the next one
	.catch(error => console.log(error))
	.then(callResults => {
		console.log(callResults); //An array with the results of the urls in the same order
	});
```

Is important to make a distinction between this method and the ones that use Promise.all internally. This one executes the next call just after one call is finish meanwhile other methods execute X callbacks with Promise.all, waiting until the last one to continue the execution, making that methods less time efficient.

<a name="todo"></a>
## TODO

To have an API like:

```javascript
piped
.iterate(urls)
.parallel(10, url => request(url, options))
.then(results => {...})
.catch(error => {...});
``` 

```javascript
piped
.iterate(urls)
.sequential((url, lastValue) => request(url, options))
.then(results => {...})
.catch(error => {...});
``` 