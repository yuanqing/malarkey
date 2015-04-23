!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.malarkey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var segue = _dereq_('segue');

var endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var malarkey = function(elem, opts) {

  // allow `malarkey` to be called without the `new` keyword
  if (!(this instanceof malarkey)) {
    return new malarkey(elem, opts || {});
  }

  // default `opts`
  var typeSpeed = opts.speed || opts.typeSpeed || 50;
  var deleteSpeed = opts.speed || opts.deleteSpeed || 50;
  var pauseDelay = opts.delay || opts.pauseDelay || 2000;
  var postfix = opts.postfix || '';
  var getter = opts.getter || function(elem) {
    return elem.innerHTML;
  };
  var setter = opts.setter || function(elem, val) {
    elem.innerHTML = val;
  };

  // initialise the function queue
  var queue = segue({ repeat: opts.loop || false });

  // internal functions that are added into `queue` via their respective
  // public methods
  var _type = function(done, str, speed) {
    var len = str.length;
    if (len === 0) {
      return done();
    }
    (function t(i) {
      setTimeout(function() {
        setter(elem, getter(elem) + str[i]);
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
    var curr = getter(elem);
    var count = curr.length; // default to deleting entire contents of `elem`
    if (x != null) {
      if (typeof x === 'string') {
        // delete the string `x` if and only if `elem` ends with `x`
        if (endsWith(curr, x + postfix)) {
          count = x.length + postfix.length;
        } else {
          count = 0;
        }
      } else {
        // delete the last `x` characters from `elem`
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
        var curr = getter(elem);
        if (count) {
          // drop last char
          setter(elem, curr.substring(0, curr.length-1));
          d(count - 1);
        } else {
          done();
        }
      }, speed);
    })(count);
  };
  var _clear = function(done) {
    setter(elem, '');
    done();
  };
  var _pause = function(done, delay) {
    setTimeout(done, delay);
  };
  var _call = function(done, fn) {
    fn.call(done, elem);
  };

  // expose public api
  this.type = function(str, speed) {
    queue(_type, str + postfix, speed || typeSpeed);
    return this;
  };
  this.delete = function(x, speed) {
    queue(_delete, x, speed || deleteSpeed);
    return this;
  };
  this.clear = function() {
    queue(_clear);
    return this;
  };
  this.pause = function(delay) {
    queue(_pause, delay || pauseDelay);
    return this;
  };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9tYWxhcmtleS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvaW5kZXguanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL3NlZ3VlL3NlZ3VlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWd1ZSA9IHJlcXVpcmUoJ3NlZ3VlJyk7XG5cbnZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG59O1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gYWxsb3cgYG1hbGFya2V5YCB0byBiZSBjYWxsZWQgd2l0aG91dCB0aGUgYG5ld2Aga2V5d29yZFxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgbWFsYXJrZXkpKSB7XG4gICAgcmV0dXJuIG5ldyBtYWxhcmtleShlbGVtLCBvcHRzIHx8IHt9KTtcbiAgfVxuXG4gIC8vIGRlZmF1bHQgYG9wdHNgXG4gIHZhciB0eXBlU3BlZWQgPSBvcHRzLnNwZWVkIHx8IG9wdHMudHlwZVNwZWVkIHx8IDUwO1xuICB2YXIgZGVsZXRlU3BlZWQgPSBvcHRzLnNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQgfHwgNTA7XG4gIHZhciBwYXVzZURlbGF5ID0gb3B0cy5kZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkgfHwgMjAwMDtcbiAgdmFyIHBvc3RmaXggPSBvcHRzLnBvc3RmaXggfHwgJyc7XG4gIHZhciBnZXR0ZXIgPSBvcHRzLmdldHRlciB8fCBmdW5jdGlvbihlbGVtKSB7XG4gICAgcmV0dXJuIGVsZW0uaW5uZXJIVE1MO1xuICB9O1xuICB2YXIgc2V0dGVyID0gb3B0cy5zZXR0ZXIgfHwgZnVuY3Rpb24oZWxlbSwgdmFsKSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSB2YWw7XG4gIH07XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgZnVuY3Rpb24gcXVldWVcbiAgdmFyIHF1ZXVlID0gc2VndWUoeyByZXBlYXQ6IG9wdHMubG9vcCB8fCBmYWxzZSB9KTtcblxuICAvLyBpbnRlcm5hbCBmdW5jdGlvbnMgdGhhdCBhcmUgYWRkZWQgaW50byBgcXVldWVgIHZpYSB0aGVpciByZXNwZWN0aXZlXG4gIC8vIHB1YmxpYyBtZXRob2RzXG4gIHZhciBfdHlwZSA9IGZ1bmN0aW9uKGRvbmUsIHN0ciwgc3BlZWQpIHtcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICAoZnVuY3Rpb24gdChpKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXR0ZXIoZWxlbSwgZ2V0dGVyKGVsZW0pICsgc3RyW2ldKTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfSkoMCk7XG4gIH07XG4gIHZhciBfZGVsZXRlID0gZnVuY3Rpb24oZG9uZSwgeCwgc3BlZWQpIHtcbiAgICB2YXIgY3VyciA9IGdldHRlcihlbGVtKTtcbiAgICB2YXIgY291bnQgPSBjdXJyLmxlbmd0aDsgLy8gZGVmYXVsdCB0byBkZWxldGluZyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgaWYgKHggIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBkZWxldGUgdGhlIHN0cmluZyBgeGAgaWYgYW5kIG9ubHkgaWYgYGVsZW1gIGVuZHMgd2l0aCBgeGBcbiAgICAgICAgaWYgKGVuZHNXaXRoKGN1cnIsIHggKyBwb3N0Zml4KSkge1xuICAgICAgICAgIGNvdW50ID0geC5sZW5ndGggKyBwb3N0Zml4Lmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgbGFzdCBgeGAgY2hhcmFjdGVycyBmcm9tIGBlbGVtYFxuICAgICAgICBpZiAoeCA+IC0xKSB7XG4gICAgICAgICAgY291bnQgPSBNYXRoLm1pbih4LCBjb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICAoZnVuY3Rpb24gZChjb3VudCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1cnIgPSBnZXR0ZXIoZWxlbSk7XG4gICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgIC8vIGRyb3AgbGFzdCBjaGFyXG4gICAgICAgICAgc2V0dGVyKGVsZW0sIGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpKTtcbiAgICAgICAgICBkKGNvdW50IC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfSkoY291bnQpO1xuICB9O1xuICB2YXIgX2NsZWFyID0gZnVuY3Rpb24oZG9uZSkge1xuICAgIHNldHRlcihlbGVtLCAnJyk7XG4gICAgZG9uZSgpO1xuICB9O1xuICB2YXIgX3BhdXNlID0gZnVuY3Rpb24oZG9uZSwgZGVsYXkpIHtcbiAgICBzZXRUaW1lb3V0KGRvbmUsIGRlbGF5KTtcbiAgfTtcbiAgdmFyIF9jYWxsID0gZnVuY3Rpb24oZG9uZSwgZm4pIHtcbiAgICBmbi5jYWxsKGRvbmUsIGVsZW0pO1xuICB9O1xuXG4gIC8vIGV4cG9zZSBwdWJsaWMgYXBpXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShfdHlwZSwgc3RyICsgcG9zdGZpeCwgc3BlZWQgfHwgdHlwZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbih4LCBzcGVlZCkge1xuICAgIHF1ZXVlKF9kZWxldGUsIHgsIHNwZWVkIHx8IGRlbGV0ZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXVlKF9jbGVhcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMucGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHF1ZXVlKF9wYXVzZSwgZGVsYXkgfHwgcGF1c2VEZWxheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcXVldWUoX2NhbGwsIGZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWxhcmtleTtcbiIsIihmdW5jdGlvbihmbikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuc2VndWUgPSBmbjtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZuO1xuICB9XG59KShmdW5jdGlvbihjYiwgb3B0cykge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgc2xpY2UgPSBbXS5zbGljZTtcblxuICAvLyBib3RoIGBjYmAgYW5kIGBvcHRzYCBhcmUgb3B0aW9uYWxcbiAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdHMgPSBjYjtcbiAgICBjYiA9IGZ1bmN0aW9uKCkge307XG4gIH1cblxuICAvLyBvbmx5IHJlcGVhdCBpZiBgb3B0cy5yZXBlYXRgIGlzIGB0cnVlYFxuICB2YXIgcmVwZWF0ID0gb3B0cyAmJiBvcHRzLnJlcGVhdCA9PT0gdHJ1ZTtcblxuICB2YXIgZm5zID0gW107IC8vIHN0b3JlIHRoZSBlbnF1ZXVlZCBmdW5jdGlvbnNcbiAgdmFyIGFyZ3MgPSBbXTsgLy8gc3RvcmUgdGhlIGFyZ3VtZW50cyBmb3IgdGhlIGVucXVldWVkIGZ1bmN0aW9uc1xuICB2YXIgaSA9IDA7IC8vIGluZGV4IG9mIHRoZSBjdXJyZW50bHkgcnVubmluZyBmdW5jdGlvblxuICB2YXIgcnVubmluZyA9IGZhbHNlOyAvLyB0cnVlIGlmIGEgZnVuY3Rpb24gcnVubmluZ1xuICB2YXIgcHJldkVyciA9IGZhbHNlOyAvLyB0cnV0aHkgaWYgYW4gZXJyb3IgaGFzIG9jY3VycmVkXG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbihlcnIpIHtcblxuICAgIC8vIGNhY2hlIHRoZSBhcnJheSBsZW5ndGhcbiAgICB2YXIgbGVuID0gZm5zLmxlbmd0aDtcblxuICAgIC8vIHdyYXBhcm91bmQgaWYgcmVwZWF0aW5nXG4gICAgaWYgKHJlcGVhdCkge1xuICAgICAgaSA9IGkgJSBsZW47XG4gICAgfVxuXG4gICAgLy8gY2FsbCB0aGUgYGNiYCBvbiBlcnJvciwgb3IgaWYgdGhlcmUgYXJlIG5vIG1vcmUgZnVuY3Rpb25zIHRvIHJ1blxuICAgIGlmIChlcnIgfHwgaSA9PT0gbGVuKSB7XG4gICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICBwcmV2RXJyID0gZXJyO1xuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgLy8gY2FsbCB0aGUgY3VycmVudCBgZm5gLCBwYXNzaW5nIGl0IHRoZSBhcmd1bWVudHMgaW4gYGFyZ3NgXG4gICAgZm5zW2ldLmFwcGx5KG51bGwsIFtdLmNvbmNhdChuZXh0LCBhcmdzW2krK10pKTtcblxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBzZWd1ZShmbikge1xuXG4gICAgLy8gYW4gZXJyb3IgaGFzIGFscmVhZHkgb2NjdXJyZWQ7IGNhbGwgdGhlIGBjYmAgd2l0aCB0aGUgYHByZXZFcnJgXG4gICAgaWYgKHByZXZFcnIpIHtcbiAgICAgIHJldHVybiBjYihwcmV2RXJyKTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZSBgZm5gIGFuZCBpdHMgYXJndW1lbnRzXG4gICAgZm5zLnB1c2goZm4pO1xuICAgIGFyZ3MucHVzaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuXG4gICAgLy8gY2FsbCB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgcXVldWUgaWYgbm8gZnVuY3Rpb25zIGFyZSBjdXJyZW50bHkgcnVubmluZ1xuICAgIGlmICghcnVubmluZykge1xuICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIG9ubHkgYWZ0ZXIgYWxsIG90aGVyIGZ1bmN0aW9ucyBoYXZlIGJlZW4gZW5xdWV1ZWRcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIHJldHVybiBzZWd1ZTtcblxuICB9O1xuXG59KTtcbiJdfQ==
(1)
});
