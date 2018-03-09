const lolex = require('lolex')
const test = require('tape')
const malarkey = require('../')

test('repeats the sequence', function (t) {
  t.plan(5)
  const clock = lolex.install()
  const results = []
  function callback (text) {
    results.push(text)
  }
  const options = { repeat: true }
  malarkey(callback, options)
    .type('foo')
    .delete()
  t.looseEquals(results, [])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo'])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', ''])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', '', 'f', 'fo', 'foo'])

  clock.tick(150)
  t.looseEquals(results, ['f', 'fo', 'foo', 'fo', 'f', '', 'f', 'fo', 'foo', 'fo', 'f', '']) // prettier-ignore

  clock.uninstall()
})
