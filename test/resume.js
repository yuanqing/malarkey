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
  const m = malarkey(callback)
    .type('foo')
  t.false(m.isStopped())
  t.looseEquals(results, [])

  m.stop()
  t.true(m.isStopped())
  t.looseEquals(results, [])

  m.resume()
  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.uninstall()
})
