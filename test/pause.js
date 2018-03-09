const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('pauses the sequence for the default duration of 2000 milliseconds', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .pause()
    .type('bar')
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(2000)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'foob', 'fooba', 'foobar'])

  clock.uninstall()
})

test('pauses the sequence for the specified duration', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .pause(4000)
    .type('bar')
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(4000)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'foob', 'fooba', 'foobar'])

  clock.uninstall()
})
