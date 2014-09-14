'use strict';

var segue = require('segue');

var malarkey = function(elem, opts) {

  // empty `element`
  elem.innerHTML = '';

  // read `opts`
  var speed = opts.speed || 100;

  // initialise queue
  var queue = segue();

  // type the `str`
  var type = function(str) {
    var that = this;
    var i = 0;
    var len = str.length;
    var t = function() {
      window.setTimeout(function() {
        elem.innerHTML += str[i];
        i += 1;
        if (i < len) {
          t(i);
        } else {
          that();
        }
      }, speed);
    };
    t();
  };

  // add `str` to the queue to be typed
  this.type = function(str) {
    queue(type, str);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts);
};
