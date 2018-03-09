const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('stops the sequence', function (t) {
  t.plan(12)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  function fn (fnCallback) {
    t.fail()
    fnCallback()
  }
  const m = malarkey(callback)
    .type('foo')
    .call(fn)
  t.false(m.isStopped())
  t.looseEquals(results, [])

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f'])

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f', 'fo'])

  m.stop()
  t.true(m.isStopped())
  t.looseEquals(results, ['f', 'fo'])

  clock.tick(50)
  t.true(m.isStopped())
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(10000)
  t.true(m.isStopped())
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.uninstall()
})
