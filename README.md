# Malarkey.js [![npm Version](http://img.shields.io/npm/v/malarkey.svg?style=flat)](https://www.npmjs.org/package/malarkey) [![Build Status](https://img.shields.io/travis/yuanqing/malarkey.svg?style=flat)](https://travis-ci.org/yuanqing/malarkey)

> Simulate a typewriter/ticker effect on a DOM element.

## Usage

```html
<body>
  <div class="malarkey"></div>
  <script src="dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelectorAll('.malarkey')[0];
    var opts = {
      speed: 100,
      loop: true,
      postfix: ''
    };
    malarkey(elem, opts).type('Say hello')   .pause(2000).delete()
                        .type('Wave goodbye').pause(2000).delete();
  </script>
</body>
```

## API

### malarkey(elem, opts)

Initialises the typewriter/ticker effect on `elem` with the given `opts` settings.

- `elem` is a DOM element.

- `opts` is an object literal. The keys are:
  - `loop` &mdash; Whether to repeat the entire sequence. Defaults to `false`.
  - `speed` &mdash; Time in milliseconds to `type` or `delete` a single character. Defaults to `50`.
  - `delay` &mdash; Delay in milliseconds for the `pause` and `clear` methods. Defaults to `50`.
  - `postfix` &mdash; This is appended to the `str` passed to `type` and `delete`. Defaults to the empty string.

### malarkey.type(str [, speed])

Types the `str` at the given `speed` (milliseconds per character).

- `speed` &mdash; Defaults to `opts.speed`.

### malarkey.delete([str, speed])

Deletes the `str` at the given `speed` (milliseconds per character).

- `str` &mdash; If specified, deletes `str` from `elem` if and only if the last string that was typed ends with `str`. Otherwise, deletes the entire contents of `elem`.
- `speed` &mdash; Defaults to `opts.speed`.

### malarkey.pause([delay])

Do nothing for `delay` (in milliseconds).

- `delay` &mdash; Defaults to `opts.delay`.

### malarkey.clear([delay])

Clears the contents of the DOM element after a `delay` (in milliseconds).

- `delay` &mdash; Defaults to `opts.delay`.

## Installation

Install via [npm](https://www.npmjs.org/package/malarkey):

```bash
$ npm i --save malarkey
```

## License

[MIT license](https://github.com/yuanqing/malarkey/blob/master/LICENSE)
