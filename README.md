# Malarkey.js

> Type out the contents of a DOM element.

## Usage

```html
<body>
  <div class="malarkey"></div>
  <script src="dist/malarkey.min.js"></script>
  <script>
    var elem = document.querySelectorAll('.malarkey')[0];
    var opts = {
      speed: 50
    };
    malarkey(elem, opts).type('Hello, ').type('World!');
  </script>
</body>
```

## License

[MIT license](https://github.com/yuanqing/malarkey/blob/master/LICENSE)
