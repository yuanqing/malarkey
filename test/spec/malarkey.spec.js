/* globals malarkey, jasmine, describe, beforeEach, afterEach, it, expect, loadFixtures, sinon, $ */
'use strict';

var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/fixture/';
jasmine.getFixtures().preload(fixture);

describe('malarkey(elem, opts)', function() {

  var elem;
  var clock;
  var defaultSpeed = 50;
  var defaultDelay = 50;

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

  describe('type(str, speed)', function() {

    it('type `str` at the default speed', function() {
      var str = 'foo';
      malarkey(elem).type(str);
      expectElem('');
      expectTyping(str, defaultSpeed);
      expectElem(str);
    });

    it('type `str` at a custom speed', function() {
      var str = 'foo';
      var speed = defaultSpeed * 10;
      malarkey(elem).type(str, speed);
      expectElem('');
      expectTyping(str, speed);
      expectElem(str);
    });

    it('no typing if `str` is empty', function() {
      var str = 'foo';
      malarkey(elem)
        .type('') // ignored
        .type(str);
      expectElem('');
      expectTyping(str, defaultSpeed);
      expectElem(str);
    });

  });

  describe('delete(str, speed)', function() {

    it('delete entire contents of `elem`', function() {
      var typeStr = 'foobar';
      malarkey(elem)
        .type(typeStr)
        .delete();
      expectElem('');
      // type
      expectTyping(typeStr, defaultSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(typeStr, defaultSpeed);
      expectElem('');
    });

    it('delete entire contents of `elem` at a custom speed', function() {
      var typeStr = 'foobar';
      var speed = defaultSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(speed);
      expectElem('');
      // type
      expectTyping(typeStr, defaultSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(typeStr, speed);
      expectElem('');
    });

    it('delete `str`', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      malarkey(elem)
        .type(typeStr)
        .delete(str);
      expectElem('');
      // type
      expectTyping(typeStr, defaultSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(str, defaultSpeed);
      expectElem('foo');
    });

    it('delete `str` at a custom speed', function() {
      var typeStr = 'foobar';
      var str = 'bar';
      var speed = defaultSpeed * 10;
      malarkey(elem)
        .type(typeStr)
        .delete(str, speed);
      expectElem('');
      // type
      expectTyping(typeStr, defaultSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion(str, speed);
      expectElem('foo');
    });

    it('no deletion if `elem` does not end with `str`', function() {
      var typeStr = 'foobar';
      var str = 'qux';
      malarkey(elem)
        .type(typeStr)
        .delete(str);
      expectElem('');
      // type
      expectTyping(typeStr, defaultSpeed);
      expectElem(typeStr);
      // delete
      expectDeletion('', defaultSpeed);
      expectElem(typeStr);
    });

  });

  describe('pause(delay)', function() {

    it('pause typing', function() {
      var str = 'foo';
      malarkey(elem)
        .pause()
        .type(str);
      expectElem('');
      // pause
      clock.tick(defaultDelay);
      expectElem('');
      // type
      expectTyping(str, defaultSpeed);
      expectElem(str);
    });

    it('pause typing after a custom delay', function() {
      var delay = defaultDelay * 10;
      var str = 'foo';
      malarkey(elem)
        .pause(delay)
        .type(str);
      expectElem('');
      // pause
      clock.tick(delay);
      expectElem('');
      // type
      expectTyping(str, defaultSpeed);
      expectElem(str);
    });

  });

  describe('clear(delay)', function() {

    it('clear contents after a delay', function() {
      var delay = defaultDelay * 10;
      var str = 'foo';
      malarkey(elem)
        .type(str)
        .clear(delay);
      expectElem('');
      // type
      expectTyping(str, defaultSpeed);
      expectElem(str);
      // clear
      clock.tick(delay);
      expectElem('');
    });

  });

  it('complex sequence with `opts`', function() {
    var opts = {
      loop: true,
      speed: 10 * defaultSpeed,
      delay: 10 * defaultDelay,
      postfix: 'bar'
    };
    var str = 'foo';
    var i = 10;
    var typeSpeed = 20 * defaultSpeed;
    var pauseDelay = 30 * defaultDelay;
    var delSpeed = 40 * defaultSpeed;
    malarkey(elem, opts)
      .type(str, typeSpeed)
      .pause(pauseDelay)
      .delete(str, delSpeed)
      .type(str)
      .clear();
    expectElem('');
    while (i--) {
      // type
      expectTyping(str + opts.postfix, typeSpeed);
      expectElem(str + opts.postfix);
      // pause
      clock.tick(pauseDelay);
      expectElem(str + opts.postfix);
      // delete
      expectDeletion(str + opts.postfix, delSpeed);
      expectElem('');
      // type
      expectTyping(str + opts.postfix, opts.speed);
      expectElem(str + opts.postfix);
      // clear
      clock.tick(opts.delay);
      expectElem('');
    }
  });

});
