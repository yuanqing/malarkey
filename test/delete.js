const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('deletes all characters at the default speed of 50 milliseconds', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .delete()
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', ''])

  clock.uninstall()
})

test('deletes the specified number of characters at the default speed of 50 milliseconds', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .delete(2)
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.uninstall()
})

test('deletes all characters at the speed set via `options.deleteSpeed`', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const options = { deleteSpeed: 1 }
  malarkey(callback, options)
    .type('foo')
    .delete()
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', ''])

  clock.uninstall()
})

test('deletes the specified number of characters at the speed set via `options.deleteSpeed`', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const options = { deleteSpeed: 1 }
  malarkey(callback, options)
    .type('foo')
    .delete(2)
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.uninstall()
})

test('deletes all characters at the specified `speed`', function (t) {
  t.plan(9)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .delete()
    .type('bar')
    .delete({ speed: 1 })
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', ''])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', '', 'b', 'ba', 'bar'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', '', 'b', 'ba', 'bar', 'ba']) // prettier-ignore

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', '', 'b', 'ba', 'bar', 'ba', 'b']) // prettier-ignore

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', '', 'b', 'ba', 'bar', 'ba', 'b', '']) // prettier-ignore

  clock.uninstall()
})

test('deletes the specified number of characters characters at the specified `speed`', function (t) {
  t.plan(8)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .delete(2)
    .type('bar')
    .delete(2, { speed: 1 })
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', 'fb', 'fba', 'fbar'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', 'fb', 'fba', 'fbar', 'fba']) // prettier-ignore

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', 'fb', 'fba', 'fbar', 'fba', 'fb']) // prettier-ignore

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', 'fb', 'fba', 'fbar', 'fba', 'fb']) // prettier-ignore

  clock.uninstall()
})
