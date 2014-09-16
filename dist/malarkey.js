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
  var speed = opts.speed || 100;
  var loop = opts.loop || false;
  var postfix = opts.postfix || '';

  // initialise the queue
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
          if (loop) {
            queue(type, str);
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
      if (loop) {
        queue(pause, duration);
      }
      that();
    }, duration);
  };

  // empty `elem`
  var clear = function() {
    elem.innerHTML = '';
    if (loop) {
      queue(clear);
    }
    this();
  };

  // add function to `queue`
  this.type = function(str) {
    queue(type, str + postfix);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgc2VndWUgPSBmdW5jdGlvbihjYikge1xuXG4gIGNiID0gY2IgfHwgZnVuY3Rpb24oKSB7fTsgLy8gbm8gb3BcblxuICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIG5leHRBcmdzID0gW107XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZXJyID0gYXJncy5zaGlmdCgpOyAvLyBgZXJyYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgIHZhciBhcnI7XG5cbiAgICBpZiAoZXJyKSB7IC8vIGV4aXQgb24gYGVycmBcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHsgLy8gY2FsbCB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgYHF1ZXVlYFxuICAgICAgYXJyID0gcXVldWUuc2hpZnQoKTtcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChhcnJbMV0pO1xuICAgICAgYXJyWzBdLmFwcGx5KG5leHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0QXJncyA9IGFyZ3M7IC8vIHNhdmUgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICB9O1xuXG4gIHZhciBlbnF1ZXVlID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGZuID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKCFxdWV1ZS5sZW5ndGggJiYgIXJ1bm5pbmcpIHtcbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobmV4dCwgbmV4dEFyZ3MuY29uY2F0KGFyZ3MpKTtcbiAgICAgIG5leHRBcmdzID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXVlLnB1c2goW2ZuLCBhcmdzXSk7XG4gICAgfVxuICAgIHJldHVybiBlbnF1ZXVlO1xuXG4gIH07XG5cbiAgcmV0dXJuIGVucXVldWU7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHNlZ3VlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VndWUgPSByZXF1aXJlKCdzZWd1ZScpO1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gcmVhZCBgb3B0c2BcbiAgdmFyIHNwZWVkID0gb3B0cy5zcGVlZCB8fCAxMDA7XG4gIHZhciBsb29wID0gb3B0cy5sb29wIHx8IGZhbHNlO1xuICB2YXIgcG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBpbml0aWFsaXNlIHRoZSBxdWV1ZVxuICB2YXIgcXVldWUgPSBzZWd1ZSgpO1xuXG4gIC8vIHR5cGUgdGhlIGBzdHJgXG4gIHZhciB0eXBlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGxvb3ApIHtcbiAgICAgICAgICAgIHF1ZXVlKHR5cGUsIHN0cik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoYXQoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgdCgpO1xuICB9O1xuXG4gIC8vIHBhdXNlIHR5cGluZyBmb3IgdGhlIGBkdXJhdGlvbmBcbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAobG9vcCkge1xuICAgICAgICBxdWV1ZShwYXVzZSwgZHVyYXRpb24pO1xuICAgICAgfVxuICAgICAgdGhhdCgpO1xuICAgIH0sIGR1cmF0aW9uKTtcbiAgfTtcblxuICAvLyBlbXB0eSBgZWxlbWBcbiAgdmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICBpZiAobG9vcCkge1xuICAgICAgcXVldWUoY2xlYXIpO1xuICAgIH1cbiAgICB0aGlzKCk7XG4gIH07XG5cbiAgLy8gYWRkIGZ1bmN0aW9uIHRvIGBxdWV1ZWBcbiAgdGhpcy50eXBlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcXVldWUodHlwZSwgc3RyICsgcG9zdGZpeCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHRoaXMucGF1c2UgPSBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgIGlmICh0eXBlb2YgZHVyYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBxdWV1ZShwYXVzZSwgZHVyYXRpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXVlKGNsZWFyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oZWxlbSwgb3B0cykge1xuICByZXR1cm4gbmV3IG1hbGFya2V5KGVsZW0sIG9wdHMpO1xufTtcbiJdfQ==
(2)
});
