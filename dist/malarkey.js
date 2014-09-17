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

  // read `opts`
  opts.speed = opts.speed || 100;
  opts.loop = opts.loop || false;
  opts.postfix = opts.postfix || '';

  // initialise the queue
  var queue = segue();

  // type the `str`
  var type = function(str, speed) {
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
          if (opts.loop) {
            queue(type, str, speed);
          }
          that();
        }
      }, speed);
    };
    t();
  };

  // pause typing for the `duration`
  var pause = function(duration) {
    var that = this;
    window.setTimeout(function() {
      if (opts.loop) {
        queue(pause, duration);
      }
      that();
    }, duration);
  };

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  // delete
  var del = function(delStr, speed) {
    var that = this;
    var str = elem.innerHTML;
    var len;
    var d;
    if (typeof delStr === 'undefined') {
      len = str.length;
    } else {
      if (parseInt(delStr, 10) === delStr) { // `str` is integer
        if (delStr === -1) {
          len = str.length;
        } else {
          len = delStr + opts.postfix.length;
          len = len > str.length ? str.length : len;
        }
      } else {
        if (endsWith(str, delStr + opts.postfix)) { // `str` is string
          len = delStr.length + opts.postfix.length;
        } else {
          that();
        }
      }
    }
    d = function(len) { // count is number of characters to delete
      window.setTimeout(function() {
        var str = elem.innerHTML;
        if (len) {
          elem.innerHTML = str.substring(0, str.length-1);
          d(len-1);
        } else {
          if (opts.loop) {
            queue(del, delStr, speed);
          }
          that();
        }
      }, speed);
    };
    d(len);
  };

  // empty `elem`
  var clear = function() {
    elem.innerHTML = '';
    if (opts.loop) {
      queue(clear);
    }
    this();
  };

  // add function to `queue`
  this.type = function(str, speed) {
    queue(type, str + opts.postfix, speed || opts.speed);
    return this;
  };
  this.delete = function(str, speed) {
    queue(del, str, speed || opts.speed);
    return this;
  };
  this.pause = function(duration) {
    if (typeof duration !== 'undefined') {
      queue(pause, duration);
    }
    return this;
  };
  this.clear = function() {
    queue(clear);
    return this;
  };

};

