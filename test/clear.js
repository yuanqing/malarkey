const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('clears the text', function (t) {
  t.plan(3)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  malarkey(callback)
    .type('foo')
    .pause({ duration: 1 })
    .clear()
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(1)
  t.looseEquals(results, ['f', 'fo', 'foo', ''])

  clock.uninstall()
})
