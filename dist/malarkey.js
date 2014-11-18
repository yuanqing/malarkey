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
      window.setTimeout(function() {
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
    * Clears the contents of `elem`.
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

  /**
    * Do nothing for `delay`.
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
    * Invokes the given `fn`, passing in `elem` as the first argument.
    *
    * @param {Function} fn
    * @api public
    */
  var call = function(fn) {
    var done = this;
    var cb = function() {
      if (opts.loop) {
        queue(call, fn);
      }
      done();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxudmFyIHNlZ3VlID0gZnVuY3Rpb24oY2IpIHtcblxuICBjYiA9IGNiIHx8IGZ1bmN0aW9uKCkge307IC8vIG5vIG9wXG5cbiAgdmFyIHJ1bm5pbmcgPSBmYWxzZTtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciBuZXh0QXJncyA9IFtdO1xuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGVyciA9IGFyZ3Muc2hpZnQoKTsgLy8gYGVycmAgaXMgdGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBgdGhpc2AgY2FsbGJhY2tcbiAgICB2YXIgYXJyO1xuXG4gICAgaWYgKGVycikgeyAvLyBleGl0IG9uIGBlcnJgXG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7IC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gaW4gdGhlIGBxdWV1ZWBcbiAgICAgIGFyciA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoYXJyWzFdKTtcbiAgICAgIGFyclswXS5hcHBseShuZXh0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dEFyZ3MgPSBhcmdzOyAvLyBzYXZlIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBgdGhpc2AgY2FsbGJhY2tcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgfTtcblxuICB2YXIgZW5xdWV1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBmbiA9IGFyZ3Muc2hpZnQoKTtcblxuICAgIGlmICghcXVldWUubGVuZ3RoICYmICFydW5uaW5nKSB7XG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG5leHQsIG5leHRBcmdzLmNvbmNhdChhcmdzKSk7XG4gICAgICBuZXh0QXJncyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWV1ZS5wdXNoKFtmbiwgYXJnc10pO1xuICAgIH1cbiAgICByZXR1cm4gZW5xdWV1ZTtcblxuICB9O1xuXG4gIHJldHVybiBlbnF1ZXVlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBzZWd1ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNlZ3VlID0gcmVxdWlyZSgnc2VndWUnKTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGRlZmF1bHRzXG4gIG9wdHMubG9vcCA9IG9wdHMubG9vcCB8fCBmYWxzZTtcbiAgb3B0cy50eXBlU3BlZWQgPSBvcHRzLnR5cGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5kZWxldGVTcGVlZCA9IG9wdHMuZGVsZXRlU3BlZWQgfHwgNTA7XG4gIG9wdHMucGF1c2VEZWxheSA9IG9wdHMucGF1c2VEZWxheSB8fCAyMDAwO1xuICBvcHRzLnBvc3RmaXggPSBvcHRzLnBvc3RmaXggfHwgJyc7XG5cbiAgLy8gY2FjaGUgYHBvc3RmaXhgIGxlbmd0aFxuICB2YXIgcG9zdGZpeExlbiA9IG9wdHMucG9zdGZpeC5sZW5ndGg7XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgZnVuY3Rpb24gYHF1ZXVlYFxuICB2YXIgcXVldWUgPSBzZWd1ZSgpO1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW50ZWdlci5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICogQGFwaSBwcml2YXRlXG4gICAgKi9cbiAgdmFyIGlzSW50ZWdlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKSA9PT0gb2JqO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYHN0cmAgZW5kcyB3aXRoIGBzdWZmaXhgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBUeXBlcyB0aGUgYHN0cmAgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHR5cGUgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciB0eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICB2YXIgdCA9IGZ1bmN0aW9uKGkpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtLmlubmVySFRNTCArPSBzdHJbaV07XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICB0KGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgIHF1ZXVlKHR5cGUsIHN0ciwgc3BlZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIHQoMCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEZWxldGVzIHRoZSBgc3RyYCBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIElmIHNwZWNpZmllZCwgZGVsZXRlcyBgc3RyYCBmcm9tIGBlbGVtYCBpZiB0aGUgbGFzdCBzdHJpbmdcbiAgICAqIHRoYXQgd2FzIHR5cGVkIGVuZHMgd2l0aCBgc3RyYCwgZWxzZSBkZWxldGVzIHRoZSBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIF9kZWxldGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgdmFyIGNvdW50ID0gY3Vyci5sZW5ndGg7IC8vIGRlZmF1bHQgdG8gZGVsZXRpbmcgZW50aXJlIGNvbnRlbnRzIG9mIGBlbGVtYFxuICAgIHZhciBkO1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGlzSW50ZWdlcihzdHIpKSB7XG4gICAgICAgIHNwZWVkID0gc3RyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZGVsZXRlIGBzdHJgIGZyb20gYGVsZW1gXG4gICAgICAgIGlmIChlbmRzV2l0aChjdXJyLCBzdHIgKyBvcHRzLnBvc3RmaXgpKSB7XG4gICAgICAgICAgY291bnQgPSBzdHIubGVuZ3RoICsgcG9zdGZpeExlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICBkID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpOyAvLyBkcm9wIGxhc3QgY2hhclxuICAgICAgICAgIGQoY291bnQgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICBkKGNvdW50KTtcbiAgfTtcblxuICAvKipcbiAgICAqIENsZWFycyB0aGUgY29udGVudHMgb2YgYGVsZW1gLlxuICAgICpcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICBxdWV1ZShjbGVhcik7XG4gICAgfVxuICAgIHRoaXMoKTtcbiAgfTtcblxuICAvKipcbiAgICAqIERvIG5vdGhpbmcgZm9yIGBkZWxheWAuXG4gICAgKlxuICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5IFRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBwYXVzZSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICBxdWV1ZShwYXVzZSwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgZG9uZSgpO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvKipcbiAgICAqIEludm9rZXMgdGhlIGdpdmVuIGBmbmAsIHBhc3NpbmcgaW4gYGVsZW1gIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2FsbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICBxdWV1ZShjYWxsLCBmbik7XG4gICAgICB9XG4gICAgICBkb25lKCk7XG4gICAgfTtcbiAgICBmbi5jYWxsKGNiLCBlbGVtKTtcbiAgfTtcblxuICAvLyBleHBvc2UgcHVibGljIEFQSVxuICB0aGlzLnR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgcXVldWUodHlwZSwgc3RyICsgb3B0cy5wb3N0Zml4LCBzcGVlZCB8fCBvcHRzLnR5cGVTcGVlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHF1ZXVlKF9kZWxldGUsIHN0ciwgc3BlZWQgfHwgb3B0cy5kZWxldGVTcGVlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBxdWV1ZShjbGVhcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMucGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHF1ZXVlKHBhdXNlLCBkZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHF1ZXVlKGNhbGwsIGZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuICByZXR1cm4gbmV3IG1hbGFya2V5KGVsZW0sIG9wdHMgfHwge30pO1xufTtcbiJdfQ==
(2)
});
