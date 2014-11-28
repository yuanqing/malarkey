!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.malarkey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
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

},{"segue":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBzZWd1ZSA9IGZ1bmN0aW9uKGNiLCByZXBlYXQpIHtcblxuICAvLyBib3RoIGByZXBlYXRgIGFuZCBgY2JgIGFyZSBvcHRpb25hbFxuICBpZiAodHlwZW9mIGNiID09PSAnYm9vbGVhbicpIHtcbiAgICByZXBlYXQgPSBjYjtcbiAgfVxuICBjYiA9IGNiIHx8IGZ1bmN0aW9uKCkge307IC8vIGRlZmF1bHQgdG8gbm8gb3BcbiAgcmVwZWF0ID0gcmVwZWF0ID09PSB0cnVlIHx8IGZhbHNlOyAvLyBkZWZhdWx0IHRvIGBmYWxzZWBcblxuICB2YXIgaSA9IC0xO1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIHJ1bm5pbmcgPSBmYWxzZTtcbiAgdmFyIG5leHRBcmdzID0gW107XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGVyciA9IGFyZ3Muc2hpZnQoKTtcbiAgICBpZiAoZXJyIHx8ICFydW5uaW5nIHx8ICghcmVwZWF0ICYmIGkgPT09IHF1ZXVlLmxlbmd0aC0xKSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYihlcnIpO1xuICAgICAgfVxuICAgICAgbmV4dEFyZ3MgPSBhcmdzO1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpID0gKGkgKyAxKSAlIHF1ZXVlLmxlbmd0aDtcbiAgICBxdWV1ZVtpXVswXS5hcHBseShuZXh0LCBuZXh0QXJncy5jb25jYXQoYXJncywgcXVldWVbaV1bMV0pKTtcbiAgICBuZXh0QXJncyA9IFtdO1xuICB9O1xuXG4gIHZhciBlbnF1ZXVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBmbjtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHsgLy8gdG9nZ2xlIGBydW5uaW5nYCBzdGF0ZVxuICAgICAgaWYgKCFydW5uaW5nICYmIHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIGFkZCBgZm5gIGFuZCBgYXJnc2AgdG8gdGhlIGZ1bmN0aW9uIGBxdWV1ZWBcbiAgICAgIGZuID0gYXJncy5zaGlmdCgpO1xuICAgICAgcXVldWUucHVzaChbZm4sIGFyZ3NdKTtcbiAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0sIDApOyAvLyBjYWxsIHRoZSBmaXJzdCBgZm5gIG9ubHkgYWZ0ZXIgYWxsIG90aGVyIGZ1bmN0aW9ucyBoYXZlIGJlZW4gZW5xdWV1ZWRcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVucXVldWU7XG4gIH07XG5cbiAgcmV0dXJuIGVucXVldWU7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHNlZ3VlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VndWUgPSByZXF1aXJlKCdzZWd1ZScpO1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gZGVmYXVsdHNcbiAgb3B0cy5sb29wID0gb3B0cy5sb29wIHx8IGZhbHNlO1xuICBvcHRzLnR5cGVTcGVlZCA9IG9wdHMudHlwZVNwZWVkIHx8IDUwO1xuICBvcHRzLmRlbGV0ZVNwZWVkID0gb3B0cy5kZWxldGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5wYXVzZURlbGF5ID0gb3B0cy5wYXVzZURlbGF5IHx8IDIwMDA7XG4gIG9wdHMucG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBjYWNoZSBgcG9zdGZpeGAgbGVuZ3RoXG4gIHZhciBwb3N0Zml4TGVuID0gb3B0cy5wb3N0Zml4Lmxlbmd0aDtcblxuICAvLyBpbml0aWFsaXNlIHRoZSBmdW5jdGlvbiBgcXVldWVgXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKG9wdHMubG9vcCk7XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnRlZ2VyLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgaXNJbnRlZ2VyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApID09PSBvYmo7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgc3RyYCBlbmRzIHdpdGggYHN1ZmZpeGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICovXG4gIHZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgfTtcblxuICAvKipcbiAgICAqIFR5cGVzIHRoZSBgc3RyYCBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIHZhciB0ID0gZnVuY3Rpb24oaSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgKz0gc3RyW2ldO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgdChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIHQoMCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEZWxldGVzIGBzdHJgIG9yIGBuYCBudW1iZXIgb2YgY2hhcmFjdGVycyBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGFyZyBJZiBgbnVsbGAgb3IgYC0xYCwgZGVsZXRlcyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gLlxuICAgICogRWxzZSBpZiBudW1iZXIsIGRlbGV0ZXMgYGFyZ2AgbnVtYmVyIG9mIGNoYXJhY3RlcnMgZnJvbSBgZWxlbWAuIEVsc2UgZGVsZXRlc1xuICAgICogYGFyZ2AgZnJvbSBgZWxlbWAgaWYgYW5kIG9ubHkgaWYgdGhlIGxhc3Qgc3RyaW5nIHRoYXQgd2FzIHR5cGVkIGVuZHMgd2l0aCBgYXJnYC5cbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZCBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0eXBlIGEgc2luZ2xlIGNoYXJhY3RlclxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgX2RlbGV0ZSA9IGZ1bmN0aW9uKGFyZywgc3BlZWQpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgdmFyIGN1cnIgPSBlbGVtLmlubmVySFRNTDtcbiAgICB2YXIgY291bnQgPSBjdXJyLmxlbmd0aDsgLy8gZGVmYXVsdCB0byBkZWxldGluZyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgdmFyIGQ7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICd1bmRlZmluZWQnICYmIGFyZyAhPT0gbnVsbCkge1xuICAgICAgaWYgKGlzSW50ZWdlcihhcmcpKSB7XG4gICAgICAgIGlmIChhcmcgPiAtMSkge1xuICAgICAgICAgIGNvdW50ID0gYXJnID4gY291bnQgPyBjb3VudCA6IGFyZztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gYXNzdW1lcyBgYXJnYCBpcyBTdHJpbmdcbiAgICAgICAgLy8gZGVsZXRlIGBhcmdgIGZyb20gYGVsZW1gIGlmIHRoZSBsYXN0IHN0cmluZyB0eXBlZCBlbmRzIHdpdGggYGFyZ2BcbiAgICAgICAgaWYgKGVuZHNXaXRoKGN1cnIsIGFyZyArIG9wdHMucG9zdGZpeCkpIHtcbiAgICAgICAgICBjb3VudCA9IGFyZy5sZW5ndGggKyBwb3N0Zml4TGVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIGQgPSBmdW5jdGlvbihjb3VudCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1cnIgPSBlbGVtLmlubmVySFRNTDtcbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBjdXJyLnN1YnN0cmluZygwLCBjdXJyLmxlbmd0aC0xKTsgLy8gZHJvcCBsYXN0IGNoYXJcbiAgICAgICAgICBkKGNvdW50IC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICBkKGNvdW50KTtcbiAgfTtcblxuICAvKipcbiAgICAqIENsZWFycyB0aGUgY29udGVudHMgb2YgYGVsZW1gLlxuICAgICpcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzKCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEbyBub3RoaW5nIGZvciBgZGVsYXlgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgcGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZG9uZSgpO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvKipcbiAgICAqIEludm9rZXMgdGhlIGdpdmVuIGBmbmAsIHBhc3NpbmcgaW4gYGVsZW1gIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2FsbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgZG9uZSgpO1xuICAgIH07XG4gICAgZm4uY2FsbChjYiwgZWxlbSk7XG4gIH07XG5cbiAgLy8gZXhwb3NlIHB1YmxpYyBBUElcbiAgdGhpcy50eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHF1ZXVlKHR5cGUsIHN0ciArIG9wdHMucG9zdGZpeCwgc3BlZWQgfHwgb3B0cy50eXBlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKGFyZywgc3BlZWQpIHtcbiAgICBxdWV1ZShfZGVsZXRlLCBhcmcsIHNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcXVldWUoY2xlYXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICBxdWV1ZShwYXVzZSwgZGVsYXkgfHwgb3B0cy5wYXVzZURlbGF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jYWxsID0gZnVuY3Rpb24oZm4pIHtcbiAgICBxdWV1ZShjYWxsLCBmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBtYWxhcmtleShlbGVtLCBvcHRzIHx8IHt9KTtcbn07XG4iXX0=
(2)
});
