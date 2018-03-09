const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('calls the given `fn`', function (t) {
  t.plan(7)
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

  clock.tick(50)
  t.looseEquals(results, ['f'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo'])

  clock.tick(50)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.uninstall()
})
