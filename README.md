# Malarkey.js [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/malarkey) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/malarkey.svg?style=flat)](https://coveralls.io/r/yuanqing/malarkey)

> Simulate a typewriter/ticker effect on a DOM element.

## Features

- [Friendly, flexible API](#api) offering fine-grained control
- Option to [repeat the effect indefinitely](#usage)
- Option to apply the effect on a [custom element property](#custom-element-property)
- Allows [pausing and resuming](#pausing-and-resuming) the sequence on-the-fly
- [Extensive tests](test), with [100% coverage](https://coveralls.io/r/yuanqing/malarkey)
- No dependencies, and super lightweight; just 1.5 KB [minified](dist/malarkey.min.js), or 0.8 KB minified and gzipped

For an in-production demo, see [the npm front page](https://npmjs.com).

## Usage

> [**Editable demo**](http://jsfiddle.net/xchon0kt/)

```html
<body>
  <div class="malarkey"></div>
  <script src="../dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelector('.malarkey');
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

By default, the effect is applied on `elem.innerHTML`. To apply the effect on a different element property (such as the `placeholder` attribute of an `input` element), pass in `opts.getter` and `opts.setter`, like so:

> [**Editable demo**](http://jsfiddle.net/za9mazh3/)

```html
<body>
  <input type="text" class="malarkey">
  <script src="../dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelector('.malarkey');
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

### Pausing and resuming

To pause and resume the sequence on-the-fly, use the `triggerPause` and `triggerResume` methods:

> [**Editable demo**](http://jsfiddle.net/4gqpsazu/)

```html
<body>
  <div class="malarkey"></div>
  <script src="../dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelector('.malarkey');
    var opts = {
      typeSpeed: 50,
      deleteSpeed: 50,
      pauseDelay: 2000,
      loop: true,
      postfix: ''
    };
    var m = malarkey(elem, opts).type('Say hello')   .pause().delete()
                                .type('Wave goodbye').pause().delete();
    document.addEventListener('click', function() {
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

Note that here, we toggle between calling `triggerPause` and `triggerResume` on every `click` event.

## API

In the browser, `malarkey` is a global variable. In Node, do:

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

Call the given `fn`, passing it `elem` as the first argument.

- `fn` &mdash; Can be asynchronous. We must invoke `this` within this function to signal that it has finished execution.

### m.triggerPause([fn])

Pauses the sequence. Calls the given `fn` when the sequence has been paused, passing it `elem` as the first argument.

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

[MIT](LICENSE.md)
