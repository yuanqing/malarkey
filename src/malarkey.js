'use strict';

var segue = require('segue');

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
