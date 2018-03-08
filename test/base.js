const test = require('tape')
const malarkey = require('../')

test('is a function', function (t) {
  t.plan(1)
  t.true(typeof malarkey === 'function')
})
