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
  opts.pauseDelay = opts.pauseDelay || 500;
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
    * Call the given `fn` with `elem` as the first argument.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxudmFyIHNlZ3VlID0gZnVuY3Rpb24oY2IpIHtcblxuICBjYiA9IGNiIHx8IGZ1bmN0aW9uKCkge307IC8vIG5vIG9wXG5cbiAgdmFyIHJ1bm5pbmcgPSBmYWxzZTtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciBuZXh0QXJncyA9IFtdO1xuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGVyciA9IGFyZ3Muc2hpZnQoKTsgLy8gYGVycmAgaXMgdGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBgdGhpc2AgY2FsbGJhY2tcbiAgICB2YXIgYXJyO1xuXG4gICAgaWYgKGVycikgeyAvLyBleGl0IG9uIGBlcnJgXG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7IC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gaW4gdGhlIGBxdWV1ZWBcbiAgICAgIGFyciA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoYXJyWzFdKTtcbiAgICAgIGFyclswXS5hcHBseShuZXh0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dEFyZ3MgPSBhcmdzOyAvLyBzYXZlIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBgdGhpc2AgY2FsbGJhY2tcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgfTtcblxuICB2YXIgZW5xdWV1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBmbiA9IGFyZ3Muc2hpZnQoKTtcblxuICAgIGlmICghcXVldWUubGVuZ3RoICYmICFydW5uaW5nKSB7XG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG5leHQsIG5leHRBcmdzLmNvbmNhdChhcmdzKSk7XG4gICAgICBuZXh0QXJncyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWV1ZS5wdXNoKFtmbiwgYXJnc10pO1xuICAgIH1cbiAgICByZXR1cm4gZW5xdWV1ZTtcblxuICB9O1xuXG4gIHJldHVybiBlbnF1ZXVlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBzZWd1ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNlZ3VlID0gcmVxdWlyZSgnc2VndWUnKTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGRlZmF1bHRzXG4gIG9wdHMubG9vcCA9IG9wdHMubG9vcCB8fCBmYWxzZTtcbiAgb3B0cy50eXBlU3BlZWQgPSBvcHRzLnR5cGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5kZWxldGVTcGVlZCA9IG9wdHMuZGVsZXRlU3BlZWQgfHwgNTA7XG4gIG9wdHMucGF1c2VEZWxheSA9IG9wdHMucGF1c2VEZWxheSB8fCA1MDA7XG4gIG9wdHMucG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBjYWNoZSBgcG9zdGZpeGAgbGVuZ3RoXG4gIHZhciBwb3N0Zml4TGVuID0gb3B0cy5wb3N0Zml4Lmxlbmd0aDtcblxuICAvLyBpbml0aWFsaXNlIHRoZSBmdW5jdGlvbiBgcXVldWVgXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKCk7XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnRlZ2VyLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgaXNJbnRlZ2VyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApID09PSBvYmo7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgc3RyYCBlbmRzIHdpdGggYHN1ZmZpeGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICovXG4gIHZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgfTtcblxuICAvKipcbiAgICAqIFR5cGVzIHRoZSBgc3RyYCBhdCB0aGUgZ2l2ZW4gYHNwZWVkYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIHZhciB0ID0gZnVuY3Rpb24oaSkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICAgICAgcXVldWUodHlwZSwgc3RyLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgdCgwKTtcbiAgfTtcblxuICAvKipcbiAgICAqIERlbGV0ZXMgdGhlIGBzdHJgIGF0IHRoZSBnaXZlbiBgc3BlZWRgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgSWYgc3BlY2lmaWVkLCBkZWxldGVzIGBzdHJgIGZyb20gYGVsZW1gIGlmIHRoZSBsYXN0IHN0cmluZ1xuICAgICogdGhhdCB3YXMgdHlwZWQgZW5kcyB3aXRoIGBzdHJgLCBlbHNlIGRlbGV0ZXMgdGhlIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWBcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZCBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0eXBlIGEgc2luZ2xlIGNoYXJhY3RlclxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgX2RlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgdmFyIGN1cnIgPSBlbGVtLmlubmVySFRNTDtcbiAgICB2YXIgY291bnQgPSBjdXJyLmxlbmd0aDsgLy8gZGVmYXVsdCB0byBkZWxldGluZyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgdmFyIGQ7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoaXNJbnRlZ2VyKHN0cikpIHtcbiAgICAgICAgc3BlZWQgPSBzdHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWxldGUgYHN0cmAgZnJvbSBgZWxlbWBcbiAgICAgICAgaWYgKGVuZHNXaXRoKGN1cnIsIHN0ciArIG9wdHMucG9zdGZpeCkpIHtcbiAgICAgICAgICBjb3VudCA9IHN0ci5sZW5ndGggKyBwb3N0Zml4TGVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIGQgPSBmdW5jdGlvbihjb3VudCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gY3Vyci5zdWJzdHJpbmcoMCwgY3Vyci5sZW5ndGgtMSk7IC8vIGRyb3AgbGFzdCBjaGFyXG4gICAgICAgICAgZChjb3VudCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgIHF1ZXVlKF9kZWxldGUsIHN0ciwgc3BlZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIGQoY291bnQpO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2xlYXJzIHRoZSBjb250ZW50cyBvZiBgZWxlbWAuXG4gICAgKlxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBlbGVtLmlubmVySFRNTCA9ICcnO1xuICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgIHF1ZXVlKGNsZWFyKTtcbiAgICB9XG4gICAgdGhpcygpO1xuICB9O1xuXG4gIC8qKlxuICAgICogRG8gbm90aGluZyBmb3IgYGRlbGF5YC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgVGltZSBpbiBtaWxsaXNlY29uZHNcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgIHF1ZXVlKHBhdXNlLCBkZWxheSk7XG4gICAgICB9XG4gICAgICBkb25lKCk7XG4gICAgfSwgZGVsYXkpO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2FsbCB0aGUgZ2l2ZW4gYGZuYCB3aXRoIGBlbGVtYCBhcyB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAgKlxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIGNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgY2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgcXVldWUoY2FsbCwgZm4pO1xuICAgICAgfVxuICAgICAgZG9uZSgpO1xuICAgIH07XG4gICAgZm4uY2FsbChjYiwgZWxlbSk7XG4gIH07XG5cbiAgLy8gZXhwb3NlIHB1YmxpYyBBUElcbiAgdGhpcy50eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHF1ZXVlKHR5cGUsIHN0ciArIG9wdHMucG9zdGZpeCwgc3BlZWQgfHwgb3B0cy50eXBlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcXVldWUoY2xlYXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICBxdWV1ZShwYXVzZSwgZGVsYXkgfHwgb3B0cy5wYXVzZURlbGF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jYWxsID0gZnVuY3Rpb24oZm4pIHtcbiAgICBxdWV1ZShjYWxsLCBmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBtYWxhcmtleShlbGVtLCBvcHRzIHx8IHt9KTtcbn07XG4iXX0=
(2)
});
