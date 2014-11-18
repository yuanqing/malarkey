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
    * Deletes the `str` at the given `speed`.
    *
    * @param {String} str If specified, deletes `str` from `elem` if the last string
    * that was typed ends with `str`, else deletes the entire contents of `elem`
    * @param {Number} speed Time in milliseconds to type a single character
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
          count = str.length + postfixLen;
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
            queue(_delete, str, speed);
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
  this.delete = function(str, speed) {
    queue(_delete, str, speed || opts.deleteSpeed);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgc2VndWUgPSBmdW5jdGlvbihjYikge1xuXG4gIGNiID0gY2IgfHwgZnVuY3Rpb24oKSB7fTsgLy8gbm8gb3BcblxuICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIG5leHRBcmdzID0gW107XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZXJyID0gYXJncy5zaGlmdCgpOyAvLyBgZXJyYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgIHZhciBhcnI7XG5cbiAgICBpZiAoZXJyKSB7IC8vIGV4aXQgb24gYGVycmBcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHsgLy8gY2FsbCB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgYHF1ZXVlYFxuICAgICAgYXJyID0gcXVldWUuc2hpZnQoKTtcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChhcnJbMV0pO1xuICAgICAgYXJyWzBdLmFwcGx5KG5leHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0QXJncyA9IGFyZ3M7IC8vIHNhdmUgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICB9O1xuXG4gIHZhciBlbnF1ZXVlID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGZuID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKCFxdWV1ZS5sZW5ndGggJiYgIXJ1bm5pbmcpIHtcbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobmV4dCwgbmV4dEFyZ3MuY29uY2F0KGFyZ3MpKTtcbiAgICAgIG5leHRBcmdzID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXVlLnB1c2goW2ZuLCBhcmdzXSk7XG4gICAgfVxuICAgIHJldHVybiBlbnF1ZXVlO1xuXG4gIH07XG5cbiAgcmV0dXJuIGVucXVldWU7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHNlZ3VlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VndWUgPSByZXF1aXJlKCdzZWd1ZScpO1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gZGVmYXVsdHNcbiAgb3B0cy5sb29wID0gb3B0cy5sb29wIHx8IGZhbHNlO1xuICBvcHRzLnR5cGVTcGVlZCA9IG9wdHMudHlwZVNwZWVkIHx8IDUwO1xuICBvcHRzLmRlbGV0ZVNwZWVkID0gb3B0cy5kZWxldGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5wYXVzZURlbGF5ID0gb3B0cy5wYXVzZURlbGF5IHx8IDIwMDA7XG4gIG9wdHMucG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBjYWNoZSBgcG9zdGZpeGAgbGVuZ3RoXG4gIHZhciBwb3N0Zml4TGVuID0gb3B0cy5wb3N0Zml4Lmxlbmd0aDtcblxuICAvLyBpbml0aWFsaXNlIHRoZSBmdW5jdGlvbiBgcXVldWVgXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKCk7XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnRlZ2VyLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgaXNJbnRlZ2VyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApID09PSBvYmo7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgc3RyYCBlbmRzIHdpdGggYHN1ZmZpeGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICovXG4gIHZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgfTtcblxuICAvKipcbiAgICAqIFR5cGVzIHRoZSBgc3RyYCBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIHZhciB0ID0gZnVuY3Rpb24oaSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgKz0gc3RyW2ldO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgdChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICBxdWV1ZSh0eXBlLCBzdHIsIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICB0KDApO1xuICB9O1xuXG4gIC8qKlxuICAgICogRGVsZXRlcyB0aGUgYHN0cmAgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBJZiBzcGVjaWZpZWQsIGRlbGV0ZXMgYHN0cmAgZnJvbSBgZWxlbWAgaWYgdGhlIGxhc3Qgc3RyaW5nXG4gICAgKiB0aGF0IHdhcyB0eXBlZCBlbmRzIHdpdGggYHN0cmAsIGVsc2UgZGVsZXRlcyB0aGUgZW50aXJlIGNvbnRlbnRzIG9mIGBlbGVtYFxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHR5cGUgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBfZGVsZXRlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgIHZhciBjb3VudCA9IGN1cnIubGVuZ3RoOyAvLyBkZWZhdWx0IHRvIGRlbGV0aW5nIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWBcbiAgICB2YXIgZDtcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChpc0ludGVnZXIoc3RyKSkge1xuICAgICAgICBzcGVlZCA9IHN0cjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlbGV0ZSBgc3RyYCBmcm9tIGBlbGVtYFxuICAgICAgICBpZiAoZW5kc1dpdGgoY3Vyciwgc3RyICsgb3B0cy5wb3N0Zml4KSkge1xuICAgICAgICAgIGNvdW50ID0gc3RyLmxlbmd0aCArIHBvc3RmaXhMZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICB9XG4gICAgZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpOyAvLyBkcm9wIGxhc3QgY2hhclxuICAgICAgICAgIGQoY291bnQgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICBkKGNvdW50KTtcbiAgfTtcblxuICAvKipcbiAgICAqIENsZWFycyB0aGUgY29udGVudHMgb2YgYGVsZW1gLlxuICAgICpcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzKCk7XG4gICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcXVldWUoY2xlYXIpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgICogRG8gbm90aGluZyBmb3IgYGRlbGF5YC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgVGltZSBpbiBtaWxsaXNlY29uZHNcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgcXVldWUocGF1c2UsIGRlbGF5KTtcbiAgICAgIH1cbiAgICAgIGRvbmUoKTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBJbnZva2VzIHRoZSBnaXZlbiBgZm5gLCBwYXNzaW5nIGluIGBlbGVtYCBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAgKlxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIGNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgY2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGRvbmUoKTtcbiAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBxdWV1ZShjYWxsLCBmbik7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH07XG4gICAgZm4uY2FsbChjYiwgZWxlbSk7XG4gIH07XG5cbiAgLy8gZXhwb3NlIHB1YmxpYyBBUElcbiAgdGhpcy50eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHF1ZXVlKHR5cGUsIHN0ciArIG9wdHMucG9zdGZpeCwgc3BlZWQgfHwgb3B0cy50eXBlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcXVldWUoY2xlYXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICBxdWV1ZShwYXVzZSwgZGVsYXkgfHwgb3B0cy5wYXVzZURlbGF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jYWxsID0gZnVuY3Rpb24oZm4pIHtcbiAgICBxdWV1ZShjYWxsLCBmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBtYWxhcmtleShlbGVtLCBvcHRzIHx8IHt9KTtcbn07XG4iXX0=
(2)
});
