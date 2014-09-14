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

  // empty `element`
  elem.innerHTML = '';

  // read `opts`
  var speed = opts.speed || 100;

  // initialise queue
  var queue = segue();

  // type the `str`
  var type = function(str) {
    var that = this;
    var i = 0;
    var len = str.length;
    var t = function() {
      window.setTimeout(function() {
        elem.innerHTML += str[i];
        i += 1;
        if (i < len) {
          t(i);
        } else {
          that();
        }
      }, speed);
    };
    t();
  };

  // add `str` to the queue to be typed
  this.type = function(str) {
    queue(type, str);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts);
};

},{"segue":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBzZWd1ZSA9IGZ1bmN0aW9uKGNiKSB7XG5cbiAgY2IgPSBjYiB8fCBmdW5jdGlvbigpIHt9OyAvLyBubyBvcFxuXG4gIHZhciBydW5uaW5nID0gZmFsc2U7XG4gIHZhciBxdWV1ZSA9IFtdO1xuICB2YXIgbmV4dEFyZ3MgPSBbXTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBlcnIgPSBhcmdzLnNoaWZ0KCk7IC8vIGBlcnJgIGlzIHRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgYHRoaXNgIGNhbGxiYWNrXG4gICAgdmFyIGFycjtcblxuICAgIGlmIChlcnIpIHsgLy8gZXhpdCBvbiBgZXJyYFxuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkgeyAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBgcXVldWVgXG4gICAgICBhcnIgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KGFyclsxXSk7XG4gICAgICBhcnJbMF0uYXBwbHkobmV4dCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRBcmdzID0gYXJnczsgLy8gc2F2ZSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgYHRoaXNgIGNhbGxiYWNrXG4gICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgdmFyIGVucXVldWUgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZm4gPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCAmJiAhcnVubmluZykge1xuICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICBmbi5hcHBseShuZXh0LCBuZXh0QXJncy5jb25jYXQoYXJncykpO1xuICAgICAgbmV4dEFyZ3MgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVldWUucHVzaChbZm4sIGFyZ3NdKTtcbiAgICB9XG4gICAgcmV0dXJuIGVucXVldWU7XG5cbiAgfTtcblxuICByZXR1cm4gZW5xdWV1ZTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gc2VndWU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWd1ZSA9IHJlcXVpcmUoJ3NlZ3VlJyk7XG5cbnZhciBtYWxhcmtleSA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcblxuICAvLyBlbXB0eSBgZWxlbWVudGBcbiAgZWxlbS5pbm5lckhUTUwgPSAnJztcblxuICAvLyByZWFkIGBvcHRzYFxuICB2YXIgc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDEwMDtcblxuICAvLyBpbml0aWFsaXNlIHF1ZXVlXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKCk7XG5cbiAgLy8gdHlwZSB0aGUgYHN0cmBcbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIHZhciB0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgKz0gc3RyW2ldO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgdChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGF0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9O1xuICAgIHQoKTtcbiAgfTtcblxuICAvLyBhZGQgYHN0cmAgdG8gdGhlIHF1ZXVlIHRvIGJlIHR5cGVkXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHF1ZXVlKHR5cGUsIHN0cik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBtYWxhcmtleShlbGVtLCBvcHRzKTtcbn07XG4iXX0=
(2)
});
