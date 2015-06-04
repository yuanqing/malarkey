'use strict';

var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/';
jasmine.getFixtures().preload(fixture);

var malarkey = require('../index.js');

describe('malarkey(elem [, opts])', function() {

  var elem;
  var defaultOpts = {
    loop: false,
    typeSpeed: 50,
    deleteSpeed: 50,
    pauseDelay: 2000,
    postfix: '',
    getter: function(elem) {
      return elem.innerHTML;
    },
    setter: function(elem, val) {
      elem.innerHTML = val;
    }
  };

  var clock;

  var expectContents = function(str, getter) {
    getter = getter || defaultOpts.getter;
    expect(getter(elem)).toBe(str);
  };

  var expectTyping = function(str, speed, getter) {
    getter = getter || defaultOpts.getter;
    var i = -1;
    var len = str.length;
    while (++i < len) {
      var curr = getter(elem);
      clock.tick(speed);
      expectContents(curr + str[i], getter);
    }
  };

  var expectDeletion = function(str, speed, getter) {
    getter = getter || defaultOpts.getter;
    var i = str.length;
    while (i-- > 0) {
      var curr = getter(elem);
      expect(curr[curr.length-1]).toBe(str[i]); // character to be deleted
      clock.tick(speed);
      expectContents(curr.substring(0, curr.length-1), getter);
    }
    clock.tick(speed);
  };

  beforeEach(function() {
    loadFixtures(fixture);
    elem = $('.malarkey')[0];
    jasmine.clock().install();
    clock = jasmine.clock();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  describe('type(str [, speed])', function() {

    it('types `str` at the default speed', function() {
      malarkey(elem)
        .type('foobar');
      expectContents('');
      // type
      expectTyping('foobar', defaultOpts.typeSpeed);
      expectContents('foobar');
    });

    it('does nothing if `str` is an empty string', function() {
      malarkey(elem)
        .type('') // ignored
        .type('foobar');
      expectContents('');
      // type
      expectTyping('foobar', defaultOpts.typeSpeed);
      expectContents('foobar');
    });

    it('types `str` at a custom speed', function() {
      var str = 'foobar';
      var customSpeed = defaultOpts.typeSpeed * 10;
      malarkey(elem)
        .type(str, customSpeed);
      expectContents('');
      // type
      expectTyping(str, customSpeed);
      expectContents(str);
    });

  });

  describe('delete()', function() {

    it('deletes every character in `elem` at the default speed', function() {
      var typeStr = 'foobar';
      malarkey(elem)
        .type(typeStr)
        .delete();
      expectContents('');
      // type
      expectTyping(typeStr, defaultOpts.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion(typeStr, defaultOpts.deleteSpeed);
      expectContents('');
    });

  });

  describe('delete(str [, speed])', function() {

    it('deletes every character in `elem` at a custom speed', function() {
      var typeStr = 'foobar';
      var customSpeed = defaultOpts.deleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(null, customSpeed);
      expectContents('');
      // type
      expectTyping(typeStr, defaultOpts.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion(typeStr, customSpeed);
      expectContents('');
    });

    it('deletes `str` at the default speed', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      malarkey(elem)
        .type(typeStr)
        .delete(str);
      expectContents('');
      // type
      expectTyping(typeStr, defaultOpts.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion(str, defaultOpts.deleteSpeed);
      expectContents('foo');
    });

    it('does nothing if `elem` does not end with `str`', function() {
      var typeStr = 'foobar';
      var str = 'qux';
      malarkey(elem)
        .type(typeStr)
        .delete(str);
      expectContents('');
      // type
      expectTyping(typeStr, defaultOpts.typeSpeed);
      expectContents(typeStr);
      // delete
      clock.tick(defaultOpts.deleteSpeed * str.length);
      expectContents(typeStr);
    });

    it('deletes `str` at a custom speed', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      var customSpeed = defaultOpts.deleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(str, customSpeed);
      expectContents('');
      // type
      expectTyping(typeStr, defaultOpts.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion(str, customSpeed);
      expectContents('foo');
    });

  });

  describe('delete(n [, speed])', function() {

    describe('deletes `n` characters at the default speed', function() {

      it('`n` < 0', function() {
        var typeStr = 'foobar';
        malarkey(elem)
          .type(typeStr)
          .delete(-1);
        expectContents('');
        // type
        expectTyping(typeStr, defaultOpts.typeSpeed);
        expectContents(typeStr);
        // delete
        expectDeletion(typeStr, defaultOpts.deleteSpeed);
        expectContents('');
      });

      it('`n` < number of characters in `elem`', function() {
        var typeStr = 'foobar';
        malarkey(elem)
          .type(typeStr)
          .delete(3);
        expectContents('');
        // type
        expectTyping(typeStr, defaultOpts.typeSpeed);
        expectContents(typeStr);
        // delete
        expectDeletion('bar', defaultOpts.deleteSpeed);
        expectContents('foo');
      });

      it('`n` > number of characters in `elem`', function() {
        var typeStr = 'foobar';
        malarkey(elem)
          .type(typeStr)
          .delete(100);
        expectContents('');
        // type
        expectTyping(typeStr, defaultOpts.typeSpeed);
        expectContents(typeStr);
        // delete
        expectDeletion(typeStr, defaultOpts.deleteSpeed);
        expectContents('');
      });

    });

    it('deletes `n` characters at a custom speed', function() {
      var typeStr = 'foobar';
      var customSpeed = defaultOpts.deleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(3, customSpeed);
      expectContents('');
      // type
      expectTyping(typeStr, defaultOpts.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion('bar', customSpeed);
      expectContents('foo');
    });

  });

  describe('clear()', function() {

    it('clears contents of `elem`', function() {
      var str = 'foobar';
      malarkey(elem)
        .type(str)
        .pause()
        .clear();
      expectContents('');
      // type
      expectTyping(str, defaultOpts.typeSpeed);
      expectContents(str);
      // pause
      clock.tick(defaultOpts.pauseDelay);
      // clear
      expectContents('');
    });

  });

  describe('pause([delay])', function() {

    it('does nothing for the default delay', function() {
      var str = 'foobar';
      malarkey(elem)
        .pause()
        .type(str);
      expectContents('');
      // pause
      clock.tick(defaultOpts.pauseDelay);
      expectContents('');
      // type
      expectTyping(str, defaultOpts.typeSpeed);
      expectContents(str);
    });

    it('does nothing for a custom delay', function() {
      var str = 'foobar';
      var customDelay = defaultOpts.pauseDelay * 10;
      malarkey(elem)
        .pause(customDelay)
        .type(str);
      expectContents('');
      // pause
      clock.tick(customDelay);
      expectContents('');
      // type
      expectTyping(str, defaultOpts.typeSpeed);
      expectContents(str);
    });

  });

  describe('call(fn)', function() {

    it('calls the given `fn`, passing it `elem`', function() {
      var fn = jasmine.createSpy('fn').and.callFake(function() {
        this();
      });
      var str = 'foobar';
      malarkey(elem)
        .pause()
        .call(fn)
        .type(str);
      expectContents('');
      // pause
      expect(fn).not.toHaveBeenCalled();
      clock.tick(defaultOpts.pauseDelay);
      // call
      expect(fn).toHaveBeenCalledWith(elem);
      // type
      expectTyping(str, defaultOpts.typeSpeed);
    });

  });

  describe('triggerPause([cb])', function() {

    it('pauses the sequence', function() {
      var m = malarkey(elem)
        .type('abc')
        .type('def');
      var speed = defaultOpts.typeSpeed;
      // type 'a'
      clock.tick(speed);
      expectContents('a');
      // trigger pause
      m.triggerPause();
      expect(m.isRunning()).toBe(true);
      // type 'b'
      clock.tick(speed);
      expectContents('ab');
      expect(m.isRunning()).toBe(true);
      // type 'c'
      clock.tick(speed);
      expectContents('abc');
      expect(m.isRunning()).toBe(false);
      // does not type 'def'
      clock.tick(100 * speed);
      expectContents('abc');
    });

    it('calls the given `cb` when paused, passing it `elem`', function() {
      var m = malarkey(elem)
        .type('abc')
        .type('def');
      var speed = defaultOpts.typeSpeed;
      // type 'a'
      clock.tick(speed);
      expectContents('a');
      // trigger pause
      var pauseCb = jasmine.createSpy('fn');
      m.triggerPause(pauseCb);
      expect(pauseCb).not.toHaveBeenCalled();
      // type 'b'
      clock.tick(speed);
      expectContents('ab');
      expect(pauseCb).not.toHaveBeenCalled();
      // type 'c'
      clock.tick(speed);
      expectContents('abc');
      expect(pauseCb).toHaveBeenCalledWith(elem);
      // does not type 'def'
      clock.tick(100 * speed);
      expectContents('abc');
    });

  });

  describe('triggerResume()', function() {

    it('resumes the sequence', function() {
      var m = malarkey(elem)
        .type('abc')
        .type('def');
      var speed = defaultOpts.typeSpeed;
      // type 'a'
      clock.tick(speed);
      expectContents('a');
      // trigger pause
      m.triggerPause();
      expect(m.isRunning()).toBe(true);
      // type 'bc'
      clock.tick(2 * speed);
      expectContents('abc');
      expect(m.isRunning()).toBe(false);
      // trigger run
      m.triggerResume();
      expect(m.isRunning()).toBe(true);
      expectContents('abc');
      // type 'def'
      clock.tick(100 * speed);
      expectContents('abcdef');
      expect(m.isRunning()).toBe(false);
    });

    it('has no effect if already running', function() {
      var m = malarkey(elem)
        .type('abc')
        .type('def');
      var speed = defaultOpts.typeSpeed;
      // type 'a'
      clock.tick(speed);
      expectContents('a');
      expect(m.isRunning()).toBe(true);
      // trigger run
      m.triggerResume();
      expect(m.isRunning()).toBe(true);
      // type 'b'
      clock.tick(speed);
      expectContents('ab');
      expect(m.isRunning()).toBe(true);
      // type 'c'
      clock.tick(speed);
      expectContents('abc');
      expect(m.isRunning()).toBe(true);
      // type 'def'
      clock.tick(3 * speed);
      expectContents('abcdef');
      expect(m.isRunning()).toBe(false);
    });

    it('overrides any previous call to `triggerPause`', function() {
      var m = malarkey(elem)
        .type('abc')
        .type('def');
      var speed = defaultOpts.typeSpeed;
      // type 'a'
      clock.tick(speed);
      expectContents('a');
      expect(m.isRunning()).toBe(true);
      // trigger pause
      m.triggerPause();
      expect(m.isRunning()).toBe(true);
      // type 'b'
      clock.tick(speed);
      expectContents('ab');
      expect(m.isRunning()).toBe(true);
      // trigger run
      m.triggerResume();
      expect(m.isRunning()).toBe(true);
      // type 'c'
      clock.tick(speed);
      expectContents('abc');
      expect(m.isRunning()).toBe(true);
      // type 'def'
      clock.tick(3 * speed);
      expectContents('abcdef');
      expect(m.isRunning()).toBe(false);
    });

  });

  describe('with `opts`', function() {

    it('custom `getter` and `setter`', function() {
      var opts = {
        getter: function(elem) {
          return elem.getAttribute('title') || '';
        },
        setter: function(elem, val) {
          elem.setAttribute('title', val);
        }
      };
      var str = 'foobar';
      malarkey(elem, opts)
        .type(str)
        .delete(str);
      // type
      expectTyping(str, defaultOpts.typeSpeed, opts.getter);
      // delete
      expectDeletion(str, defaultOpts.deleteSpeed, opts.getter);
    });

    it('loop', function() {
      var opts = {
        loop: true,
        typeSpeed: 10 * defaultOpts.typeSpeed,
        deleteSpeed: 10 * defaultOpts.deleteSpeed,
        pauseDelay: 10 * defaultOpts.pauseDelay,
        postfix: 'qux'
      };
      var str = 'foobar';
      var customTypeSpeed = 20 * defaultOpts.typeSpeed;
      var customDeleteSpeed = 20 * defaultOpts.deleteSpeed;
      var customPauseDelay = 20 * defaultOpts.pauseDelay;
      var i = 3; // repeat
      malarkey(elem, opts)
        .type(str, customTypeSpeed)
        .delete(str, customDeleteSpeed)
        .pause(customPauseDelay)
        .type(str)
        .delete('bar')
        .pause()
        .clear();
      expectContents('');
      while (i--) {
        // type
        expectTyping(str + opts.postfix, customTypeSpeed);
        expectContents(str + opts.postfix);
        // delete
        expectDeletion(str + opts.postfix, customDeleteSpeed);
        expectContents('');
        // pause
        clock.tick(customPauseDelay);
        expectContents('');
        // type
        expectTyping(str + opts.postfix, opts.typeSpeed);
        expectContents(str + opts.postfix);
        // delete
        expectDeletion('bar' + opts.postfix, opts.deleteSpeed);
        expectContents('foo');
        // pause
        clock.tick(opts.pauseDelay);
        // clear
        expectContents('');
      }
    });

  });

});
