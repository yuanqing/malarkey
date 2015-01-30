!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.malarkey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var segue = _dereq_('segue');

var malarkey = function(elem, opts) {

  // defaults
  opts.loop = opts.loop || false;
  opts.typeSpeed = opts.speed || opts.typeSpeed || 50;
  opts.deleteSpeed = opts.speed || opts.deleteSpeed || 50;
  opts.pauseDelay = opts.delay || opts.pauseDelay || 2000;
  opts.postfix = opts.postfix || '';

  // cache `postfix` length
  var postfixLen = opts.postfix.length;

  // initialise the function `queue`
  var queue = segue({ repeat: opts.loop });

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
  var type = function(done, str, speed) {
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
  var _delete = function(done, arg, speed) {
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
  var clear = function(done) {
    elem.innerHTML = '';
    done();
  };

  /**
    * Do nothing for `delay`.
    *
    * @param {Number} delay Time in milliseconds
    * @api public
    */
  var pause = function(done, delay) {
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
  var call = function(done, fn) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9tYWxhcmtleS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvaW5kZXguanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL3NlZ3VlL3NlZ3VlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNlZ3VlID0gcmVxdWlyZSgnc2VndWUnKTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGRlZmF1bHRzXG4gIG9wdHMubG9vcCA9IG9wdHMubG9vcCB8fCBmYWxzZTtcbiAgb3B0cy50eXBlU3BlZWQgPSBvcHRzLnNwZWVkIHx8IG9wdHMudHlwZVNwZWVkIHx8IDUwO1xuICBvcHRzLmRlbGV0ZVNwZWVkID0gb3B0cy5zcGVlZCB8fCBvcHRzLmRlbGV0ZVNwZWVkIHx8IDUwO1xuICBvcHRzLnBhdXNlRGVsYXkgPSBvcHRzLmRlbGF5IHx8IG9wdHMucGF1c2VEZWxheSB8fCAyMDAwO1xuICBvcHRzLnBvc3RmaXggPSBvcHRzLnBvc3RmaXggfHwgJyc7XG5cbiAgLy8gY2FjaGUgYHBvc3RmaXhgIGxlbmd0aFxuICB2YXIgcG9zdGZpeExlbiA9IG9wdHMucG9zdGZpeC5sZW5ndGg7XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgZnVuY3Rpb24gYHF1ZXVlYFxuICB2YXIgcXVldWUgPSBzZWd1ZSh7IHJlcGVhdDogb3B0cy5sb29wIH0pO1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW50ZWdlci5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICogQGFwaSBwcml2YXRlXG4gICAgKi9cbiAgdmFyIGlzSW50ZWdlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKSA9PT0gb2JqO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYHN0cmAgZW5kcyB3aXRoIGBzdWZmaXhgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBUeXBlcyB0aGUgYHN0cmAgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHR5cGUgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciB0eXBlID0gZnVuY3Rpb24oZG9uZSwgc3RyLCBzcGVlZCkge1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIHZhciB0ID0gZnVuY3Rpb24oaSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgKz0gc3RyW2ldO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgdChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIHQoMCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEZWxldGVzIGBzdHJgIG9yIGBuYCBudW1iZXIgb2YgY2hhcmFjdGVycyBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGFyZyBJZiBgbnVsbGAgb3IgYC0xYCwgZGVsZXRlcyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gLlxuICAgICogRWxzZSBpZiBudW1iZXIsIGRlbGV0ZXMgYGFyZ2AgbnVtYmVyIG9mIGNoYXJhY3RlcnMgZnJvbSBgZWxlbWAuIEVsc2UgZGVsZXRlc1xuICAgICogYGFyZ2AgZnJvbSBgZWxlbWAgaWYgYW5kIG9ubHkgaWYgdGhlIGxhc3Qgc3RyaW5nIHRoYXQgd2FzIHR5cGVkIGVuZHMgd2l0aCBgYXJnYC5cbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZCBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0eXBlIGEgc2luZ2xlIGNoYXJhY3RlclxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgX2RlbGV0ZSA9IGZ1bmN0aW9uKGRvbmUsIGFyZywgc3BlZWQpIHtcbiAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgIHZhciBjb3VudCA9IGN1cnIubGVuZ3RoOyAvLyBkZWZhdWx0IHRvIGRlbGV0aW5nIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWBcbiAgICB2YXIgZDtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnICE9PSBudWxsKSB7XG4gICAgICBpZiAoaXNJbnRlZ2VyKGFyZykpIHtcbiAgICAgICAgaWYgKGFyZyA+IC0xKSB7XG4gICAgICAgICAgY291bnQgPSBhcmcgPiBjb3VudCA/IGNvdW50IDogYXJnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBhc3N1bWVzIGBhcmdgIGlzIFN0cmluZ1xuICAgICAgICAvLyBkZWxldGUgYGFyZ2AgZnJvbSBgZWxlbWAgaWYgdGhlIGxhc3Qgc3RyaW5nIHR5cGVkIGVuZHMgd2l0aCBgYXJnYFxuICAgICAgICBpZiAoZW5kc1dpdGgoY3VyciwgYXJnICsgb3B0cy5wb3N0Zml4KSkge1xuICAgICAgICAgIGNvdW50ID0gYXJnLmxlbmd0aCArIHBvc3RmaXhMZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICB9XG4gICAgZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpOyAvLyBkcm9wIGxhc3QgY2hhclxuICAgICAgICAgIGQoY291bnQgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIGQoY291bnQpO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2xlYXJzIHRoZSBjb250ZW50cyBvZiBgZWxlbWAuXG4gICAgKlxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2xlYXIgPSBmdW5jdGlvbihkb25lKSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICBkb25lKCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEbyBub3RoaW5nIGZvciBgZGVsYXlgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgcGF1c2UgPSBmdW5jdGlvbihkb25lLCBkZWxheSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBkb25lKCk7XG4gICAgfSwgZGVsYXkpO1xuICB9O1xuXG4gIC8qKlxuICAgICogSW52b2tlcyB0aGUgZ2l2ZW4gYGZuYCwgcGFzc2luZyBpbiBgZWxlbWAgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICAgICpcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBjYWxsID0gZnVuY3Rpb24oZG9uZSwgZm4pIHtcbiAgICB2YXIgY2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuICAgIGZuLmNhbGwoY2IsIGVsZW0pO1xuICB9O1xuXG4gIC8vIGV4cG9zZSBwdWJsaWMgQVBJXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZSh0eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMudHlwZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbihhcmcsIHNwZWVkKSB7XG4gICAgcXVldWUoX2RlbGV0ZSwgYXJnLCBzcGVlZCB8fCBvcHRzLmRlbGV0ZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXVlKGNsZWFyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgcXVldWUocGF1c2UsIGRlbGF5IHx8IG9wdHMucGF1c2VEZWxheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcXVldWUoY2FsbCwgZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG4gIHJldHVybiBuZXcgbWFsYXJrZXkoZWxlbSwgb3B0cyB8fCB7fSk7XG59O1xuIiwiKGZ1bmN0aW9uKGZuKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5zZWd1ZSA9IGZuO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZm47XG4gIH1cbn0pKGZ1bmN0aW9uKGNiLCBvcHRzKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIC8vIGJvdGggYGNiYCBhbmQgYG9wdHNgIGFyZSBvcHRpb25hbFxuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IGNiO1xuICAgIGNiID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxuXG4gIC8vIG9ubHkgcmVwZWF0IGlmIGBvcHRzLnJlcGVhdGAgaXMgYHRydWVgXG4gIHZhciByZXBlYXQgPSBvcHRzICYmIG9wdHMucmVwZWF0ID09PSB0cnVlO1xuXG4gIHZhciBmbnMgPSBbXTsgLy8gc3RvcmUgdGhlIGVucXVldWVkIGZ1bmN0aW9uc1xuICB2YXIgYXJncyA9IFtdOyAvLyBzdG9yZSB0aGUgYXJndW1lbnRzIGZvciB0aGUgZW5xdWV1ZWQgZnVuY3Rpb25zXG4gIHZhciBpID0gMDsgLy8gaW5kZXggb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nIGZ1bmN0aW9uXG4gIHZhciBydW5uaW5nID0gZmFsc2U7IC8vIHRydWUgaWYgYSBmdW5jdGlvbiBydW5uaW5nXG4gIHZhciBwcmV2RXJyID0gZmFsc2U7IC8vIHRydXRoeSBpZiBhbiBlcnJvciBoYXMgb2NjdXJyZWRcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVycikge1xuXG4gICAgLy8gY2FjaGUgdGhlIGFycmF5IGxlbmd0aFxuICAgIHZhciBsZW4gPSBmbnMubGVuZ3RoO1xuXG4gICAgLy8gd3JhcGFyb3VuZCBpZiByZXBlYXRpbmdcbiAgICBpZiAocmVwZWF0KSB7XG4gICAgICBpID0gaSAlIGxlbjtcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBgY2JgIG9uIGVycm9yLCBvciBpZiB0aGVyZSBhcmUgbm8gbW9yZSBmdW5jdGlvbnMgdG8gcnVuXG4gICAgaWYgKGVyciB8fCBpID09PSBsZW4pIHtcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHByZXZFcnIgPSBlcnI7XG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBjdXJyZW50IGBmbmAsIHBhc3NpbmcgaXQgdGhlIGFyZ3VtZW50cyBpbiBgYXJnc2BcbiAgICBmbnNbaV0uYXBwbHkobnVsbCwgW10uY29uY2F0KG5leHQsIGFyZ3NbaSsrXSkpO1xuXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHNlZ3VlKGZuKSB7XG5cbiAgICAvLyBhbiBlcnJvciBoYXMgYWxyZWFkeSBvY2N1cnJlZDsgY2FsbCB0aGUgYGNiYCB3aXRoIHRoZSBgcHJldkVycmBcbiAgICBpZiAocHJldkVycikge1xuICAgICAgcmV0dXJuIGNiKHByZXZFcnIpO1xuICAgIH1cblxuICAgIC8vIHN0b3JlIGBmbmAgYW5kIGl0cyBhcmd1bWVudHNcbiAgICBmbnMucHVzaChmbik7XG4gICAgYXJncy5wdXNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG5cbiAgICAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBxdWV1ZSBpZiBubyBmdW5jdGlvbnMgYXJlIGN1cnJlbnRseSBydW5uaW5nXG4gICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gb25seSBhZnRlciBhbGwgb3RoZXIgZnVuY3Rpb25zIGhhdmUgYmVlbiBlbnF1ZXVlZFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ3VlO1xuXG4gIH07XG5cbn0pO1xuIl19
(1)
});
