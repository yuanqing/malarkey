const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('calls the given `fn`', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  function fn (fnCallback, text) {
    t.notEqual(fnCallback, callback)
    t.equals(text, 'foo')
    t.looseEquals(results, ['f', 'fo', 'foo'])
    fnCallback()
  }
  malarkey(callback)
    .type('foo')
    .call(fn)
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.uninstall()
})
