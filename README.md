---

<div align="center">
  <h1>fs-readstream-progress</h1>
  <h2>fs.createReadStream that emits progress events. Also works with hyperdrive.</h2>
  <p>
    <a href="https://npmjs.com/packages/fs-readstream-progress" alt="npm package">
      <img src="https://img.shields.io/npm/v/fs-readstream-progress.svg?style=flat-square">
    </a>
    <a href="https://github.com/blahah/fs-readstream-progress/blob/master/LICENSE" alt="CC0 public domain">
      <img src="https://img.shields.io/badge/license-CC0-ff69b4.svg?style=flat-square">
    </a>
  </p>
</div>

---

## What problem does this solve?

Track the progress of `readStream`s for Node `fs` or [`hyperdrive`](https://github.com/mafintosh/hyperdrive) archives.

## Install

```
npm install fs-readstream-progress
```

## Usage

Use it like `fs.createReadStream`, except that:

- it also emits `progress` events
- you can pass an alternative `fs`
- it has a convenient `.drain()` method

API:

```js
var getwithprogress = require('fs-readstream-progress')

var stream = getwithprogress(filename, opts)
```

### Progress events

Example:

``` js
var progress = require('fs-readstream-progress')

progress('somefile')
  .on('progress', function (data) { console.log('progress:', data) })
  .on('data', function(data) {})
  .on('end', function() { console.log('done') })
```

Each `progress` event looks like:

```js
{
  done: 16, // integer, number of bytes streamed so far
  total: 256, // integer, total number of bytes
  progress: 0.0625 // float, proportion of the data streamed
}
```

When all the data have been streamed, the stream will emit `end`, just like `fs.createReadStream`.

### Different `fs`

To use a different `fs` implementation (e.g. a hyperdrive archive), just pass

```
var hyperdrive = require('hyperdrive')
var getwithprogress = require('fs-readstream-progress')

var archive = hyperdrive('.')
var stream = getwithprogress('somefile', { fs: archive })
```

### `.drain()`

Drains the stream, pulling all data through without keeping it in memory.

This is useful if you just want to track a download from a hyperdrive archive.

## License

To the extent possible by law, we transfer any rights we have in this code to the public domain. Specifically, we do so using the [CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).

You can do whatever you want with this code. No need to credit us, link to us, include any license, or anything else. But if you want to do those things, you're free to do that too.
