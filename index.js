(function(root) {

  'use strict';

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var Malarkey = function(elem, opts) {

    // allow `Malarkey` to be called without the `new` keyword
    if (!(this instanceof Malarkey)) {
      return new Malarkey(elem, opts);
    }

    // default `opts`
    opts = opts || {};
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
    var loop = opts.loop;

    // initialise the function queue
    var fnQueue = [];
    var argsQueue = [];
    var i = -1;
    var isRunning = false;
    var enqueue = function(fn, args) {
      fnQueue.push(fn);
      argsQueue.push(args);
      if (!isRunning) {
        isRunning = true;
        setTimeout(function() { // wait for remaining functions to be enqueued
          next();
        }, 0);
      }
    };
    var next = function() {
      i++;
      if (i === fnQueue.length) {
        if (!loop) {
          isRunning = false;
          return;
        }
        i = 0;
      }
      var fn = fnQueue[i];
      var args = [].concat(next, argsQueue[i]);
      fn.apply(null, args);
    };

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
    var self = this;
    self.type = function(str, speed) {
      enqueue(_type, [str + postfix, speed || typeSpeed]);
      return this;
    };
    self.delete = function(x, speed) {
      enqueue(_delete, [x, speed || deleteSpeed]);
      return this;
    };
    self.clear = function() {
      enqueue(_clear, []);
      return this;
    };
    self.pause = function(delay) {
      enqueue(_pause, [delay || pauseDelay]);
      return this;
    };
    self.call = function(fn) {
      enqueue(_call, [fn]);
      return this;
    };

  };

  /* istanbul ignore else */
  if (typeof module === 'object') {
    module.exports = Malarkey;
  } else {
    root.malarkey = Malarkey;
  }

})(this);
