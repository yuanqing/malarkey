const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('types at the default speed of 50 milliseconds', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback).type('foo')
  t.looseEquals(results, [])
  clock.tick(50)
  t.looseEquals(results, ['f'])
  clock.tick(50)
  t.looseEquals(results, ['f', 'fo'])
  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo'])
  clock.uninstall()
})

test('types at the speed set via `options`', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const options = { typeSpeed: 1 }
  malarkey(callback, options).type('foo')
  t.looseEquals(results, [])
  clock.tick(1)
  t.looseEquals(results, ['f'])
  clock.tick(1)
  t.looseEquals(results, ['f', 'fo'])
  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo'])
  clock.uninstall()
})

test('types at the specified speed', function (t) {
  t.plan(7)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .type('bar', { typeSpeed: 2 })
  t.looseEquals(results, [])
  clock.tick(50)
  t.looseEquals(results, ['f'])
  clock.tick(50)
  t.looseEquals(results, ['f', 'fo'])
  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo'])
  clock.tick(2)
  t.looseEquals(results, ['f', 'fo', 'foo', 'foob'])
  clock.tick(2)
  t.looseEquals(results, ['f', 'fo', 'foo', 'foob', 'fooba'])
  clock.tick(2)
  t.looseEquals(results, ['f', 'fo', 'foo', 'foob', 'fooba', 'foobar'])
  clock.uninstall()
})
