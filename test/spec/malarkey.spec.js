/* globals jasmine, describe, beforeEach, afterEach, it, expect, loadFixtures */
'use strict';

var fixture = 'fixture.html';
jasmine.getFixtures().fixturesPath = 'base/test/fixture/';
jasmine.getFixtures().preload(fixture);

describe('malarkey', function() {

  beforeEach(function() {
    loadFixtures(fixture);
  });

  afterEach(function() {
  });

  it('', function() {
    expect(true).toBe(true);
  });

});
