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
  opts.speed = opts.speed || 50;
  opts.delay = opts.delay || 50;
  opts.loop = opts.loop || false;
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
    * Deletes the `str` at the given `speed`.
    *
    * @param {String} str If specified, deletes `str` from `elem` if and only if
    * the last string that was typed ends with `str`, else deletes the entire
    * contents of `elem`
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
    * Clears the contents of `elem`.
    *
    * @api public
    */
  var clear = function() {
    elem.innerHTML = '';
    if (opts.loop) {
      queue(clear);
    }
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
  this.clear = function() {
    queue(clear);
    return this;
  };
  this.call = function(fn) {
    queue(fn, elem);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts || {});
};

},{"segue":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxudmFyIHNlZ3VlID0gZnVuY3Rpb24oY2IpIHtcblxuICBjYiA9IGNiIHx8IGZ1bmN0aW9uKCkge307IC8vIG5vIG9wXG5cbiAgdmFyIHJ1bm5pbmcgPSBmYWxzZTtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciBuZXh0QXJncyA9IFtdO1xuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGVyciA9IGFyZ3Muc2hpZnQoKTsgLy8gYGVycmAgaXMgdGhlIGZpcnN0IGFyZ3VtZW50IG9mIHRoZSBgdGhpc2AgY2FsbGJhY2tcbiAgICB2YXIgYXJyO1xuXG4gICAgaWYgKGVycikgeyAvLyBleGl0IG9uIGBlcnJgXG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7IC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gaW4gdGhlIGBxdWV1ZWBcbiAgICAgIGFyciA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoYXJyWzFdKTtcbiAgICAgIGFyclswXS5hcHBseShuZXh0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dEFyZ3MgPSBhcmdzOyAvLyBzYXZlIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBgdGhpc2AgY2FsbGJhY2tcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgfTtcblxuICB2YXIgZW5xdWV1ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBmbiA9IGFyZ3Muc2hpZnQoKTtcblxuICAgIGlmICghcXVldWUubGVuZ3RoICYmICFydW5uaW5nKSB7XG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG5leHQsIG5leHRBcmdzLmNvbmNhdChhcmdzKSk7XG4gICAgICBuZXh0QXJncyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWV1ZS5wdXNoKFtmbiwgYXJnc10pO1xuICAgIH1cbiAgICByZXR1cm4gZW5xdWV1ZTtcblxuICB9O1xuXG4gIHJldHVybiBlbnF1ZXVlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBzZWd1ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNlZ3VlID0gcmVxdWlyZSgnc2VndWUnKTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGRlZmF1bHRzXG4gIG9wdHMuc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDUwO1xuICBvcHRzLmRlbGF5ID0gb3B0cy5kZWxheSB8fCA1MDtcbiAgb3B0cy5sb29wID0gb3B0cy5sb29wIHx8IGZhbHNlO1xuICBvcHRzLnBvc3RmaXggPSBvcHRzLnBvc3RmaXggfHwgJyc7XG5cbiAgLy8gY2FjaGUgYHBvc3RmaXhgIGxlbmd0aFxuICB2YXIgcG9zdGZpeExlbiA9IG9wdHMucG9zdGZpeC5sZW5ndGg7XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgZnVuY3Rpb24gYHF1ZXVlYFxuICB2YXIgcXVldWUgPSBzZWd1ZSgpO1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW50ZWdlci5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICogQGFwaSBwcml2YXRlXG4gICAgKi9cbiAgdmFyIGlzSW50ZWdlciA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKSA9PT0gb2JqO1xuICB9O1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYHN0cmAgZW5kcyB3aXRoIGBzdWZmaXhgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBUeXBlcyB0aGUgYHN0cmAgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIHR5cGUgYSBzaW5nbGUgY2hhcmFjdGVyXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciB0eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgZG9uZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSA9IGkgKyAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICAgICAgcXVldWUodHlwZSwgc3RyLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgdCgpO1xuICB9O1xuXG4gIC8qKlxuICAgICogRGVsZXRlcyB0aGUgYHN0cmAgYXQgdGhlIGdpdmVuIGBzcGVlZGAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBJZiBzcGVjaWZpZWQsIGRlbGV0ZXMgYHN0cmAgZnJvbSBgZWxlbWAgaWYgYW5kIG9ubHkgaWZcbiAgICAqIHRoZSBsYXN0IHN0cmluZyB0aGF0IHdhcyB0eXBlZCBlbmRzIHdpdGggYHN0cmAsIGVsc2UgZGVsZXRlcyB0aGUgZW50aXJlXG4gICAgKiBjb250ZW50cyBvZiBgZWxlbWBcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZCBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byB0eXBlIGEgc2luZ2xlIGNoYXJhY3RlclxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgX2RlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICB2YXIgZG9uZSA9IHRoaXM7XG4gICAgdmFyIGN1cnIgPSBlbGVtLmlubmVySFRNTDtcbiAgICB2YXIgY291bnQgPSBjdXJyLmxlbmd0aDsgLy8gZGVmYXVsdCB0byBkZWxldGluZyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgdmFyIGQ7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoaXNJbnRlZ2VyKHN0cikpIHtcbiAgICAgICAgc3BlZWQgPSBzdHI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWxldGUgYHN0cmAgZnJvbSBgZWxlbWBcbiAgICAgICAgaWYgKGVuZHNXaXRoKGN1cnIsIHN0ciArIG9wdHMucG9zdGZpeCkpIHtcbiAgICAgICAgICBjb3VudCA9IHN0ci5sZW5ndGggKyBwb3N0Zml4TGVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIGRvbmUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1cnIgPSBlbGVtLmlubmVySFRNTDtcbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBjdXJyLnN1YnN0cmluZygwLCBjdXJyLmxlbmd0aC0xKTsgLy8gZHJvcCBsYXN0IGNoYXJcbiAgICAgICAgICBkKGNvdW50IC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICAgICAgcXVldWUoX2RlbGV0ZSwgc3RyLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgZChjb3VudCk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBEbyBub3RoaW5nIGZvciBgZGVsYXlgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgcGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHZhciBkb25lID0gdGhpcztcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgcXVldWUocGF1c2UsIGRlbGF5KTtcbiAgICAgIH1cbiAgICAgIGRvbmUoKTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBDbGVhcnMgdGhlIGNvbnRlbnRzIG9mIGBlbGVtYC5cbiAgICAqXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIGVsZW0uaW5uZXJIVE1MID0gJyc7XG4gICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgcXVldWUoY2xlYXIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBleHBvc2UgcHVibGljIEFQSVxuICB0aGlzLnR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgcXVldWUodHlwZSwgc3RyICsgb3B0cy5wb3N0Zml4LCBzcGVlZCB8fCBvcHRzLnNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgcXVldWUoX2RlbGV0ZSwgc3RyLCBzcGVlZCB8fCBvcHRzLnNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgcXVldWUocGF1c2UsIGRlbGF5IHx8IG9wdHMuZGVsYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcXVldWUoY2xlYXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHF1ZXVlKGZuLCBlbGVtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuICByZXR1cm4gbmV3IG1hbGFya2V5KGVsZW0sIG9wdHMgfHwge30pO1xufTtcbiJdfQ==
(2)
});
