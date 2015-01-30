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
  opts.loop = opts.loop || false;
  opts.typeSpeed = opts.speed || opts.typeSpeed || 50;
  opts.deleteSpeed = opts.speed || opts.deleteSpeed || 50;
  opts.pauseDelay = opts.delay || opts.pauseDelay || 2000;
  opts.postfix = opts.postfix || '';

  // initialise the function queue
  var queue = segue({ repeat: opts.loop });

  // internal functions that are added into `queue` via public methods
  var _type = function(done, str, speed) {
    var len = str.length;
    if (len === 0) {
      return done();
    }
    (function t(i) {
      setTimeout(function() {
        elem.innerHTML += str[i];
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
    var curr = elem.innerHTML;
    var count = curr.length; // default to deleting entire contents of `elem`
    if (x != null) {
      if (typeof x === 'string') {
        // delete `x` from `elem` if the last string typed ends with `x`
        if (endsWith(curr, x + opts.postfix)) {
          count = x.length + opts.postfix.length;
        } else {
          count = 0;
        }
      } else { // assume `x` is an integer
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
        var curr = elem.innerHTML;
        if (count) {
          elem.innerHTML = curr.substring(0, curr.length-1); // drop last char
          d(count - 1);
        } else {
          done();
        }
      }, speed);
    })(count);
  };
  var _clear = function(done) {
    elem.innerHTML = '';
    done();
  };
  var _pause = function(done, delay) {
    setTimeout(done, delay);
  };
  var _call = function(done, fn) {
    fn.call(done, elem);
  };

  /**
    * Types the `str` at the given `speed`.
    *
    * @param {String} str
    * @param {Number} speed Time in milliseconds to type a single character
    * @api public
    */
  this.type = function(str, speed) {
    queue(_type, str + opts.postfix, speed || opts.typeSpeed);
    return this;
  };

  /**
    * Deletes characters from `elem` (one character at a time) at the
    * given `speed`.
    *
    * @param {String|Number} x If `null` or `-1`, deletes the contents of
    * `elem`. If a string, deletes the string if and only if `elem` ends with
    * said string. Else if an integer, deletes that many characters from the
    * `elem`.
    * @param {Number} speed Time in milliseconds to delete a single character
    * @api public
    */
  this.delete = function(x, speed) {
    queue(_delete, x, speed || opts.deleteSpeed);
    return this;
  };

  /**
    * Clear the contents of `elem`.
    *
    * @api public
    */
  this.clear = function() {
    queue(_clear);
    return this;
  };

  /**
    * Do nothing for `delay`.
    *
    * @param {Number} delay Time in milliseconds
    * @api public
    */
  this.pause = function(delay) {
    queue(_pause, delay || opts.pauseDelay);
    return this;
  };

  /**
    * Invoke the given `fn`, passing it `elem` as the first argument.
    *
    * @param {Function} fn Invoke `this` within this function to signal that it
    * has finished execution.
    * @api public
    */
  this.call = function(fn) {
    queue(_call, fn);
    return this;
  };

};

module.exports = malarkey;
