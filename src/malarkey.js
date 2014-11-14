'use strict';

var segue = require('segue');

var malarkey = function(elem, opts) {

  // set `opts` to defaults if needed
  opts.speed = opts.speed || 50;
  opts.delay = opts.delay || 50;
  opts.loop = opts.loop || false;
  opts.postfix = opts.postfix || '';

  // cache `postfix` length
  var postFixLen = opts.postfix.length;

  // initialise the function queue
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
    * Type the `str`.
    *
    * @param {String} str
    * @param {Number} speed Time in milliseconds to type a single character
    * @api public
    */
  var type = function(str, speed) {
    var done = this;
    var len = str.length;
    var i = 0;
    if (len === 0) {
      done();
      return;
    }
    var t = function() {
      window.setTimeout(function() {
        elem.innerHTML += str[i];
        i = i + 1;
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
    t();
  };

  /**
    * Do nothing for the `delay`.
    *
    * @param {Number} delay Time in milliseconds
    * @api public
    */
  var pause = function(delay) {
    var done = this;
    window.setTimeout(function() {
      if (opts.loop) {
        queue(pause, delay);
      }
      done();
    }, delay);
  };

  /**
    * If `str` was set, delete `str` from `elem` if the `elem` ends with `str`.
    * Else delete entire contents of `elem`.
    *
    * @param {String} str
    * @param {Number} speed Time in milliseconds to delete a single character
    * @api public
    */
  var _delete = function(str, speed) {
    var done = this;
    var curr = elem.innerHTML;
    var count = curr.length; // default to deleting entire contents of `elem`
    var d;
    if (typeof str !== 'undefined') {
      if (isInteger(str)) {
        speed = str;
      } else {
        // delete `str` from `elem`
        if (endsWith(curr, str + opts.postfix)) {
          count = str.length + postFixLen;
        } else {
          count = 0;
        }
      }
    }
    if (count === 0) {
      done();
      return;
    }
    d = function(count) {
      window.setTimeout(function() {
        var curr = elem.innerHTML;
        if (count) {
          elem.innerHTML = curr.substring(0, curr.length-1); // drop last char
          d(count - 1);
        } else {
          if (opts.loop) {
            queue(_delete, str, speed);
          }
          done();
        }
      }, speed);
    };
    d(count);
  };

  /**
    * Clear the contents of `elem`.
    *
    * @api public
    */
  var clear = function(duration) {
    var done = this;
    window.setTimeout(function() {
      elem.innerHTML = '';
      if (opts.loop) {
        queue(clear, duration);
      }
      done();
    }, duration);
  };

  // expose public API
  this.type = function(str, speed) {
    queue(type, str + opts.postfix, speed || opts.speed);
    return this;
  };
  this.delete = function(str, speed) {
    queue(_delete, str, speed || opts.speed);
    return this;
  };
  this.pause = function(delay) {
    queue(pause, delay || opts.delay);
    return this;
  };
  this.clear = function(delay) {
    queue(clear, delay || opts.delay);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts || {});
};
