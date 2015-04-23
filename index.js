'use strict';

var segue = require('segue');

var endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var malarkey = function(elem, opts) {

  // allow `malarkey` to be called without the `new` keyword
  if (!(this instanceof malarkey)) {
    return new malarkey(elem, opts || {});
  }

  // default `opts`
  var typeSpeed = opts.speed || opts.typeSpeed || 50;
  var deleteSpeed = opts.speed || opts.deleteSpeed || 50;
  var pauseDelay = opts.delay || opts.pauseDelay || 2000;
  var postfix = opts.postfix || '';
  var getter = opts.getter || function(elem) {
    return elem.innerHTML;
  };
  var setter = opts.setter || function(elem, val) {
    elem.innerHTML = val;
  };

  // initialise the function queue
  var queue = segue({ repeat: opts.loop || false });

  // internal functions that are added into `queue` via their respective
  // public methods
  var _type = function(done, str, speed) {
    var len = str.length;
    if (len === 0) {
      return done();
    }
    (function t(i) {
      setTimeout(function() {
        setter(elem, getter(elem) + str[i]);
        i += 1;
        if (i < len) {
          t(i);
        } else {
          done();
        }
      }, speed);
    })(0);
  };
  var _delete = function(done, x, speed) {
    var curr = getter(elem);
    var count = curr.length; // default to deleting entire contents of `elem`
    if (x != null) {
      if (typeof x === 'string') {
        // delete the string `x` if and only if `elem` ends with `x`
        if (endsWith(curr, x + postfix)) {
          count = x.length + postfix.length;
        } else {
          count = 0;
        }
      } else {
        // delete the last `x` characters from `elem`
        if (x > -1) {
          count = Math.min(x, count);
        }
      }
    }
    if (count === 0) {
      return done();
    }
    (function d(count) {
      setTimeout(function() {
        var curr = getter(elem);
        if (count) {
          // drop last char
          setter(elem, curr.substring(0, curr.length-1));
          d(count - 1);
        } else {
          done();
        }
      }, speed);
    })(count);
  };
  var _clear = function(done) {
    setter(elem, '');
    done();
  };
  var _pause = function(done, delay) {
    setTimeout(done, delay);
  };
  var _call = function(done, fn) {
    fn.call(done, elem);
  };

  // expose public api
  this.type = function(str, speed) {
    queue(_type, str + postfix, speed || typeSpeed);
    return this;
  };
  this.delete = function(x, speed) {
    queue(_delete, x, speed || deleteSpeed);
    return this;
  };
  this.clear = function() {
    queue(_clear);
    return this;
  };
  this.pause = function(delay) {
    queue(_pause, delay || pauseDelay);
    return this;
  };
  this.call = function(fn) {
    queue(_call, fn);
    return this;
  };

};

module.exports = malarkey;
