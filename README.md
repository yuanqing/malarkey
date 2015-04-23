# Malarkey.js [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/malarkey) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/malarkey.svg?style=flat)](https://coveralls.io/r/yuanqing/malarkey)

> Simulate a typewriter/ticker effect on a DOM element.

- [Friendly, flexible API](#api)
- Super lightweight; 2.3 KB [minified](https://github.com/yuanqing/malarkey/blob/master/dist/malarkey.min.js), or 1.1 KB minified and gzipped

## Usage

> [**Editable demo**](http://jsfiddle.net/yoyjoLhx/)

```html
<body>
  <div class="malarkey"></div>
  <script src="dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelectorAll('.malarkey')[0];
    var opts = {
      typeSpeed: 50,
      deleteSpeed: 50,
      pauseDelay: 2000,
      loop: true,
      postfix: ''
    };
    malarkey(elem, opts).type('Say hello')   .pause().delete()
                        .type('Wave goodbye').pause().delete();
  </script>
</body>
```

By default, the effect is applied on `elem.innerHTML`. To apply it on other element properties (such as the `placeholder` attribute of an `input` element), pass in `opts.getter` and `opts.setter`, like so:

> [**Editable demo**](http://jsfiddle.net/qu88jvb9/)

```html
<body>
  <input type="text" class="malarkey">
  <script src="dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelectorAll('.malarkey')[0];
    var attr = 'placeholder';
    var opts = {
      loop: true,
      getter: function(elem) {
        return elem.getAttribute(attr) || '';
      },
      setter: function(elem, val) {
        elem.setAttribute(attr, val);
      }
    };
    malarkey(elem, opts).type('Say hello')   .pause().delete()
                        .type('Wave goodbye').pause().delete();
  </script>
</body>
```

## API

```js
var malarkey = require('malarkey');
```

### var m = malarkey(elem [, opts])

Initialises the typewriter/ticker effect on `elem` with the given `opts` settings.

- `elem` &mdash; A DOM element.

- `opts` &mdash; Settings are:
  - `loop` &mdash; Whether to repeat the entire sequence. Defaults to `false`.
  - `typeSpeed` &mdash; Time in milliseconds to `type` a single character. Defaults to `50`.
  - `deleteSpeed` &mdash; Time in milliseconds to `delete` a single character. Defaults to `50`.
  - `pauseDelay` &mdash; Delay in milliseconds to `pause`. Defaults to `2000`.
  - `postfix` &mdash; A string that is appended to the `str` that is passed to `type` and `delete`. Defaults to the empty string.
  - `getter` &mdash; A function to get the current value of `elem`. Defaults to `function(elem) { return elem.innerHTML; }`.
  - `setter` &mdash; A function to assign a new value to `elem`. Defaults to `function(elem, val) { elem.innerHTML = val; }`.

### m.type(str [, speed])

Type the `str` at the given `speed`.

- `speed` &mdash; Defaults to `opts.typeSpeed`.

### m.delete()

Delete the contents of `elem`, one character at a time, at the default speed.

### m.delete(str [, speed])

Delete the given `str`, one character at a time, at the given `speed`.

- `str` &mdash; `null`, or a string. If `null`, deletes every character in `elem`. Else deletes `str` from `elem` if and only if `elem` ends with `str`.
- `speed` &mdash; Defaults to `opts.deleteSpeed`.

### m.delete(n [, speed])

Delete the last `n` characters of `elem`, one character at a time, at the given `speed`.

- `n` &mdash; An integer. If `-1`, deletes every character in `elem`. Else deletes the last `n` characters of `elem`.
- `speed` &mdash; Defaults to `opts.deleteSpeed`.

### m.clear()

Clear the contents of `elem`.

### m.pause([delay])

Do nothing for `delay`.

- `delay` &mdash; Defaults to `opts.pauseDelay`.

### m.call(fn)

Call the given asynchronous `fn`, passing it `elem` as the first argument.

- `fn` &mdash; Call `this` within this function to signal that it has finished execution.

## Installation

Install via [npm](https://npmjs.com):

```bash
$ npm i --save malarkey
```

Install via [bower](http://bower.io):

```bash
$ bower i --save yuanqing/malarkey
```

## Changelog

- 1.2.0
  - Add `opts.getter` and `opts.setter` to allow the effect to be applied on other element properties
- 1.1.1
  - Use [Segue](https://github.com/yuanqing/segue) v0.2.0
- 1.1.0
  - Restore ability to `delete` by number of characters
- 1.0.0
  - Add `opts.typeSpeed` and `opts.deleteSpeed` in place of `opts.speed`
  - Rename `opts.delay` to `opts.pauseDelay`
  - Remove `delete(n)`
- 0.0.1
  - Initial release

## License

[MIT](https://github.com/yuanqing/malarkey/blob/master/LICENSE)
