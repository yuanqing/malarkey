# Malarkey.js [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/malarkey) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/malarkey.svg?style=flat)](https://coveralls.io/r/yuanqing/malarkey)

> Simulate a typewriter/ticker effect on a DOM element.

- [Friendly, flexible API](#api)
- No dependencies
- Super lightweight; just 1.25 KB [minified](dist/malarkey.min.js), or 0.7 KB minified and gzipped

For an in-production demo, see [the npm website](https://npmjs.com) and [the relevant source code](https://github.com/npm/newww/blob/master/assets/scripts/what-npm-is-for.js).

## Usage

> [**Demo**](http://jsfiddle.net/yoyjoLhx/)

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

By default, the effect is applied on `elem.innerHTML`. To **apply the effect on other element properties** (such as the `placeholder` attribute of an `input` element), pass in `opts.getter` and `opts.setter`, like so:

> [**Demo**](http://jsfiddle.net/qu88jvb9/)

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

In the browser, `malarkey` is attached on the `window` object. (As seen in our examples above.)

In Node, do:

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
  - `postfix` &mdash; A string that is appended to the `str` that is passed to `type` and `delete`. Defaults to `''`.
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

- `delay` &mdash; Default: `opts.pauseDelay`.

### m.call(fn)

Call the given asynchronous `fn`, passing it `elem` as the first argument.

- `fn` &mdash; Call `this` within this function to signal that it has finished execution.

## Installation

Install via [npm](https://npmjs.com):

```
$ npm i --save malarkey
```

Install via [bower](http://bower.io):

```
$ bower i --save yuanqing/malarkey
```

## License

[MIT](LICENSE)
