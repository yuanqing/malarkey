/* globals malarkey, jasmine, describe, beforeEach, afterEach, it, expect, loadFixtures, sinon, $ */
'use strict';

var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/fixture/';
jasmine.getFixtures().preload(fixture);

describe('malarkey(elem [, opts])', function() {

  var elem;
  var clock;

  var defaultTypeSpeed = 50;
  var defaultDeleteSpeed = 50;
  var defaultPauseDelay = 2000;

  var expectElem = function(str) {
    expect(elem.innerHTML).toBe(str);
  };

  var expectTyping = function(str, speed) {
    var curr;
    var i;
    var len = str.length;
    for (i = 0; i < len; ++i) {
      curr = elem.innerHTML;
      clock.tick(speed);
      expectElem(curr + str[i]);
    }
  };

  var expectDeletion = function(str, speed) {
    var curr;
    var i;
    var len = str.length;
    for (i = len-1; i >= 0; --i) {
      curr = elem.innerHTML;
      expect(curr[curr.length-1]).toBe(str[i]); // character to be deleted
      clock.tick(speed);
      expectElem(curr.substring(0, curr.length-1));
    }
    clock.tick(speed);
  };

  beforeEach(function() {
    loadFixtures(fixture);
    elem = $('.malarkey')[0];
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  describe('type(str [, speed])', function() {

    it('types `str` at the default speed', function() {
      var str = 'foo';
      malarkey(elem)
        .type(str);
      expectElem('');
      // type
      expectTyping(str, defaultTypeSpeed);
      expectElem(str);
    });

    it('types `str` at the custom `speed`', function() {
      var str = 'foo';
      var customSpeed = defaultTypeSpeed * 10;
      malarkey(elem)
        .type(str, customSpeed);
      expectElem('');
      // type
      expectTyping(str, customSpeed);
      expectElem(str);
    });

    it('does not type if empty `str`', function() {
      var str = 'foo';
      malarkey(elem)
        .type('') // ignored
        .type(str);
      expectElem('');
      // type
      expectTyping(str, defaultTypeSpeed);
      expectElem(str);
    });

  });

  describe('delete([str, speed])', function() {

    it('deletes entire contents at the default speed', function() {
      var typeStr = 'foobar';
      malarkey(elem)
        .type(typeStr)
        .delete();
      expectElem('');
      // type
      expectTyping(typeStr, defaultTypeSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(typeStr, defaultDeleteSpeed);
      expectElem('');
    });

    it('deletes entire contents at the custom `speed`', function() {
      var typeStr = 'foobar';
      var customSpeed = defaultDeleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(customSpeed);
      expectElem('');
      // type
      expectTyping(typeStr, defaultTypeSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(typeStr, customSpeed);
      expectElem('');
    });

    it('deletes `str` at the default speed', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      malarkey(elem)
        .type(typeStr)
        .delete(str);
      expectElem('');
      // type
      expectTyping(typeStr, defaultTypeSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(str, defaultDeleteSpeed);
      expectElem('foo');
    });

    it('deletes `str` at the custom `speed`', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      var customSpeed = defaultDeleteSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(str, customSpeed);
      expectElem('');
      // type
      expectTyping(typeStr, defaultTypeSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(str, customSpeed);
      expectElem('foo');
    });

    it('does not delete `str` if `elem` does not end with `str`', function() {
      var typeStr = 'foobar';
      var str = 'qux';
      malarkey(elem)
        .type(typeStr)
        .delete(str);
      expectElem('');
      // type
      expectTyping(typeStr, defaultTypeSpeed);
      expectElem(typeStr);
      // delete
      clock.tick(defaultDeleteSpeed);
      expectElem(typeStr);
    });

  });

  describe('clear()', function() {

    it('clears entire contents of `elem`', function() {
      var str = 'foo';
      malarkey(elem)
        .type(str)
        .pause()
        .clear();
      expectElem('');
      // type
      expectTyping(str, defaultTypeSpeed);
      expectElem(str);
      // pause
      clock.tick(defaultPauseDelay);
      // clear
      expectElem('');
    });

  });

  describe('pause([delay])', function() {

    it('pauses typing for the default delay', function() {
      var str = 'foo';
      malarkey(elem)
        .pause()
        .type(str);
      expectElem('');
      // pause
      clock.tick(defaultPauseDelay);
      expectElem('');
      // type
      expectTyping(str, defaultTypeSpeed);
      expectElem(str);
    });

    it('pauses typing for the custom `delay`', function() {
      var str = 'foo';
      var customDelay = defaultPauseDelay * 10;
      malarkey(elem)
        .pause(customDelay)
        .type(str);
      expectElem('');
      // pause
      clock.tick(customDelay);
      expectElem('');
      // type
      expectTyping(str, defaultTypeSpeed);
      expectElem(str);
    });

  });

  describe('call(fn)', function() {

    it('calls the given `fn` with `elem`', function() {
      var str = 'foo';
      var fn = jasmine.createSpy('fn').and.callFake(function() {
        this();
      });
      malarkey(elem)
        .type(str)
        .pause()
        .call(fn)
        .type(str);
      expectElem('');
      // type
      expectTyping(str, defaultTypeSpeed);
      expectElem(str);
      // pause
      expect(fn).not.toHaveBeenCalled();
      clock.tick(defaultPauseDelay);
      // call
      expect(fn).toHaveBeenCalledWith(elem);
      // type
      expectTyping(str, defaultTypeSpeed);
    });

  });

  it('complex sequence with `opts`', function() {
    var opts = {
      loop: true,
      typeSpeed: 10 * defaultTypeSpeed,
      deleteSpeed: 10 * defaultDeleteSpeed,
      pauseDelay: 10 * defaultPauseDelay,
      postfix: 'bar'
    };
    var str = 'foo';
    var i = 3;
    var customTypeSpeed = 20 * defaultTypeSpeed;
    var customDeleteSpeed = 20 * defaultDeleteSpeed;
    var customPauseDelay = 20 * defaultPauseDelay;
    malarkey(elem, opts)
      .type(str, customTypeSpeed)
      .pause(customPauseDelay)
      .delete(str, customDeleteSpeed)
      .type(str)
      .pause()
      .clear();
    expectElem('');
    while (i--) {
      // type
      expectTyping(str + opts.postfix, customTypeSpeed);
      expectElem(str + opts.postfix);
      // pause
      clock.tick(customPauseDelay);
      expectElem(str + opts.postfix);
      // delete
      expectDeletion(str + opts.postfix, customDeleteSpeed);
      expectElem('');
      // type
      expectTyping(str + opts.postfix, opts.typeSpeed);
      expectElem(str + opts.postfix);
      // pause
      clock.tick(opts.pauseDelay);
      // clear
      expectElem('');
    }
  });

});
