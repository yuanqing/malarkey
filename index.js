var DELETE_ALL_SENTINEL = -1

function noop () {}

function malarkey (callback, options) {
  options = options || {}

  var text = ''

  var functionQueue = []
  var functionArguments = []
  var functionIndex = -1

  var isStopped = true
  var stoppedCallback = noop

  var methods = {
    call: function (fn) {
      return enqueue(_call, [fn])
    },
    clear: function () {
      return enqueue(_clear, null)
    },
    delete: function (characterCount, deleteOptions) {
      if (typeof characterCount === 'object') {
        deleteOptions = characterCount
        characterCount = DELETE_ALL_SENTINEL
      }
      return enqueue(_delete, [
        characterCount || DELETE_ALL_SENTINEL,
        (deleteOptions ? deleteOptions.speed : options.deleteSpeed) || 50
      ])
    },
    isStopped: function () {
      return isStopped
    },
    pause: function (pauseOptions) {
      return enqueue(setTimeout, [
        (pauseOptions ? pauseOptions.duration : options.pauseDuration) || 2000
      ])
    },
    triggerResume: function () {
      if (isStopped) {
        isStopped = false
        next()
      }
      return methods
    },
    triggerStop: function (fn) {
      isStopped = true
      stoppedCallback = fn || noop
      return methods
    },
    type: function (text, typeOptions) {
      return enqueue(_type, [
        text,
        (typeOptions ? typeOptions.speed : options.typeSpeed) || 50
      ])
    }
  }

  function next () {
    if (isStopped) {
      stoppedCallback(text)
      stoppedCallback = noop
      return
    }
    functionIndex += 1
    if (functionIndex === functionQueue.length) {
      if (!options.repeat) {
        functionIndex = functionQueue.length - 1
        isStopped = true
        return
      }
      functionIndex = 0
    }
    functionQueue[functionIndex].apply(
      null,
      [next].concat(functionArguments[functionIndex])
    )
  }

  function enqueue (callback, args) {
    functionQueue.push(callback)
    functionArguments.push(args)
    if (isStopped) {
      isStopped = false
      setTimeout(next, 0)
    }
    return methods
  }

  function _type (next, typeText, typeSpeed) {
    var length = typeText.length
    var i = 0
    setTimeout(function typeCharacter () {
      text += typeText[i++]
      callback(text)
      if (i === length) {
        next()
        return
      }
      setTimeout(typeCharacter, typeSpeed)
    }, typeSpeed)
  }

  function _delete (next, characterCount, deleteSpeed) {
    var finalLength =
      characterCount === DELETE_ALL_SENTINEL ? 0 : text.length - characterCount
    setTimeout(function deleteCharacter () {
      text = text.substring(0, text.length - 1)
      callback(text)
      if (text.length === finalLength) {
        next()
        return
      }
      setTimeout(deleteCharacter, deleteSpeed)
    }, deleteSpeed)
  }

  function _clear (next) {
    text = ''
    callback(text)
    next()
  }

  function _call (next, fn) {
    fn(next, text)
  }

  return methods
}

module.exports = malarkey
