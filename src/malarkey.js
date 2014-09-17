'use strict';

var segue = require('segue');

var malarkey = function(elem, opts) {

  // read `opts`
  opts.speed = opts.speed || 100;
  opts.loop = opts.loop || false;
  opts.postfix = opts.postfix || '';

  // initialise the queue
  var queue = segue();

  // type the `str`
  var type = function(str, speed) {
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
          if (opts.loop) {
            queue(type, str, speed);
          }
          that();
        }
      }, speed);
    };
    t();
  };

  // pause typing for the `duration`
  var pause = function(duration) {
    var that = this;
    window.setTimeout(function() {
      if (opts.loop) {
        queue(pause, duration);
      }
      that();
    }, duration);
  };

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  // delete
  var del = function(delStr, speed) {
    var that = this;
    var str = elem.innerHTML;
    var len;
    var d;
    if (typeof delStr === 'undefined') {
      len = str.length;
    } else {
      if (parseInt(delStr, 10) === delStr) { // `str` is integer
        if (delStr === -1) {
          len = str.length;
        } else {
          len = delStr + opts.postfix.length;
          len = len > str.length ? str.length : len;
        }
      } else {
        if (endsWith(str, delStr + opts.postfix)) { // `str` is string
          len = delStr.length + opts.postfix.length;
        } else {
          that();
        }
      }
    }
    d = function(len) { // count is number of characters to delete
      window.setTimeout(function() {
        var str = elem.innerHTML;
        if (len) {
          elem.innerHTML = str.substring(0, str.length-1);
          d(len-1);
        } else {
          if (opts.loop) {
            queue(del, delStr, speed);
          }
          that();
        }
      }, speed);
    };
    d(len);
  };

  // empty `elem`
  var clear = function() {
    elem.innerHTML = '';
    if (opts.loop) {
      queue(clear);
    }
    this();
  };

  // add function to `queue`
  this.type = function(str, speed) {
    queue(type, str + opts.postfix, speed || opts.speed);
    return this;
  };
  this.delete = function(str, speed) {
    queue(del, str, speed || opts.speed);
    return this;
  };
  this.pause = function(duration) {
    if (typeof duration !== 'undefined') {
      queue(pause, duration);
    }
    return this;
  };
  this.clear = function() {
    queue(clear);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts);
};