module.exports = exports = function(elem, opts) {
  return new malarkey(elem, opts);
};

},{"segue":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbnZhciBzZWd1ZSA9IGZ1bmN0aW9uKGNiKSB7XG5cbiAgY2IgPSBjYiB8fCBmdW5jdGlvbigpIHt9OyAvLyBubyBvcFxuXG4gIHZhciBydW5uaW5nID0gZmFsc2U7XG4gIHZhciBxdWV1ZSA9IFtdO1xuICB2YXIgbmV4dEFyZ3MgPSBbXTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBlcnIgPSBhcmdzLnNoaWZ0KCk7IC8vIGBlcnJgIGlzIHRoZSBmaXJzdCBhcmd1bWVudCBvZiB0aGUgYHRoaXNgIGNhbGxiYWNrXG4gICAgdmFyIGFycjtcblxuICAgIGlmIChlcnIpIHsgLy8gZXhpdCBvbiBgZXJyYFxuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkgeyAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBgcXVldWVgXG4gICAgICBhcnIgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KGFyclsxXSk7XG4gICAgICBhcnJbMF0uYXBwbHkobmV4dCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRBcmdzID0gYXJnczsgLy8gc2F2ZSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgYHRoaXNgIGNhbGxiYWNrXG4gICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgdmFyIGVucXVldWUgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZm4gPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCAmJiAhcnVubmluZykge1xuICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICBmbi5hcHBseShuZXh0LCBuZXh0QXJncy5jb25jYXQoYXJncykpO1xuICAgICAgbmV4dEFyZ3MgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVldWUucHVzaChbZm4sIGFyZ3NdKTtcbiAgICB9XG4gICAgcmV0dXJuIGVucXVldWU7XG5cbiAgfTtcblxuICByZXR1cm4gZW5xdWV1ZTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gc2VndWU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWd1ZSA9IHJlcXVpcmUoJ3NlZ3VlJyk7XG5cbnZhciBtYWxhcmtleSA9IGZ1bmN0aW9uKGVsZW0sIG9wdHMpIHtcblxuICAvLyByZWFkIGBvcHRzYFxuICBvcHRzLnNwZWVkID0gb3B0cy5zcGVlZCB8fCAxMDA7XG4gIG9wdHMubG9vcCA9IG9wdHMubG9vcCB8fCBmYWxzZTtcbiAgb3B0cy5wb3N0Zml4ID0gb3B0cy5wb3N0Zml4IHx8ICcnO1xuXG4gIC8vIGluaXRpYWxpc2UgdGhlIHF1ZXVlXG4gIHZhciBxdWV1ZSA9IHNlZ3VlKCk7XG5cbiAgLy8gdHlwZSB0aGUgYHN0cmBcbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICAgICAgcXVldWUodHlwZSwgc3RyLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoYXQoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgdCgpO1xuICB9O1xuXG4gIC8vIHBhdXNlIHR5cGluZyBmb3IgdGhlIGBkdXJhdGlvbmBcbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgIHF1ZXVlKHBhdXNlLCBkdXJhdGlvbik7XG4gICAgICB9XG4gICAgICB0aGF0KCk7XG4gICAgfSwgZHVyYXRpb24pO1xuICB9O1xuXG4gIHZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgfTtcblxuICAvLyBkZWxldGVcbiAgdmFyIGRlbCA9IGZ1bmN0aW9uKGRlbFN0ciwgc3BlZWQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHN0ciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgIHZhciBsZW47XG4gICAgdmFyIGQ7XG4gICAgaWYgKHR5cGVvZiBkZWxTdHIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGFyc2VJbnQoZGVsU3RyLCAxMCkgPT09IGRlbFN0cikgeyAvLyBgc3RyYCBpcyBpbnRlZ2VyXG4gICAgICAgIGlmIChkZWxTdHIgPT09IC0xKSB7XG4gICAgICAgICAgbGVuID0gc3RyLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZW4gPSBkZWxTdHIgKyBvcHRzLnBvc3RmaXgubGVuZ3RoO1xuICAgICAgICAgIGxlbiA9IGxlbiA+IHN0ci5sZW5ndGggPyBzdHIubGVuZ3RoIDogbGVuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW5kc1dpdGgoc3RyLCBkZWxTdHIgKyBvcHRzLnBvc3RmaXgpKSB7IC8vIGBzdHJgIGlzIHN0cmluZ1xuICAgICAgICAgIGxlbiA9IGRlbFN0ci5sZW5ndGggKyBvcHRzLnBvc3RmaXgubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoYXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBkID0gZnVuY3Rpb24obGVuKSB7IC8vIGNvdW50IGlzIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIGRlbGV0ZVxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdHIgPSBlbGVtLmlubmVySFRNTDtcbiAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gc3RyLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoLTEpO1xuICAgICAgICAgIGQobGVuLTEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgIHF1ZXVlKGRlbCwgZGVsU3RyLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoYXQoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgZChsZW4pO1xuICB9O1xuXG4gIC8vIGVtcHR5IGBlbGVtYFxuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBlbGVtLmlubmVySFRNTCA9ICcnO1xuICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgIHF1ZXVlKGNsZWFyKTtcbiAgICB9XG4gICAgdGhpcygpO1xuICB9O1xuXG4gIC8vIGFkZCBmdW5jdGlvbiB0byBgcXVldWVgXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZSh0eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMuc3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShkZWwsIHN0ciwgc3BlZWQgfHwgb3B0cy5zcGVlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMucGF1c2UgPSBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgIGlmICh0eXBlb2YgZHVyYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBxdWV1ZShwYXVzZSwgZHVyYXRpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXVlKGNsZWFyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuICByZXR1cm4gbmV3IG1hbGFya2V5KGVsZW0sIG9wdHMpO1xufTtcbiJdfQ==
(2)
});
