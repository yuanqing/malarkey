/* globals jasmine, describe, beforeEach, afterEach, it, expect, loadFixtures, $ */
'use strict';

var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/';
jasmine.getFixtures().preload(fixture);

var malarkey = require('../index.js');

describe('malarkey(elem [, opts])', function() {

  var elem;
  var defaults = {
    loop: false,
    typeSpeed: 50,
    deleteSpeed: 50,
    pauseDelay: 2000,
    postFix: ''
  };

  var clock;

  var expectContents = function(str) {
    expect(elem.innerHTML).toBe(str);
  };

  var expectTyping = function(str, speed) {
    var i = -1;
    var len = str.length;
    while (++i < len) {
      var curr = elem.innerHTML;
      clock.tick(speed);
      expectContents(curr + str[i]);
    }
  };

  var expectDeletion = function(str, speed) {
    var i = str.length;
    while (i-- > 0) {
      var curr = elem.innerHTML;
      expect(curr[curr.length-1]).toBe(str[i]); // character to be deleted
      clock.tick(speed);
      expectContents(curr.substring(0, curr.length-1));
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
      expectTyping('foobar', defaults.typeSpeed);
      expectContents('foobar');
    });

    it('does nothing if `str` is an empty string', function() {
      malarkey(elem)
        .type('') // ignored
        .type('foobar');
      expectContents('');
      // type
      expectTyping('foobar', defaults.typeSpeed);
      expectContents('foobar');
    });

    it('types `str` at a custom speed', function() {
      var str = 'foobar';
      var customSpeed = defaults.typeSpeed * 10;
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
      expectTyping(typeStr, defaults.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion(typeStr, defaults.deleteSpeed);
      expectContents('');
    });

  });

  describe('delete(str [, speed])', function() {

    it('deletes every character in `elem` at a custom speed', function() {
      var typeStr = 'foobar';
      var customSpeed = defaults.deleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(null, customSpeed);
      expectContents('');
      // type
      expectTyping(typeStr, defaults.typeSpeed);
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
      expectTyping(typeStr, defaults.typeSpeed);
      expectContents(typeStr);
      // delete
      expectDeletion(str, defaults.deleteSpeed);
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
      expectTyping(typeStr, defaults.typeSpeed);
      expectContents(typeStr);
      // delete
      clock.tick(defaults.deleteSpeed * str.length);
      expectContents(typeStr);
    });

    it('deletes `str` at a custom speed', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      var customSpeed = defaults.deleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(str, customSpeed);
      expectContents('');
      // type
      expectTyping(typeStr, defaults.typeSpeed);
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
        expectTyping(typeStr, defaults.typeSpeed);
        expectContents(typeStr);
        // delete
        expectDeletion(typeStr, defaults.deleteSpeed);
        expectContents('');
      });

      it('`n` < number of characters in `elem`', function() {
        var typeStr = 'foobar';
        malarkey(elem)
          .type(typeStr)
          .delete(3);
        expectContents('');
        // type
        expectTyping(typeStr, defaults.typeSpeed);
        expectContents(typeStr);
        // delete
        expectDeletion('bar', defaults.deleteSpeed);
        expectContents('foo');
      });

      it('`n` > number of characters in `elem`', function() {
        var typeStr = 'foobar';
        malarkey(elem)
          .type(typeStr)
          .delete(100);
        expectContents('');
        // type
        expectTyping(typeStr, defaults.typeSpeed);
        expectContents(typeStr);
        // delete
        expectDeletion(typeStr, defaults.deleteSpeed);
        expectContents('');
      });

    });

    it('deletes `n` characters at a custom speed', function() {
      var typeStr = 'foobar';
      var customSpeed = defaults.deleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(3, customSpeed);
      expectContents('');
      // type
      expectTyping(typeStr, defaults.typeSpeed);
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
      expectTyping(str, defaults.typeSpeed);
      expectContents(str);
      // pause
      clock.tick(defaults.pauseDelay);
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
      clock.tick(defaults.pauseDelay);
      expectContents('');
      // type
      expectTyping(str, defaults.typeSpeed);
      expectContents(str);
    });

    it('does nothing for a custom delay', function() {
      var str = 'foobar';
      var customDelay = defaults.pauseDelay * 10;
      malarkey(elem)
        .pause(customDelay)
        .type(str);
      expectContents('');
      // pause
      clock.tick(customDelay);
      expectContents('');
      // type
      expectTyping(str, defaults.typeSpeed);
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
      clock.tick(defaults.pauseDelay);
      // call
      expect(fn).toHaveBeenCalledWith(elem);
      // type
      expectTyping(str, defaults.typeSpeed);
    });

  });

  it('complex sequence with `opts`', function() {
    var opts = {
      loop: true,
      typeSpeed: 10 * defaults.typeSpeed,
      deleteSpeed: 10 * defaults.deleteSpeed,
      pauseDelay: 10 * defaults.pauseDelay,
      postfix: 'qux'
    };
    var str = 'foobar';
    var customTypeSpeed = 20 * defaults.typeSpeed;
    var customDeleteSpeed = 20 * defaults.deleteSpeed;
    var customPauseDelay = 20 * defaults.pauseDelay;
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
