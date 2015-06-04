# Malarkey.js [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/malarkey) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/malarkey.svg?style=flat)](https://coveralls.io/r/yuanqing/malarkey)

> Simulate a typewriter/ticker effect on a DOM element.

## Features

- [Friendly, flexible API](#api) allowing fine-grained control
- [Repeat](#usage) the effect indefinitely
- Apply the effect on a [custom element property](#custom-element-property)
- Allows [pausing and resuming](#trigger-pause-and-resume) the sequence on-the-fly
- [Extensive tests](test), with [100% coverage](https://coveralls.io/r/yuanqing/malarkey)
- No dependencies, and super lightweight; just 1.4 KB [minified](dist/malarkey.min.js), or 0.7 KB minified and gzipped

For an in-production demo, see [the npm front page](https://npmjs.com).

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

### Custom element property

By default, the effect is applied on `elem.innerHTML`. To apply the effect on other element properties (such as the `placeholder` attribute of an `input` element), pass in `opts.getter` and `opts.setter`, like so:

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

### Trigger pause and resume

Pausing and resuming the sequence on-the-fly is via the `triggerPause` and `triggerResume` methods.

> [**Editable demo**](http://jsfiddle.net/sqozesav/)

```html
<body>
  <div class="malarkey"></div>
  <script src="../dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelectorAll('.malarkey')[0];
    var opts = {
      typeSpeed: 50,
      deleteSpeed: 50,
      pauseDelay: 2000,
      loop: true,
      postfix: ''
    };
    var m = malarkey(elem, opts).type('Say hello')   .pause().delete()
                                .type('Wave goodbye').pause().delete();
    elem.addEventListener('click', function() {
      if (m.isRunning()) {
        m.triggerPause();
        elem.style.color = 'red';
      } else {
        m.triggerResume();
        elem.style.color = 'black';
      }
    });
  </script>
</body>
```

(Click the element to toggle between calling `triggerPause` and `triggerResume`.)

## API

In the browser, `malarkey` is a global variable (attached on the `window` object). In Node, do:

```js
var malarkey = require('malarkey');
```

### var m = malarkey(elem [, opts])

Initialises the typewriter/ticker effect on `elem` with the given `opts` settings.

- `elem` &mdash; A DOM element.

- `opts` &mdash; An object literal:

  Key | Description | Default
  :--|:--|:--
  `loop` | Whether to repeat the entire sequence | `false`
  `typeSpeed` | Time in milliseconds to `type` a single character | `50`
  `deleteSpeed` | Time in milliseconds to `delete` a single character | `50`
  `pauseDelay` | Delay in milliseconds to `pause` | `2000`
  `postfix` | A string appended to any `str` passed to `type` and `delete` | `''`
  `getter` | A function to get the current value of `elem` | Returns `elem.innerHTML`
  `setter` | A function to assign a new value to `elem` | Assigns to `elem.innerHTML`

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

Call the given *asynchronous* `fn`, passing it `elem` as the first argument.

- `fn` &mdash; We must invoke `this` within this function to signal that it has finished execution.

### m.triggerPause([fn])

Pauses the sequence. Calls the given *synchronous* `fn` when the sequence has been paused, passing it `elem` as the first argument.

### m.triggerResume()

Resumes the sequence *immediately*. Has no effect if the sequence is already running.

### m.isRunning()

Returns `true` if the sequence is currently running. Else returns `false`.

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
