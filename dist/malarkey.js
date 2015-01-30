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
  opts.typeSpeed = opts.speed || opts.typeSpeed || 50;
  opts.deleteSpeed = opts.speed || opts.deleteSpeed || 50;
  opts.pauseDelay = opts.delay || opts.pauseDelay || 2000;
  opts.postfix = opts.postfix || '';

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
        elem.innerHTML += str[i];
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
    var curr = elem.innerHTML;
    var count = curr.length; // default to deleting entire contents of `elem`
    if (x != null) {
      if (typeof x === 'string') {
        // delete the string `x` if and only if `elem` ends with `x`
        if (endsWith(curr, x + opts.postfix)) {
          count = x.length + opts.postfix.length;
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
        var curr = elem.innerHTML;
        if (count) {
          elem.innerHTML = curr.substring(0, curr.length-1); // drop last char
          d(count - 1);
        } else {
          done();
        }
      }, speed);
    })(count);
  };
  var _clear = function(done) {
    elem.innerHTML = '';
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
    queue(_type, str + opts.postfix, speed || opts.typeSpeed);
    return this;
  };
  this.delete = function(x, speed) {
    queue(_delete, x, speed || opts.deleteSpeed);
    return this;
  };
  this.clear = function() {
    queue(_clear);
    return this;
  };
  this.pause = function(delay) {
    queue(_pause, delay || opts.pauseDelay);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9tYWxhcmtleS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvaW5kZXguanMiLCIvVXNlcnMveXVhbnFpbmcvQ29kZS9HaXRIdWIvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL3NlZ3VlL3NlZ3VlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VndWUgPSByZXF1aXJlKCdzZWd1ZScpO1xuXG52YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICByZXR1cm4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xufTtcblxudmFyIG1hbGFya2V5ID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuXG4gIC8vIGFsbG93IGBtYWxhcmtleWAgdG8gYmUgY2FsbGVkIHdpdGhvdXQgdGhlIGBuZXdgIGtleXdvcmRcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIG1hbGFya2V5KSkge1xuICAgIHJldHVybiBuZXcgbWFsYXJrZXkoZWxlbSwgb3B0cyB8fCB7fSk7XG4gIH1cblxuICAvLyBkZWZhdWx0IGBvcHRzYFxuICBvcHRzLnR5cGVTcGVlZCA9IG9wdHMuc3BlZWQgfHwgb3B0cy50eXBlU3BlZWQgfHwgNTA7XG4gIG9wdHMuZGVsZXRlU3BlZWQgPSBvcHRzLnNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQgfHwgNTA7XG4gIG9wdHMucGF1c2VEZWxheSA9IG9wdHMuZGVsYXkgfHwgb3B0cy5wYXVzZURlbGF5IHx8IDIwMDA7XG4gIG9wdHMucG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBpbml0aWFsaXNlIHRoZSBmdW5jdGlvbiBxdWV1ZVxuICB2YXIgcXVldWUgPSBzZWd1ZSh7IHJlcGVhdDogb3B0cy5sb29wIHx8IGZhbHNlIH0pO1xuXG4gIC8vIGludGVybmFsIGZ1bmN0aW9ucyB0aGF0IGFyZSBhZGRlZCBpbnRvIGBxdWV1ZWAgdmlhIHRoZWlyIHJlc3BlY3RpdmVcbiAgLy8gcHVibGljIG1ldGhvZHNcbiAgdmFyIF90eXBlID0gZnVuY3Rpb24oZG9uZSwgc3RyLCBzcGVlZCkge1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuICAgIChmdW5jdGlvbiB0KGkpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfSkoMCk7XG4gIH07XG4gIHZhciBfZGVsZXRlID0gZnVuY3Rpb24oZG9uZSwgeCwgc3BlZWQpIHtcbiAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgIHZhciBjb3VudCA9IGN1cnIubGVuZ3RoOyAvLyBkZWZhdWx0IHRvIGRlbGV0aW5nIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWBcbiAgICBpZiAoeCAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgc3RyaW5nIGB4YCBpZiBhbmQgb25seSBpZiBgZWxlbWAgZW5kcyB3aXRoIGB4YFxuICAgICAgICBpZiAoZW5kc1dpdGgoY3VyciwgeCArIG9wdHMucG9zdGZpeCkpIHtcbiAgICAgICAgICBjb3VudCA9IHgubGVuZ3RoICsgb3B0cy5wb3N0Zml4Lmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgbGFzdCBgeGAgY2hhcmFjdGVycyBmcm9tIGBlbGVtYFxuICAgICAgICBpZiAoeCA+IC0xKSB7XG4gICAgICAgICAgY291bnQgPSBNYXRoLm1pbih4LCBjb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICAoZnVuY3Rpb24gZChjb3VudCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1cnIgPSBlbGVtLmlubmVySFRNTDtcbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBjdXJyLnN1YnN0cmluZygwLCBjdXJyLmxlbmd0aC0xKTsgLy8gZHJvcCBsYXN0IGNoYXJcbiAgICAgICAgICBkKGNvdW50IC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfSkoY291bnQpO1xuICB9O1xuICB2YXIgX2NsZWFyID0gZnVuY3Rpb24oZG9uZSkge1xuICAgIGVsZW0uaW5uZXJIVE1MID0gJyc7XG4gICAgZG9uZSgpO1xuICB9O1xuICB2YXIgX3BhdXNlID0gZnVuY3Rpb24oZG9uZSwgZGVsYXkpIHtcbiAgICBzZXRUaW1lb3V0KGRvbmUsIGRlbGF5KTtcbiAgfTtcbiAgdmFyIF9jYWxsID0gZnVuY3Rpb24oZG9uZSwgZm4pIHtcbiAgICBmbi5jYWxsKGRvbmUsIGVsZW0pO1xuICB9O1xuXG4gIC8vIGV4cG9zZSBwdWJsaWMgYXBpXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShfdHlwZSwgc3RyICsgb3B0cy5wb3N0Zml4LCBzcGVlZCB8fCBvcHRzLnR5cGVTcGVlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oeCwgc3BlZWQpIHtcbiAgICBxdWV1ZShfZGVsZXRlLCB4LCBzcGVlZCB8fCBvcHRzLmRlbGV0ZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXVlKF9jbGVhcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMucGF1c2UgPSBmdW5jdGlvbihkZWxheSkge1xuICAgIHF1ZXVlKF9wYXVzZSwgZGVsYXkgfHwgb3B0cy5wYXVzZURlbGF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jYWxsID0gZnVuY3Rpb24oZm4pIHtcbiAgICBxdWV1ZShfY2FsbCwgZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hbGFya2V5O1xuIiwiKGZ1bmN0aW9uKGZuKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5zZWd1ZSA9IGZuO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZm47XG4gIH1cbn0pKGZ1bmN0aW9uKGNiLCBvcHRzKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIC8vIGJvdGggYGNiYCBhbmQgYG9wdHNgIGFyZSBvcHRpb25hbFxuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IGNiO1xuICAgIGNiID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxuXG4gIC8vIG9ubHkgcmVwZWF0IGlmIGBvcHRzLnJlcGVhdGAgaXMgYHRydWVgXG4gIHZhciByZXBlYXQgPSBvcHRzICYmIG9wdHMucmVwZWF0ID09PSB0cnVlO1xuXG4gIHZhciBmbnMgPSBbXTsgLy8gc3RvcmUgdGhlIGVucXVldWVkIGZ1bmN0aW9uc1xuICB2YXIgYXJncyA9IFtdOyAvLyBzdG9yZSB0aGUgYXJndW1lbnRzIGZvciB0aGUgZW5xdWV1ZWQgZnVuY3Rpb25zXG4gIHZhciBpID0gMDsgLy8gaW5kZXggb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nIGZ1bmN0aW9uXG4gIHZhciBydW5uaW5nID0gZmFsc2U7IC8vIHRydWUgaWYgYSBmdW5jdGlvbiBydW5uaW5nXG4gIHZhciBwcmV2RXJyID0gZmFsc2U7IC8vIHRydXRoeSBpZiBhbiBlcnJvciBoYXMgb2NjdXJyZWRcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVycikge1xuXG4gICAgLy8gY2FjaGUgdGhlIGFycmF5IGxlbmd0aFxuICAgIHZhciBsZW4gPSBmbnMubGVuZ3RoO1xuXG4gICAgLy8gd3JhcGFyb3VuZCBpZiByZXBlYXRpbmdcbiAgICBpZiAocmVwZWF0KSB7XG4gICAgICBpID0gaSAlIGxlbjtcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBgY2JgIG9uIGVycm9yLCBvciBpZiB0aGVyZSBhcmUgbm8gbW9yZSBmdW5jdGlvbnMgdG8gcnVuXG4gICAgaWYgKGVyciB8fCBpID09PSBsZW4pIHtcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHByZXZFcnIgPSBlcnI7XG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsIHRoZSBjdXJyZW50IGBmbmAsIHBhc3NpbmcgaXQgdGhlIGFyZ3VtZW50cyBpbiBgYXJnc2BcbiAgICBmbnNbaV0uYXBwbHkobnVsbCwgW10uY29uY2F0KG5leHQsIGFyZ3NbaSsrXSkpO1xuXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHNlZ3VlKGZuKSB7XG5cbiAgICAvLyBhbiBlcnJvciBoYXMgYWxyZWFkeSBvY2N1cnJlZDsgY2FsbCB0aGUgYGNiYCB3aXRoIHRoZSBgcHJldkVycmBcbiAgICBpZiAocHJldkVycikge1xuICAgICAgcmV0dXJuIGNiKHByZXZFcnIpO1xuICAgIH1cblxuICAgIC8vIHN0b3JlIGBmbmAgYW5kIGl0cyBhcmd1bWVudHNcbiAgICBmbnMucHVzaChmbik7XG4gICAgYXJncy5wdXNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG5cbiAgICAvLyBjYWxsIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBxdWV1ZSBpZiBubyBmdW5jdGlvbnMgYXJlIGN1cnJlbnRseSBydW5uaW5nXG4gICAgaWYgKCFydW5uaW5nKSB7XG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gb25seSBhZnRlciBhbGwgb3RoZXIgZnVuY3Rpb25zIGhhdmUgYmVlbiBlbnF1ZXVlZFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ3VlO1xuXG4gIH07XG5cbn0pO1xuIl19
(1)
});
