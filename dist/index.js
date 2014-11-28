!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.malarkey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var segue = _dereq_('segue');

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
  var queue = segue(opts.loop);

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

},{"segue":2}],2:[function(_dereq_,module,exports){
'use strict';

var aps = Array.prototype.slice;

var segue = function(cb, repeat) {

  // both `repeat` and `cb` are optional
  if (typeof cb === 'boolean') {
    repeat = cb;
  }
  cb = cb || function() {}; // default to no op
  repeat = repeat === true || false; // default to `false`

  var i = -1;
  var queue = [];
  var running = false;
  var nextArgs = [];

  var next = function() {
    var args = aps.call(arguments);
    var err = args.shift();
    if (err || !running || (!repeat && i === queue.length-1)) {
      if (err) {
        cb(err);
      }
      nextArgs = args;
      running = false;
      return;
    }
    i = (i + 1) % queue.length;
    queue[i][0].apply(next, nextArgs.concat(args, queue[i][1]));
    nextArgs = [];
  };

  var enqueue = function() {
    var args = aps.call(arguments);
    var fn;
    if (args.length === 0) { // toggle `running` state
      if (!running && queue.length) {
        running = true;
        next();
      } else {
        running = false;
      }
    } else { // add `fn` and `args` to the function `queue`
      fn = args.shift();
      queue.push([fn, args]);
      if (!running) {
        running = true;
        setTimeout(function() {
          next();
        }, 0); // call the first `fn` only after all other functions have been enqueued
      }
    }
    return enqueue;
  };

  return enqueue;

};

module.exports = exports = segue;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L2luZGV4LmpzIiwiL1VzZXJzL3l1YW5xaW5nL0NvZGUvR2l0SHViL0phdmFTY3JpcHQvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL3NlZ3VlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNlZ3VlID0gcmVxdWlyZSgnc2VndWUnKTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGRlZmF1bHRzXG4gIG9wdHMubG9vcCA9IG9wdHMubG9vcCB8fCBmYWxzZTtcbiAgb3B0cy50eXBlU3BlZWQgPSBvcHRzLnR5cGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5kZWxldGVTcGVlZCA9IG9wdHMuZGVsZXRlU3BlZWQgfHwgNTA7XG4gIG9wdHMucGF1c2VEZWxheSA9IG9wdHMucGF1c2VEZWxheSB8fCAyMDAwO1xuICBvcHRzLnBvc3RmaXggPSBvcHRzLnBvc3RmaXggfHwgJyc7XG5cbiAgLy8gY2FjaGUgYHBvc3RmaXhgIGxlbmd0aFxuICB2YXIgcG9zdGZpeExlbiA9IG9wdHMucG9zdGZpeC5sZW5ndGg7XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgZnVuY3Rpb24gYHF1ZXVlYFxuICB2YXIgcXVldWUgPSBzZWd1ZShvcHRzLmxvb3ApO1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW50ZWdlci5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICogQGFwaSBwcml2YXRlXG4gICAgKi9cbiAgdmFyIGlzSW50ZWdlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKSA9PT0gb2JqO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYHN0cmAgZW5kcyB3aXRoIGBzdWZmaXhgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBUeXBlcyB0aGUgYHN0cmAgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHR5cGUgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciB0eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICB2YXIgdCA9IGZ1bmN0aW9uKGkpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICB0KDApO1xuICB9O1xuXG4gIC8qKlxuICAgICogRGVsZXRlcyBgc3RyYCBvciBgbmAgbnVtYmVyIG9mIGNoYXJhY3RlcnMgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBhcmcgSWYgYG51bGxgIG9yIGAtMWAsIGRlbGV0ZXMgZW50aXJlIGNvbnRlbnRzIG9mIGBlbGVtYC5cbiAgICAqIEVsc2UgaWYgbnVtYmVyLCBkZWxldGVzIGBhcmdgIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZyb20gYGVsZW1gLiBFbHNlIGRlbGV0ZXNcbiAgICAqIGBhcmdgIGZyb20gYGVsZW1gIGlmIGFuZCBvbmx5IGlmIHRoZSBsYXN0IHN0cmluZyB0aGF0IHdhcyB0eXBlZCBlbmRzIHdpdGggYGFyZ2AuXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIF9kZWxldGUgPSBmdW5jdGlvbihhcmcsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgdmFyIGNvdW50ID0gY3Vyci5sZW5ndGg7IC8vIGRlZmF1bHQgdG8gZGVsZXRpbmcgZW50aXJlIGNvbnRlbnRzIG9mIGBlbGVtYFxuICAgIHZhciBkO1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgIT09IG51bGwpIHtcbiAgICAgIGlmIChpc0ludGVnZXIoYXJnKSkge1xuICAgICAgICBpZiAoYXJnID4gLTEpIHtcbiAgICAgICAgICBjb3VudCA9IGFyZyA+IGNvdW50ID8gY291bnQgOiBhcmc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIGFzc3VtZXMgYGFyZ2AgaXMgU3RyaW5nXG4gICAgICAgIC8vIGRlbGV0ZSBgYXJnYCBmcm9tIGBlbGVtYCBpZiB0aGUgbGFzdCBzdHJpbmcgdHlwZWQgZW5kcyB3aXRoIGBhcmdgXG4gICAgICAgIGlmIChlbmRzV2l0aChjdXJyLCBhcmcgKyBvcHRzLnBvc3RmaXgpKSB7XG4gICAgICAgICAgY291bnQgPSBhcmcubGVuZ3RoICsgcG9zdGZpeExlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICBkID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gY3Vyci5zdWJzdHJpbmcoMCwgY3Vyci5sZW5ndGgtMSk7IC8vIGRyb3AgbGFzdCBjaGFyXG4gICAgICAgICAgZChjb3VudCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgZChjb3VudCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDbGVhcnMgdGhlIGNvbnRlbnRzIG9mIGBlbGVtYC5cbiAgICAqXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIGVsZW0uaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcygpO1xuICB9O1xuXG4gIC8qKlxuICAgICogRG8gbm90aGluZyBmb3IgYGRlbGF5YC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgVGltZSBpbiBtaWxsaXNlY29uZHNcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBJbnZva2VzIHRoZSBnaXZlbiBgZm5gLCBwYXNzaW5nIGluIGBlbGVtYCBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAgKlxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIGNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgY2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuICAgIGZuLmNhbGwoY2IsIGVsZW0pO1xuICB9O1xuXG4gIC8vIGV4cG9zZSBwdWJsaWMgQVBJXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZSh0eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMudHlwZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbihhcmcsIHNwZWVkKSB7XG4gICAgcXVldWUoX2RlbGV0ZSwgYXJnLCBzcGVlZCB8fCBvcHRzLmRlbGV0ZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXVlKGNsZWFyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgcXVldWUocGF1c2UsIGRlbGF5IHx8IG9wdHMucGF1c2VEZWxheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcXVldWUoY2FsbCwgZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG4gIHJldHVybiBuZXcgbWFsYXJrZXkoZWxlbSwgb3B0cyB8fCB7fSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgc2VndWUgPSBmdW5jdGlvbihjYiwgcmVwZWF0KSB7XG5cbiAgLy8gYm90aCBgcmVwZWF0YCBhbmQgYGNiYCBhcmUgb3B0aW9uYWxcbiAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmVwZWF0ID0gY2I7XG4gIH1cbiAgY2IgPSBjYiB8fCBmdW5jdGlvbigpIHt9OyAvLyBkZWZhdWx0IHRvIG5vIG9wXG4gIHJlcGVhdCA9IHJlcGVhdCA9PT0gdHJ1ZSB8fCBmYWxzZTsgLy8gZGVmYXVsdCB0byBgZmFsc2VgXG5cbiAgdmFyIGkgPSAtMTtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciBydW5uaW5nID0gZmFsc2U7XG4gIHZhciBuZXh0QXJncyA9IFtdO1xuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBlcnIgPSBhcmdzLnNoaWZ0KCk7XG4gICAgaWYgKGVyciB8fCAhcnVubmluZyB8fCAoIXJlcGVhdCAmJiBpID09PSBxdWV1ZS5sZW5ndGgtMSkpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2IoZXJyKTtcbiAgICAgIH1cbiAgICAgIG5leHRBcmdzID0gYXJncztcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaSA9IChpICsgMSkgJSBxdWV1ZS5sZW5ndGg7XG4gICAgcXVldWVbaV1bMF0uYXBwbHkobmV4dCwgbmV4dEFyZ3MuY29uY2F0KGFyZ3MsIHF1ZXVlW2ldWzFdKSk7XG4gICAgbmV4dEFyZ3MgPSBbXTtcbiAgfTtcblxuICB2YXIgZW5xdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZm47XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7IC8vIHRvZ2dsZSBgcnVubmluZ2Agc3RhdGVcbiAgICAgIGlmICghcnVubmluZyAmJiBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBhZGQgYGZuYCBhbmQgYGFyZ3NgIHRvIHRoZSBmdW5jdGlvbiBgcXVldWVgXG4gICAgICBmbiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHF1ZXVlLnB1c2goW2ZuLCBhcmdzXSk7XG4gICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9LCAwKTsgLy8gY2FsbCB0aGUgZmlyc3QgYGZuYCBvbmx5IGFmdGVyIGFsbCBvdGhlciBmdW5jdGlvbnMgaGF2ZSBiZWVuIGVucXVldWVkXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnF1ZXVlO1xuICB9O1xuXG4gIHJldHVybiBlbnF1ZXVlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBzZWd1ZTtcbiJdfQ==
(1)
});
