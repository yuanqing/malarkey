const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('resumes the stopped sequence', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const m = malarkey(callback).type('foo')
  t.false(m.isStopped())
  t.looseEquals(results, [])
  m.stop()

  clock.tick(150)
  t.true(m.isStopped())
  t.looseEquals(results, [])
  m.resume()

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.uninstall()
})

test('has no effect if the sequence is already running', function (t) {
  t.plan(10)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const m = malarkey(callback)
    .type('foo')
    .type('bar')
  t.false(m.isStopped())
  t.looseEquals(results, [])

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f'])
  m.resume()

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f', 'fo'])

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(150)
  t.true(m.isStopped())
  t.looseEquals(results, ['f', 'fo', 'foo', 'foob', 'fooba', 'foobar'])

  clock.uninstall()
})
