const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('stops the sequence', function (t) {
  t.plan(14)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  function stopFn (text) {
    t.equals(text, 'foo')
    t.looseEquals(results, ['f', 'fo', 'foo'])
  }
  function callFn (callFnCallback) {
    t.fail()
    callFnCallback()
  }
  const m = malarkey(callback)
    .type('foo')
    .call(callFn)
  t.false(m.isStopped())
  t.looseEquals(results, [])

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f'])

  clock.tick(50)
  t.false(m.isStopped())
  t.looseEquals(results, ['f', 'fo'])

  m.triggerStop(stopFn)
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
