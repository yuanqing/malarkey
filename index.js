function noop () {}

var DELETE_ALL_SENTINEL = -1

function malarkey (callback, options) {
  options = options || {}
  var defaultTypeSpeed = options.typeSpeed || 50
  var defaultDeleteSpeed = options.deleteSpeed || 50
  var defaultPauseDuration = options.pauseDuration || 2000
  var repeat = options.repeat

  var text = ''

  var functionQueue = []
  var functionArguments = []
  var functionIndex = -1

  var pauseCallback = noop

  var isRunning = false

  var methods = {
    type: function (text, typeSpeed) {
      return enqueue(_type, [
        text,
        typeSpeed != null ? typeSpeed : defaultTypeSpeed
      ])
    },
    delete: function (characterCount, deleteSpeed) {
      return enqueue(_delete, [
        characterCount || DELETE_ALL_SENTINEL,
        deleteSpeed != null ? deleteSpeed : defaultDeleteSpeed
      ])
    },
    pause: function (pauseDuration) {
      return enqueue(setTimeout, [pauseDuration != null ? pauseDuration : defaultPauseDuration])
    },
    isRunning: function () {
      return isRunning
    },
    triggerPause: function (callback) {
      isRunning = false
      pauseCallback = callback
      return methods
    },
    triggerResume: function () {
      if (!isRunning) {
        isRunning = true
        next()
      }
      return methods
    }
  }

  function next () {
    if (!isRunning) {
      pauseCallback(text)
      pauseCallback = noop
      return
    }
    functionIndex += 1
    if (functionIndex === functionQueue.length) {
      if (!repeat) {
        functionIndex = functionQueue.length - 1
        isRunning = false
        return
      }
      functionIndex = 0
    }
    functionQueue[functionIndex].apply(
      null,
      [].concat(next, functionArguments[functionIndex])
    )
  }

  function enqueue (callback, args) {
    functionQueue.push(callback)
    functionArguments.push(args)
    if (!isRunning) {
      isRunning = true
      setTimeout(next, 0)
    }
    return methods
  }

  function _type (next, typeText, timeout) {
    var length = typeText.length
    var i = -1
    setTimeout(function typeCharacter () {
      if (++i === length) {
        next()
        return
      }
      text += typeText[i]
      callback(text)
      setTimeout(typeCharacter, timeout)
    }, timeout)
  }

  function _delete (next, characterCount, timeout) {
    var length =
      characterCount === DELETE_ALL_SENTINEL ? 0 : text.length - characterCount
    setTimeout(function deleteCharacter () {
      if (text.length === length) {
        next()
        return
      }
      text = text.substring(0, text.length - 1)
      callback(text)
      setTimeout(deleteCharacter, timeout)
    }, timeout)
  }

  return methods
}

module.exports = malarkey
