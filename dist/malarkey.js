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
  opts.valueSetter = opts.valueSetter || function(elem, value) {
    elem.innerHTML = value;
  };
  opts.valueGetter = opts.valueGetter || function(elem) {
    return elem.innerHTML;
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
        opts.valueSetter(elem, opts.valueGetter(elem) + str[i]);
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
    var curr = opts.valueGetter(elem);
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
        var curr = opts.valueGetter(elem);
        if (count) {
          // drop last char
          opts.valueSetter(elem, curr.substring(0, curr.length-1)); 
          d(count - 1);
        } else {
          done();
        }
      }, speed);
    })(count);
  };
  var _clear = function(done) {
    opts.valueSetter(elem, '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vdmVybmEvY29kZS9naXRodWIvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3N0ZWZhbm92ZXJuYS9jb2RlL2dpdGh1Yi9tYWxhcmtleS9pbmRleC5qcyIsIi9Vc2Vycy9zdGVmYW5vdmVybmEvY29kZS9naXRodWIvbWFsYXJrZXkvbm9kZV9tb2R1bGVzL3NlZ3VlL3NlZ3VlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWd1ZSA9IHJlcXVpcmUoJ3NlZ3VlJyk7XG5cbnZhciBlbmRzV2l0aCA9IGZ1bmN0aW9uKHN0ciwgc3VmZml4KSB7XG4gIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG59O1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gYWxsb3cgYG1hbGFya2V5YCB0byBiZSBjYWxsZWQgd2l0aG91dCB0aGUgYG5ld2Aga2V5d29yZFxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgbWFsYXJrZXkpKSB7XG4gICAgcmV0dXJuIG5ldyBtYWxhcmtleShlbGVtLCBvcHRzIHx8IHt9KTtcbiAgfVxuXG4gIC8vIGRlZmF1bHQgYG9wdHNgXG4gIG9wdHMudHlwZVNwZWVkID0gb3B0cy5zcGVlZCB8fCBvcHRzLnR5cGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5kZWxldGVTcGVlZCA9IG9wdHMuc3BlZWQgfHwgb3B0cy5kZWxldGVTcGVlZCB8fCA1MDtcbiAgb3B0cy5wYXVzZURlbGF5ID0gb3B0cy5kZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkgfHwgMjAwMDtcbiAgb3B0cy5wb3N0Zml4ID0gb3B0cy5wb3N0Zml4IHx8ICcnO1xuICBvcHRzLnZhbHVlU2V0dGVyID0gb3B0cy52YWx1ZVNldHRlciB8fCBmdW5jdGlvbihlbGVtLCB2YWx1ZSkge1xuICAgIGVsZW0uaW5uZXJIVE1MID0gdmFsdWU7XG4gIH07XG4gIG9wdHMudmFsdWVHZXR0ZXIgPSBvcHRzLnZhbHVlR2V0dGVyIHx8IGZ1bmN0aW9uKGVsZW0pIHtcbiAgICByZXR1cm4gZWxlbS5pbm5lckhUTUw7XG4gIH07XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgZnVuY3Rpb24gcXVldWVcbiAgdmFyIHF1ZXVlID0gc2VndWUoeyByZXBlYXQ6IG9wdHMubG9vcCB8fCBmYWxzZSB9KTtcblxuICAvLyBpbnRlcm5hbCBmdW5jdGlvbnMgdGhhdCBhcmUgYWRkZWQgaW50byBgcXVldWVgIHZpYSB0aGVpciByZXNwZWN0aXZlXG4gIC8vIHB1YmxpYyBtZXRob2RzXG4gIHZhciBfdHlwZSA9IGZ1bmN0aW9uKGRvbmUsIHN0ciwgc3BlZWQpIHtcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZG9uZSgpO1xuICAgIH1cbiAgICAoZnVuY3Rpb24gdChpKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBvcHRzLnZhbHVlU2V0dGVyKGVsZW0sIG9wdHMudmFsdWVHZXR0ZXIoZWxlbSkgKyBzdHJbaV0pO1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgdChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHNwZWVkKTtcbiAgICB9KSgwKTtcbiAgfTtcbiAgdmFyIF9kZWxldGUgPSBmdW5jdGlvbihkb25lLCB4LCBzcGVlZCkge1xuICAgIHZhciBjdXJyID0gb3B0cy52YWx1ZUdldHRlcihlbGVtKTtcbiAgICB2YXIgY291bnQgPSBjdXJyLmxlbmd0aDsgLy8gZGVmYXVsdCB0byBkZWxldGluZyBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgaWYgKHggIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBkZWxldGUgdGhlIHN0cmluZyBgeGAgaWYgYW5kIG9ubHkgaWYgYGVsZW1gIGVuZHMgd2l0aCBgeGBcbiAgICAgICAgaWYgKGVuZHNXaXRoKGN1cnIsIHggKyBvcHRzLnBvc3RmaXgpKSB7XG4gICAgICAgICAgY291bnQgPSB4Lmxlbmd0aCArIG9wdHMucG9zdGZpeC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWxldGUgdGhlIGxhc3QgYHhgIGNoYXJhY3RlcnMgZnJvbSBgZWxlbWBcbiAgICAgICAgaWYgKHggPiAtMSkge1xuICAgICAgICAgIGNvdW50ID0gTWF0aC5taW4oeCwgY291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICB9XG4gICAgKGZ1bmN0aW9uIGQoY291bnQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXJyID0gb3B0cy52YWx1ZUdldHRlcihlbGVtKTtcbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgLy8gZHJvcCBsYXN0IGNoYXJcbiAgICAgICAgICBvcHRzLnZhbHVlU2V0dGVyKGVsZW0sIGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpKTsgXG4gICAgICAgICAgZChjb3VudCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH0pKGNvdW50KTtcbiAgfTtcbiAgdmFyIF9jbGVhciA9IGZ1bmN0aW9uKGRvbmUpIHtcbiAgICBvcHRzLnZhbHVlU2V0dGVyKGVsZW0sICcnKTtcbiAgICBkb25lKCk7XG4gIH07XG4gIHZhciBfcGF1c2UgPSBmdW5jdGlvbihkb25lLCBkZWxheSkge1xuICAgIHNldFRpbWVvdXQoZG9uZSwgZGVsYXkpO1xuICB9O1xuICB2YXIgX2NhbGwgPSBmdW5jdGlvbihkb25lLCBmbikge1xuICAgIGZuLmNhbGwoZG9uZSwgZWxlbSk7XG4gIH07XG5cbiAgLy8gZXhwb3NlIHB1YmxpYyBhcGlcbiAgdGhpcy50eXBlID0gZnVuY3Rpb24oc3RyLCBzcGVlZCkge1xuICAgIHF1ZXVlKF90eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMudHlwZVNwZWVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbih4LCBzcGVlZCkge1xuICAgIHF1ZXVlKF9kZWxldGUsIHgsIHNwZWVkIHx8IG9wdHMuZGVsZXRlU3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcXVldWUoX2NsZWFyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgcXVldWUoX3BhdXNlLCBkZWxheSB8fCBvcHRzLnBhdXNlRGVsYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNhbGwgPSBmdW5jdGlvbihmbikge1xuICAgIHF1ZXVlKF9jYWxsLCBmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFsYXJrZXk7XG4iLCIoZnVuY3Rpb24oZm4pIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLnNlZ3VlID0gZm47XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmbjtcbiAgfVxufSkoZnVuY3Rpb24oY2IsIG9wdHMpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHNsaWNlID0gW10uc2xpY2U7XG5cbiAgLy8gYm90aCBgY2JgIGFuZCBgb3B0c2AgYXJlIG9wdGlvbmFsXG4gIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICBvcHRzID0gY2I7XG4gICAgY2IgPSBmdW5jdGlvbigpIHt9O1xuICB9XG5cbiAgLy8gb25seSByZXBlYXQgaWYgYG9wdHMucmVwZWF0YCBpcyBgdHJ1ZWBcbiAgdmFyIHJlcGVhdCA9IG9wdHMgJiYgb3B0cy5yZXBlYXQgPT09IHRydWU7XG5cbiAgdmFyIGZucyA9IFtdOyAvLyBzdG9yZSB0aGUgZW5xdWV1ZWQgZnVuY3Rpb25zXG4gIHZhciBhcmdzID0gW107IC8vIHN0b3JlIHRoZSBhcmd1bWVudHMgZm9yIHRoZSBlbnF1ZXVlZCBmdW5jdGlvbnNcbiAgdmFyIGkgPSAwOyAvLyBpbmRleCBvZiB0aGUgY3VycmVudGx5IHJ1bm5pbmcgZnVuY3Rpb25cbiAgdmFyIHJ1bm5pbmcgPSBmYWxzZTsgLy8gdHJ1ZSBpZiBhIGZ1bmN0aW9uIHJ1bm5pbmdcbiAgdmFyIHByZXZFcnIgPSBmYWxzZTsgLy8gdHJ1dGh5IGlmIGFuIGVycm9yIGhhcyBvY2N1cnJlZFxuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAvLyBjYWNoZSB0aGUgYXJyYXkgbGVuZ3RoXG4gICAgdmFyIGxlbiA9IGZucy5sZW5ndGg7XG5cbiAgICAvLyB3cmFwYXJvdW5kIGlmIHJlcGVhdGluZ1xuICAgIGlmIChyZXBlYXQpIHtcbiAgICAgIGkgPSBpICUgbGVuO1xuICAgIH1cblxuICAgIC8vIGNhbGwgdGhlIGBjYmAgb24gZXJyb3IsIG9yIGlmIHRoZXJlIGFyZSBubyBtb3JlIGZ1bmN0aW9ucyB0byBydW5cbiAgICBpZiAoZXJyIHx8IGkgPT09IGxlbikge1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgcHJldkVyciA9IGVycjtcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIC8vIGNhbGwgdGhlIGN1cnJlbnQgYGZuYCwgcGFzc2luZyBpdCB0aGUgYXJndW1lbnRzIGluIGBhcmdzYFxuICAgIGZuc1tpXS5hcHBseShudWxsLCBbXS5jb25jYXQobmV4dCwgYXJnc1tpKytdKSk7XG5cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gc2VndWUoZm4pIHtcblxuICAgIC8vIGFuIGVycm9yIGhhcyBhbHJlYWR5IG9jY3VycmVkOyBjYWxsIHRoZSBgY2JgIHdpdGggdGhlIGBwcmV2RXJyYFxuICAgIGlmIChwcmV2RXJyKSB7XG4gICAgICByZXR1cm4gY2IocHJldkVycik7XG4gICAgfVxuXG4gICAgLy8gc3RvcmUgYGZuYCBhbmQgaXRzIGFyZ3VtZW50c1xuICAgIGZucy5wdXNoKGZuKTtcbiAgICBhcmdzLnB1c2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblxuICAgIC8vIGNhbGwgdGhlIG5leHQgZnVuY3Rpb24gaW4gdGhlIHF1ZXVlIGlmIG5vIGZ1bmN0aW9ucyBhcmUgY3VycmVudGx5IHJ1bm5pbmdcbiAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgLy8gY2FsbCB0aGUgbmV4dCBmdW5jdGlvbiBvbmx5IGFmdGVyIGFsbCBvdGhlciBmdW5jdGlvbnMgaGF2ZSBiZWVuIGVucXVldWVkXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VndWU7XG5cbiAgfTtcblxufSk7XG4iXX0=
(1)
});
