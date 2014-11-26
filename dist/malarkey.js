!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.malarkey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var aps = Array.prototype.slice;

var segue = function(cb) {

  cb = cb || function() {}; // no op

  var running = false;
  var queue = [];
  var nextArgs = [];

  var next = function() {

    var args = aps.call(arguments);
    var err = args.shift(); // `err` is the first argument of the `this` callback
    var arr;

    if (err) { // exit on `err`
      return cb(err);
    }

    if (queue.length) { // call the next function in the `queue`
      arr = queue.shift();
      args = args.concat(arr[1]);
      arr[0].apply(next, args);
    } else {
      nextArgs = args; // save the arguments passed to the `this` callback
      running = false;
    }

  };

  var enqueue = function() {

    var args = aps.call(arguments);
    var fn = args.shift();

    if (!queue.length && !running) {
      running = true;
      fn.apply(next, nextArgs.concat(args));
      nextArgs = [];
    } else {
      queue.push([fn, args]);
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

},{"segue":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgc2VndWUgPSBmdW5jdGlvbihjYikge1xuXG4gIGNiID0gY2IgfHwgZnVuY3Rpb24oKSB7fTsgLy8gbm8gb3BcblxuICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIG5leHRBcmdzID0gW107XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZXJyID0gYXJncy5zaGlmdCgpOyAvLyBgZXJyYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgIHZhciBhcnI7XG5cbiAgICBpZiAoZXJyKSB7IC8vIGV4aXQgb24gYGVycmBcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHsgLy8gY2FsbCB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgYHF1ZXVlYFxuICAgICAgYXJyID0gcXVldWUuc2hpZnQoKTtcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChhcnJbMV0pO1xuICAgICAgYXJyWzBdLmFwcGx5KG5leHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0QXJncyA9IGFyZ3M7IC8vIHNhdmUgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICB9O1xuXG4gIHZhciBlbnF1ZXVlID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGZuID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKCFxdWV1ZS5sZW5ndGggJiYgIXJ1bm5pbmcpIHtcbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobmV4dCwgbmV4dEFyZ3MuY29uY2F0KGFyZ3MpKTtcbiAgICAgIG5leHRBcmdzID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXVlLnB1c2goW2ZuLCBhcmdzXSk7XG4gICAgfVxuICAgIHJldHVybiBlbnF1ZXVlO1xuXG4gIH07XG5cbiAgcmV0dXJuIGVucXVldWU7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHNlZ3VlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VndWUgPSByZXF1aXJlKCdzZWd1ZScpO1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gZGVmYXVsdHNcbiAgb3B0cy5sb29wID0gb3B0cy5sb29wIHx8IGZhbHNlO1xuICBvcHRzLnR5cGVTcGVlZCA9IG9wdHMudHlwZVNwZWVkIHx8IDUwO1xuICBvcHRzLmRlbGV0ZVNwZWVkID0gb3B0cy5kZWxldGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5wYXVzZURlbGF5ID0gb3B0cy5wYXVzZURlbGF5IHx8IDIwMDA7XG4gIG9wdHMucG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBjYWNoZSBgcG9zdGZpeGAgbGVuZ3RoXG4gIHZhciBwb3N0Zml4TGVuID0gb3B0cy5wb3N0Zml4Lmxlbmd0aDtcblxuICAvLyBpbml0aWFsaXNlIHRoZSBmdW5jdGlvbiBgcXVldWVgXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKCk7XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnRlZ2VyLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgaXNJbnRlZ2VyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApID09PSBvYmo7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgc3RyYCBlbmRzIHdpdGggYHN1ZmZpeGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICovXG4gIHZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgfTtcblxuICAvKipcbiAgICAqIFR5cGVzIHRoZSBgc3RyYCBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIHZhciB0ID0gZnVuY3Rpb24oaSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgKz0gc3RyW2ldO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgdChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICBxdWV1ZSh0eXBlLCBzdHIsIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICB0KDApO1xuICB9O1xuXG4gIC8qKlxuICAgICogRGVsZXRlcyBgc3RyYCBvciBgbmAgbnVtYmVyIG9mIGNoYXJhY3RlcnMgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBhcmcgSWYgYG51bGxgIG9yIGAtMWAsIGRlbGV0ZXMgZW50aXJlIGNvbnRlbnRzIG9mIGBlbGVtYC5cbiAgICAqIEVsc2UgaWYgbnVtYmVyLCBkZWxldGVzIGBhcmdgIG51bWJlciBvZiBjaGFyYWN0ZXJzIGZyb20gYGVsZW1gLiBFbHNlIGRlbGV0ZXNcbiAgICAqIGBhcmdgIGZyb20gYGVsZW1gIGlmIGFuZCBvbmx5IGlmIHRoZSBsYXN0IHN0cmluZyB0aGF0IHdhcyB0eXBlZCBlbmRzIHdpdGggYGFyZ2AuXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIF9kZWxldGUgPSBmdW5jdGlvbihhcmcsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgdmFyIGNvdW50ID0gY3Vyci5sZW5ndGg7IC8vIGRlZmF1bHQgdG8gZGVsZXRpbmcgZW50aXJlIGNvbnRlbnRzIG9mIGBlbGVtYFxuICAgIHZhciBkO1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgIT09IG51bGwpIHtcbiAgICAgIGlmIChpc0ludGVnZXIoYXJnKSkge1xuICAgICAgICBpZiAoYXJnID4gLTEpIHtcbiAgICAgICAgICBjb3VudCA9IGFyZyA+IGNvdW50ID8gY291bnQgOiBhcmc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIGFzc3VtZXMgYGFyZ2AgaXMgU3RyaW5nXG4gICAgICAgIC8vIGRlbGV0ZSBgYXJnYCBmcm9tIGBlbGVtYCBpZiB0aGUgbGFzdCBzdHJpbmcgdHlwZWQgZW5kcyB3aXRoIGBhcmdgXG4gICAgICAgIGlmIChlbmRzV2l0aChjdXJyLCBhcmcgKyBvcHRzLnBvc3RmaXgpKSB7XG4gICAgICAgICAgY291bnQgPSBhcmcubGVuZ3RoICsgcG9zdGZpeExlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICBkID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gY3Vyci5zdWJzdHJpbmcoMCwgY3Vyci5sZW5ndGgtMSk7IC8vIGRyb3AgbGFzdCBjaGFyXG4gICAgICAgICAgZChjb3VudCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgIHF1ZXVlKF9kZWxldGUsIGFyZywgc3BlZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIGQoY291bnQpO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2xlYXJzIHRoZSBjb250ZW50cyBvZiBgZWxlbWAuXG4gICAgKlxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBlbGVtLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMoKTtcbiAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBxdWV1ZShjbGVhcik7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEbyBub3RoaW5nIGZvciBgZGVsYXlgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgcGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICBxdWV1ZShwYXVzZSwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgZG9uZSgpO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvKipcbiAgICAqIEludm9rZXMgdGhlIGdpdmVuIGBmbmAsIHBhc3NpbmcgaW4gYGVsZW1gIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2FsbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgZG9uZSgpO1xuICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHF1ZXVlKGNhbGwsIGZuKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmbi5jYWxsKGNiLCBlbGVtKTtcbiAgfTtcblxuICAvLyBleHBvc2UgcHVibGljIEFQSVxuICB0aGlzLnR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgcXVldWUodHlwZSwgc3RyICsgb3B0cy5wb3N0Zml4LCBzcGVlZCB8fCBvcHRzLnR5cGVTcGVlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oYXJnLCBzcGVlZCkge1xuICAgIHF1ZXVlKF9kZWxldGUsIGFyZywgc3BlZWQgfHwgb3B0cy5kZWxldGVTcGVlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBxdWV1ZShjbGVhcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMucGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHF1ZXVlKHBhdXNlLCBkZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHF1ZXVlKGNhbGwsIGZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuICByZXR1cm4gbmV3IG1hbGFya2V5KGVsZW0sIG9wdHMgfHwge30pO1xufTtcbiJdfQ==
(2)
});
