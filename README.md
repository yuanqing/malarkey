# Malarkey.js

> Simulate a typewriter/ticker effect on a DOM element.

## Usage

```html
<body>
  <div class="malarkey"></div>
  <script src="dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelectorAll('.malarkey')[0];
    var opts = {
      speed: 50,
      loop: true,
      postfix: ' '
    };
    malarkey(elem, opts).type('Hello,').pause(2000).type('World!').pause(2000).clear();
  </script>
</body>
```

## License

[MIT license](https://github.com/yuanqing/malarkey/blob/master/LICENSE)
