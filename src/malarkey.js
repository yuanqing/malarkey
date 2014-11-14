'use strict';

var segue = require('segue');

var malarkey = function(elem, opts) {

  // set `opts` to defaults if needed
  opts = opts || {};
  opts.speed = opts.speed || 50;
  opts.loop = opts.loop || false;
  opts.postfix = opts.postfix || '';

  // cache `postfix` length
  var postFixLen = opts.postfix.length;

  // initialise the function queue
  var queue = segue();

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
    * Do nothing for the `duration`.
    *
    * @param {Number} duration Time in milliseconds
    * @api public
    */
  var pause = function(duration) {
    var done = this;
    window.setTimeout(function() {
      if (opts.loop) {
        queue(pause, duration);
      }
      done();
    }, duration);
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
    var count;
    var d;
    if (typeof str !== 'undefined') {
      // delete `str` from `elem`
      if (endsWith(curr, str + opts.postfix)) {
        count = str.length + postFixLen;
      } else {
        done();
        return;
      }
    } else {
      // delete entire contents of `elem`
      count = curr.length;
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
  var clear = function() {
    elem.innerHTML = '';
    if (opts.loop) {
      queue(clear);
    }
    this();
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
  this.pause = function(duration) {
    queue(pause, duration);
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
