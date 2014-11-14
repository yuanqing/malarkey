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
  opts = opts || {};
  opts.speed = opts.speed || 50;
  opts.loop = opts.loop || false;
  opts.postfix = opts.postfix || '';

  // cache `postfix` length
  var postFixLen = opts.postfix.length;

  // initialise the function queue
  var queue = segue();

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
    * Do nothing for the `duration`.
    *
    * @param {Number} duration Time in milliseconds
    * @api public
    */
  var pause = function(duration) {
    var done = this;
    window.setTimeout(function() {
      if (opts.loop) {
        queue(pause, duration);
      }
      done();
    }, duration);
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
    var count;
    var d;
    if (typeof str !== 'undefined') {
      // delete `str` from `elem`
      if (endsWith(curr, str + opts.postfix)) {
        count = str.length + postFixLen;
      } else {
        done();
        return;
      }
    } else {
      // delete entire contents of `elem`
      count = curr.length;
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
  var clear = function() {
    elem.innerHTML = '';
    if (opts.loop) {
      queue(clear);
    }
    this();
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
  this.pause = function(duration) {
    queue(pause, duration);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L25vZGVfbW9kdWxlcy9zZWd1ZS9pbmRleC5qcyIsIi9Vc2Vycy95dWFucWluZy9Db2RlL0dpdEh1Yi9KYXZhU2NyaXB0L21hbGFya2V5L3NyYy9tYWxhcmtleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG52YXIgc2VndWUgPSBmdW5jdGlvbihjYikge1xuXG4gIGNiID0gY2IgfHwgZnVuY3Rpb24oKSB7fTsgLy8gbm8gb3BcblxuICB2YXIgcnVubmluZyA9IGZhbHNlO1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIG5leHRBcmdzID0gW107XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgZXJyID0gYXJncy5zaGlmdCgpOyAvLyBgZXJyYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgIHZhciBhcnI7XG5cbiAgICBpZiAoZXJyKSB7IC8vIGV4aXQgb24gYGVycmBcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHsgLy8gY2FsbCB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgYHF1ZXVlYFxuICAgICAgYXJyID0gcXVldWUuc2hpZnQoKTtcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChhcnJbMV0pO1xuICAgICAgYXJyWzBdLmFwcGx5KG5leHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0QXJncyA9IGFyZ3M7IC8vIHNhdmUgdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGB0aGlzYCBjYWxsYmFja1xuICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cblxuICB9O1xuXG4gIHZhciBlbnF1ZXVlID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGZuID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKCFxdWV1ZS5sZW5ndGggJiYgIXJ1bm5pbmcpIHtcbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobmV4dCwgbmV4dEFyZ3MuY29uY2F0KGFyZ3MpKTtcbiAgICAgIG5leHRBcmdzID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXVlLnB1c2goW2ZuLCBhcmdzXSk7XG4gICAgfVxuICAgIHJldHVybiBlbnF1ZXVlO1xuXG4gIH07XG5cbiAgcmV0dXJuIGVucXVldWU7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHNlZ3VlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VndWUgPSByZXF1aXJlKCdzZWd1ZScpO1xuXG52YXIgbWFsYXJrZXkgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG5cbiAgLy8gc2V0IGBvcHRzYCB0byBkZWZhdWx0cyBpZiBuZWVkZWRcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIG9wdHMuc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDUwO1xuICBvcHRzLmxvb3AgPSBvcHRzLmxvb3AgfHwgZmFsc2U7XG4gIG9wdHMucG9zdGZpeCA9IG9wdHMucG9zdGZpeCB8fCAnJztcblxuICAvLyBjYWNoZSBgcG9zdGZpeGAgbGVuZ3RoXG4gIHZhciBwb3N0Rml4TGVuID0gb3B0cy5wb3N0Zml4Lmxlbmd0aDtcblxuICAvLyBpbml0aWFsaXNlIHRoZSBmdW5jdGlvbiBxdWV1ZVxuICB2YXIgcXVldWUgPSBzZWd1ZSgpO1xuXG4gIC8qKlxuICAgICogQ2hlY2sgaWYgYHN0cmAgZW5kcyB3aXRoIGBzdWZmaXhgLlxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgKiBAYXBpIHByaXZhdGVcbiAgICAqL1xuICB2YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzdHIsIHN1ZmZpeCkge1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAgKiBUeXBlIHRoZSBgc3RyYC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWQgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gdHlwZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIHR5cGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IHN0cltpXTtcbiAgICAgICAgaSA9IGkgKyAxO1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIHQoaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICAgICAgcXVldWUodHlwZSwgc3RyLCBzcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG4gICAgdCgpO1xuICB9O1xuXG4gIC8qKlxuICAgICogRG8gbm90aGluZyBmb3IgdGhlIGBkdXJhdGlvbmAuXG4gICAgKlxuICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIFRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIHZhciBwYXVzZSA9IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICBxdWV1ZShwYXVzZSwgZHVyYXRpb24pO1xuICAgICAgfVxuICAgICAgZG9uZSgpO1xuICAgIH0sIGR1cmF0aW9uKTtcbiAgfTtcblxuICAvKipcbiAgICAqIElmIGBzdHJgIHdhcyBzZXQsIGRlbGV0ZSBgc3RyYCBmcm9tIGBlbGVtYCBpZiB0aGUgYGVsZW1gIGVuZHMgd2l0aCBgc3RyYC5cbiAgICAqIEVsc2UgZGVsZXRlIGVudGlyZSBjb250ZW50cyBvZiBgZWxlbWAuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIHRvIGRlbGV0ZSBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgdmFyIF9kZWxldGUgPSBmdW5jdGlvbihzdHIsIHNwZWVkKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzO1xuICAgIHZhciBjdXJyID0gZWxlbS5pbm5lckhUTUw7XG4gICAgdmFyIGNvdW50O1xuICAgIHZhciBkO1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gZGVsZXRlIGBzdHJgIGZyb20gYGVsZW1gXG4gICAgICBpZiAoZW5kc1dpdGgoY3Vyciwgc3RyICsgb3B0cy5wb3N0Zml4KSkge1xuICAgICAgICBjb3VudCA9IHN0ci5sZW5ndGggKyBwb3N0Rml4TGVuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlbGV0ZSBlbnRpcmUgY29udGVudHMgb2YgYGVsZW1gXG4gICAgICBjb3VudCA9IGN1cnIubGVuZ3RoO1xuICAgIH1cbiAgICBkID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VyciA9IGVsZW0uaW5uZXJIVE1MO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGN1cnIuc3Vic3RyaW5nKDAsIGN1cnIubGVuZ3RoLTEpOyAvLyBkcm9wIGxhc3QgY2hhclxuICAgICAgICAgIGQoY291bnQgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICB9LCBzcGVlZCk7XG4gICAgfTtcbiAgICBkKGNvdW50KTtcbiAgfTtcblxuICAvKipcbiAgICAqIENsZWFyIHRoZSBjb250ZW50cyBvZiBgZWxlbWAuXG4gICAgKlxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICBlbGVtLmlubmVySFRNTCA9ICcnO1xuICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgIHF1ZXVlKGNsZWFyKTtcbiAgICB9XG4gICAgdGhpcygpO1xuICB9O1xuXG4gIC8vIGV4cG9zZSBwdWJsaWMgQVBJXG4gIHRoaXMudHlwZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZSh0eXBlLCBzdHIgKyBvcHRzLnBvc3RmaXgsIHNwZWVkIHx8IG9wdHMuc3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKHN0ciwgc3BlZWQpIHtcbiAgICBxdWV1ZShfZGVsZXRlLCBzdHIsIHNwZWVkIHx8IG9wdHMuc3BlZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICBxdWV1ZShwYXVzZSwgZHVyYXRpb24pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgcXVldWUoY2xlYXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmdW5jdGlvbihlbGVtLCBvcHRzKSB7XG4gIHJldHVybiBuZXcgbWFsYXJrZXkoZWxlbSwgb3B0cyk7XG59O1xuIl19
(2)
});
