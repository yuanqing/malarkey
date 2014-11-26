'use strict';

var segue = require('segue');

var malarkey = function(elem, opts) {

  // defaults
  opts.loop = opts.loop || false;
  opts.typeSpeed = opts.typeSpeed || 50;
  opts.deleteSpeed = opts.deleteSpeed || 50;
  opts.pauseDelay = opts.pauseDelay || 2000;
  opts.postfix = opts.postfix || '';

  // cache `postfix` length
  var postfixLen = opts.postfix.length;

  // initialise the function `queue`
  var queue = segue();

  /**
    * Check if `obj` is an integer.
    *
    * @param {Object} obj
    * @return {Boolean}
    * @api private
    */
  var isInteger = function(obj) {
    return parseInt(obj, 10) === obj;
  };

  /**
    * Check if `str` ends with `suffix`.
    *
    * @param {String} str
    * @param {String} suffix
    * @return {Boolean}
    * @api private
    */
  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  /**
    * Types the `str` at the given `speed`.
    *
    * @param {String} str
    * @param {Number} speed Time in milliseconds to type a single character
    * @api public
    */
  var type = function(str, speed) {
    var done = this;
    var len = str.length;
    if (len === 0) {
      return done();
    }
    var t = function(i) {
      setTimeout(function() {
        elem.innerHTML += str[i];
        i += 1;
        if (i < len) {
          t(i);
        } else {
          if (opts.loop) {
            queue(type, str, speed);
          }
          done();
        }
      }, speed);
    };
    t(0);
  };

  /**
    * Deletes `str` or `n` number of characters at the given `speed`.
    *
    * @param {String|Number} arg If `null` or `-1`, deletes entire contents of `elem`.
    * Else if number, deletes `arg` number of characters from `elem`. Else deletes
    * `arg` from `elem` if and only if the last string that was typed ends with `arg`.
    * @param {Number} speed Time in milliseconds to type a single character
    * @api public
    */
  var _delete = function(arg, speed) {
    var done = this;
    var curr = elem.innerHTML;
    var count = curr.length; // default to deleting entire contents of `elem`
    var d;
    if (typeof arg !== 'undefined' && arg !== null) {
      if (isInteger(arg)) {
        if (arg > -1) {
          count = arg > count ? count : arg;
        }
      } else { // assumes `arg` is String
        // delete `arg` from `elem` if the last string typed ends with `arg`
        if (endsWith(curr, arg + opts.postfix)) {
          count = arg.length + postfixLen;
        } else {
          count = 0;
        }
      }
    }
    if (count === 0) {
      return done();
    }
    d = function(count) {
      setTimeout(function() {
        var curr = elem.innerHTML;
        if (count) {
          elem.innerHTML = curr.substring(0, curr.length-1); // drop last char
          d(count - 1);
        } else {
          if (opts.loop) {
            queue(_delete, arg, speed);
          }
          done();
        }
      }, speed);
    };
    d(count);
  };

  /**
    * Clears the contents of `elem`.
    *
    * @api public
    */
  var clear = function() {
    elem.innerHTML = '';
    this();
    if (opts.loop) {
      setTimeout(function() {
        queue(clear);
      }, 0);
    }
  };

  /**
    * Do nothing for `delay`.
    *
    * @param {Number} delay Time in milliseconds
    * @api public
    */
  var pause = function(delay) {
    var done = this;
    setTimeout(function() {
      if (opts.loop) {
        queue(pause, delay);
      }
      done();
    }, delay);
  };

  /**
    * Invokes the given `fn`, passing in `elem` as the first argument.
    *
    * @param {Function} fn
    * @api public
    */
  var call = function(fn) {
    var done = this;
    var cb = function() {
      done();
      if (opts.loop) {
        setTimeout(function() {
          queue(call, fn);
        }, 0);
      }
    };
    fn.call(cb, elem);
  };

  // expose public API
  this.type = function(str, speed) {
    queue(type, str + opts.postfix, speed || opts.typeSpeed);
    return this;
  };
  this.delete = function(arg, speed) {
    queue(_delete, arg, speed || opts.deleteSpeed);
    return this;
  };
  this.clear = function() {
    queue(clear);
    return this;
  };
  this.pause = function(delay) {
    queue(pause, delay || opts.pauseDelay);
    return this;
  };
  this.call = function(fn) {
    queue(call, fn);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts || {});
};
