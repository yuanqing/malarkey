# malarkey [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/malarkey) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/malarkey.svg?style=flat)](https://coveralls.io/r/yuanqing/malarkey)

> Simulate a typewriter effect in vanilla JavaScript.

- Flexible API offering fine-grained control
- Option to repeat the effect indefinitely
- Allows stopping and resuming the sequence on-the-fly
- 522 bytes gzipped

## Usage

> [**Editable demo (CodePen)**](https://codepen.io/lyuanqing/pen/)

```html
<div class="typewriter"></div>
```

```js
const malarkey = require('malarkey')

const element = document.querySelector('.typewriter')
function callback (text) {
  element.innerHTML = text
}
const options = {
  typeSpeed: 50,
  deleteSpeed: 50,
  pauseDuration: 2000,
  repeat: true
}
malarkey(callback, options)
  .type('Say hello')
  .pause()
  .delete()
  .type('Wave goodbye')
  .pause()
  .delete()
```

## API

```js
const malarkey = require('malarkey')
```

### const m = malarkey(callback [, options])

Initialises the typewriter effect with the given optional `options` settings.

- `callback` is a function that is invoked for every `type` and `delete` event. The function signature is `(text)`, where `text` is the current state of the characters that we&rsquo;ve typed and deleted.

- `options` is an object literal:


  Key | Description | Default
  :--|:--|:--
  `typeSpeed` | Duration in milliseconds to `type` a single character | `50`
  `deleteSpeed` | Duration in milliseconds to `delete` a single character | `50`
  `pauseDuration` | Duration in milliseconds to `pause` | `2000`
  `repeat` | Whether to repeat the entire sequence indefinitely | `false`

### m.type(string [, options])

Type the given `string`, one character at a time.

- Set `options.speed` to override the default type speed.

### m.delete([characterCount, options])

Delete the specified number of characters, one character at a time.

- `characterCount` is a positive integer. If not specified, all characters previously typed will be deleted, one character at a time.
- Set `options.speed` to override the default delete speed.

### m.pause([options])

Do nothing for a period of time.

- Set `options.duration` to override the default pause duration.

### m.clear()

Clear all characters previously typed.

### m.call(fn)

Call the given `fn` function.

- The function signature of `fn` is `(callback, text)`. Invoke `callback` to signal that `fn` has finished execution and that we can move on to the next event in the sequence.

### m.triggerStop([fn])

Stops the sequence. Calls the given `fn` function when the sequence has been stopped.

- The function signature of `fn` is `(text)`.

### m.triggerResume()

Resume the sequence. Has no effect if the sequence is already running.

### m.isStopped()

Returns `true` if the sequence is currently stopped, else returns `false`.

## Installation

Install via [yarn](https://yarnpkg.com):

```sh
$ yarn add malarkey
```

Or [npm](https://npmjs.com):

```sh
$ npm install --save malarkey
```

## License

[MIT](LICENSE.md)
