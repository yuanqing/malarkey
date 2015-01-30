!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.malarkey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var segue = _dereq_('segue');

/**
  * Check if `str` ends with the `suffix`.
  *
  * @param {String} str
  * @param {String} suffix
  * @return {Boolean}
  * @api private
  */
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

},{"segue":2}],2:[function(_dereq_,module,exports){
(function(fn) {
  /* istanbul ignore if  */
  if (typeof module === 'undefined') {
    this.segue = fn;
  } else {
    module.exports = fn;
  }
})(function(cb, opts) {

  'use strict';

  var slice = [].slice;

  // both `cb` and `opts` are optional
  if (typeof cb !== 'function') {
    opts = cb;
    cb = function() {};
  }

  // only repeat if `opts.repeat` is `true`
  var repeat = opts && opts.repeat === true;

  var fns = []; // store the enqueued functions
  var args = []; // store the arguments for the enqueued functions
  var i = 0; // index of the currently running function
  var running = false; // true if a function running
  var prevErr = false; // truthy if an error has occurred

  var next = function(err) {

    // cache the array length
    var len = fns.length;

    // wraparound if repeating
    if (repeat) {
      i = i % len;
    }

    // call the `cb` on error, or if there are no more functions to run
    if (err || i === len) {
      running = false;
      prevErr = err;
      return cb(err);
    }

    // call the current `fn`, passing it the arguments in `args`
    fns[i].apply(null, [].concat(next, args[i++]));

  };

  return function segue(fn) {

    // an error has already occurred; call the `cb` with the `prevErr`
    if (prevErr) {
      return cb(prevErr);
    }

    // store `fn` and its arguments
    fns.push(fn);
    args.push(slice.call(arguments, 1));

    // call the next function in the queue if no functions are currently running
    if (!running) {
      running = true;
      // call the next function only after all other functions have been enqueued
      setTimeout(function() {
        next();
      }, 0);
    }

    return segue;

  };

});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9tYWxhcmtleS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvaW5kZXguanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL3NlZ3VlL3NlZ3VlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWd1ZSA9IHJlcXVpcmUoJ3NlZ3VlJyk7XG5cbi8qKlxuICAqIENoZWNrIGlmIGBzdHJgIGVuZHMgd2l0aCB0aGUgYHN1ZmZpeGAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICogQGFwaSBwcml2YXRlXG4gICovXG52YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICByZXR1cm4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xufTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGFsbG93IGBtYWxhcmtleWAgdG8gYmUgY2FsbGVkIHdpdGhvdXQgdGhlIGBuZXdgIGtleXdvcmRcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIG1hbGFya2V5KSkge1xuICAgIHJldHVybiBuZXcgbWFsYXJrZXkoZWxlbSwgb3B0cyB8fCB7fSk7XG4gIH1cblxuICAvLyBkZWZhdWx0IGBvcHRzYFxuICBvcHRzLmxvb3AgPSBvcHRzLmxvb3AgfHwgZmFsc2U7XG4gIG9wdHMudHlwZVNwZWVkID0gb3B0cy5zcGVlZCB8fCBvcHRzLnR5cGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5kZWxldGVTcGVlZCA9IG9wdHMuc3BlZWQgfHwgb3B0cy5kZWxldGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5wYXVzZURlbGF5ID0gb3B0cy5kZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkgfHwgMjAwMDtcbiAgb3B0cy5wb3N0Zml4ID0gb3B0cy5wb3N0Zml4IHx8ICcnO1xuXG4gIC8vIGluaXRpYWxpc2UgdGhlIGZ1bmN0aW9uIHF1ZXVlXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKHsgcmVwZWF0OiBvcHRzLmxvb3AgfSk7XG5cbiAgLy8gaW50ZXJuYWwgZnVuY3Rpb25zIHRoYXQgYXJlIGFkZGVkIGludG8gYHF1ZXVlYCB2aWEgcHVibGljIG1ldGhvZHNcbiAgdmFyIF90eXBlID0gZnVuY3Rpb24oZG9uZSwgc3RyLCBzcGVlZCkge1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIChmdW5jdGlvbiB0KGkpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfSkoMCk7XG4gIH07XG4gIHZhciBfZGVsZXRlID0gZnVuY3Rpb24oZG9uZSwgeCwgc3BlZWQpIHtcbiAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgIHZhciBjb3VudCA9IGN1cnIubGVuZ3RoOyAvLyBkZWZhdWx0IHRvIGRlbGV0aW5nIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWBcbiAgICBpZiAoeCAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGRlbGV0ZSBgeGAgZnJvbSBgZWxlbWAgaWYgdGhlIGxhc3Qgc3RyaW5nIHR5cGVkIGVuZHMgd2l0aCBgeGBcbiAgICAgICAgaWYgKGVuZHNXaXRoKGN1cnIsIHggKyBvcHRzLnBvc3RmaXgpKSB7XG4gICAgICAgICAgY291bnQgPSB4Lmxlbmd0aCArIG9wdHMucG9zdGZpeC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBhc3N1bWUgYHhgIGlzIGFuIGludGVnZXJcbiAgICAgICAgaWYgKHggPiAtMSkge1xuICAgICAgICAgIGNvdW50ID0gTWF0aC5taW4oeCwgY291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICB9XG4gICAgKGZ1bmN0aW9uIGQoY291bnQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gY3Vyci5zdWJzdHJpbmcoMCwgY3Vyci5sZW5ndGgtMSk7IC8vIGRyb3AgbGFzdCBjaGFyXG4gICAgICAgICAgZChjb3VudCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH0pKGNvdW50KTtcbiAgfTtcbiAgdmFyIF9jbGVhciA9IGZ1bmN0aW9uKGRvbmUpIHtcbiAgICBlbGVtLmlubmVySFRNTCA9ICcnO1xuICAgIGRvbmUoKTtcbiAgfTtcbiAgdmFyIF9wYXVzZSA9IGZ1bmN0aW9uKGRvbmUsIGRlbGF5KSB7XG4gICAgc2V0VGltZW91dChkb25lLCBkZWxheSk7XG4gIH07XG4gIHZhciBfY2FsbCA9IGZ1bmN0aW9uKGRvbmUsIGZuKSB7XG4gICAgZm4uY2FsbChkb25lLCBlbGVtKTtcbiAgfTtcblxuICAvKipcbiAgICAqIFR5cGVzIHRoZSBgc3RyYCBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdGhpcy50eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHF1ZXVlKF90eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMudHlwZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICAqIERlbGV0ZXMgY2hhcmFjdGVycyBmcm9tIGBlbGVtYCAob25lIGNoYXJhY3RlciBhdCBhIHRpbWUpIGF0IHRoZVxuICAgICogZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHggSWYgYG51bGxgIG9yIGAtMWAsIGRlbGV0ZXMgdGhlIGNvbnRlbnRzIG9mXG4gICAgKiBgZWxlbWAuIElmIGEgc3RyaW5nLCBkZWxldGVzIHRoZSBzdHJpbmcgaWYgYW5kIG9ubHkgaWYgYGVsZW1gIGVuZHMgd2l0aFxuICAgICogc2FpZCBzdHJpbmcuIEVsc2UgaWYgYW4gaW50ZWdlciwgZGVsZXRlcyB0aGF0IG1hbnkgY2hhcmFjdGVycyBmcm9tIHRoZVxuICAgICogYGVsZW1gLlxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIGRlbGV0ZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbih4LCBzcGVlZCkge1xuICAgIHF1ZXVlKF9kZWxldGUsIHgsIHNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2xlYXIgdGhlIGNvbnRlbnRzIG9mIGBlbGVtYC5cbiAgICAqXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHRoaXMuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBxdWV1ZShfY2xlYXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgICogRG8gbm90aGluZyBmb3IgYGRlbGF5YC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgVGltZSBpbiBtaWxsaXNlY29uZHNcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgcXVldWUoX3BhdXNlLCBkZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgICogSW52b2tlIHRoZSBnaXZlbiBgZm5gLCBwYXNzaW5nIGl0IGBlbGVtYCBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAgKlxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gSW52b2tlIGB0aGlzYCB3aXRoaW4gdGhpcyBmdW5jdGlvbiB0byBzaWduYWwgdGhhdCBpdFxuICAgICogaGFzIGZpbmlzaGVkIGV4ZWN1dGlvbi5cbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdGhpcy5jYWxsID0gZnVuY3Rpb24oZm4pIHtcbiAgICBxdWV1ZShfY2FsbCwgZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hbGFya2V5O1xuIiwiKGZ1bmN0aW9uKGZuKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5zZWd1ZSA9IGZuO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZm47XG4gIH1cbn0pKGZ1bmN0aW9uKGNiLCBvcHRzKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIC8vIGJvdGggYGNiYCBhbmQgYG9wdHNgIGFyZSBvcHRpb25hbFxuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IGNiO1xuICAgIGNiID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxuXG4gIC8vIG9ubHkgcmVwZWF0IGlmIGBvcHRzLnJlcGVhdGAgaXMgYHRydWVgXG4gIHZhciByZXBlYXQgPSBvcHRzICYmIG9wdHMucmVwZWF0ID09PSB0cnVlO1xuXG4gIHZhciBmbnMgPSBbXTsgLy8gc3RvcmUgdGhlIGVucXVldWVkIGZ1bmN0aW9uc1xuICB2YXIgYXJncyA9IFtdOyAvLyBzdG9yZSB0aGUgYXJndW1lbnRzIGZvciB0aGUgZW5xdWV1ZWQgZnVuY3Rpb25zXG4gIHZhciBpID0gMDsgLy8gaW5kZXggb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nIGZ1bmN0aW9uXG4gIHZhciBydW5uaW5nID0gZmFsc2U7IC8vIHRydWUgaWYgYSBmdW5jdGlvbiBydW5uaW5nXG4gIHZhciBwcmV2RXJyID0gZmFsc2U7IC8vIHRydXRoeSBpZiBhbiBlcnJvciBoYXMgb2NjdXJyZWRcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVycikge1xuXG4gICAgLy8gY2FjaGUgdGhlIGFycmF5IGxlbmd0aFxuICAgIHZhciBsZW4gPSBmbnMubGVuZ3RoO1xuXG4gICAgLy8gd3JhcGFyb3VuZCBpZiByZXBlYXRpbmdcbiAgICBpZiAocmVwZWF0KSB7XG4gICAgICBpID0gaSAlIGxlbjtcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBgY2JgIG9uIGVycm9yLCBvciBpZiB0aGVyZSBhcmUgbm8gbW9yZSBmdW5jdGlvbnMgdG8gcnVuXG4gICAgaWYgKGVyciB8fCBpID09PSBsZW4pIHtcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHByZXZFcnIgPSBlcnI7XG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBjdXJyZW50IGBmbmAsIHBhc3NpbmcgaXQgdGhlIGFyZ3VtZW50cyBpbiBgYXJnc2BcbiAgICBmbnNbaV0uYXBwbHkobnVsbCwgW10uY29uY2F0KG5leHQsIGFyZ3NbaSsrXSkpO1xuXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHNlZ3VlKGZuKSB7XG5cbiAgICAvLyBhbiBlcnJvciBoYXMgYWxyZWFkeSBvY2N1cnJlZDsgY2FsbCB0aGUgYGNiYCB3aXRoIHRoZSBgcHJldkVycmBcbiAgICBpZiAocHJldkVycikge1xuICAgICAgcmV0dXJuIGNiKHByZXZFcnIpO1xuICAgIH1cblxuICAgIC8vIHN0b3JlIGBmbmAgYW5kIGl0cyBhcmd1bWVudHNcbiAgICBmbnMucHVzaChmbik7XG4gICAgYXJncy5wdXNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG5cbiAgICAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBxdWV1ZSBpZiBubyBmdW5jdGlvbnMgYXJlIGN1cnJlbnRseSBydW5uaW5nXG4gICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gb25seSBhZnRlciBhbGwgb3RoZXIgZnVuY3Rpb25zIGhhdmUgYmVlbiBlbnF1ZXVlZFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ3VlO1xuXG4gIH07XG5cbn0pO1xuIl19
(1)
});
