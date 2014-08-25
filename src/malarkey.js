/* globals define */
var malarkey = function() {

  return function(elem) {

    var str = elem.innerHTML;
    var i = 0;
    var len = str.length;

    elem.innerHTML = '';

    var type = function() {
      window.setTimeout(function() {
        elem.innerHTML += str[i];
        i += 1;
        if (i < len) {
          type(i);
        }
      }, 100);
    };
    type();

  };

};

(function(root, factory) {
  if (typeof define === 'function' && define.amd) { // istanbul ignore
    define(factory);
  } else if (typeof exports === 'object') { // istanbul ignore
    module.exports = factory;
  } else {
    root.malarkey = factory(root);
  }
})(this, malarkey);
