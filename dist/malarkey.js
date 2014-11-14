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

},{"segue":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBzZWd1ZSA9IGZ1bmN0aW9uKGNiKSB7XG5cbiAgY2IgPSBjYiB8fCBmdW5jdGlvbigpIHt9OyAvLyBubyBvcFxuXG4gIHZhciBydW5uaW5nID0gZmFsc2U7XG4gIHZhciBxdWV1ZSA9IFtdO1xuICB2YXIgbmV4dEFyZ3MgPSBbXTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBlcnIgPSBhcmdzLnNoaWZ0KCk7IC8vIGBlcnJgIGlzIHRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgYHRoaXNgIGNhbGxiYWNrXG4gICAgdmFyIGFycjtcblxuICAgIGlmIChlcnIpIHsgLy8gZXhpdCBvbiBgZXJyYFxuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkgeyAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBgcXVldWVgXG4gICAgICBhcnIgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KGFyclsxXSk7XG4gICAgICBhcnJbMF0uYXBwbHkobmV4dCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRBcmdzID0gYXJnczsgLy8gc2F2ZSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgYHRoaXNgIGNhbGxiYWNrXG4gICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgdmFyIGVucXVldWUgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZm4gPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCAmJiAhcnVubmluZykge1xuICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICBmbi5hcHBseShuZXh0LCBuZXh0QXJncy5jb25jYXQoYXJncykpO1xuICAgICAgbmV4dEFyZ3MgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVldWUucHVzaChbZm4sIGFyZ3NdKTtcbiAgICB9XG4gICAgcmV0dXJuIGVucXVldWU7XG5cbiAgfTtcblxuICByZXR1cm4gZW5xdWV1ZTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gc2VndWU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWd1ZSA9IHJlcXVpcmUoJ3NlZ3VlJyk7XG5cbnZhciBtYWxhcmtleSA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcblxuICAvLyBzZXQgYG9wdHNgIHRvIGRlZmF1bHRzIGlmIG5lZWRlZFxuICBvcHRzLnNwZWVkID0gb3B0cy5zcGVlZCB8fCA1MDtcbiAgb3B0cy5kZWxheSA9IG9wdHMuZGVsYXkgfHwgNTA7XG4gIG9wdHMubG9vcCA9IG9wdHMubG9vcCB8fCBmYWxzZTtcbiAgb3B0cy5wb3N0Zml4ID0gb3B0cy5wb3N0Zml4IHx8ICcnO1xuXG4gIC8vIGNhY2hlIGBwb3N0Zml4YCBsZW5ndGhcbiAgdmFyIHBvc3RGaXhMZW4gPSBvcHRzLnBvc3RmaXgubGVuZ3RoO1xuXG4gIC8vIGluaXRpYWxpc2UgdGhlIGZ1bmN0aW9uIHF1ZXVlXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKCk7XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnRlZ2VyLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgaXNJbnRlZ2VyID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApID09PSBvYmo7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDaGVjayBpZiBgc3RyYCBlbmRzIHdpdGggYHN1ZmZpeGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICovXG4gIHZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgfTtcblxuICAvKipcbiAgICAqIFR5cGUgdGhlIGBzdHJgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZCBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0eXBlIGEgc2luZ2xlIGNoYXJhY3RlclxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgdHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIGRvbmUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtLmlubmVySFRNTCArPSBzdHJbaV07XG4gICAgICAgIGkgPSBpICsgMTtcbiAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICB0KGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgIHF1ZXVlKHR5cGUsIHN0ciwgc3BlZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIHQoKTtcbiAgfTtcblxuICAvKipcbiAgICAqIERvIG5vdGhpbmcgZm9yIHRoZSBgZGVsYXlgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgcGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgcXVldWUocGF1c2UsIGRlbGF5KTtcbiAgICAgIH1cbiAgICAgIGRvbmUoKTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBJZiBgc3RyYCB3YXMgc2V0LCBkZWxldGUgYHN0cmAgZnJvbSBgZWxlbWAgaWYgdGhlIGBlbGVtYCBlbmRzIHdpdGggYHN0cmAuXG4gICAgKiBFbHNlIGRlbGV0ZSBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZCBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byBkZWxldGUgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBfZGVsZXRlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgIHZhciBjb3VudCA9IGN1cnIubGVuZ3RoOyAvLyBkZWZhdWx0IHRvIGRlbGV0aW5nIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWBcbiAgICB2YXIgZDtcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChpc0ludGVnZXIoc3RyKSkge1xuICAgICAgICBzcGVlZCA9IHN0cjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlbGV0ZSBgc3RyYCBmcm9tIGBlbGVtYFxuICAgICAgICBpZiAoZW5kc1dpdGgoY3Vyciwgc3RyICsgb3B0cy5wb3N0Zml4KSkge1xuICAgICAgICAgIGNvdW50ID0gc3RyLmxlbmd0aCArIHBvc3RGaXhMZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgZG9uZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpOyAvLyBkcm9wIGxhc3QgY2hhclxuICAgICAgICAgIGQoY291bnQgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICBkKGNvdW50KTtcbiAgfTtcblxuICAvKipcbiAgICAqIENsZWFyIHRoZSBjb250ZW50cyBvZiBgZWxlbWAuXG4gICAgKlxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2xlYXIgPSBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGVsZW0uaW5uZXJIVE1MID0gJyc7XG4gICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgIHF1ZXVlKGNsZWFyLCBkdXJhdGlvbik7XG4gICAgICB9XG4gICAgICBkb25lKCk7XG4gICAgfSwgZHVyYXRpb24pO1xuICB9O1xuXG4gIC8vIGV4cG9zZSBwdWJsaWMgQVBJXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZSh0eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMuc3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkIHx8IG9wdHMuc3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICBxdWV1ZShwYXVzZSwgZGVsYXkgfHwgb3B0cy5kZWxheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuY2xlYXIgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHF1ZXVlKGNsZWFyLCBkZWxheSB8fCBvcHRzLmRlbGF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuICByZXR1cm4gbmV3IG1hbGFya2V5KGVsZW0sIG9wdHMgfHwge30pO1xufTtcbiJdfQ==
(2)
});
