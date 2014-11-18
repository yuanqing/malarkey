# Malarkey.js [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?style=flat)](https://travis-ci.org/yuanqing/malarkey)

> Simulate a typewriter/ticker effect on a DOM element.

## Features

1. [Friendly, flexible API](#api)
2. Vanilla JavaScript, and therefore super lightweight (~2.4 KB [minified](https://github.com/yuanqing/malarkey/blob/master/dist/malarkey.min.js), or ~1.1 KB minified and gzipped)

## Usage

Boom:

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

## API

### malarkey(elem [, opts])

Initialises the typewriter/ticker effect on `elem` with the given `opts` settings.

- `elem` is a DOM element.

- `opts` is an object literal. Settings are:
  - `loop` &mdash; Whether to repeat the entire sequence. Defaults to `false`.
  - `typeSpeed` &mdash; Time in milliseconds to `type` a single character. Defaults to `50`.
  - `deleteSpeed` &mdash; Time in milliseconds to `delete` a single character. Defaults to `50`.
  - `pauseDelay` &mdash; Delay in milliseconds to `pause`. Defaults to `2000`.
  - `postfix` &mdash; This is appended to the `str` passed to `type` and `delete`. Defaults to the empty string.

### malarkey.type(str [, speed])

Types the `str` at the given `speed` (milliseconds per character).

- `speed` &mdash; Defaults to `opts.speed`.

### malarkey.delete([str, speed])

Deletes the `str` at the given `speed` (milliseconds per character).

- `str` &mdash; If specified, deletes `str` from `elem` if the last string that was typed ends with `str`. Otherwise, deletes the entire contents of `elem`.
- `speed` &mdash; Defaults to `opts.speed`.

### malarkey.clear()

Clears the contents of `elem`.

### malarkey.pause([delay])

Do nothing for `delay` (in milliseconds).

- `delay` &mdash; Defaults to `opts.delay`.

### malarkey.call(fn)

Invokes the given `fn`, passing in `elem` as the first argument.

- `fn` &mdash; Can be asynchronous. Call `this()` within the function to signal that it has finished execution.

## Installation

Install via [npm](https://www.npmjs.org/package/malarkey):

```bash
$ npm i --save malarkey
```

## License

[MIT license](https://github.com/yuanqing/malarkey/blob/master/LICENSE)
