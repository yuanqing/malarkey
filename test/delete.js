const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('deletes all characters at the default speed of 50 milliseconds', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .delete()

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
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .delete(2)

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f']) // no change

  clock.uninstall()
})

test('deletes all characters at the speed set via `options`', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const options = { deleteSpeed: 1 }
  malarkey(callback, options)
    .type('foo')
    .delete()

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

test('deletes the specified number of characters at the speed set via `options`', function (t) {
  t.plan(4)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const options = { deleteSpeed: 1 }
  malarkey(callback, options)
    .type('foo')
    .delete(2)

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f']) // no change

  clock.uninstall()
})

test('deletes all characters at the speed set via `deleteOptions`', function (t) {
  t.plan(8)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const deleteOptions = { deleteSpeed: 5 }
  malarkey(callback)
    .type('foo')
    .delete()
    .type('bar')
    .delete(deleteOptions)

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

  clock.tick(5)
  t.looseEquals(results, [
    'f',
    'fo',
    'foo',
    'fo',
    'f',
    '',
    'b',
    'ba',
    'bar',
    'ba'
  ])

  clock.tick(5)
  t.looseEquals(results, [
    'f',
    'fo',
    'foo',
    'fo',
    'f',
    '',
    'b',
    'ba',
    'bar',
    'ba',
    'b'
  ])

  clock.tick(5)
  t.looseEquals(results, [
    'f',
    'fo',
    'foo',
    'fo',
    'f',
    '',
    'b',
    'ba',
    'bar',
    'ba',
    'b',
    ''
  ])

  clock.uninstall()
})

test('deletes the specified number of characters characters at the speed set via `deleteOptions`', function (t) {
  t.plan(6)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const deleteOptions = { deleteSpeed: 2 }
  malarkey(callback)
    .type('foo')
    .delete(2)
    .type('bar')
    .delete(1, deleteOptions)

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f'])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', 'fb', 'fba', 'fbar'])

  clock.tick(2)
  t.looseEquals(results, [
    'f',
    'fo',
    'foo',
    'fo',
    'f',
    'fb',
    'fba',
    'fbar',
    'fba'
  ])

  clock.tick(2)
  t.looseEquals(results, [
    'f',
    'fo',
    'foo',
    'fo',
    'f',
    'fb',
    'fba',
    'fbar',
    'fba'
  ])

  clock.uninstall()
})
